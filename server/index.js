import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load from root .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Email Transporter Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify Transporter
transporter.verify((error, success) => {
    if (error) {
        console.error('Server: SMTP Connection Error:', error);
    } else {
        console.log('Server: SMTP Server is ready to take our messages');
    }
});

app.post('/api/send-alert', async (req, res) => {
    const { nodeName, health, temp, vib, current, fault, rul, timestamp, action } = req.body;

    console.log(`Server: Received alert for ${nodeName}`);

    const mailOptions = {
        from: `"AssetSense Alert System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Sending to self/admin for now
        subject: `🚨 CRITICAL ALERT: ${nodeName} FAILURE DETECTED`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">CRITICAL ASSET FAILURE</h1>
                    <p style="margin: 5px 0 0;">Immediate Action Required</p>
                </div>
                
                <div style="padding: 20px;">
                    <p><strong>Node:</strong> ${nodeName}</p>
                    <p><strong>Timestamp:</strong> ${timestamp}</p>
                    <p><strong>Fault Detected:</strong> <span style="color: #ef4444; font-weight: bold;">${fault}</span></p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background-color: #f3f4f6;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Health Score</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: #ef4444; font-weight: bold;">${health.toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Temperature</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${temp.toFixed(1)}°C</td>
                        </tr>
                        <tr style="background-color: #f3f4f6;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Vibration</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${vib.toFixed(2)} mm/s</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Current Load</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${current.toFixed(1)} A</td>
                        </tr>
                         <tr style="background-color: #f3f4f6;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Est. RUL</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${rul.toFixed(0)} Hours</td>
                        </tr>
                    </table>

                    <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin-top: 20px;">
                        <strong style="color: #c2410c;">Recommended Action:</strong>
                        <p style="margin: 5px 0 0; color: #9a3412;">${action}</p>
                    </div>
                </div>

                <div style="background-color: #f9fafb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e0e0e0;">
                    AssetSense Industrial Monitoring System • Automated Alert
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Server: Email sent successfully for ${nodeName}`);
        res.status(200).json({ success: true, message: 'Email alert sent' });
    } catch (error) {
        console.error('Server: Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`AssetSense Backend running on http://localhost:${PORT}`);
});
