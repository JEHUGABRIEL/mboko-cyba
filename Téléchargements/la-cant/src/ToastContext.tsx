import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

// ===== Types =====

type ToastType = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  action?: ToastAction;
  exiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void;
}

// ===== Context =====

const ToastContext = createContext<ToastContextType | null>(null);

// ===== Provider =====

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const removeToast = useCallback((id: number) => {
    // Commencer l'animation de sortie
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Supprimer après l'animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", action?: ToastAction) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, type, action }]);
      const duration = action ? 6000 : 4000;
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

// ===== Hook =====

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ===== Container Component =====

const ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const BORDERS: Record<ToastType, string> = {
  success: "border-l-green-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
};

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 bg-white rounded-lg shadow-lg border border-slate-200 border-l-4 ${BORDERS[toast.type]} px-4 py-3 min-w-[300px] max-w-[420px] transition-all duration-300 ${
            toast.exiting
              ? "opacity-0 translate-x-8"
              : "opacity-100 translate-x-0 animate-slideInRight"
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {ICONS[toast.type]}
          </div>
          <p className="flex-1 text-sm text-slate-800 font-medium leading-snug">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
            >
              {toast.action.label}
            </button>
          )}
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
