import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, TriangleAlert, X, Heart } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info' | 'favorite';
interface ToastItem {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

const ToastContext = createContext<(t: Omit<ToastItem, 'id'>) => void>(() => {});

export const useToast = () => useContext(ToastContext);

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-sage-dark" />,
  error: <TriangleAlert className="h-5 w-5 text-tangerine-dark" />,
  info: <Info className="h-5 w-5 text-forest" />,
  favorite: <Heart className="h-5 w-5 fill-tangerine text-tangerine" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto sm:flex-col-reverse sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-lift"
          >
            <span className="mt-0.5 shrink-0">{icons[t.kind]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-charcoal">{t.title}</p>
              {t.message && <p className="mt-0.5 text-sm text-charcoal-soft">{t.message}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="-m-1 rounded-full p-1 text-charcoal-muted transition hover:bg-cream hover:text-charcoal"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
