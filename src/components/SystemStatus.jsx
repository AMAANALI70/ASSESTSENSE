import React from 'react';
import { Wifi, Server, Activity } from 'lucide-react';

const SystemStatus = ({ status, nodeCount }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            background: 'var(--bg-panel)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
        }}>
            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Wifi size={16} color={status.mqtt === 'Connected' ? 'var(--status-healthy)' : 'var(--status-critical)'} />
                <span style={{ fontSize: '0.9rem' }}>MQTT: {status.mqtt}</span>
            </div>

            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Server size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem' }}>Nodes: {nodeCount}</span>
            </div>

            <div className="flex-center" style={{ gap: '0.5rem' }}>
                <Activity size={16} color="var(--accent-warning)" />
                <span style={{ fontSize: '0.9rem' }}>Latency: {Math.round(status.latency)}ms</span>
            </div>
        </div>
    );
};

export default SystemStatus;
