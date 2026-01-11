/**
 * AssetSense ML Model
 * Lightweight Neural Network for Predictive Maintenance
 * 
 * Architecture: 3 inputs → 4 hidden (ReLU) → 2 outputs (Sigmoid)
 * - Input: [temperature, vibration, current] (normalized)
 * - Output: [health, anomaly] (0-1)
 * 
 * Features:
 * - Online learning with gradient descent
 * - RUL estimation using exponential decay
 * - Statistical anomaly detection
 * - Pattern-based fault classification
 */

// ============== CONFIGURATION ==============
const CONFIG = {
    // Network architecture
    inputSize: 3,
    hiddenSize: 4,
    outputSize: 2,

    // Learning parameters
    learningRate: 0.01,
    minConfidence: 0.5,

    // Sensor normalization bounds (based on typical industrial ranges)
    normalization: {
        temp: { min: 20, max: 120 },      // °C
        vib: { min: 0, max: 5 },           // g (RMS)
        current: { min: 0, max: 20 }       // A
    },

    // Thresholds for rule-based fallback
    thresholds: {
        temp: { warning: 70, critical: 85 },
        vib: { warning: 1.5, critical: 2.5 },
        current: { warning: 12, critical: 15 }
    },

    // RUL parameters
    rul: {
        maxHours: 1000,           // Maximum RUL in hours
        decayRateHealthy: 0.001,  // Slow decay when healthy
        decayRateCritical: 0.05   // Fast decay when critical
    }
};

// ============== UTILITY FUNCTIONS ==============

/**
 * ReLU activation function
 */
function relu(x) {
    return Math.max(0, x);
}

/**
 * Sigmoid activation function
 */
function sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
}

/**
 * Sigmoid derivative for backpropagation
 */
function sigmoidDerivative(x) {
    const s = sigmoid(x);
    return s * (1 - s);
}

/**
 * ReLU derivative for backpropagation
 */
function reluDerivative(x) {
    return x > 0 ? 1 : 0;
}

/**
 * Xavier/Glorot initialization for weights
 */
function xavierInit(fanIn, fanOut) {
    const limit = Math.sqrt(6 / (fanIn + fanOut));
    return (Math.random() * 2 - 1) * limit;
}

// ============== ML MODEL CLASS ==============

export class MLModel {
    constructor() {
        console.log('🧠 ML Model: Initializing neural network...');

        // Initialize weights with Xavier initialization
        this.weightsInputHidden = this.initWeights(CONFIG.inputSize, CONFIG.hiddenSize);
        this.weightsHiddenOutput = this.initWeights(CONFIG.hiddenSize, CONFIG.outputSize);

        // Initialize biases to zero
        this.biasHidden = new Array(CONFIG.hiddenSize).fill(0);
        this.biasOutput = new Array(CONFIG.outputSize).fill(0);

        // Training statistics
        this.trainingCount = 0;
        this.runningError = 0;
        this.confidence = CONFIG.minConfidence;

        // History for anomaly detection
        this.history = [];
        this.historyMaxSize = 100;

        // Running statistics for online normalization
        this.runningMean = [0, 0, 0];
        this.runningStd = [1, 1, 1];

        console.log('🧠 ML Model: Initialized with',
            CONFIG.inputSize, '→', CONFIG.hiddenSize, '→', CONFIG.outputSize, 'architecture');
    }

    /**
     * Initialize weight matrix with Xavier initialization
     */
    initWeights(fanIn, fanOut) {
        const weights = [];
        for (let i = 0; i < fanIn; i++) {
            weights[i] = [];
            for (let j = 0; j < fanOut; j++) {
                weights[i][j] = xavierInit(fanIn, fanOut);
            }
        }
        return weights;
    }

    /**
     * Normalize sensor values to 0-1 range
     */
    normalize(temp, vib, current) {
        const norm = CONFIG.normalization;
        return [
            (temp - norm.temp.min) / (norm.temp.max - norm.temp.min),
            (vib - norm.vib.min) / (norm.vib.max - norm.vib.min),
            (current - norm.current.min) / (norm.current.max - norm.current.min)
        ].map(v => Math.max(0, Math.min(1, v))); // Clamp to [0, 1]
    }

