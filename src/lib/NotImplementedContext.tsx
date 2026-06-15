import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info } from 'lucide-react';
import { useI18n } from './i18n';

interface NotImplementedContextType {
  showInfo: (identifier: string, message?: string) => void;
}

const NotImplementedContext = createContext<NotImplementedContextType | undefined>(undefined);

export function NotImplementedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState({ identifier: '', message: '' });
  const { t } = useI18n();

  const showInfo = (identifier: string, message?: string) => {
    setInfo({ identifier, message: message || t('Diese Funktion ist in dieser Demo noch nicht implementiert.', 'This feature is not yet implemented in this demo.') });
    setIsOpen(true);
  };

  return (
    <NotImplementedContext.Provider value={{ showInfo }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-orange-600">
                  <Info className="w-5 h-5 cursor-default" />
                  <h3 className="font-bold text-slate-900">{t('Feature in Entwicklung', 'Feature in Development')}</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ID: {info.identifier}</p>
                <p className="text-slate-700 text-[15px] leading-relaxed">{info.message}</p>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setIsOpen(false)} className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors cursor-pointer shadow-sm">
                  {t('Verstanden', 'Understood')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotImplementedContext.Provider>
  );
}

export function useNotImplemented() {
  const context = useContext(NotImplementedContext);
  if (!context) throw new Error('useNotImplemented must be used within NotImplementedProvider');
  return context;
}
