import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Euro, MessageSquare } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm } from '../lib/CrmContext';

export function CreateDealOverlay({ isOpen, onClose, initialData }: { isOpen: boolean, onClose: () => void, initialData?: { name?: string, value?: string, company?: string } }) {
  const { t } = useI18n();
  const { addDeal } = useCrm();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    agreed: false
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        company: initialData?.company || '',
        value: initialData?.value || '',
        agreed: false
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;
    
    addDeal({
      name: formData.name,
      company: formData.company,
      value: formData.value || '€0/J',
      age: 'Just now',
      stage: 'lead'
    });
    
    setFormData({ name: '', company: '', value: '', agreed: false });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('Neuen Deal erstellen', 'Create New Deal')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('Erfasse einen neuen Lead oder ein Verkaufsprojekt.', 'Log a new lead or sales opportunity.')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {t('Deal Name / Kontakt', 'Deal Name / Contact')}
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Schmidt Handwerk - Haftpflicht"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {t('Unternehmen', 'Company')}
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Unternehmen GmbH"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Euro className="w-4 h-4 text-slate-400" />
                  {t('Erwartete Jahresprämie', 'Expected Annual Premium')}
                </label>
                <input 
                  type="text" 
                  value={formData.value}
                  onChange={e => setFormData({ ...formData, value: e.target.value })}
                  placeholder="€1,200/J"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  {t('Abbrechen', 'Cancel')}
                </button>
                <button 
                  type="submit"
                  disabled={!formData.name || !formData.company}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('Deal speichern', 'Save Deal')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
