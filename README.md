# AssetSense - Industrial Predictive Maintenance Dashboard 🏭

AssetSense is a high-fidelity simulated industrial dashboard designed for monitoring the health and performance of critical machinery. It features real-time data visualization, fault injection capabilities, and a premium "Dark Industrial" aesthetic.

![AssetSense Dashboard](https://via.placeholder.com/800x450.png?text=AssetSense+Dashboard+Preview)

## 🚀 Features

### 📊 Real-Time Monitoring
- **Live Metrics**: Monitor Temperature, Vibration, and Current for 4 distinct nodes (Pump, Motor, Compressor, Spare).
- **Health Index**: ML-based health scoring algorithm that reacts to sensor drifts.
- **Visual Feedback**: LED status indicators, animated gauges, and dynamic trend charts.

### ⚠️ Fault Simulation Engine
- **Interactive Console**: Inject specific faults like **Overheating**, **Bearing Wear**, **Misalignment**, and **Overload**.
- **Realistic Physics**: Sensor values drift realistically based on the injected fault type.
- **Maintenance Workflow**: Repair nodes to reset their health and restore normal operation.
- **Auto-Protect**: System automatically fails over to a Spare Node when a critical fault is detected.

### 🎨 Premium UI/UX
- **Industrial Design**: Custom "Dark Industrial" theme with neon accents and glassmorphism effects.
- **Machine Animations**: Detailed CSS/SVG animations for different machine types (rotating impellers, pistons, rotors).
- **Micro-Interactions**: Hover effects, pulse animations, and smooth transitions.

### 📈 Advanced Views
- **Analytics**: Historical trends, Node Comparison Radar Chart, and RUL (Remaining Useful Life) forecast.
- **Team Management**: Manage operator access and view activity logs.
- **Settings**: Configure system units, theme intensity, and data retention.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Variables & Keyframes) - *No Tailwind*
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks (`useSimulation`) + LocalStorage Persistence

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/assetsense.git
   cd assetsense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 How to Use

1. **Dashboard**: Observe the 4 main nodes. Green = Healthy, Yellow = Warning, Red = Critical.
2. **Inject a Fault**:
   - Scroll down to the **Fault Injection Console**.
   - Select a Target Machine (e.g., "Pump 01").
   - Select a Fault Type (e.g., "Overheating").
   - Click **INJECT FAULT**.
   - Watch the sensor values rise and the node card react!
3. **Repair**:
   - Click **Repair & Reset** in the console to fix the node.
4. **Analyze**: Navigate to the **Analytics** page to see the impact of your faults on the system's history.

## 📄 License

MIT License - Free for educational and personal use.
