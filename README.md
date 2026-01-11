# 🏭 AssetSense – Industrial Predictive Maintenance Platform

AssetSense is a production-ready Industrial IoT Predictive Maintenance platform that demonstrates how modern Industry 4.0 systems leverage **Machine Learning**, **real-time data processing**, and **edge-to-cloud intelligence** to monitor machine health, detect faults early, and prevent unplanned downtime.

The project seamlessly integrates **lightweight neural networks**, **MQTT/WebSocket protocols**, and a **professional industrial dashboard** to deliver real-world predictive maintenance workflows used in manufacturing plants, energy systems, and process industries.

AssetSense supports both **simulation mode** (for development and demonstration) and **hardware integration** (ESP32-based sensor deployments with MQTT streaming).

## 🎯 Key Innovation: Embedded ML for Predictive Maintenance

AssetSense implements a **pure JavaScript neural network** (3→4→2 architecture) that runs directly in the Node.js backend, featuring:
- **Online Learning**: Continuously adapts to sensor patterns without retraining offline
- **Health Scoring**: ML-based predictions with rule-based fallback when confidence is low
- **Anomaly Detection**: Statistical Z-score analysis combined with ML anomaly scoring
- **RUL Estimation**: Exponential decay model for Remaining Useful Life prediction
- **Fault Classification**: Multi-parametric pattern matching for bearing wear, overload, misalignment, and overheating

🎯 Project Motivation

In real industrial environments:

Unexpected machine failures cause massive production losses

Reactive maintenance is unsafe and expensive

Scheduled maintenance often replaces healthy components unnecessarily

Predictive Maintenance (PdM) solves this by:

Continuously monitoring machine condition

Detecting early degradation patterns

Acting before catastrophic failure occurs

🚀 AssetSense was built to:

Demonstrate predictive maintenance concepts clearly

Showcase edge-cloud industrial architecture

Simulate realistic machine degradation and faults

Provide a decision-support dashboard, not just charts

Serve as a bridge between academic IoT concepts and real industry systems

🧠 What AssetSense Does

AssetSense continuously monitors three critical machine parameters:

Temperature

Vibration

Current

Using these signals, it:

Computes a Health Index (0–100%)

Detects fault patterns such as:

Overheating

Bearing Wear

Misalignment

Overload

Estimates Remaining Useful Life (RUL)

Automatically triggers Auto-Protect by switching to a Spare Node when a machine becomes critical

Escalates alerts via email notifications

All logic mirrors real industrial predictive maintenance systems, even though sensor data is currently simulated.

## 🏗️ System Architecture

AssetSense follows a **Hybrid Edge–Cloud Industrial IoT Architecture** with ML-enabled intelligence:

### 🔹 Hardware Layer (ESP32)
- **ESP32 microcontroller** per machine node
- **Sensor suite**: Temperature (DS18B20), Vibration (MPU6050), Current (ACS712)
- **Control interface**: Relay modules for machine actuation
- **Communication**: MQTT publish to cloud broker (HiveMQ)

### 🔹 Communication Layer
- **MQTT Broker**: HiveMQ Cloud (broker.hivemq.com)
- **Protocol**: MQTT over TCP/IP for sensor data transmission
- **WebSocket**: Socket.IO for real-time dashboard updates
- **Data Flow**: ESP32 → MQTT Broker → Node.js Backend → WebSocket → React Dashboard

### 🔹 Intelligence Layer (Node.js Backend)
- **ML Neural Network**: 3-input → 4-hidden → 2-output architecture
- **Online Learning**: Continuous model training with gradient descent
- **Health Prediction**: ML inference with rule-based fallback
- **Anomaly Detection**: Statistical Z-score analysis
- **Fault Classification**: Pattern-based diagnosis (bearing wear, overload, misalignment, overheating)
- **RUL Estimation**: Exponential decay model for predictive scheduling

