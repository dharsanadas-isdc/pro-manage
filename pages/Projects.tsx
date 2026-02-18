
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/db';
import { Project } from '../types';
import { Plus, Search, Trash2, Folder, ArrowUpRight, X } from 'lucide-react';

interface ProjectsProps {
  onProjectClick: (id: string) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onProjectClick }) => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!profile?.companyId) return;
    const unsub = dbService.subscribeProjects(profile.companyId, setProjects);
    return () => unsub();
  }, [profile?.companyId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !profile) return;
    await dbService.createProject(newProject.name, newProject.description, profile.companyId, profile.uid);
    setIsModalOpen(false);
    setNewProject({ name: '', description: '' });
  };

  const filtered = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Project Hub</h2>
          <p className="text-slate-500 font-medium tracking-tight">Manage your team's mission-critical initiatives.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Filter initiatives..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 w-full md:w-72 transition-all font-medium text-sm shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {(profile?.role === 'Owner' || profile?.role === 'Admin') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black italic uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Plus size={18} /> New Initiative
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p) => (
          <div 
            key={p.id}
            onClick={() => onProjectClick(p.id)}
            className="group bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300">
              <Folder size={28} />
            </div>

            <h3 className="text-2xl font-black italic text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
            <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-8 min-h-[40px]">{p.description || 'Seamless project execution and real-time collaboration metrics.'}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />)}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Phase 01</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
            <Folder size={64} className="mx-auto text-slate-300 mb-6" />
            <h4 className="text-2xl font-black italic text-slate-400 uppercase tracking-tighter">No Initiatives Found</h4>
            <p className="text-slate-400 font-bold max-w-sm mx-auto mt-2 uppercase tracking-widest text-[10px]">Create a new project to start tracking your team progress.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            <div className="p-12 space-y-8">
              <header className="space-y-2">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Folder size={24} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">New Initiative</h3>
              </header>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block">Initiative Name</label>
                  <input 
                    autoFocus required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 font-bold text-lg"
                    placeholder="e.g. Apollo Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block">Mission Brief</label>
                  <textarea 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 font-medium h-32 resize-none"
                    placeholder="Short description of the goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black italic uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all">Launch Project</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
