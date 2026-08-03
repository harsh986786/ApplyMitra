'use client';

import { useState } from 'react';
import { ShieldCheck, UserCog, Loader2, LogIn, Lock, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { ToastProvider } from '@/lib/toast';
import { LogoLockup } from '@/components/Logo3D';

function LoginPageInner() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email, password);
      toast({ type: 'success', message: `Welcome ${res.name}!` });
      window.location.href = res.role === 'admin' ? '/dashboard' : '/staff';
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <a href="/" className="flex justify-center mb-6"><LogoLockup size={48} /></a>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg mb-3">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="font-extrabold text-2xl text-white">Admin / Staff Login</h1>
            <p className="text-sm text-ink-300 mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">Email</span>
              <div className="mt-1.5 relative">
                <UserCog className="absolute left-3 top-3.5 text-ink-400" size={16} />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input !pl-9" placeholder="you@email.com" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink-300 uppercase tracking-wider">Password</span>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3 top-3.5 text-ink-400" size={16} />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input !pl-9" placeholder="••••••••" />
              </div>
            </label>
            <button disabled={loading} type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogIn size={18} /> Sign in</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-ink-400 hover:text-white inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to home
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-ink-400 mt-4">Protected area — authorized personnel only</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginPageInner />
    </ToastProvider>
  );
}