### 🔹 Alert & Action Layer
- **Auto-Protect Logic**: Automatic spare node activation when health < 60%
- **Email Alerts**: SMTP notifications via Nodemailer (5-minute cooldown)
- **Event Throttling**: Prevents alert spam during transient faults

### 🔹 Visualization Layer (React Dashboard)
- **Real-time monitoring**: Live sensor streams via WebSocket
- **ML insights**: Health scores, RUL, anomaly scores, confidence levels
- **Fault simulation**: Manual injection for testing and demonstration
- **Analytics**: Historical trends, node comparison, and operator activity

🧩 Hardware Components (Real Deployment Ready)

Although AssetSense currently simulates sensor data, it is fully compatible with real hardware.

🔧 Per Machine Node

ESP32 Dev Board (ESP32-WROOM / DevKitC)

Temperature Sensor (DS18B20 / PT100)

Vibration Sensor (MPU6050 / ADXL345)

Current Sensor (ACS712 / SCT-013)

Relay / Contactor Module

Power Supply (5V / Industrial DC)

🖥️ Edge System

Industrial PC / Server / Laptop

MQTT / HTTP / WebSocket support

Local network (Ethernet / Wi-Fi)

☁️ Backend

Node.js + Express

SMTP Email Service (Nodemailer)

## 🚀 Features

### 🧠 **Machine Learning Intelligence**
- **Neural Network**: Lightweight 3→4→2 architecture (pure JavaScript)
- **Online Learning**: Model trains continuously on incoming sensor data
- **Adaptive Health Scoring**: ML predictions with >70% confidence, otherwise rule-based fallback
- **Anomaly Detection**: Z-score statistical analysis + ML-based anomaly scoring
- **RUL Prediction**: Exponential decay model estimating hours until failure
- **Fault Classification**: Automatic diagnosis (Bearing Wear / Overload / Misalignment / Overheating)
- **Prediction Metadata**: Displays ML confidence, training count, and prediction source

### 📊 **Real-Time Monitoring**
- **Live Sensor Streams**: Temperature (°C), Vibration (g), Current (A) via MQTT/WebSocket
- **Multi-Node Dashboard**: Pump, Motor, Compressor, and Spare Node
- **Composite Health Index**: 0-100% score updated in real-time
- **Dynamic Status**: Auto-categorization (Healthy / Warning / Critical)
- **ML Insights Panel**: Shows anomaly scores, RUL hours, and fault diagnosis

### ⚠️ **Fault Simulation & Control**
- **Fault Injection Console**: Manually inject Overheating, Bearing Wear, Misalignment, Overload
- **Physics-Based Degradation**: Realistic sensor drift mimicking real-world failures
- **Repair Workflow**: One-click repair restores node health and releases spare
- **Auto-Protect**: Automatic spare activation when health drops below 60%
- **System Response Banner**: Visual alerts for critical conditions

### 📧 **Automated Alert System**
- **Critical Email Alerts**: Auto-sent when node becomes critical (health < 60%)
- **Email Throttling**: 5-minute cooldown prevents spam
- **Rich HTML Templates**: Professional alert emails with full diagnostic data
- **SMTP Integration**: Nodemailer with Gmail (configurable)

### 🎨 **Industrial-Grade Dashboard**
- **Dark Industrial Theme**: Optimized for 24/7 control room displays
- **Animated Machine Visuals**: Rotating gears, pumps, and compressors
- **LED-Style Indicators**: Status lights with glow effects
- **Smooth Micro-Interactions**: Hover effects, transitions, and loading states
- **Multi-View Interface**: Dashboard, Analytics, Team, and Settings pages

