
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/db';
import { Task, TaskStatus, UserProfile } from '../types';
import { where } from 'firebase/firestore';
import { Plus, ChevronLeft, Calendar, User, MoreVertical, Clock, X } from 'lucide-react';

interface TasksProps {
  projectId: string;
  onBack: () => void;
}

const Tasks: React.FC<TasksProps> = ({ projectId, onBack }) => {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', priority: 'medium' as any, dueDate: '' });

  useEffect(() => {
    if (!profile?.companyId) return;
    const unsubT = dbService.subscribeTasks(profile.companyId, [where('projectId', '==', projectId)], setTasks);
    const unsubM = dbService.subscribeMembers(profile.companyId, setMembers);
    return () => { unsubT(); unsubM(); };
  }, [profile?.companyId, projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await dbService.createTask({
      ...newTask,
      projectId,
      companyId: profile.companyId,
      status: 'todo'
    });
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
  };

  const updateStatus = (id: string, s: TaskStatus) => dbService.updateTaskStatus(id, s);

  const cols: { id: TaskStatus; label: string; bg: string }[] = [
    { id: 'todo', label: 'Backlog', bg: 'bg-slate-50' },
    { id: 'inprogress', label: 'Active', bg: 'bg-indigo-50/30' },
    { id: 'done', label: 'Released', bg: 'bg-emerald-50/30' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"><ChevronLeft size={20} /></button>
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Mission Control</h2>
            <p className="text-slate-500 font-medium tracking-tight">Managing execution flow for this initiative.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black italic uppercase tracking-[0.15em] text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/20">
          <Plus size={18} /> New Objective
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cols.map(col => (
          <div key={col.id} className={`${col.bg} p-4 rounded-[40px] flex flex-col min-h-[600px] border border-slate-200/50`}>
            <div className="flex items-center justify-between px-4 py-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase tracking-[0.2em] italic text-slate-400">{col.label}</span>
                <span className="bg-white border border-slate-200 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
              <MoreVertical size={16} className="text-slate-400" />
            </div>

            <div className="flex-1 space-y-4">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 group hover:border-indigo-600 hover:shadow-xl transition-all relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      task.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {task.priority}
                    </div>
                    <div className="text-slate-300 group-hover:text-indigo-600 transition-colors"><Clock size={14} /></div>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{task.dueDate || 'No Due Date'}</span>
                    </div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black uppercase text-slate-500 overflow-hidden">
                      {members.find(m => m.uid === task.assignedTo)?.photoURL ? (
                        <img src={members.find(m => m.uid === task.assignedTo)?.photoURL} className="w-full h-full object-cover" />
                      ) : <User size={14} />}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {col.id !== 'todo' && (
                      <button onClick={() => updateStatus(task.id, col.id === 'done' ? 'inprogress' : 'todo')} className="text-[9px] font-black tracking-widest uppercase py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">Prev</button>
                    )}
                    {col.id !== 'done' && (
                      <button onClick={() => updateStatus(task.id, col.id === 'todo' ? 'inprogress' : 'done')} className="text-[9px] font-black tracking-widest uppercase py-2 bg-indigo-600 text-white rounded-xl hover:scale-105 transition-all col-start-2">Next</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300 relative">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
             <div className="p-12 space-y-8">
                <header className="space-y-1">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Establish Objective</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Define the next target for the mission.</p>
                </header>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Objective Title</label>
                      <input required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-bold" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Assign To</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-bold" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                        <option value="">Unassigned</option>
                        {members.map(m => <option key={m.uid} value={m.uid}>{m.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Criticality</label>
                      <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-bold" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as any})}>
                        <option value="low">Standard</option>
                        <option value="medium">Important</option>
                        <option value="high">Mission Critical</option>
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Execution Details</label>
                      <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 font-medium h-32" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                    </div>
                  </div>
                  <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black italic uppercase tracking-widest shadow-xl shadow-indigo-600/30">Activate Objective</button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
