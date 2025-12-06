import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { BarChart2, Calendar, Activity } from 'lucide-react';

const Analytics = ({ nodes }) => {
    // Mock Data for Trends
    const trendData = [
        { time: '00:00', temp: 55, vib: 0.5, health: 98 },
        { time: '04:00', temp: 58, vib: 0.6, health: 97 },
        { time: '08:00', temp: 62, vib: 0.8, health: 95 },
        { time: '12:00', temp: 65, vib: 1.2, health: 92 },
        { time: '16:00', temp: 60, vib: 0.9, health: 94 },
        { time: '20:00', temp: 57, vib: 0.6, health: 96 },
        { time: '24:00', temp: 56, vib: 0.5, health: 97 },
    ];

    const radarData = nodes.map(node => ({
        subject: node.name,
        A: node.health,
        B: 100 - node.temp, // Inverse temp for "goodness"
        fullMark: 100,
    }));

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart2 className="text-blue-500" /> Analytics Dashboard
                    </h2>
                    <p className="text-gray-400">Historical trends and system performance analysis</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-500/30">Daily</button>
                    <button className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg border border-gray-700 hover:bg-gray-700">Weekly</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Health Trend Chart */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-green-400" /> System Health Trend (24h)
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="health" stroke="#22c55e" strokeWidth={2} />
                                <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Node Comparison Radar */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-purple-400" /> Node Performance Comparison
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                                <Radar name="Health Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* RUL Timeline (Mock) */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-yellow-400" /> Maintenance Forecast
                </h3>
                <div className="space-y-4">
                    {nodes.map(node => (
                        <div key={node.id} className="flex items-center gap-4">
                            <div className="w-24 text-gray-400 text-sm">{node.name}</div>
                            <div className="flex-1 bg-gray-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${Math.min(100, (node.rul / 2000) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="w-24 text-right text-sm font-mono text-blue-300">{Math.round(node.rul)} hrs</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
