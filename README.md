🏭 AssetSense – Industrial Predictive Maintenance Platform

AssetSense is a high-fidelity Industrial Predictive Maintenance platform designed to demonstrate how modern Industry 4.0 systems monitor machine health, detect faults early, and prevent unplanned downtime.

The project combines real-time data processing, edge intelligence, and a professional industrial dashboard to simulate (and extend toward) real-world predictive maintenance workflows used in manufacturing plants, energy systems, and process industries.

AssetSense is intentionally designed to be simulation-driven at the UI level, while remaining architecture-accurate and hardware-ready for real ESP32-based deployments.

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

🏗️ System Architecture (High Level)

AssetSense follows a Hybrid Edge–Cloud Industrial IoT Architecture:

🔹 On-Device (Conceptual / Real-Ready)

ESP32 controller per machine

Temperature, vibration, and current sensors

Relay/contactor for machine control

🔹 Edge Intelligence

Health scoring

Fault classification

Degradation tracking

Auto-Protect logic (safety-critical)

🔹 Cloud / Backend

Email alerts only

No control logic in the cloud

Control decisions are edge-local, ensuring low latency and safety.

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

🚀 Features
📊 Real-Time Monitoring

Live Temperature, Vibration, and Current for:

Pump

Motor

Compressor

Spare Node

Composite Health Index

Dynamic state changes (Healthy / Warning / Critical)

⚠️ Fault Simulation Engine

Inject faults:

Overheating

Bearing Wear

Misalignment

Overload

Physics-inspired signal drift

Repair workflow to restore machines

Auto-Protect with Spare Node activation

🎨 Industrial-Grade UI/UX

Dark Industrial theme

Animated machine visuals

LED-style status indicators

Smooth micro-interactions

Designed for control room displays

📈 Advanced Analytics

Historical sensor trends

Node comparison radar chart

Remaining Useful Life (RUL) estimation

Operator activity visibility

🛠️ Technology Stack
Frontend

React 18 + Vite

Vanilla CSS (Variables & Keyframes)

Recharts (data visualization)

Lucide React (icons)

State & Logic

Custom React Hook: useSimulation

LocalStorage persistence

Deterministic physics-based modeling

Backend

Node.js

Express.js

Nodemailer (SMTP email alerts)

📦 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/yourusername/assetsense.git
cd assetsense

2️⃣ Install Dependencies
npm install

3️⃣ Run the Frontend
npm run dev

4️⃣ Run the Backend (Email Alerts)
cd server
node index.js

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

🔮 Future Enhancements

Real ESP32 sensor integration (hardware-in-loop)

MQTT / OPC-UA industrial protocol support

Edge gateway deployment (Raspberry Pi / IPC)

Digital Twin visualization (3D models)

Federated learning across multiple plants

👨‍🎓 Who This Project Is For

IoT & Embedded Systems students

Industry 4.0 learners

Predictive maintenance demonstrations
Academic projects & capstones

Interview & portfolio showcase

📄 License

MIT License
Free for educational and personal use.

