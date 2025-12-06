import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Bell, Monitor, Save } from 'lucide-react';

const Settings = () => {
    const [units, setUnits] = useState('metric');
    const [theme, setTheme] = useState('dark');
    const [retention, setRetention] = useState('7');

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <SettingsIcon className="text-blue-500" /> System Configuration
                    </h2>
                    <p className="text-gray-400">Customize dashboard behavior and preferences</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="glass-panel p-6 rounded-xl space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">General Preferences</h3>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Monitor className="text-gray-400" />
                            <div>
                                <p className="text-white font-medium">Measurement Units</p>
                                <p className="text-xs text-gray-500">Select display units for sensors</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setUnits('metric')}
                                className={`px-3 py-1 rounded text-sm ${units === 'metric' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                            >Metric</button>
                            <button
                                onClick={() => setUnits('imperial')}
                                className={`px-3 py-1 rounded text-sm ${units === 'imperial' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                            >Imperial</button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Database className="text-gray-400" />
                            <div>
                                <p className="text-white font-medium">Data Retention</p>
                                <p className="text-xs text-gray-500">How long to keep historical data</p>
                            </div>
                        </div>
                        <select
                            value={retention}
                            onChange={(e) => setRetention(e.target.value)}
                            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1"
                        >
                            <option value="1">24 Hours</option>
                            <option value="7">7 Days</option>
                            <option value="30">30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Alert Settings */}
                <div className="glass-panel p-6 rounded-xl space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Alert Thresholds</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">Temperature Critical Limit</span>
                                <span className="text-red-400 font-mono">90°C</span>
                            </div>
                            <input type="range" className="w-full accent-red-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">Vibration Warning Limit</span>
                                <span className="text-yellow-400 font-mono">2.5g</span>
                            </div>
                            <input type="range" className="w-full accent-yellow-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
