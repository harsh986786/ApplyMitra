'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string };
const ToastCtx = createContext<(t: Omit<Toast, 'id'>) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass-light rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[280px] animate-riseUp"
          >
            {t.type === 'success' && <CheckCircle2 className="text-success-600 shrink-0" size={20} />}
            {t.type === 'error' && <AlertTriangle className="text-danger-600 shrink-0" size={20} />}
            {t.type === 'info' && <Info className="text-brand-600 shrink-0" size={20} />}
            <span className="text-sm font-medium text-ink-900 flex-1">{t.message}</span>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="text-ink-400 hover:text-ink-700">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
