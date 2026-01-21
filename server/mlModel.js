/**
 * AssetSense ML Model - Cloud Analytics Layer
 * Implements "Section VI.C: Cloud Analytics and Fleet Intelligence" from IOT_paper.pdf
 * 
 * Algorithms:
 * 1. Drift Estimation: Exponentially Weighted Moving Average (EWMA) [Eq. 4]
 * 2. Anomaly Detection: Isolation Forest (Unsupervised) [Section VI.C.2]
 * 3. Health Scoring: Sigmoid-based Penalty Function [Eq. 5 & 6]
 */

const CONFIG = {
    // EWMA Parameters
    ewma: {
        alphaBase: 0.1,    // Baseline smoothing factor
        alphaDynamic: true // Adjust alpha based on volatility
    },

    // Health Penalty Weights (from Paper)
    weights: {
        vib: 0.5,
        temp: 0.3,
        current: 0.2
    },

    // Soft Thresholds for Sigmoid Function (Tau_k)
    thresholds: {
        vib: 2.5,    // mm/s (mapped from g for simulation)
        temp: 75,    // °C
        current: 12  // A
    },

    // Sensitivity Parameters (Lambda_k) - Tuned for sigmoid curve
    sensitivity: {
        vib: 2.0,
        temp: 0.25,  // Increased from 0.1 for sharper penalty at 90C
        current: 0.5
    },

    // Calibration
    calibration: {
        vibScale: 1.0,
    }
};

// ==========================================
// 1. ISOLATION FOREST IMPLEMENTATION
// ==========================================

class IsolationTree {
    constructor(heightLimit) {
        this.heightLimit = heightLimit;
        this.root = null;
    }

    fit(X) {
        this.root = this.makeTree(X, 0, this.heightLimit);
    }

    makeTree(X, currentHeight, heightLimit) {
        if (currentHeight >= heightLimit || X.length <= 1) {
            return { type: 'leaf', size: X.length };
        }

        // 1. Randomly select a dimension (feature)
        const numFeatures = X[0].length;
        const q = Math.floor(Math.random() * numFeatures);

        // 2. Find min/max for that feature
        const values = X.map(x => x[q]);
        const min = Math.min(...values);
        const max = Math.max(...values);

        if (min === max) {
            return { type: 'leaf', size: X.length };
        }

        // 3. Randomly select a split value
        const p = min + Math.random() * (max - min);

        // 4. Split data
        const leftX = X.filter(x => x[q] < p);
        const rightX = X.filter(x => x[q] >= p);

        return {
            type: 'node',
            splitAtt: q,
            splitVal: p,
            left: this.makeTree(leftX, currentHeight + 1, heightLimit),
            right: this.makeTree(rightX, currentHeight + 1, heightLimit)
        };
    }

    pathLength(x, node, currentHeight) {
        if (node.type === 'leaf') {
            return currentHeight + this.c(node.size);
        }
        if (x[node.splitAtt] < node.splitVal) {
            return this.pathLength(x, node.left, currentHeight + 1);
        } else {
            return this.pathLength(x, node.right, currentHeight + 1);
        }
    }

    c(n) {
        if (n <= 1) return 0;
        return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
    }
}

class IsolationForest {
    constructor(numTrees = 20, sampleSize = 256) {
        this.numTrees = numTrees;
        this.sampleSize = sampleSize;
        this.trees = [];
        this.X_train = []; // Keep a rolling buffer of training data
    }

    train(dataPoint) {
        // Online learning: Maintain a buffer of recent points
        this.X_train.push(dataPoint);
        if (this.X_train.length > this.sampleSize * 2) {
            this.X_train.shift(); // Keep buffer size manageable
        }

        // Retrain periodically (simplified for online usage)
        // In robust implementation, we wouldn't retrain on every point, but for 'Day-Zero' demo, we build trees on startup
        if (this.trees.length === 0 && this.X_train.length >= 10) {
            this.buildForest();
        } else if (this.X_train.length % 50 === 0) {
            // Rebuild forest periodically to adapt to new "normal"
            this.buildForest();
        }
    }

    buildForest() {
        this.trees = [];
        const heightLimit = Math.ceil(Math.log2(this.sampleSize));

        // Subsample for training
        const sample = this.X_train.length > this.sampleSize
            ? this.X_train.slice(-this.sampleSize) // Take most recent
            : this.X_train;

        for (let i = 0; i < this.numTrees; i++) {
            const tree = new IsolationTree(heightLimit);
            tree.fit(sample);
            this.trees.push(tree);
        }
        console.log(`🌲 Isolation Forest: Rebuilt with ${this.trees.length} trees`);
    }

    score(x) {
        if (this.trees.length === 0) return 0.5; // Default neutral score

        let totalPathLength = 0;
        for (let tree of this.trees) {
            totalPathLength += tree.pathLength(x, tree.root, 0);
        }
        const avgPathLength = totalPathLength / this.trees.length;

        // Normalize score: 2^(-E(h(x)) / c(n))
        const n = this.sampleSize;
        const c_n = 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
        const score = Math.pow(2, -avgPathLength / c_n);

        return score; // > 0.6 is anomaly
    }
}

