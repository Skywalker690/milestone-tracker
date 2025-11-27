import React, { useMemo, useState, useEffect } from 'react';
import { Milestone } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle2, Circle, Clock, Target, TrendingUp } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  milestones: Milestone[];
}

const COLORS = ['#6366f1', '#e2e8f0']; // Indigo-500, Slate-200
const BAR_COLOR = '#6366f1';

const Dashboard: React.FC<DashboardProps> = ({ milestones }) => {
  const [motivation, setMotivation] = useState<string>('');

  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate upcoming (pending milestones with dates in next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const upcoming = milestones.filter(m => {
      if (m.completed || !m.achieveDate) return false;
      const date = new Date(m.achieveDate);
      return date >= now && date <= nextWeek;
    }).length;

    return { total, completed, pending, rate, upcoming };
  }, [milestones]);

  useEffect(() => {
    if (stats.completed > 0) {
      geminiService.generateMotivation(stats.completed).then(setMotivation);
    }
  }, [stats.completed]);

  const chartData = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">Your progress overview & insights</p>
        </div>
        {motivation && (
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-2xl text-sm font-medium shadow-lg shadow-indigo-500/20 animate-slide-up flex items-center gap-2 max-w-lg">
            <div className="bg-white/20 p-1 rounded-full"><TrendingUp className="w-3 h-3" /></div>
            "{motivation}"
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Goals" 
          value={stats.total} 
          icon={<Target className="w-6 h-6 text-indigo-600" />} 
          bg="bg-indigo-50"
          trend="All Time"
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} 
          bg="bg-emerald-50"
          trend="Achieved"
        />
        <StatCard 
          title="In Progress" 
          value={stats.pending} 
          icon={<Circle className="w-6 h-6 text-amber-600" />} 
          bg="bg-amber-50"
          trend="Remaining"
        />
        <StatCard 
          title="Upcoming (7d)" 
          value={stats.upcoming} 
          icon={<Clock className="w-6 h-6 text-rose-600" />} 
          bg="bg-rose-50"
          trend="Due Soon"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Rate Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Completion Rate</h3>
            <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Real-time</span>
          </div>
          <div className="h-72 flex items-center justify-center relative">
            {stats.total === 0 ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PieChart className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">No data available yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={105}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={stats.completed === 0 || stats.pending === 0 ? 0 : 5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-slate-800" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                    {stats.rate}%
                  </text>
                  <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-slate-400 uppercase tracking-wide">
                    Done
                  </text>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Milestone Velocity Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Milestone Distribution</h3>
            <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Status</span>
          </div>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={60}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                   />
                   <YAxis 
                    tick={{fontSize: 12, fill: '#64748b'}} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false} 
                   />
                   <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                   />
                   <Bar dataKey="value" fill={BAR_COLOR} radius={[8, 8, 8, 8]} animationDuration={1000} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, trend }: { title: string, value: number, icon: React.ReactNode, bg: string, trend: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider">{trend}</span>
    </div>
    <div>
      <h3 className="text-4xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
    </div>
  </div>
);

export default Dashboard;