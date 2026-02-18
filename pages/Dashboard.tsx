
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/db';
import { Project, Task } from '../types';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.companyId) return;
    const unsubP = dbService.subscribeProjects(profile.companyId, setProjects);
    const unsubT = dbService.subscribeTasks(profile.companyId, [], (ts) => {
      setTasks(ts);
      setLoading(false);
    });
    return () => { unsubP(); unsubT(); };
  }, [profile?.companyId]);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-12 w-64 bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl" />)}
      </div>
      <div className="h-96 bg-slate-200 rounded-3xl" />
    </div>
  );

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Tasks Pending', value: tasks.filter(t => t.status !== 'done').length, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Productivity', value: '94%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full w-fit">
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Real-time status</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Welcome, <span className="italic text-indigo-600">{profile?.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">Everything looks great today. You have {tasks.filter(t => t.assignedTo === profile?.uid && t.status !== 'done').length} tasks assigned to you.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Calendar size={18} className="text-slate-400" />
            <span className="font-bold text-sm text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Priority Queue</h3>
            <button className="text-sm font-bold text-indigo-600 hover:translate-x-1 transition-transform flex items-center gap-1">
              All Tasks <ChevronRight size={16} />
            </button>
          </div>
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {tasks.filter(t => t.assignedTo === profile?.uid).slice(0, 5).map(task => (
                <div key={task.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-indigo-400'}`} />
                    <div>
                      <p className="font-bold text-slate-900 text-lg leading-tight mb-1">{task.title}</p>
                      <p className="text-xs font-medium text-slate-500">Due {task.dueDate || 'ASAP'}</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {task.status}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.assignedTo === profile?.uid).length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <Trophy size={48} className="mx-auto text-slate-200" />
                  <p className="text-slate-400 font-bold italic uppercase tracking-widest">Inbox Zero. You're clear!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Global Activity</h3>
          <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-6">Company Momentum</p>
              <div className="space-y-6">
                {[
                  { label: 'Weekly Velocity', value: '+12%' },
                  { label: 'Team Engagement', value: 'High' },
                  { label: 'Cloud Sync', value: 'Active' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm font-bold text-indigo-100">{item.label}</span>
                    <span className="font-black italic">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
