import React, { useState } from 'react';
import { ClipboardList, Filter, Search, AlertTriangle, CheckCircle, Info, AlertOctagon } from 'lucide-react';

const EventLog = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Mock Event Data
    const events = [
        { id: 1, time: '10:45:23 AM', node: 'Pump 01', type: 'Fault', severity: 'critical', message: 'Overheating detected (92°C)' },
        { id: 2, time: '10:45:30 AM', node: 'System', type: 'Alert', severity: 'warning', message: 'Auto-Protect Sequence Initiated' },
        { id: 3, time: '10:45:35 AM', node: 'Spare Node', type: 'Info', severity: 'info', message: 'Boot sequence started' },
        { id: 4, time: '10:45:40 AM', node: 'Pump 01', type: 'Status', severity: 'critical', message: 'Node Offline (Safety Trip)' },
        { id: 5, time: '10:45:42 AM', node: 'Spare Node', type: 'Status', severity: 'success', message: 'Node Online & Active' },
        { id: 6, time: '11:15:00 AM', node: 'Pump 01', type: 'Maintenance', severity: 'success', message: 'Manual Repair Completed' },
        { id: 7, time: '11:15:05 AM', node: 'System', type: 'Info', severity: 'info', message: 'System Reset - Normal Operation' },
    ];

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical': return <AlertOctagon size={16} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'success': return <CheckCircle size={16} className="text-green-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'success': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' || event.severity === filter;
        const matchesSearch = event.message.toLowerCase().includes(search.toLowerCase()) || event.node.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardList className="text-blue-500" /> System Event Log
                    </h2>
                    <p className="text-gray-400">Comprehensive audit trail of all system activities</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>All</button>
                        <button onClick={() => setFilter('critical')} className={`px-3 py-1.5 rounded text-sm ${filter === 'critical' ? 'bg-red-600/20 text-red-400' : 'text-gray-400 hover:text-white'}`}>Critical</button>
                        <button onClick={() => setFilter('warning')} className={`px-3 py-1.5 rounded text-sm ${filter === 'warning' ? 'bg-yellow-600/20 text-yellow-400' : 'text-gray-400 hover:text-white'}`}>Warnings</button>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase">
                            <th className="p-4 font-semibold">Time</th>
                            <th className="p-4 font-semibold">Severity</th>
                            <th className="p-4 font-semibold">Node</th>
                            <th className="p-4 font-semibold">Event Type</th>
                            <th className="p-4 font-semibold">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredEvents.map(event => (
                            <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-gray-400 font-mono text-sm">{event.time}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityClass(event.severity)}`}>
                                        {getSeverityIcon(event.severity)}
                                        {event.severity.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-white font-medium">{event.node}</td>
                                <td className="p-4 text-gray-300">{event.type}</td>
                                <td className="p-4 text-gray-300 group-hover:text-white transition-colors">{event.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No events found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventLog;
