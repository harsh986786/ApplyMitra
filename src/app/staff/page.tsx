'use client';

import { useEffect, useState } from 'react';
import { Send, LogOut, Loader2, CheckCircle2, Clock, User, MapPin, Mail, Phone, FileText, IndianRupee, ClipboardList } from 'lucide-react';
import { api } from '@/lib/api';
import type { Application } from '@/types';
import { useToast, ToastProvider } from '@/lib/toast';
import { LogoLockup } from '@/components/Logo3D';

export default function StaffDashboardPage() {
  return (
    <ToastProvider>
      <StaffDashboard />
    </ToastProvider>
  );
}

function StaffDashboard() {
  const toast = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Application | null>(null);

  const load = async () => {
    try { setApps(await api.staffApplications()); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)applymitra_meta=([^;]+)/);
    if (!match) { window.location.href = '/login'; return; }
    try {
      const meta = JSON.parse(decodeURIComponent(match[1]));
      if (meta.role !== 'staff') { window.location.href = '/dashboard'; return; }
    } catch { window.location.href = '/login'; return; }
    load();
  }, []);

  const logout = async () => { try { await api.logout(); } catch {} window.location.href = '/login'; };

  const pending = apps.filter((a) => a.status !== 'completed').length;
  const completed = apps.filter((a) => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-white border-b border-ink-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/"><LogoLockup size={36} /></a>
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-accent-700 bg-accent-50 px-3 py-1 rounded-full">
              <ClipboardList size={14} /> Staff
            </span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-ink-600 hover:bg-ink-100 text-sm font-medium">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-ink-400"><Loader2 className="animate-spin mr-2" /> Loading your assignments...</div>
        ) : (
          <>
            <h1 className="font-extrabold text-2xl text-ink-900">My assigned applications</h1>
            <p className="text-ink-500 text-sm mt-1">Update the status of forms assigned to you</p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <StatCard label="Assigned to me" value={apps.length} icon={Send} color="from-brand-500 to-brand-700" />
              <StatCard label="In progress" value={pending} icon={Clock} color="from-accent-400 to-accent-600" />
              <StatCard label="Completed" value={completed} icon={CheckCircle2} color="from-success-500 to-success-600" />
            </div>

            <div className="mt-6 space-y-4">
              {apps.map((a) => (
                <div key={a._id} className="bg-white rounded-2xl p-5 border border-ink-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-ink-900">{a.serviceName}</h3>
                      <p className="text-xs text-ink-400">{a.serviceCategory} · {a.casteCategory}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                    <Info icon={User} label="Applicant" value={a.applicantName} />
                    <Info icon={Phone} label="Phone" value={a.phone} />
                    <Info icon={Mail} label="Email" value={a.email} />
                    <Info icon={IndianRupee} label="Total fee" value={`₹${a.totalFee}`} />
                  </div>
                  <Info icon={MapPin} label="Address" value={a.address} />
                  {a.statusNote && <div className="mt-3 text-xs bg-ink-50 rounded-lg p-3 text-ink-600"><b>Note:</b> {a.statusNote}</div>}
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setActive(a)} className="px-4 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold">Update status</button>
                  </div>
                </div>
              ))}
              {apps.length === 0 && (
                <div className="bg-white rounded-2xl p-12 border border-ink-200 text-center">
                  <Send className="mx-auto text-ink-300 mb-3" size={40} />
                  <p className="text-ink-500">No applications assigned to you yet. The admin will assign forms here.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {active && <StatusModal app={active} onClose={() => setActive(null)} onUpdated={load} />}
    </div>
  );
}

function StatusModal({ app, onClose, onUpdated }: { app: Application; onClose: () => void; onUpdated: () => void }) {
  const toast = useToast();
  const [status, setStatus] = useState(app.status);
  const [note, setNote] = useState(app.statusNote || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.updateAppStatus(app._id, status, note);
      toast({ type: 'success', message: 'Status updated' });
      onClose(); onUpdated();
    } catch (err: any) { toast({ type: 'error', message: err.message }); }
    finally { setSaving(false); }
  };

  const options = [
    { value: 'assigned', label: 'Assigned — just received' },
    { value: 'in_progress', label: 'In progress — collecting documents' },
    { value: 'completed', label: 'Completed — form submitted' },
    { value: 'rejected', label: 'Rejected — could not process' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-ink-900">Update application status</h3>
        <p className="text-xs text-ink-400 mt-1">{app.serviceName} — {app.applicantName}</p>
        <div className="mt-4 space-y-2">
          {options.map((o) => (
            <label key={o.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${status === o.value ? 'border-brand-500 bg-brand-50' : 'border-ink-200 hover:bg-ink-50'}`}>
              <input type="radio" checked={status === o.value} onChange={() => setStatus(o.value)} className="accent-brand-600" />
              <span className="text-sm text-ink-800">{o.label}</span>
            </label>
          ))}
        </div>
        <label className="block mt-4">
          <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Note (optional)</span>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="form-input-light resize-none mt-1.5" placeholder="Add a note about this status" />
        </label>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-ink-300 text-ink-600 font-medium">Cancel</button>
          <button disabled={saving} onClick={save} className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />} Save status
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-ink-200">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="text-white" size={20} />
      </div>
      <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}
function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="text-ink-400 shrink-0 mt-0.5" size={15} />
      <div><span className="text-xs text-ink-400">{label}</span><p className="text-ink-800 text-sm">{value}</p></div>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-warning-100 text-warning-600',
    assigned: 'bg-brand-100 text-brand-700',
    in_progress: 'bg-brand-100 text-brand-700',
    payment_verified: 'bg-success-100 text-success-600',
    completed: 'bg-success-100 text-success-600',
    rejected: 'bg-danger-100 text-danger-600',
  };
  return <span className={`pill ${map[status] || 'bg-ink-100 text-ink-600'}`}>{status.replace('_', ' ')}</span>;
}