    /**
     * Forward pass through the neural network
     */
    forward(inputs) {
        // Input → Hidden layer
        const hiddenPre = new Array(CONFIG.hiddenSize).fill(0);
        for (let j = 0; j < CONFIG.hiddenSize; j++) {
            for (let i = 0; i < CONFIG.inputSize; i++) {
                hiddenPre[j] += inputs[i] * this.weightsInputHidden[i][j];
            }
            hiddenPre[j] += this.biasHidden[j];
        }

        // Apply ReLU activation
        const hiddenPost = hiddenPre.map(relu);

        // Hidden → Output layer
        const outputPre = new Array(CONFIG.outputSize).fill(0);
        for (let k = 0; k < CONFIG.outputSize; k++) {
            for (let j = 0; j < CONFIG.hiddenSize; j++) {
                outputPre[k] += hiddenPost[j] * this.weightsHiddenOutput[j][k];
            }
            outputPre[k] += this.biasOutput[k];
        }

        // Apply Sigmoid activation
        const outputPost = outputPre.map(sigmoid);

        return {
            inputs,
            hiddenPre,
            hiddenPost,
            outputPre,
            outputPost
        };
    }

    /**
     * Train the model using online gradient descent
     */
    train(temp, vib, current, targetHealth) {
        const inputs = this.normalize(temp, vib, current);
        const target = [targetHealth, 0]; // [health, anomaly] - anomaly target is 0 for normal

        // Forward pass
        const { hiddenPre, hiddenPost, outputPre, outputPost } = this.forward(inputs);

        // Calculate output error
        const outputError = [
            outputPost[0] - target[0],
            outputPost[1] - target[1]
        ];

        // Calculate gradients for output layer
        const outputGrad = outputError.map((e, k) => e * sigmoidDerivative(outputPre[k]));

        // Calculate hidden layer error
        const hiddenError = new Array(CONFIG.hiddenSize).fill(0);
        for (let j = 0; j < CONFIG.hiddenSize; j++) {
            for (let k = 0; k < CONFIG.outputSize; k++) {
                hiddenError[j] += outputGrad[k] * this.weightsHiddenOutput[j][k];
            }
        }

        // Calculate hidden layer gradients
        const hiddenGrad = hiddenError.map((e, j) => e * reluDerivative(hiddenPre[j]));

        // Update weights: Hidden → Output
        for (let j = 0; j < CONFIG.hiddenSize; j++) {
            for (let k = 0; k < CONFIG.outputSize; k++) {
                this.weightsHiddenOutput[j][k] -= CONFIG.learningRate * outputGrad[k] * hiddenPost[j];
            }
        }

        // Update biases: Output
        for (let k = 0; k < CONFIG.outputSize; k++) {
            this.biasOutput[k] -= CONFIG.learningRate * outputGrad[k];
        }

        // Update weights: Input → Hidden
        for (let i = 0; i < CONFIG.inputSize; i++) {
            for (let j = 0; j < CONFIG.hiddenSize; j++) {
                this.weightsInputHidden[i][j] -= CONFIG.learningRate * hiddenGrad[j] * inputs[i];
            }
        }

        // Update biases: Hidden
        for (let j = 0; j < CONFIG.hiddenSize; j++) {
            this.biasHidden[j] -= CONFIG.learningRate * hiddenGrad[j];
        }

        // Update training statistics
        this.trainingCount++;
        const error = Math.abs(outputError[0]);
        this.runningError = 0.95 * this.runningError + 0.05 * error;

        // Update confidence based on error
        this.confidence = Math.min(0.99, CONFIG.minConfidence + (1 - this.runningError) * 0.4);

        // Store in history for anomaly detection
        this.history.push({ temp, vib, current, health: targetHealth });
        if (this.history.length > this.historyMaxSize) {
            this.history.shift();
        }
    }

    /**
     * Main prediction function
     */
    predictHealth(temp, vib, current) {
        const inputs = this.normalize(temp, vib, current);
        const { outputPost } = this.forward(inputs);

        // ML predicted health (0-1 → 0-100)
        const mlHealth = outputPost[0] * 100;
        const mlAnomaly = outputPost[1];

        // Calculate RUL
        const rul = this.predictRUL(mlHealth);

        // Detect anomalies
        const anomalyResult = this.detectAnomaly(temp, vib, current);

        // Classify fault
        const fault = this.classifyFault(temp, vib, current);

        // Combine anomaly scores
        const combinedAnomalyScore = Math.max(mlAnomaly, anomalyResult.score);

        return {
            health: Math.max(0, Math.min(100, mlHealth)),
            anomalyScore: combinedAnomalyScore,
            rul: rul,
            fault: fault,
            confidence: this.confidence,
            isAnomaly: combinedAnomalyScore > 0.5,
            trainingCount: this.trainingCount
        };
    }

