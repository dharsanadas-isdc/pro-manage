
import React from 'react';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background blobs for aesthetic depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-md w-full text-center space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand Identity */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-600/30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl text-white font-black italic">TF</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 italic">TENANTS FLOW</h1>
          <p className="text-xl text-slate-500 font-medium">Scale your company with perfect multi-tenant project management.</p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Rocket, label: 'Fast', color: 'text-blue-600' },
            { icon: ShieldCheck, label: 'Secure', color: 'text-emerald-600' },
            { icon: Zap, label: 'Modern', color: 'text-amber-500' }
          ].map(f => (
            <div key={f.label} className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <f.icon className={`mx-auto mb-2 ${f.color}`} size={24} />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Action Area */}
        <div className="space-y-4">
          <button 
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 border-2 border-slate-200 py-4 px-8 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xl shadow-slate-200/50 active:scale-[0.98] group"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              className="w-6 h-6 group-hover:scale-110 transition-transform" 
              alt="Google" 
            />
            Continue with Google
          </button>
          
          {error && (
            <div className="animate-in shake duration-300">
              <p className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-100">
                {error}
              </p>
            </div>
          )}
          
          <p className="text-slate-400 text-sm">
            No credit card required. Invite your team in seconds.
          </p>
        </div>
        
        <div className="pt-8 text-slate-400 text-xs font-medium">
          <p>© 2025 TenantsFlow Inc. • <a href="#" className="hover:text-blue-600 underline underline-offset-4">Terms</a> • <a href="#" className="hover:text-blue-600 underline underline-offset-4">Privacy</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
