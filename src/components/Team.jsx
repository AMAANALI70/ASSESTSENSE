import React from 'react';
import { Users, UserPlus, Clock, Shield } from 'lucide-react';

const Team = () => {
    const teamMembers = [
        { id: 1, name: 'Alex Chen', role: 'Lead Engineer', status: 'Active', shift: 'Morning', avatar: 'AC' },
        { id: 2, name: 'Sarah Miller', role: 'Maintenance Tech', status: 'On Shift', shift: 'Morning', avatar: 'SM' },
        { id: 3, name: 'Mike Ross', role: 'Operator', status: 'Offline', shift: 'Night', avatar: 'MR' },
    ];

    const activityLog = [
        { id: 1, user: 'Alex Chen', action: 'Injected Fault: Overheating on Pump 01', time: '10:45 AM' },
        { id: 2, user: 'System', action: 'Auto-Protect Triggered: Pump 01 -> Spare', time: '10:48 AM' },
        { id: 3, user: 'Sarah Miller', action: 'Repaired Pump 01', time: '11:15 AM' },
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-blue-500" /> Team Management
                    </h2>
                    <p className="text-gray-400">Manage access and view operator activity</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <UserPlus size={18} /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Team List */}
                <div className="lg:col-span-2 space-y-4">
                    {teamMembers.map(member => (
                        <div key={member.id} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {member.avatar}
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{member.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Shield size={14} /> {member.role} • {member.shift}
                                    </div>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${member.status === 'Active' || member.status === 'On Shift'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-700 text-gray-400'
                                }`}>
                                {member.status}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity Log */}
                <div className="glass-panel p-6 rounded-xl h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" /> Recent Activity
                    </h3>
                    <div className="space-y-4 relative">
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-800"></div>
                        {activityLog.map(log => (
                            <div key={log.id} className="relative pl-6">
                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gray-900 border-2 border-blue-500"></div>
                                <p className="text-sm text-gray-300">{log.action}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span className="text-blue-400 font-medium">{log.user}</span> • {log.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