    /**
     * Predict Remaining Useful Life using exponential decay model
     */
    predictRUL(healthPercent) {
        const health = healthPercent / 100;

        // Exponential decay model
        // RUL = maxRUL * health^2 (faster decay at lower health)
        let rul = CONFIG.rul.maxHours * Math.pow(health, 2);

        // Apply critical decay rate if health is low
        if (healthPercent < 60) {
            rul *= 0.5; // Halve RUL when critical
        } else if (healthPercent < 80) {
            rul *= 0.75; // Reduce RUL when warning
        }

        return Math.max(0, Math.round(rul));
    }

    /**
     * Detect anomalies using statistical methods
     */
    detectAnomaly(temp, vib, current) {
        if (this.history.length < 10) {
            return { score: 0, reason: 'Insufficient data' };
        }

        // Calculate mean and std from history
        const temps = this.history.map(h => h.temp);
        const vibs = this.history.map(h => h.vib);
        const currents = this.history.map(h => h.current);

        const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
        const std = arr => {
            const m = mean(arr);
            return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length);
        };

        const tempMean = mean(temps);
        const vibMean = mean(vibs);
        const currentMean = mean(currents);

        const tempStd = std(temps) || 1;
        const vibStd = std(vibs) || 0.1;
        const currentStd = std(currents) || 1;

        // Calculate Z-scores
        const tempZ = Math.abs(temp - tempMean) / tempStd;
        const vibZ = Math.abs(vib - vibMean) / vibStd;
        const currentZ = Math.abs(current - currentMean) / currentStd;

        // Max Z-score as anomaly indicator
        const maxZ = Math.max(tempZ, vibZ, currentZ);

        // Convert Z-score to anomaly score (0-1)
        // Z > 3 is typically considered anomalous
        const score = Math.min(1, maxZ / 4);

        let reason = 'Normal';
        if (maxZ > 3) {
            if (tempZ === maxZ) reason = 'Temperature spike';
            else if (vibZ === maxZ) reason = 'Vibration spike';
            else reason = 'Current spike';
        }

        return { score, reason, zScores: { temp: tempZ, vib: vibZ, current: currentZ } };
    }

    /**
     * Classify fault type based on sensor patterns
     */
    classifyFault(temp, vib, current) {
        const t = CONFIG.thresholds;

        // Pattern matching for fault classification
        const highTemp = temp > t.temp.warning;
        const criticalTemp = temp > t.temp.critical;
        const highVib = vib > t.vib.warning;
        const criticalVib = vib > t.vib.critical;
        const highCurrent = current > t.current.warning;
        const criticalCurrent = current > t.current.critical;

        // Bearing Wear: High temp + High vibration
        if (highTemp && highVib) {
            return 'Bearing Wear';
        }

        // Overload: High temp + High current
        if (highTemp && highCurrent) {
            return 'Overload';
        }

        // Misalignment: High vibration only
        if (criticalVib && !highTemp) {
            return 'Misalignment';
        }

        // Overheating: High temp only
        if (criticalTemp && !highVib && !highCurrent) {
            return 'Overheating';
        }

        // Electrical Issue: High current + normal temp
        if (criticalCurrent && !highTemp) {
            return 'Electrical Issue';
        }

        return 'None';
    }

    /**
     * Rule-based health calculation (fallback)
     */
    calculateRuleBasedHealth(temp, vib, current) {
        const tempPenalty = Math.max(0, (temp - 60) * 1.5);
        const vibPenalty = Math.max(0, (vib - 1.0) * 20);
        const currentPenalty = Math.max(0, (current - 10) * 5);

        let health = 100 - (0.4 * tempPenalty + 0.35 * vibPenalty + 0.25 * currentPenalty);
        return Math.max(0, Math.min(100, health));
    }

    /**
     * Get model status for debugging/display
     */
    getStatus() {
        return {
            trainingCount: this.trainingCount,
            confidence: this.confidence,
            runningError: this.runningError,
            historySize: this.history.length,
            architecture: `${CONFIG.inputSize}→${CONFIG.hiddenSize}→${CONFIG.outputSize}`
        };
    }
}

// Export default instance for convenience
export default MLModel;