// ==========================================
// 2. MAIN MODEL CLASS
// ==========================================

export class MLModel {
    constructor() {
        console.log('🧠 AssetSense Cloud Analytics: Initializing...');

        this.isolationForest = new IsolationForest(25, 100); // 25 trees, 100 sample size

        // EWMA State [Mean, Variance]
        this.driftState = {
            temp: { mean: 40, var: 0 },
            vib: { mean: 0.5, var: 0 },
            current: { mean: 5, var: 0 }
        };

        this.trainingCount = 0;
        console.log('🧠 AssetSense Cloud Analytics: Online (Isolation Forest + EWMA)');
    }

    /**
     * Eq 4: Exponentially Weighted Moving Average for Drift Estimation
     * Tracks the "true" underlying value amidst noise.
     */
    updateDrift(metric, value) {
        const state = this.driftState[metric];

        // Simple variance estimation for dynamic alpha
        // If deviation is high, high alpha (trust new value more/fast adaptation)
        // If deviation is low, low alpha (filter noise)
        const deviation = Math.abs(value - state.mean);
        let alpha = CONFIG.ewma.alphaBase;

        if (CONFIG.ewma.alphaDynamic) {
            // Heuristic: Boost alpha if deviation > 3 * estimated std dev (approx)
            if (deviation > (Math.sqrt(state.var) * 3)) alpha = 0.5;
        }

        // Update Mean: mu_t = alpha * X_t + (1 - alpha) * mu_t-1
        state.mean = alpha * value + (1 - alpha) * state.mean;

        // Update Variance (Welford's approx or simple exponential)
        // Var_t = (1-beta)*Var_t-1 + beta*(X_t - mu_t)^2
        const beta = 0.1;
        state.var = (1 - beta) * state.var + beta * Math.pow(deviation, 2);

        return state.mean;
    }

    /**
     * Eq 5: Partial Health Penalty Function (Sigmoid)
     * phi_k(x) = 1 / (1 + e^(-lambda * (x - tau)))
     */
    calculatePenalty(value, metric) {
        const lambda = CONFIG.sensitivity[metric];
        const tau = CONFIG.thresholds[metric];

        // Sigmoid function
        const exponent = -lambda * (value - tau);
        const penalty = 1 / (1 + Math.exp(exponent));

        return penalty;
    }

    /**
     * Main Pipeline: Ingest -> EWMA -> Isolation Forest -> Health Score
     */
    predictHealth(temp, vib, current) {
        // 1. Drift Estimation (EWMA)
        const driftTemp = this.updateDrift('temp', temp);
        const driftVib = this.updateDrift('vib', vib);
        const driftCurrent = this.updateDrift('current', current);

        // 2. Anomaly Detection (Isolation Forest)
        // Feature Vector: [Temp, Vib, Current]
        const features = [temp, vib, current];
        this.isolationForest.train(features); // Online Learning
        const anomalyScore = this.isolationForest.score(features);
        const isAnomaly = anomalyScore > 0.55; // Tuned threshold for lightweight implementation

        // 3. Health Score Calculation (Eq. 6)
        // H(t) = 100 - Sum(w_k * phi_k(x)) * 100
        const pTemp = this.calculatePenalty(driftTemp, 'temp');
        const pVib = this.calculatePenalty(driftVib, 'vib');
        const pCurrent = this.calculatePenalty(driftCurrent, 'current');

        const totalPenalty = (
            CONFIG.weights.temp * pTemp +
            CONFIG.weights.vib * pVib +
            CONFIG.weights.current * pCurrent
        );

        const healthScore = Math.max(0, Math.min(100, (1 - totalPenalty) * 100));

        // 4. RUL Estimation (Simplified Physics-based)
        const rul = this.estimateRUL(healthScore);

        this.trainingCount++;

        return {
            health: healthScore,
            anomalyScore: anomalyScore,
            isAnomaly: isAnomaly,
            rul: rul,
            fault: this.classifyFault(temp, vib, current),
            confidence: isAnomaly ? 0.4 : 0.9, // Lower confidence if outlier detected
            trainingCount: this.trainingCount,
            drift: { temp: driftTemp, vib: driftVib, current: driftCurrent }
        };
    }

    estimateRUL(health) {
        // Basic quadratic decay model
        // RUL = 1000 * (Health/100)^2
        return Math.floor(1000 * Math.pow(health / 100, 2));
    }

    classifyFault(temp, vib, current) {
        if (temp > 85) return 'Overheating';
        if (vib > 2.0) return 'Misalignment'; // Tuned for simulation
        if (current > 15) return 'Overload';
        return 'None';
    }

    train(temp, vib, current, target) {
        // Isolation Forest trains online in 'predictHealth', distinct explicit training is passive here
        // We keep this method signature for compatibility with index.js
    }

    getStatus() {
        return {
            algorithm: 'Isolation Forest + EWMA',
            trees: this.isolationForest.trees.length,
            samples: this.isolationForest.X_train.length,
            drift: this.driftState
        };
    }
}

export default MLModel;
