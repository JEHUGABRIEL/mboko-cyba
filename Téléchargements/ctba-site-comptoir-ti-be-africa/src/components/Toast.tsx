import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { setToastHandler, clearToastHandler } from './toastUtils';

type ToastType = {
  message: string;
  visible: boolean;
};

export function ToastContainer() {
  const [toast, setToast] = useState<ToastType>({ message: '', visible: false });

  useEffect(() => {
    setToastHandler((message: string) => {
      setToast({ message, visible: true });
    });
    return () => {
      clearToastHandler();
    };
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[100]"
        >
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 shadow-lg rounded-xl px-5 py-3.5 min-w-[320px]">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-green-600 dark:text-green-300" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">
              {toast.message}
            </p>
            <button
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
