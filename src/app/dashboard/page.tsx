'use client';

import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FileText, Users2, UserCog, IndianRupee, TrendingUp, Plus, Trash2,
  CheckCircle2, Loader2, LogOut, ShieldCheck, Send, X, Tag, BadgeIndianRupee, UserCheck, Clock,
} from 'lucide-react';
import { api } from '@/lib/api';
import type { Stats, Service, Application, TeamApplication, Staff, CategoryFee } from '@/types';
import { CASTE_CATEGORIES } from '@/types';
import { useToast, ToastProvider } from '@/lib/toast';
import { LogoLockup } from '@/components/Logo3D';

type Tab = 'overview' | 'services' | 'applications' | 'team' | 'staff';

export default function AdminDashboardPage() {
  return (
    <ToastProvider>
      <AdminDashboard />
    </ToastProvider>
  );
}

function AdminDashboard() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [team, setTeam] = useState<TeamApplication[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [s, sv, a, t, st] = await Promise.all([
        api.adminStats(), api.getServices(), api.adminApplications(), api.adminTeam(), api.adminStaff(),
      ]);
      setStats(s); setServices(sv); setApplications(a); setTeam(t); setStaff(st);
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Guard: confirm an auth session exists (meta cookie), else bounce to login.
    const match = document.cookie.match(/(?:^|;\s*)applymitra_meta=([^;]+)/);
    if (!match) { window.location.href = '/login'; return; }
    try {
      const meta = JSON.parse(decodeURIComponent(match[1]));
      if (meta.role !== 'admin') { window.location.href = '/staff'; return; }
    } catch {
      window.location.href = '/login';
      return;
    }
    loadAll();
  }, []);

  const logout = async () => { try { await api.logout(); } catch {} window.location.href = '/login'; };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'applications', label: 'Applications', icon: Send },
    { id: 'team', label: 'Join Team', icon: Users2 },
    { id: 'staff', label: 'Staff', icon: UserCog },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="bg-white border-b border-ink-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/"><LogoLockup size={36} /></a>
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
              <ShieldCheck size={14} /> Admin
            </span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-ink-600 hover:bg-ink-100 text-sm font-medium">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:flex flex-col w-56 border-r border-ink-200 bg-white min-h-[calc(100vh-4rem)] py-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition ${
                tab === t.id ? 'text-brand-700 bg-brand-50 border-r-2 border-brand-600' : 'text-ink-600 hover:bg-ink-50'
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </aside>

        <div className="md:hidden flex overflow-x-auto bg-white border-b border-ink-200 w-full">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap ${tab === t.id ? 'text-brand-700 border-b-2 border-brand-600' : 'text-ink-500'}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-ink-400"><Loader2 className="animate-spin mr-2" /> Loading dashboard...</div>
          ) : (
            <>
              {tab === 'overview' && stats && <Overview stats={stats} applications={applications} team={team} />}
              {tab === 'services' && <ServicesPanel services={services} onChange={loadAll} />}
              {tab === 'applications' && <ApplicationsPanel applications={applications} staff={staff} onChange={loadAll} />}
              {tab === 'team' && <TeamPanel team={team} onChange={loadAll} />}
              {tab === 'staff' && <StaffPanel staff={staff} onChange={loadAll} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function Overview({ stats, applications, team }: { stats: Stats; applications: Application[]; team: TeamApplication[] }) {
  const cards = [
    
    { label: 'Total revenue', value: stats.totalRevenue, icon: IndianRupee, color: 'from-brand-500 to-brand-700', sub: 'applications + team' },
    { label: 'Application revenue', value: stats.applicationRevenue, icon: TrendingUp, color: 'from-success-500 to-success-600', sub: 'verified payments' },
    { label: 'Team revenue', value: stats.teamRevenue, icon: BadgeIndianRupee, color: 'from-accent-400 to-accent-600', sub: 'join-team fees' },
    { label: 'Total applications', value: stats.totalApplications, icon: Send, color: 'from-brand-400 to-brand-600', sub: `${stats.pendingApplications} pending` },
    { label: 'Payment verified', value: stats.paymentVerifiedApps, icon: CheckCircle2, color: 'from-success-500 to-success-600', sub: 'applications' },
    { label: 'Team applications', value: stats.totalTeamApplications, icon: Users2, color: 'from-accent-500 to-accent-700', sub: `${stats.pendingTeamApplications} pending` },
  ];
   const RATE_PER_FORM = 25;

  // 2. Real Employee Performance with Team Apps Lookup
  const employeePerformanceMap = (applications || []).reduce((acc: any, app: any) => {
    const empId = app.assigned_employee_id || app.employee_id || app.employeeId;

    // Direct customer submission, skip
    if (!empId) return acc;

    // Team Apps se real employee name matching check karo
    const matchingTeamMember = (team || []).find(
      (t: any) => String(t._id) === String(empId) || String(t.user_id) === String(empId)
    );

    const empName =
      app.assigned_employee_name ||
      app.employeeName ||
      matchingTeamMember?.fullName ||
      `Employee (${String(empId).slice(-4)})`;

    const empEmail =
      app.assigned_employee_email ||
      app.employeeEmail ||
      matchingTeamMember?.email ||
      'N/A';

    if (!acc[empId]) {
      acc[empId] = {
        id: empId,
        name: empName,
        email: empEmail,
        formsCount: 0,
        payout: 0,
      };
    }

    if (app.current_status !== 'DELETED') {
      acc[empId].formsCount += 1;
      acc[empId].payout = acc[empId].formsCount * RATE_PER_FORM;
    }

    return acc;
  }, {});

  return (
    
    <div>
      <h1 className="font-extrabold text-2xl text-ink-900">Dashboard overview</h1>
      <p className="text-ink-500 text-sm mt-1">Revenue and activity across ApplyMitra</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-ink-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow`}>
                <c.icon className="text-white" size={22} />
              </div>
              <span className="text-xs text-ink-400">{c.sub}</span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink-900 flex items-center">
              {c.label.includes('revenue') ? <><IndianRupee size={22} />{c.value}</> : c.value}
            </p>
            <p className="text-sm text-ink-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <Panel title="Recent applications" icon={Send}>
          {applications.slice(0, 5).map((a) => (
            <RowItem key={a._id} title={a.applicantName} sub={`${a.serviceName} · ${a.casteCategory}`} right={<StatusPill status={a.status} />} />
          ))}
          {applications.length === 0 && <Empty text="No applications yet" />}
        </Panel>
        <Panel title="Recent team applications" icon={Users2}>
          {team.slice(0, 5).map((t) => (
            <RowItem key={t._id} title={t.fullName} sub={t.city} right={<StatusPill status={t.status} />} />
          ))}
          {team.length === 0 && <Empty text="No team applications yet" />}
        </Panel>
      </div>
    </div>
  );
}

function ServicesPanel({ services, onChange }: { services: Service[]; onChange: () => void }) {
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [fees, setFees] = useState<CategoryFee[]>(
    CASTE_CATEGORIES.map((c) => ({ category: c, governmentFee: 0, convenienceFee: 100 }))
  );
  const [form, setForm] = useState({ name: '', category: 'General', description: '', eligibility: '', documentsRequired: '' });
  const [saving, setSaving] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.addService({ ...form, fees });
      toast({ type: 'success', message: 'Service added' });
      setForm({ name: '', category: 'General', description: '', eligibility: '', documentsRequired: '' });
      setFees(CASTE_CATEGORIES.map((c) => ({ category: c, governmentFee: 0, convenienceFee: 100 })));
      setAdding(false);
      onChange();
    } catch (err: any) { toast({ type: 'error', message: err.message }); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try { await api.deleteService(id); toast({ type: 'success', message: 'Service deleted' }); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };

  const setFee = (cat: string, field: 'governmentFee' | 'convenienceFee', value: number) => {
    setFees((prev) => prev.map((f) => (f.category === cat ? { ...f, [field]: value } : f)));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-2xl text-ink-900">Services</h1>
          <p className="text-ink-500 text-sm mt-1">Add, edit or remove form services — with category-wise fees</p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
          <Plus size={18} /> {adding ? 'Cancel' : 'Add service'}
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="mt-5 bg-white rounded-2xl p-6 border border-ink-200 grid sm:grid-cols-2 gap-4">
          <LField label="Service name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input-light" placeholder="e.g. PAN Card Application" /></LField>
          <LField label="Category *">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input-light">
              {['General', 'Government Scheme', 'Exam', 'Job', 'Certificate', 'Pension', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </LField>
          <LField label="Description" full><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="form-input-light resize-none" /></LField>
          <LField label="Eligibility criteria"><input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} className="form-input-light" placeholder="Who can apply" /></LField>
          <LField label="Documents required"><input value={form.documentsRequired} onChange={(e) => setForm({ ...form, documentsRequired: e.target.value })} className="form-input-light" placeholder="e.g. Aadhaar, photo" /></LField>

          {/* caste-wise fees editor */}
          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Fees by category</span>
            <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fees.map((f) => (
                <div key={f.category} className="border border-ink-200 rounded-xl p-3">
                  <p className="font-semibold text-sm text-ink-800 mb-2 flex items-center gap-1.5"><Tag size={13} className="text-brand-600" /> {f.category}</p>
                  <label className="block text-xs text-ink-500">Govt fee (₹)
                    <input type="number" value={f.governmentFee} onChange={(e) => setFee(f.category, 'governmentFee', Number(e.target.value))} className="form-input-light mt-1" />
                  </label>
                  <label className="block text-xs text-ink-500 mt-2">Convenience (₹)
                    <input type="number" value={f.convenienceFee} onChange={(e) => setFee(f.category, 'convenienceFee', Number(e.target.value))} className="form-input-light mt-1" />
                  </label>
                  <p className="text-xs text-ink-400 mt-2">Total: <b className="text-ink-700">₹{f.governmentFee + f.convenienceFee}</b></p>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2.5 rounded-xl border border-ink-300 text-ink-600 font-medium">Cancel</button>
            <button disabled={saving} type="submit" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Save service
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s) => {
          const min = Math.min(...(s.fees?.map((f) => f.governmentFee + f.convenienceFee) || [0]));
          return (
            <div key={s._id} className="bg-white rounded-2xl p-5 border border-ink-200">
              <div className="flex items-start justify-between">
                <span className="pill bg-brand-50 text-brand-700 border border-brand-200"><Tag size={12} /> {s.category}</span>
                <button onClick={() => del(s._id)} className="text-ink-400 hover:text-danger-600 p-1"><Trash2 size={16} /></button>
              </div>
              <h3 className="mt-3 font-bold text-ink-900">{s.name}</h3>
              <p className="text-xs text-ink-500 mt-1 line-clamp-2">{s.description}</p>
              <div className="mt-3 space-y-1">
                {s.fees?.map((f) => (
                  <div key={f.category} className="flex justify-between text-xs">
                    <span className="text-ink-500">{f.category}</span>
                    <span className="font-semibold text-ink-800">₹{f.governmentFee + f.convenienceFee}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-ink-100 my-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600 font-medium">Starts from</span><span className="font-extrabold text-ink-900">₹{min}</span>
              </div>
            </div>
          );
        })}
        {services.length === 0 && <div className="sm:col-span-2 lg:col-span-3"><Empty text="No services yet. Add your first service." /></div>}
      </div>
    </div>
  );
}

function ApplicationsPanel({ applications, staff, onChange }: { applications: Application[]; staff: Staff[]; onChange: () => void }) {
  const toast = useToast();
  const [verifyFor, setVerifyFor] = useState<Application | null>(null);
  const [assignFor, setAssignFor] = useState<Application | null>(null);

  const verify = async (amt: number) => {
    if (!verifyFor) return;
    try { await api.verifyAppPayment(verifyFor._id, amt); toast({ type: 'success', message: 'Payment verified' }); setVerifyFor(null); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };
  const assign = async (sid: string) => {
    if (!assignFor) return;
    try { await api.assignApplication(assignFor._id, sid); toast({ type: 'success', message: 'Assigned to staff' }); setAssignFor(null); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };

  return (
    <div>
      <h1 className="font-extrabold text-2xl text-ink-900">Applications</h1>
      <p className="text-ink-500 text-sm mt-1">Verify payments and assign applications to staff</p>

      <div className="mt-5 bg-white rounded-2xl border border-ink-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-ink-500 text-xs uppercase">
              <tr>
                <Th>Applicant</Th><Th>Service</Th><Th>Category</Th><Th>Fee</Th><Th>Payment</Th><Th>Status</Th><Th>Assigned</Th><Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a._id} className="border-t border-ink-100 hover:bg-ink-50/50">
                  <Td>
                    <p className="font-semibold text-ink-900">{a.applicantName}</p>
                    <p className="text-xs text-ink-400">{a.phone} · {a.email}</p>
                  </Td>
                  <Td>{a.serviceName}<p className="text-xs text-ink-400">{a.serviceCategory}</p></Td>
                  <Td><span className="pill bg-brand-50 text-brand-700 text-[10px]">{a.casteCategory}</span></Td>
                  <Td><span className="font-semibold">₹{a.totalFee}</span><p className="text-xs text-ink-400">paid ₹{a.paidAmount}</p></Td>
                  <Td>{a.paymentVerified ? <span className="pill bg-success-100 text-success-600"><CheckCircle2 size={12}/> Verified</span> : <span className="pill bg-warning-100 text-warning-600"><Clock size={12}/> Pending</span>}</Td>
                  <Td><StatusPill status={a.status} /></Td>
                  <Td>{a.assignedToName || <span className="text-ink-400 text-xs">Unassigned</span>}</Td>
                  <Td>
                    <div className="flex gap-2">
                      {!a.paymentVerified && <button onClick={() => setVerifyFor(a)} className="px-3 py-1.5 rounded-lg bg-success-600 text-white text-xs font-semibold">Verify</button>}
                      {a.paymentVerified && !a.assignedTo && <button onClick={() => setAssignFor(a)} className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold">Assign</button>}
                    </div>
                  </Td>
                </tr>
              ))}
              {applications.length === 0 && <tr><td colSpan={8}><Empty text="No applications yet" /></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {verifyFor && <VerifyModal app={verifyFor} onConfirm={verify} onClose={() => setVerifyFor(null)} />}
      {assignFor && <AssignModal staff={staff} onConfirm={assign} onClose={() => setAssignFor(null)} />}
    </div>
  );
}

function VerifyModal({ app, onConfirm, onClose }: { app: Application; onConfirm: (amt: number) => void; onClose: () => void }) {
  const [amount, setAmount] = useState(app.totalFee);
  return (
    <Modal title={`Verify payment — ${app.applicantName}`} onClose={onClose}>
      <p className="text-sm text-ink-500">Enter the amount you received from the applicant on WhatsApp.</p>
      <div className="mt-4">
        <label className="text-xs font-medium text-ink-500 uppercase">Amount received (₹)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="form-input-light mt-1.5" autoFocus />
        <p className="text-xs text-ink-400 mt-2">Expected total: ₹{app.totalFee} ({app.casteCategory} — Govt ₹{a_gov(app)} + ₹{a_conv(app)} convenience)</p>
      </div>
      <div className="mt-6 flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-ink-300 text-ink-600 font-medium">Cancel</button>
        <button onClick={() => onConfirm(amount)} className="px-5 py-2.5 rounded-xl bg-success-600 text-white font-semibold flex items-center gap-2"><CheckCircle2 size={16} /> Confirm verification</button>
      </div>
    </Modal>
  );
}
function a_gov(a: Application) { return a.governmentFee; }
function a_conv(a: Application) { return a.convenienceFee; }

function AssignModal({ staff, onConfirm, onClose }: { staff: Staff[]; onConfirm: (sid: string) => void; onClose: () => void }) {
  return (
    <Modal title="Assign to staff" onClose={onClose}>
      {staff.length === 0 ? (
        <p className="text-sm text-ink-500">No staff members yet. Add staff from the Staff tab first.</p>
      ) : (
        <div className="space-y-2">
          {staff.map((s) => (
            <button key={s._id} onClick={() => onConfirm(s._id)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-ink-200 hover:border-brand-400 hover:bg-brand-50 transition text-left">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">{s.name[0]}</div>
              <div><p className="font-semibold text-ink-900 text-sm">{s.name}</p><p className="text-xs text-ink-400">{s.email}</p></div>
              <UserCheck className="ml-auto text-brand-600" size={18} />
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

function TeamPanel({ team, onChange }: { team: TeamApplication[]; onChange: () => void }) {
  const toast = useToast();
  const [verifyFor, setVerifyFor] = useState<TeamApplication | null>(null);
  const [amount, setAmount] = useState(500);

  const openVerify = (t: TeamApplication) => { setVerifyFor(t); setAmount(500); };
  const verify = async () => {
    if (!verifyFor) return;
    try { await api.verifyTeamPayment(verifyFor._id, amount); toast({ type: 'success', message: 'Team payment verified' }); setVerifyFor(null); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };
  const del = async (id: string) => {
    if (!confirm('Delete this team application?')) return;
    try { await api.deleteTeam(id); toast({ type: 'success', message: 'Deleted' }); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };

  return (
    <div>
      <h1 className="font-extrabold text-2xl text-ink-900">Join our team applications</h1>
      <p className="text-ink-500 text-sm mt-1">Admin only — verify ₹500 payment and approve partners. Saved separately from client applications.</p>

      <div className="mt-5 bg-white rounded-2xl border border-ink-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-50 text-ink-500 text-xs uppercase">
              <tr><Th>Name</Th><Th>Contact</Th><Th>City</Th><Th>Payment</Th><Th>Status</Th><Th>Action</Th></tr>
            </thead>
            <tbody>
              {team.map((t) => (
                <tr key={t._id} className="border-t border-ink-100 hover:bg-ink-50/50">
                  <Td><p className="font-semibold text-ink-900">{t.fullName}</p><p className="text-xs text-ink-400">{t.experience}</p></Td>
                  <Td>{t.phone}<p className="text-xs text-ink-400">{t.email}</p></Td>
                  <Td>{t.city}</Td>
                  <Td>{t.paymentVerified ? <span className="pill bg-success-100 text-success-600"><CheckCircle2 size={12}/> Verified</span> : <span className="pill bg-warning-100 text-warning-600"><Clock size={12}/> Pending</span>}
                    {t.paymentVerified && <p className="text-xs text-ink-400 mt-1">₹{t.paidAmount}</p>}
                  </Td>
                  <Td><StatusPill status={t.status} /></Td>
                  <Td>
                    <div className="flex gap-2">
                      {!t.paymentVerified && <button onClick={() => openVerify(t)} className="px-3 py-1.5 rounded-lg bg-success-600 text-white text-xs font-semibold">Verify ₹500</button>}
                      <button onClick={() => del(t._id)} className="p-1.5 text-ink-400 hover:text-danger-600"><Trash2 size={15} /></button>
                    </div>
                  </Td>
                </tr>
              ))}
              {team.length === 0 && <tr><td colSpan={6}><Empty text="No team applications yet" /></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {verifyFor && (
        <Modal title={`Verify ₹500 — ${verifyFor.fullName}`} onClose={() => setVerifyFor(null)}>
          <p className="text-sm text-ink-500">Confirm the join-team fee payment received on WhatsApp.</p>
          <div className="mt-4">
            <label className="text-xs font-medium text-ink-500 uppercase">Amount received (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="form-input-light mt-1.5" autoFocus />
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={() => setVerifyFor(null)} className="px-4 py-2.5 rounded-xl border border-ink-300 text-ink-600 font-medium">Cancel</button>
            <button onClick={verify} className="px-5 py-2.5 rounded-xl bg-success-600 text-white font-semibold flex items-center gap-2"><CheckCircle2 size={16} /> Verify payment</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StaffPanel({ staff, onChange }: { staff: Staff[]; onChange: () => void }) {
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.addStaff(form);
      toast({ type: 'success', message: 'Staff member added' });
      setForm({ name: '', email: '', password: '' }); setAdding(false); onChange();
    } catch (err: any) { toast({ type: 'error', message: err.message }); }
    finally { setSaving(false); }
  };
  const del = async (id: string) => {
    if (!confirm('Remove this staff member?')) return;
    try { await api.deleteStaff(id); toast({ type: 'success', message: 'Staff removed' }); onChange(); }
    catch (err: any) { toast({ type: 'error', message: err.message }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-2xl text-ink-900">Staff</h1>
          <p className="text-ink-500 text-sm mt-1">Add or remove staff who handle applications</p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700">
          <Plus size={18} /> {adding ? 'Cancel' : 'Add staff'}
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="mt-5 bg-white rounded-2xl p-6 border border-ink-200 grid sm:grid-cols-3 gap-4">
          <LField label="Name *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input-light" /></LField>
          <LField label="Email *"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input-light" /></LField>
          <LField label="Password *"><input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-input-light" /></LField>
          <div className="sm:col-span-3 flex justify-end gap-3">
            <button type="button" onClick={() => setAdding(false)} className="px-4 py-2.5 rounded-xl border border-ink-300 text-ink-600 font-medium">Cancel</button>
            <button disabled={saving} type="submit" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add staff
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl p-5 border border-ink-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-lg">{s.name[0]}</div>
            <div className="flex-1">
              <p className="font-bold text-ink-900">{s.name}</p>
              <p className="text-xs text-ink-400">{s.email}</p>
            </div>
            <button onClick={() => del(s._id)} className="text-ink-400 hover:text-danger-600 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {staff.length === 0 && <div className="sm:col-span-2 lg:col-span-3"><Empty text="No staff yet. Add your first team member." /></div>}
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ink-200">
      <h3 className="font-bold text-ink-900 flex items-center gap-2 mb-3"><Icon size={18} className="text-brand-600" /> {title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function RowItem({ title, sub, right }: { title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink-200 last:border-0">
      <div><p className="text-sm font-semibold text-ink-900">{title}</p><p className="text-xs text-ink-400">{sub}</p></div>
      {right}
    </div>
  );
}
function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-warning-100 text-warning-600',
    assigned: 'bg-brand-100 text-brand-700',
    in_progress: 'bg-brand-100 text-brand-700',
    payment_verified: 'bg-success-100 text-success-600',
    completed: 'bg-success-100 text-success-600',
    verified: 'bg-success-100 text-success-600',
    rejected: 'bg-danger-100 text-danger-600',
  };
  return <span className={`pill ${map[status] || 'bg-ink-100 text-ink-900'}`}>{status.replace('_', ' ')}</span>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="text-left px-4 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-3 align-top">{children}</td>; }
function Empty({ text }: { text: string }) { return <div className="text-center py-12 text-ink-400 text-sm">{text}</div>; }
function LField({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`block ${full ? 'sm:col-span-2' : ''}`}><span className="text-xs font-medium text-ink-500 uppercase tracking-wider">{label}</span><div className="mt-1.5">{children}</div></label>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
