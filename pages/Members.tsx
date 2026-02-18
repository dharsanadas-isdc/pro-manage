
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/db';
import { UserProfile, Role } from '../types';
import { UserPlus, Shield, Mail, MoreHorizontal, User, Sparkles } from 'lucide-react';

const Members: React.FC = () => {
  const { profile } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invite, setInvite] = useState({ email: '', role: 'Member' as Role });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!profile?.companyId) return;
    const unsub = dbService.subscribeMembers(profile.companyId, setMembers);
    return () => unsub();
  }, [profile?.companyId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !invite.email) return;
    setSending(true);
    try {
      await dbService.sendInvite(invite.email, profile.companyId, invite.role, profile.uid);
      setIsModalOpen(false);
      setInvite({ email: '', role: 'Member' });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full w-fit">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Workspace</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">The Fleet</h2>
          <p className="text-slate-500 font-medium tracking-tight">Managing access and operative roles for the team.</p>
        </div>
        {(profile?.role === 'Owner' || profile?.role === 'Admin') && (
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-[24px] font-black italic uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/30">
            <UserPlus size={18} /> Mobilize operative
          </button>
        )}
      </header>

      <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Operative</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Clearance</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-10 py-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.uid} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                        {m.photoURL ? <img src={m.photoURL} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-300" />}
                      </div>
                      <div>
                        <p className="font-black italic text-slate-900">{m.name}</p>
                        <p className="text-xs font-medium text-slate-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      m.role === 'Owner' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      <Shield size={10} /> {m.role}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Online</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-12 space-y-8 text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center mx-auto">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Mobilize Operative</h3>
                <p className="text-slate-500 font-medium">Add a new teammate to the workspace missions.</p>
              </div>
              <form onSubmit={handleInvite} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Email Address</label>
                  <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" placeholder="operatve@company.com" value={invite.email} onChange={e => setInvite({...invite, email: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Operational Role</label>
                  <div className="grid grid-cols-2 gap-4">
                    {(['Member', 'Admin'] as Role[]).map(r => (
                      <button key={r} type="button" onClick={() => setInvite({...invite, role: r})} className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${invite.role === r ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white border-slate-200 text-slate-400'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Abort</button>
                  <button disabled={sending} type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/30">Dispatch Invite</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
