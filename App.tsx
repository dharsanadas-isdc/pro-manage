
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Members from './pages/Members';
import Login from './components/Login';

const AppContent: React.FC = () => {
  const { user, loading, login, error } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-2xl" />
          <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-2xl animate-spin" />
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 animate-pulse">Initializing Flow...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} error={error} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'projects': 
        return selectedProjectId 
          ? <Tasks projectId={selectedProjectId} onBack={() => setSelectedProjectId(null)} />
          : <Projects onProjectClick={setSelectedProjectId} />;
      case 'members': return <Members />;
      case 'settings': return (
        <div className="py-20 text-center bg-white rounded-[48px] border border-slate-200">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Workspace Ops</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Administrative overrides coming soon.</p>
        </div>
      );
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
