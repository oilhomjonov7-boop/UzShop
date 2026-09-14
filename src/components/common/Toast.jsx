import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

let toastHandler = null;

export const showToast = {
  success: (message, title = 'Muvaffaqiyatli') => {
    if (toastHandler) toastHandler({ type: 'success', title, message });
  },
  error: (message, title = 'Xatolik') => {
    if (toastHandler) toastHandler({ type: 'error', title, message });
  },
  info: (message, title = "Ma'lumot") => {
    if (toastHandler) toastHandler({ type: 'info', title, message });
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastHandler = ({ type, title, message }) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, type, title, message }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    return () => {
      toastHandler = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-slide-up ${
              isSuccess
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : isError
                ? 'bg-rose-50/95 border-rose-200 text-rose-900'
                : 'bg-blue-50/95 border-blue-200 text-blue-900'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold leading-none">{toast.title}</h4>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
