import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Mail, Phone, MapPin, RefreshCw } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Customer } from '../lib/CrmContext';

export function CreateCustomerOverlay({ isOpen, onClose, customerToEdit }: { isOpen: boolean, onClose: () => void, customerToEdit?: Customer | null }) {
  const { t } = useI18n();
  const { addCustomer, updateCustomer } = useCrm();

  const [formData, setFormData] = useState({
    type: 'company' as 'person' | 'company',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        setFormData({
          type: customerToEdit.type,
          name: customerToEdit.name,
          email: customerToEdit.email,
          phone: customerToEdit.phone,
          address: customerToEdit.address
        });
      } else {
        setFormData({ type: 'company', name: '', email: '', phone: '', address: '' });
      }
    }
  }, [isOpen, customerToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (customerToEdit) {
      updateCustomer(customerToEdit.id, formData);
    } else {
      addCustomer(formData);
    }
    
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
                <h2 className="text-xl font-bold text-slate-900">
                  {customerToEdit ? t('Kunde bearbeiten', 'Edit Customer') : t('Neuen Kunden anlegen', 'New Customer')}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {t('Daten werden im Kernsystem aktualisiert.', 'Data will be updated in the core system.')}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
               <div className="flex bg-slate-100 p-1 rounded-lg">
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, type: 'company'})} 
                   className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'company' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <Building2 className="w-4 h-4" />
                   {t('Firma', 'Company')}
                 </button>
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, type: 'person'})} 
                   className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'person' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   <User className="w-4 h-4" />
                   {t('Privatperson', 'Individual')}
                 </button>
               </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  {formData.type === 'company' ? <Building2 className="w-4 h-4 text-slate-400" /> : <User className="w-4 h-4 text-slate-400" />}
                  {formData.type === 'company' ? t('Firmenname', 'Company Name') : t('Vor- und Nachname', 'Full Name')}
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.type === 'company' ? "z.B. Schmidt Handwerk GmbH" : "z.B. Max Mustermann"}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {t('E-Mail', 'Email')}
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {t('Telefon', 'Phone')}
                  </label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {t('Anschrift', 'Address')}
                </label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
                 <RefreshCw className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                   {t('Info: Änderungen an Kundendaten werden nach dem Speichern automatisch ins Kernsystem übertragen.', 'Info: Changes to customer data are automatically transferred to the core system after saving.')}
                 </p>
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
                  disabled={!formData.name}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('Speichern & Synchronisieren', 'Save & Sync')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