### 📈 **Advanced Analytics**
- **Historical Trends**: Line charts for temperature, vibration, current over time
- **Node Comparison**: Radar charts comparing all nodes
- **RUL Panel**: Remaining Useful Life estimates for maintenance scheduling
- **ML Training Metrics**: Displays training iterations and confidence growth
- **Operator Activity Log**: Tracks injections, repairs, and system events

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite (fast dev server, HMR)
- **Styling**: Vanilla CSS with CSS Variables and Keyframe Animations
- **Charts**: Recharts (line charts, radar charts, gauges)
- **Icons**: Lucide React (industrial iconography)
- **State Management**: Custom React Hook (`useSimulation`) with real-time WebSocket
- **Persistence**: LocalStorage for fault injection history and settings
- **Real-time Communication**: Socket.IO Client

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **ML Engine**: Custom Neural Network (`mlModel.js`) - pure JavaScript
- **MQTT Client**: `mqtt.js` (connects to HiveMQ broker)
- **WebSocket**: Socket.IO Server (broadcasts ML predictions to frontend)
- **Email Service**: Nodemailer (SMTP via Gmail)
- **Environment Config**: dotenv (.env file management)

### Communication Protocols
- **MQTT**: Pub/Sub messaging (topic: `assetsense/nodes/#`)
- **WebSocket**: Bidirectional real-time updates (Socket.IO)
- **HTTP/REST**: Legacy alert API endpoint

### Machine Learning
- **Architecture**: Feedforward Neural Network (3 inputs → 4 hidden neurons → 2 outputs)
- **Activation Functions**: ReLU (hidden layer), Sigmoid (output layer)
- **Training**: Online gradient descent with backpropagation
- **Optimization**: Xavier/Glorot weight initialization
- **Features**: Health prediction, anomaly detection, RUL estimation, fault classification

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/assetsense.git
cd assetsense
```

### 2️⃣ Install Frontend Dependencies
```bash
npm install
```

### 3️⃣ Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4️⃣ Configure Environment Variables
Create a `.env` file in the root directory:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

**Note**: For Gmail, you need to generate an [App Password](https://support.google.com/accounts/answer/185833).

### 5️⃣ Run the Backend (ML Engine + MQTT Bridge)
```bash
cd server
node index.js
```

You should see:
```
🧠 ML Model: Ready for predictions
Connected to MQTT Broker: mqtt://broker.hivemq.com
AssetSense Backend running on http://localhost:3000
```

### 6️⃣ Run the Frontend (Dashboard)
In a new terminal:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7️⃣ (Optional) Connect Real ESP32 Hardware
See [physical_implementation.md](physical_implementation.md) for wiring and code.

Publish sensor data to MQTT topic:
```
assetsense/nodes/{nodeId}
```

Payload format:
```json
{
  "nodeId": "pump-01",
  "temp": 65.5,
  "vib": 1.2,
  "current": 8.3
}
```

🎮 How to Use AssetSense

Observe the Dashboard

Green → Healthy

Yellow → Warning

Red → Critical

Inject a Fault

Open Fault Injection Console

Select Machine

Select Fault Type

Inject and observe degradation

Auto-Protect in Action

When health < 60%, system switches to Spare Node automatically

Repair & Recover

Repair the faulty node

Health restores

Spare is released

## 🔮 Future Enhancements

- [ ] **Edge ML Deployment**: Port neural network to TensorFlow Lite for ESP32
- [ ] **OPC-UA Support**: Industrial protocol for enterprise SCADA integration
- [ ] **Digital Twin 3D**: Three.js visualization with thermal overlays
- [ ] **Federated Learning**: Multi-plant model aggregation without data sharing
- [ ] **Time-Series Database**: InfluxDB for long-term sensor storage
- [ ] **Advanced RUL Models**: LSTM networks for time-series failure prediction
- [ ] **Mobile App**: React Native dashboard for on-the-go monitoring
- [ ] **Cloud Deployment**: AWS IoT Core / Azure IoT Hub integration

👨‍🎓 Who This Project Is For

IoT & Embedded Systems students

Industry 4.0 learners

Predictive maintenance demonstrations
Academic projects & capstones

Interview & portfolio showcase

📄 License

MIT License
Free for educational and personal use.

