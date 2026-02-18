
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { profile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', name: 'Projects', icon: Briefcase },
    { id: 'members', name: 'Team', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-inter">
      {/* Mobile Sidebar Overlay */}
      {isOpen && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-600/30">TF</div>
            <span className="text-xl font-black tracking-tight italic text-slate-900">TENANTSFLOW</span>
          </div>

          <nav className="flex-1 px-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                  ${activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
                `}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
              <img src={profile?.photoURL} className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" alt="" />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate text-slate-900">{profile?.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{profile?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden p-2 -ml-2 text-slate-500" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
            <Search size={18} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Quick search tasks..." className="bg-transparent outline-none text-sm w-full" />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Workspace</p>
              <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">Team Delta</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
