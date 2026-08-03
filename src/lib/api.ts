import type { Service, Application, TeamApplication, Staff, Stats, AuthUser } from '@/types';

function parseMeta(): AuthUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)applymitra_meta=([^;]+)/);
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    return data as AuthUser;
  } catch {
    return null;
  }
}

export function getAuthUser(): AuthUser | null {
  return parseMeta();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).error || 'Request failed');
  }
  return data as T;
}

export const api = {
  // public
  getServices: () => request<Service[]>('/api/services'),
  submitApplication: (body: any) => request<Application>('/api/applications', { method: 'POST', body: JSON.stringify(body) }),
  submitTeam: (body: any) => request<TeamApplication>('/api/team', { method: 'POST', body: JSON.stringify(body) }),

  // auth
  login: (email: string, password: string) =>
    request<{ role: string; name: string; email: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),

  // admin
  adminStats: () => request<Stats>('/api/admin/stats'),
  adminApplications: () => request<Application[]>('/api/admin/applications'),
  adminTeam: () => request<TeamApplication[]>('/api/admin/team'),
  adminStaff: () => request<Staff[]>('/api/admin/staff'),

  addService: (body: any) => request<Service>('/api/services', { method: 'POST', body: JSON.stringify(body) }),
  updateService: (id: string, body: any) => request(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteService: (id: string) => request(`/api/services/${id}`, { method: 'DELETE' }),

  assignApplication: (id: string, staffId: string) =>
    request(`/api/admin/applications/${id}/assign`, { method: 'PUT', body: JSON.stringify({ staffId }) }),
  verifyAppPayment: (id: string, paidAmount: number) =>
    request(`/api/admin/applications/${id}/verify-payment`, { method: 'PUT', body: JSON.stringify({ paidAmount }) }),

  verifyTeamPayment: (id: string, paidAmount: number) =>
    request(`/api/admin/team/${id}/verify-payment`, { method: 'PUT', body: JSON.stringify({ paidAmount }) }),
  deleteTeam: (id: string) => request(`/api/admin/team/${id}`, { method: 'DELETE' }),

  addStaff: (body: { name: string; email: string; password: string }) =>
    request<Staff>('/api/admin/staff', { method: 'POST', body: JSON.stringify(body) }),
  deleteStaff: (id: string) => request(`/api/admin/staff/${id}`, { method: 'DELETE' }),

  // staff
  staffApplications: () => request<Application[]>('/api/staff/applications'),
  updateAppStatus: (id: string, status: string, note?: string) =>
    request(`/api/staff/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, note }) }),
};
