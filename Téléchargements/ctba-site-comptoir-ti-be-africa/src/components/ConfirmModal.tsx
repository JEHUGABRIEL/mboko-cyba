import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onClick={onCancel}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 28,
                mass: 0.8,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    transition: { type: 'spring', stiffness: 500, damping: 18, delay: 0.1 },
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    variant === 'danger'
                      ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <AlertTriangle size={20} />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.18, duration: 0.3 } }}
                  className="text-lg font-bold text-slate-900 dark:text-white"
                >
                  {title}
                </motion.h3>
              </div>
              <button
                onClick={onCancel}
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.3 } }}
              className="p-5"
            >
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.32, duration: 0.3 } }}
              className="flex gap-3 p-5 pt-0"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 ease-out"
              >
                {cancelLabel}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ease-out ${
                  variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md hover:shadow-red-600/20'
                    : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 shadow-sm hover:shadow-md'
                }`}
              >
                {confirmLabel}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
