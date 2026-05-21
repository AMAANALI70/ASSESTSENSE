# 🏭 AssetSense – Industrial Predictive Maintenance Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Version](https://img.shields.io/badge/version-1.1.0--ML--Enhanced-orange.svg)](#)
[![Node](https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg)](#)
[![React](https://img.shields.io/badge/react-19.2.0-blue.svg)](#)
[![MQTT](https://img.shields.io/badge/protocol-MQTT%20v3.1.1-lightgrey.svg)](#)

AssetSense is a production-ready **Industrial IoT (IIoT) Predictive Maintenance (PdM)** platform designed to mimic supervisor control systems (SCADA/DCS) for process plants, manufacturing fleets, and rotating machinery. The system integrates real-time sensor streams, edge-to-cloud analytics with machine learning, and automated failover mechanics to maximize plant reliability and eliminate unplanned downtime.

---

### ⚠️ The Problem It Solves
In modern industrial settings, **unplanned equipment downtime** is the single largest driver of lost revenue, costing companies millions in repairs and lost productivity.
* **Reactive Maintenance** (fixing machines *after* failure) leads to catastrophic damage, production logjams, and operator safety hazards.
* **Preventative Maintenance** (servicing machines on a *fixed schedule*) is highly inefficient, frequently replacing healthy components and wasting resources.

**AssetSense** bridges this gap using condition-based monitoring. By tracking multi-parametric signals (temperature, vibration, and current) in real-time, the system:
1. Detects subtle machine degradation weeks before physical failure occurs.
2. Identifies exact fault signatures (e.g., Bearing Wear, Overload, Misalignment).
3. Automatically triggers safety overrides ("Auto-Protect") to switch operations to a redundant backup node.
4. Alerts plant operators via instant email escalations.

---

## 📋 Table of Contents
1. [Features](#-features)
2. [Demo & Screenshots](#-demo--screenshots)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Installation & Setup](#-installation--setup)
6. [Usage](#-usage)
7. [API Documentation](#-api-documentation)
8. [Testing](#-testing)
9. [Deployment](#-deployment)
10. [Contributing](#-contributing)
11. [Roadmap / Future Improvements](#-roadmap--future-improvements)
12. [License](#-license)
13. [Contact / Author](#-contact--author)

---

## 🚀 Features

### 🧠 Machine Learning & Analytics Intelligence
* **Online Neural Network**: Features a pure-JavaScript feedforward neural network (using `Brain.js` with a 3-input → [64, 32] hidden → 2-output architecture) that trains dynamically in real-time on the telemetry stream.
* **Unsupervised Anomaly Detection**: Employs a custom, lightweight **Isolation Forest** algorithm to calculate day-zero anomaly scores based on multi-dimensional sensor clustering.
* **Stochastic Drift Estimation**: Uses an **Exponentially Weighted Moving Average (EWMA)** filter to identify trends and sensor drift amidst ambient industrial noise.
* **Predictive Health Scoring**: Computes a composite Health Index (0–100%) utilizing a multi-parametric sigmoid-based penalty function derived from physical thresholds.
* **RUL Trend Regression**: Calculates the **Remaining Useful Life (RUL)** in hours using a linear regression trend line of historical health metrics, allowing operators to plan maintenance cycles precisely.
* **Automatic Fault Classification**: Automatically identifies and diagnoses specific operational abnormalities:
  * **Bearing Wear**: Friction-induced heat combined with vibration spikes.
  * **Motor Overload**: Accelerated current draw paired with winding temperature rises.
  * **Shaft Misalignment**: Isolated vibration peaks in rotating parts.
  * **Overheating**: Thermal spikes caused by cooling or environment failures.

### 🛡️ Operational Resilience & Closed-Loop Control
* **Auto-Protect Mechanics**: When a primary active node's Health Index drops below 60%, the backend triggers an automated safety sequence, shutting down the failing asset and activating a redundant **Standby Spare Node** in real-time.
* **Failover Cooldowns & Throttling**: Ensures stable operation and prevents alert spam or rapid toggling caused by transient sensor spikes.

### 📧 SMTP Notification Dispatch
* Sends immediate, rich-text HTML alert emails containing detailed sensor telemetry tables and diagnostic reports to plant administrators using `Nodemailer` (secured with a 5-minute event cooldown to avoid inbox flooding).

### 🎮 Fault Injection & Virtual Control Room
* **Digital Twin Playground**: Features an interactive simulation console allowing operators to manually inject physical faults (Overheating, Bearing Wear, Misalignment, and Overload) to observe real-time physics-based signal degradation.
* **One-Click Maintenance**: Supports virtual repair workflows that restore node health, log maintenance actions, and release the spare node back to standby status.

---

## 📊 Demo / Screenshots

> [!NOTE]
> Below are placeholders representing the core views of the dashboard interface.

### 1. Main Plant Overview Dashboard
```
+-------------------------------------------------------------------------------+
| [ASSETSENSE]                SYSTEM HEALTH: 94.2%  |  Edge Connectivity: ONLINE |
|                                                                               |
|  +------------------+  +------------------+  +------------------+  +-------+  |
|  | Pump 01          |  | Induction Motor  |  | Compressor A     |  | Spare |  |
|  | Health: 98%      |  | Health: 58%      |  | Health: 92%      |  | STANDB|  |
|  | Status: HEALTHY  |  | Status: CRITICAL |  | Status: HEALTHY  |  | Active|  |
|  +------------------+  +------------------+  +------------------+  +-------+  |
|                                                                               |
|  [⚠️ SYSTEM ALERT: Auto-Protect Switched Induction Motor to Standby Spare]      |
+-------------------------------------------------------------------------------+
```

### 2. Multi-Parametric Radar & Trend Analytics
* **Historical trends**: Real-time Recharts line graphs showing Temperature, Vibration, and Current.
* **Node Comparison**: Radar chart comparing sensor deviations across all active machinery.
* **ML Performance Panel**: Tracks online neural network training iterations and prediction source logs.

*(Visual captures such as `server/figure4_simulation.png` showcase these plotted datasets).*

---

## 🛠️ Tech Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS (via PostCSS), Vanilla CSS | Ultra-fast rendering engine, industrial dark-theme dashboard, CSS keyframe animations. |
| **Charting & Icons** | Recharts, Lucide React | High-performance telemetry line graphs, radar charts, and SVG industrial icons. |
| **Backend API** | Node.js, Express.js | Event-driven architecture, RESTful endpoints. |
| **Communication** | MQTT (HiveMQ Broker), WebSocket (Socket.IO) | Dual-protocol messaging (low-latency TCP pub/sub + real-time browser socket broadcasts). |
| **Machine Learning** | Brain.js, Simple-Statistics, EWMA | Online Neural Networks, trend regressions, and stochastic drift filters. |
| **Database** | MongoDB (via Mongoose), JSON File Fallback | Dual persistence layer: writes to MongoDB when available; falls back to `db-logs.json`. |
| **Edge Hardware** | ESP32, PubSubClient, ArduinoJson | Physical acquisition platform deploying temperature, vibration, and current sensors. |

---

## 📦 Project Structure

```hl
assetsense/
├── .env                         # Local environment configuration file (redacted)
├── .gitignore                   # Files and directories ignored by Git
├── package.json                 # Frontend dependencies and configuration scripts
├── postcss.config.js            # PostCSS configuration for styling
├── tailwind.config.js           # Tailwind configuration properties
├── vite.config.js               # Vite compilation configuration
├── index.html                   # HTML template loader
├── WORKING.md                   # Operational theory and algorithm metrics documentation
├── physical_implementation.md   # Physical hardware assembly and wiring specifications
├── IOT_paper.pdf                # Reference scientific research paper
├── assetsense_ieee_paper.tex    # LaTeX formatting of reference paper
├── system_architecture.puml     # PlantUML source code for system layout
├── code/
│   └── code_1/
│       └── code_1.ino           # ESP32 C++ Sketch (Sensor loop + MQTT Pub)
├── server/
│   ├── package.json             # Backend server dependencies and execution scripts
│   ├── index.js                 # Express server, MQTT bridge, Socket.IO, SMTP dispatcher
│   ├── mlModel.js               # Anomaly Detection (Isolation Forest), Neural Network, EWMA
│   ├── database.js              # MongoDB connectivity module and local JSON fallback writer
│   ├── verify_analytics.js      # Isolated offline validation test suite for ML models
│   ├── verify_mqtt.js           # Test script to publish simulated MQTT packages
│   └── figure4_simulation.png   # ML model performance and simulation chart output
└── src/
    ├── App.jsx                  # Root React view, sidebar routing, and page coordinator
    ├── main.jsx                 # Client bootstrapping script
    ├── components/              # Isolated UI components (Alerts, Charts, Cards, etc.)
    │   ├── AlertsPanel.jsx      # Panel listing recent critical events and notifications
    │   ├── Analytics.jsx        # Complete analytical layout including line/radar graphs
    │   ├── FaultControlPanel.jsx# Diagnostic cockpit used to inject faults / repair nodes
    │   ├── HealthGauge.jsx      # SVG-rendered semi-circular status gauge
    │   ├── MachineAnimation.jsx # SVG animations showing rotating gears and fans
    │   ├── NodeCard.jsx         # Card component showcasing metrics & ML predictions per asset
    │   └── ...
    ├── hooks/
    │   └── useSimulation.js     # Custom React Hook orchestrating socket listeners & state
    ├── styles/                  # Theme variables and structural CSS files
    └── utils/                   # Shared arithmetic formatting helpers
```

---

## 🚀 Installation & Setup

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **MongoDB** (Optional, falls back to local file logs if not detected)
* **Arduino IDE** (Optional, only required if deploying to real ESP32 hardware)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/assetsense.git
cd assetsense
```

#### 2. Install Frontend & Root Dependencies
```bash
npm install
```

#### 3. Install Backend Server Dependencies
```bash
cd server
npm install
cd ..
```

---

### Environment Variables Setup

Create a `.env` file in the **root** of the project directory:

```env
# Node Server Configuration
PORT=3000

# SMTP Mail Server Credentials (Gmail Example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Database Connection URI (Optional)
MONGO_URL=mongodb://127.0.0.1:27017/assetsense
```

> [!TIP]
> If utilizing Gmail, you must generate a secure 16-character **App Password** via Google Accounts -> Security -> 2-Step Verification -> App Passwords.

---

### Running AssetSense Locally

#### Step A: Boot the Backend (MQTT Client + WebSockets + ML Engine)
From the root directory:
```bash
cd server
npm run dev
```
Upon successful boot, your console will output:
```hl
🧠 ML Model: Ready for predictions (PRO Architecture)
🧠 Neural Network: Pre-trained with synthetic baselines
💾 Database: Attempting connection to mongodb://127.0.0.1:27017/assetsense...
✅ Database: MongoDB Connected Successfully.
Connecting to MQTT Broker...
Connected to MQTT Broker: mqtt://broker.hivemq.com
Subscribed to topic: assetsense/nodes/#
AssetSense Backend running on http://localhost:3000
 > WebSocket Server ready
 > MQTT Bridge active
```

#### Step B: Boot the Frontend Dashboard
Open a new terminal window at the root directory:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 💡 Usage

### Operating the Dashboard
1. **Monitor Node Status**: Green indicates healthy status, yellow represents a warning threshold, and red flags a critical fault.
2. **Inject a Fault**: Locate the **Fault Simulation Console** on the dashboard. Select an asset (e.g., Pump 01) and choose a fault profile (e.g., *Bearing Wear*). Click **Inject Fault** to start the drift simulation.
3. **Observe Automated Safeguards**: Watch the telemetry graphs. Once the health index drops below 60%, the active node will deactivate, the standby **Spare Node** will immediately transition to an active status, and an email alert will be sent to the administrator.
4. **Trigger Repairs**: Click **Repair** on the degraded node in the simulation console. Its health will revert to 100%, and the spare node will switch back to idle status.

### Hardware Integration (ESP32)
1. Wire your sensors to the ESP32 as outlined in [physical_implementation.md](physical_implementation.md).
2. Open `code/code_1/code_1.ino` in the Arduino IDE.
3. Replace the SSID, password, and MQTT broker IP with your local network configurations.
4. Flash the code to the microchip. The ESP32 will immediately begin streaming live JSON payloads.

---

## 📡 API Documentation

### REST API Endpoints

#### 1. Dispatch Manual Emergency Alert
* **Endpoint**: `POST /api/send-alert`
* **Content-Type**: `application/json`
* **Request Body**:
```json
{
  "nodeName": "Induction Motor",
  "health": 55.4,
  "temp": 86.2,
  "vib": 2.45,
  "current": 12.8,
  "fault": "Bearing Wear"
}
```
* **Response (`200 OK`)**:
```json
{
  "success": true
}
```

---

### MQTT Telemetry Topic Structure
* **Topic**: `assetsense/nodes/{nodeId}`
* **Payload Schema**:
```json
{
  "nodeId": "pump-01",
  "temp": 64.2,
  "vib": 0.35,
  "current": 7.8,
  "timestamp": 1248950
}
```

---

### WebSocket Broadcast API (Socket.IO)
* **Event**: `sensor_update`
* **Enriched Metadata Output**:
```json
{
  "nodeId": "pump-01",
  "temp": 64.2,
  "vib": 0.35,
  "current": 7.8,
  "health": 98.4,
  "status": "healthy",
  "fault": "None",
  "rul": 1000,
  "anomalyScore": 0.12,
  "isAnomaly": false,
  "mlConfidence": 0.94,
  "predictionSource": "ML (Neural Net)",
  "trainingCount": 42
}
```

---

## 🧪 Testing

AssetSense includes an isolated testing suite designed to validate the regression, filtering, and classification engines offline.

To execute the analytical test pipeline, run:
```bash
cd server
node verify_analytics.js
```

### Verification Logs Output Example
```hl
--- AssetSense Cloud Analytics Verification ---
🧠 AssetSense Cloud Analytics: Initializing (PRO VERSION)...
🧠 Neural Network: Pre-trained with synthetic baselines
🧠 AssetSense Cloud Analytics: Online (NN + Forest + Regression)

[1] Training with Normal Data (Temp=40, Vib=0.5, Curr=5)...
Model Status: {
  algorithm: 'Isolation Forest + Brain.js NN',
  trees: 25,
  rulMethod: 'Linear Regression (Simple-Statistics)',
  drift: {
    temp: { mean: 39.851, var: 2.148 },
    vib: { mean: 0.503, var: 0.009 },
    current: { mean: 5.120, var: 1.042 }
  }
}

[2] Testing Normal Point (Temp=41, Vib=0.55, Curr=5.2)...
Normal Result: {
  "health": 98.24501,
  "anomalyScore": 0.14201,
  "isAnomaly": false,
  "rul": "> 1000h",
  "fault": "None",
  "confidence": 0.98421
}
✅ PASS: Normal data health high.

[3] Testing Anomaly Point (Temp=45, Vib=3.5, Curr=5.5)...
AnomalyResult (Score): 0.68421
✅ PASS: Anomaly detected (Isolation Forest Score > 0.55).

[4] Testing Health Penalty (Temp=90, Vib=0.5, Curr=5) - Sustained...
✅ PASS: Health score penalized correctly (< 80).
```

To test local MQTT subscriptions and websocket relays, run:
```bash
node verify_mqtt.js
```

---

## 🌐 Deployment

### Frontend Build
Compile the optimized static bundle of the React frontend using:
```bash
npm run build
```
This outputs compiled static files inside the `dist/` directory, which can be served on standard static servers like Nginx, Netlify, or Vercel.

### Backend Hosting
The backend service can be hosted on a cloud instance (AWS EC2, DigitalOcean, Heroku, or Render):
1. Use **PM2** process manager to ensure continuous execution:
   ```bash
   npm install -g pm2
   pm2 start index.js --name "assetsense-backend"
   ```
2. **Production Database Security**: Ensure the `.env` file maps to an authenticated MongoDB instance rather than public dev clusters.
3. **MQTT Protocol Encryption**: For production hardware communication, secure HiveMQ with TLS on port `8883` instead of the public port `1883`.

---

## 🤝 Contributing

Contributions to improve the analytical algorithms, frontend visualization, or edge hardware integrations are welcome!

1. Fork the project repository.
2. Create a feature branch: `git checkout -b feature/NewAlgorithm`.
3. Check for syntax and style compliance: `npm run lint`.
4. Commit your changes: `git commit -m 'Add new predictive feature'`.
5. Push to the branch: `git push origin feature/NewAlgorithm`.
6. Submit a Pull Request.

---

## 🔮 Roadmap / Future Improvements

* [ ] **Edge ML Deployment**: Port the lightweight Neural Network classifier to TensorFlow Lite for Microcontrollers (TFLite Micro) to enable local computation directly on the ESP32.
* [ ] **OPC-UA Protocol Integration**: Support OPC-UA and Modbus protocols to make AssetSense compatible with enterprise SCADA and DCS pipelines.
* [ ] **3D Digital Twin Representation**: Load CAD machine meshes using `Three.js` to showcase thermal gradients and mechanical stress zones on screen.
* [ ] **Federated Learning Network**: Support distributed model training where multiple plants aggregate neural weights without exporting raw telemetry data.
* [ ] **Advanced RUL Modeling**: Replace simple linear regression with an Long Short-Term Memory (LSTM) network to predict failure curves using sequential trend history.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](#) details. Free for educational and personal use.

---

## 👥 Contact / Author

* **Project Team**: AssetSense Development Team
* **Documentation Version**: 1.1.0 (ML Enhanced)
* **Academic Reference**: [IOT_paper.pdf](file:///e:/assestsense/IOT_paper.pdf)
