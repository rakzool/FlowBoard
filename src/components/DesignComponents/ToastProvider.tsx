import { useCallback, useEffect, useState } from "react";
import Toast, { type TToastData } from "./Toast";
import { ToastContext } from "./hooks/useToast";

type TToastProviderProps = { children: React.ReactNode };

export default function ToastProvider({ children }: TToastProviderProps) {
  const [toasts, setToasts] = useState<TToastData[]>([]);
  const showToast = useCallback((toast: Omit<TToastData, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timeout = window.setTimeout(() => dismissToast(toasts[0].id), 4500);
    return () => window.clearTimeout(timeout);
  }, [toasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:items-end">
        {toasts.map((toast) => (
          <div className="pointer-events-auto" key={toast.id}>
            <Toast toast={toast} onClose={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
