import { useState, useEffect, useRef } from 'react';
import { sendCriticalAlert } from '../services/emailService';

const NODES_CONFIG = [
    { id: 1, name: 'Pump 01', type: 'pump' },
    { id: 2, name: 'Induction Motor', type: 'motor' },
    { id: 3, name: 'Compressor A', type: 'compressor' },
    { id: 4, name: 'Spare Node', type: 'spare' },
];

const INITIAL_HISTORY_LENGTH = 20;

const generateInitialHistory = () => {
    return Array.from({ length: INITIAL_HISTORY_LENGTH }, (_, i) => ({
        time: new Date(Date.now() - (INITIAL_HISTORY_LENGTH - i) * 1000).toLocaleTimeString(),
        temp: 50 + Math.random() * 10,
        vib: 0.5 + Math.random() * 0.5,
        current: 5 + Math.random() * 2,
    }));
};

export const useSimulation = () => {
    const [nodes, setNodes] = useState(() => {
        const saved = localStorage.getItem('assetsense_nodes');
        if (saved) {
            return JSON.parse(saved);
        }
        return NODES_CONFIG.map(node => ({
            ...node,
            temp: 55,
            vib: 0.8,
            current: 6.5,
            health: 98,
            status: 'healthy',
            fault: 'None',
            rul: 1000, // Hours
            history: generateInitialHistory(),
            isSpare: node.type === 'spare',
            isActive: node.type !== 'spare', // Spare starts inactive
        }));
    });

    const [alerts, setAlerts] = useState([]);
    const [systemStatus, setSystemStatus] = useState({
        mqtt: 'Connected',
        latency: 45,
        packetLoss: 0.01,
        autoProtect: false,
    });

    const [activeFault, setActiveFault] = useState(null); // { nodeId, type, startTime }

    // Track sent emails to avoid spam (Transient state, not persisted)
    const emailSentFlags = useRef({});

    useEffect(() => {
        localStorage.setItem('assetsense_nodes', JSON.stringify(nodes));
    }, [nodes]);

    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prevNodes => {
                let autoProtectTriggered = false;

                const updatedNodes = prevNodes.map(node => {
                    // 1. Base Random Walk (Normal Operation)
                    let deltaTemp = (Math.random() - 0.5) * 1.5;
                    let deltaVib = (Math.random() - 0.5) * 0.1;
                    let deltaCurrent = (Math.random() - 0.5) * 0.5;

                    // 2. Fault Injection Logic
                    if (activeFault && activeFault.nodeId === node.id) {
                        const timeSinceFault = (Date.now() - activeFault.startTime) / 1000; // seconds
                        const severityMultiplier = Math.min(timeSinceFault / 10, 5); // Ramp up over 50s

                        switch (activeFault.type) {
                            case 'Overheating':
                                deltaTemp += 0.8 * severityMultiplier;
                                deltaVib += 0.05 * severityMultiplier;
                                deltaCurrent += 0.2 * severityMultiplier;
                                break;
                            case 'Bearing Wear':
                                deltaVib += 0.2 * severityMultiplier;
                                deltaTemp += 0.1 * severityMultiplier;
                                break;
                            case 'Misalignment':
                                deltaVib += 0.15 * severityMultiplier;
                                deltaTemp += 0.2 * severityMultiplier;
                                break;
                            case 'Overload':
                                deltaCurrent += 0.5 * severityMultiplier;
                                deltaTemp += 0.3 * severityMultiplier;
                                deltaVib += 0.05 * severityMultiplier;
                                break;
                        }
                    }

                    // Apply Deltas
                    let newTemp = Math.max(40, Math.min(120, node.temp + deltaTemp));
                    let newVib = Math.max(0.2, Math.min(10, node.vib + deltaVib));
                    let newCurrent = Math.max(1, Math.min(30, node.current + deltaCurrent));

                    // 3. ML-Based Health Scoring
                    const tempPenalty = Math.max(0, (newTemp - 60) * 1.5);
                    const vibPenalty = Math.max(0, (newVib - 1.0) * 20);
                    const currentPenalty = Math.max(0, (newCurrent - 10) * 5);

                    let calculatedHealth = 100 - (0.4 * tempPenalty + 0.35 * vibPenalty + 0.25 * currentPenalty);
                    calculatedHealth = Math.max(0, Math.min(100, calculatedHealth));

                    // 4. Fault Classification & Status
                    let fault = node.fault;
                    if (activeFault && activeFault.nodeId === node.id) {
                        fault = activeFault.type;
                    } else if (fault === 'None') {
                        // Auto-detect if not manually injected
                        if (newTemp > 80 && newVib > 2.0) fault = 'Bearing Wear';
                        else if (newTemp > 85 && newCurrent > 12) fault = 'Overload';
                        else if (newVib > 2.5) fault = 'Misalignment';
                        else if (newTemp > 90) fault = 'Overheating';
                    }

                    let status = 'healthy';
                    if (calculatedHealth < 60) status = 'critical';
                    else if (calculatedHealth < 80) status = 'warning';

                    // 5. Auto-Protect Logic (Spare Activation)
                    if (status === 'critical' && !node.isSpare && node.isActive) {
                        autoProtectTriggered = true;
                    }

                    // 6. RUL Calculation
                    const decayRate = (100 - calculatedHealth) * 0.01 * (activeFault?.nodeId === node.id ? 5 : 1);
                    let newRul = Math.max(0, (node.rul || 1000) - decayRate);

                    // Update History
                    const newHistory = [
                        ...node.history.slice(1),
                        {
                            time: new Date().toLocaleTimeString(),
                            temp: newTemp,
                            vib: newVib,
                            current: newCurrent,
                        }
                    ];

                    // --- EMAIL ALERT LOGIC ---
                    // Trigger if Essential Criteria Met: Critical Status AND Not yet sent for this event
                    if (status === 'critical' && node.status !== 'critical') {
                        // Just entered critical state - add UI Alert
                        addAlert(node.name, `CRITICAL FAILURE: ${fault}`, 'critical');
                    }

                    if (status === 'critical' && !emailSentFlags.current[node.id]) {
                        // Prepare Alert Packet
                        const alertPacket = {
                            nodeName: node.name,
                            health: calculatedHealth,
                            temp: newTemp,
                            vib: newVib,
                            current: newCurrent,
                            fault: fault !== 'None' ? fault : 'Unknown Critical Anomaly',
                            rul: newRul,
                            timestamp: new Date().toLocaleString(),
                            action: 'Inspect Immediately. Prepare for safe shutdown if vibration > 5mm/s.',
                        };

                        // Send Email (Fire & Forget)
                        sendCriticalAlert(alertPacket).then(success => {
                            if (success) {
                                addAlert(node.name, `Email Notification Sent to Admin`, 'info', true);
                            }
                        });

                        // Set Flag to prevent spam
                        emailSentFlags.current[node.id] = true;
                    }

                    // Reset Flag if node recovers (Health > 70 to avoid flickering at 60 boundary)
                    if (status !== 'critical' && calculatedHealth > 70 && emailSentFlags.current[node.id]) {
                        emailSentFlags.current[node.id] = false;
                        addAlert(node.name, `System Recovered - Email Triggers Reset`, 'success');
                    }
                    // -------------------------

                    return {
                        ...node,
                        temp: newTemp,
                        vib: newVib,
                        current: newCurrent,
                        health: calculatedHealth,
                        status,
                        fault,
                        rul: newRul,
                        history: newHistory,
                        isActive: node.isActive, // Preserve active state
                        isSpare: node.isSpare
                    };
                });

                // Handle Auto-Protect Switch
                if (autoProtectTriggered) {
                    // Find critical node and deactivate
                    const criticalNode = updatedNodes.find(n => n.status === 'critical' && !n.isSpare && n.isActive);
                    // Find spare and activate
                    const spareNode = updatedNodes.find(n => n.isSpare);

                    if (criticalNode && spareNode && !spareNode.isActive) {
                        criticalNode.isActive = false;
                        spareNode.isActive = true;
                        setSystemStatus(prev => ({ ...prev, autoProtect: true }));
                        addAlert('SYSTEM', `Auto-Protect: Switched ${criticalNode.name} to ${spareNode.name}`, 'critical');
                    }
                }

                return updatedNodes;
            });

            // System Status Sim
            setSystemStatus(prev => ({
                ...prev,
                latency: 40 + Math.random() * 20,
            }));

        }, 1000);

        return () => clearInterval(interval);
    }, [activeFault]);

    const addAlert = (source, message, severity = 'warning', emailSent = false) => {
        const newAlert = {
            id: Date.now(),
            source,
            message,
            time: new Date().toLocaleTimeString(),
            severity,
            emailSent // Metadata for UI badge
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
    };

    const injectFault = (nodeId, type) => {
        setActiveFault({ nodeId, type, startTime: Date.now() });
        addAlert('SYSTEM', `Manual Fault Injection: ${type} on Node ${nodeId}`, 'warning');
    };

    const repairNode = (nodeId) => {
        setActiveFault(null);
        // Reset email flag immediately upon repair
        if (emailSentFlags.current[nodeId]) {
            emailSentFlags.current[nodeId] = false;
        }

        const targetNode = nodes.find(n => n.id === nodeId);
        if (targetNode) {
            setAlerts(prev => prev.filter(alert =>
                !(alert.source === targetNode.name && alert.severity === 'critical')
            ));
        }

        setNodes(prev => prev.map(n => {
            if (n.id === nodeId) {
                return {
                    ...n,
                    temp: 55,
                    vib: 0.8,
                    current: 6.5,
                    health: 100,
                    status: 'healthy',
                    fault: 'None',
                    isActive: true, // Reactivate if it was the broken one
                    rul: 1000
                };
            }
            return n;
        }));
        setSystemStatus(prev => ({ ...prev, autoProtect: false }));
        addAlert('MAINTENANCE', `Node ${nodeId} Repaired & Reset`, 'success');
    };

    return { nodes, alerts, systemStatus, injectFault, repairNode };
};
