import React, { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import { BarChart2, Activity, AlertTriangle, ArrowRight } from 'lucide-react';

const Analytics = ({ nodes }) => {
    const [timeRange, setTimeRange] = useState('daily');

    // Mock Trend Data generated based on time range
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
        subject: node.name.split(' ')[0],
        Health: node.health,
        Efficiency: 100 - (node.temp - 40),
        Stability: 100 - (node.vib * 10),
        fullMark: 100,
    }));

    return (
        <div className="container mx-auto px-6 py-8 max-w-[1600px] space-y-12 animate-in fade-in duration-700">
            {/* Header Section - Clean & Centered vertically */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-8">
                <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <BarChart2 className="text-blue-500" size={28} />
                        Analytics Overview
                    </h2>
                    <p className="text-gray-400 mt-2 text-base leading-relaxed">
                        Comprehensive system performance metrics, identifying long-term trends and anomalies to optimize maintenance.
                    </p>
                </div>

                <div className="flex items-center p-1.5 bg-[#181b21] border border-gray-800 rounded-lg">
                    {['Daily', 'Weekly', 'Monthly'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range.toLowerCase())}
                            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${timeRange === range.toLowerCase()
                                    ? 'bg-gray-800 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Grid Layout - 2 Columns for Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* System Health Trend */}
                <div className="bg-[#0f1115] border border-gray-800 rounded-xl p-8 shadow-lg shadow-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                                <Activity size={20} className="text-blue-500" />
                                System Health Trend
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Health score vs. Temperature over time</p>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                Health
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                                Temp
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#475569"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f1115',
                                        borderColor: '#334155',
                                        borderRadius: '8px',
                                        color: '#f8fafc',
                                        padding: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#94a3b8', fontSize: '13px', paddingBottom: '4px' }}
                                    cursor={{ stroke: '#334155', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="health"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    fill="url(#colorHealth)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temp"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={false}
                                    strokeDasharray="4 4"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Dimensions */}
                <div className="bg-[#0f1115] border border-gray-800 rounded-xl p-8 shadow-lg shadow-black/20">
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-200">Performance Dimensions</h3>
                        <p className="text-sm text-gray-500 mt-1">Multi-axis comparative analysis across nodes</p>
                    </div>
                    <div className="h-[400px] w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#1e293b" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13, dy: 4 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Metrics"
                                    dataKey="Health"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    fill="#3b82f6"
                                    fillOpacity={0.25}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: '13px', marginTop: '20px' }}
                                    formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Maintenance Forecast */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white">Maintenance Forecast</h3>
                        <p className="text-sm text-gray-500 mt-1">Predicted Remaining Useful Life (RUL)</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors group">
                        Export Report <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nodes.map(node => {
                        const rulPercentage = Math.min(100, (node.rul / 2000) * 100);
                        const isCritical = node.rul < 200;

                        return (
                            <div key={node.id} className="group bg-[#0f1115] border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-black/40 flex flex-col justify-between h-[180px]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-200 text-lg group-hover:text-white transition-colors">{node.name}</p>
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mt-1">{node.type}</p>
                                    </div>
                                    {isCritical && (
                                        <div className="bg-red-500/10 p-2 rounded-lg animate-pulse">
                                            <AlertTriangle size={18} className="text-red-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className={`text-4xl font-bold tracking-tight ${isCritical ? 'text-red-500' : 'text-white'}`}>
                                            {Math.round(node.rul)}
                                        </span>
                                        <span className="text-sm text-gray-500 font-medium">hrs</span>
                                    </div>

                                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${isCritical ? 'bg-red-500' :
                                                    rulPercentage < 50 ? 'bg-amber-500' : 'bg-blue-500'
                                                }`}
                                            style={{ width: `${rulPercentage}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs font-medium uppercase tracking-wide">
                                        <span className="text-gray-600">Status</span>
                                        <span className={isCritical ? 'text-red-400' : 'text-green-400'}>
                                            {isCritical ? 'CRITICAL ACTION' : 'OPTIMAL'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
