import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, AlertCircle, FileText, User, Tag, Clock, RefreshCw } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm } from '../lib/CrmContext';
import { cn } from '../lib/utils';

export function CreateTaskOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t } = useI18n();
  const { addTask, deals } = useCrm();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    linkedDealId: '',
    linkedCustomer: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.linkedCustomer) return;
    
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    addTask({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      status: 'open',
      priority: formData.priority,
      linkedCustomer: formData.linkedCustomer,
      linkedDealId: formData.linkedDealId || undefined,
      hasDocuments: false,
      tags: tagsArray,
      comments: []
    });
    
    setFormData({ title: '', description: '', dueDate: '', priority: 'medium', linkedDealId: '', linkedCustomer: '', tags: '' });
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
                <h2 className="text-xl font-bold text-slate-900">{t('Neue Aufgabe', 'New Task')}</h2>
                <p className="text-sm text-slate-500 mt-1">{t('Erstellen Sie einen Vorang mit Wiedervorlage.', 'Create a task with follow-up.')}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {t('Titel der Aufgabe', 'Task Title')}
                </label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t('z.B. Gewerbeanmeldung anfordern', 'e.g. Request registration form')}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {t('Kunde / Firma', 'Customer / Company')}
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.linkedCustomer}
                  onChange={e => setFormData({ ...formData, linkedCustomer: e.target.value })}
                  placeholder={t('Kundenname', 'Customer Name')}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  {t('Beschreibung / Notizen', 'Description / Notes')}
                </label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  {t('Kategorien (kommasepariert)', 'Categories (comma-separated)')}
                </label>
                <input 
                  type="text" 
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder={t('z.B. IT, Angebot, Termin', 'e.g. Sales, IT, Appointment')}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {t('Wiedervorlage', 'Follow-up Date')}
                  </label>
                  <input 
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    {t('Priorität', 'Priority')}
                  </label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  >
                    <option value="low">{t('Niedrig', 'Low')}</option>
                    <option value="medium">{t('Mittel', 'Medium')}</option>
                    <option value="high">{t('Hoch', 'High')}</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                  {t('Mit Deal verknüpfen (Optional)', 'Link to Deal (Optional)')}
                </label>
                <select 
                  value={formData.linkedDealId}
                  onChange={e => setFormData({ ...formData, linkedDealId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow text-sm"
                >
                  <option value="">{t('-- Kein Deal ausgewählt --', '-- No Deal --')}</option>
                  {deals.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.company})</option>
                  ))}
                </select>
              </div>

               <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {t('Dokumente anhängen (Optional)', 'Attach Documents (Optional)')}
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                     <p className="text-sm text-slate-500">{t('Drag & Drop oder klicken zum Auswählen', 'Drag & drop or click to select')}</p>
                     <input type="file" className="hidden" id="file-upload" />
                     <label htmlFor="file-upload" className="mt-2 inline-block px-4 py-1.5 bg-white border border-slate-300 text-sm font-medium text-slate-700 rounded-md cursor-pointer hover:bg-slate-50">
                        {t('Datei auswählen', 'Select File')}
                     </label>
                  </div>
               </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
                 <RefreshCw className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed">
                   {t('Info: Diese Aufgabe wird automatisch bi-direktional mit dem Backend-Kernsystem (MVP) synchronisiert.', 'Info: This task will be automatically synchronized bi-directionally with the backend core system (MVP).')}
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
                  disabled={!formData.title || !formData.linkedCustomer || !formData.dueDate}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('Aufgabe speichern', 'Save Task')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
