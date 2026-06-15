import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useCrm, Customer } from '../lib/CrmContext';
import { X, Phone, Mail, MessageSquare, FileText, CheckCircle2, FileSignature, Presentation, History, Sparkles, Building2, User, PlayCircle, Settings2, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNotImplemented } from '../lib/NotImplementedContext';

interface CustomerRecordOverlayProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerRecordOverlay({ customer, isOpen, onClose }: CustomerRecordOverlayProps) {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const [activeTab, setActiveTab] = useState<'beratung' | 'angebote' | 'historie' | 'dokumente' | 'prozesse'>('historie');

  if (!isOpen || !customer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%', opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-4xl bg-slate-50 h-full shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  {customer.type === 'company' ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                  <p className="text-sm text-slate-500 uppercase tracking-wider">{customer.type === 'company' ? t('Firma', 'Company') : t('Privatperson', 'Individual')}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Sync Info */}
            <div className="flex justify-between items-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div className="flex gap-2">
                    <button className="p-2 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors tooltip-trigger relative group">
                        <Phone className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{t('Anrufen', 'Call')}</span>
                    </button>
                    <button className="p-2 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors group relative">
                        <Mail className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{t('E-Mail schreiben', 'Write E-Mail')}</span>
                    </button>
                    <button className="p-2 text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors flex items-center gap-2 group relative">
                        <MessageSquare className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">WhatsApp/Messenger</span>
                    </button>
                </div>
                
                <div className="flex items-center gap-2 font-medium text-xs">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{t('Kalender synchronisiert', 'Calendar synced')}</span>
                </div>
            </div>
          </div>

          <div className="flex border-b border-slate-200 bg-white px-2">
             <button onClick={() => setActiveTab('historie')} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'historie' ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")}>
                <div className="flex items-center gap-2"><History className="w-4 h-4" /> {t('Historie', 'History')}</div>
             </button>
             <button onClick={() => setActiveTab('beratung')} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'beratung' ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")}>
                <div className="flex items-center gap-2"><Presentation className="w-4 h-4" /> {t('Beratung', 'Consultation')}</div>
             </button>
             <button onClick={() => setActiveTab('angebote')} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'angebote' ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")}>
                <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> {t('Angebote', 'Quotes')}</div>
             </button>
             <button onClick={() => setActiveTab('dokumente')} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'dokumente' ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")}>
                <div className="flex items-center gap-2"><FileSignature className="w-4 h-4" /> {t('Dokumente & Unterschriften', 'Documents')}</div>
             </button>
             <button onClick={() => setActiveTab('prozesse')} className={cn("px-4 py-3 text-sm font-bold border-b-2 transition-colors", activeTab === 'prozesse' ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300")}>
                <div className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> {t('Standard-Prozesse', 'Standard Processes')}</div>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
             
             {activeTab === 'historie' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">{t('Kundenhistorie', 'Customer History')}</h3>
                        <button onClick={() => showInfo(t('KI wird Mail entwerfen...', 'AI is drafting mail...'))} className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                            {t('KI Follow-up generieren', 'Generate AI Follow-up')}
                        </button>
                    </div>

                    <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
                       <div className="relative">
                          <div className="absolute -left-[35px] bg-slate-100 p-1.5 rounded-full border border-slate-200">
                             <Phone className="w-4 h-4 text-slate-500" />
                          </div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Heute, 10:30</p>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                             <p className="font-bold text-slate-900 text-sm mb-1">{t('Telefonat: Schadensmeldung', 'Call: Claim Report')}</p>
                             <p className="text-sm text-slate-600">{t('Kunde hat einen Wasserschaden gemeldet. Schadensprozess #49281 wurde im Kernsystem angestoßen.', 'Customer reported water damage. Claim process #49281 was triggered in the core system.')}</p>
                          </div>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[35px] bg-slate-100 p-1.5 rounded-full border border-slate-200">
                             <Mail className="w-4 h-4 text-emerald-500" />
                          </div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Gesendet am 24. Mai, 14:15</p>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                             <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-emerald-500" />
                                <p className="font-bold text-slate-900 text-sm">{t('KI Entwurf versendet', 'AI Draft Sent')}</p>
                             </div>
                             <p className="text-sm text-slate-600">{t('Zusammenfassung des letzten Gesprächs bezüglich D&O Deckung. Follow-up Anruf für nächste Woche terminiert (automatischer Sync).', 'Summary of last conversation regarding D&O coverage. Follow-up call scheduled for next week (auto sync).')}</p>
                          </div>
                       </div>
                    </div>
                </div>
             )}

             {activeTab === 'beratung' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">{t('Laufende Beratungen', 'Ongoing Consultations')}</h3>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">{t('Bedarfsanalyse: Gewerbliche Absicherung', 'Needs Assessment: Commercial Coverage')}</h4>
                            <p className="text-sm text-slate-500 mt-1">{t('Letzte Änderung: Gestern', 'Last modified: Yesterday')}</p>
                        </div>
                        <button className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-orange-100 transition-colors">
                            <PlayCircle className="w-4 h-4" />
                            {t('Fortsetzen', 'Continue')}
                        </button>
                    </div>
                </div>
             )}

             {activeTab === 'angebote' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900">{t('Gesendete Angebote', 'Sent Quotes')}</h3>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="px-4 py-3">{t('Titel', 'Title')}</th>
                                    <th className="px-4 py-3">{t('Datum', 'Date')}</th>
                                    <th className="px-4 py-3">{t('Status', 'Status')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">Betriebshaftpflicht Optima</td>
                                    <td className="px-4 py-3 text-slate-500">20.05.2026</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md font-bold text-xs">Beim Kunden</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">KFZ Flotte</td>
                                    <td className="px-4 py-3 text-slate-500">12.04.2026</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Angenommen</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
             )}

             {activeTab === 'dokumente' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">{t('Dokumente & E-Signaturen', 'Documents & E-Signatures')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-orange-500 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <FileSignature className="w-8 h-8 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-xs font-bold border border-emerald-100">Signiert</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Maklermandat.pdf</p>
                                <p className="text-xs text-slate-500 mt-1">12.04.2026</p>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {activeTab === 'prozesse' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">{t('Automatisierte Standard-Prozesse', 'Automated Standard Processes')}</h3>
                    <p className="text-sm text-slate-500 -mt-4 mb-4">{t('Häufige Geschäftsvorfälle direkt ins Kernsystem anstoßen', 'Trigger common business events directly into the core system')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => showInfo('EVB Prozess gestartet')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-orange-500 transition-colors group">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">EVB generieren</div>
                            <div className="text-xs text-slate-500 mt-1 leading-snug">Elektronische Versicherungsbestätigung für KFZ abrufen.</div>
                        </button>
                        <button onClick={() => showInfo('SEPA Mandat Prozess gestartet')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-orange-500 transition-colors group">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">SEPA / Bankverbindung</div>
                            <div className="text-xs text-slate-500 mt-1 leading-snug">Neues SEPA Mandat via SMS/Email Link anfordern.</div>
                        </button>
                        <button onClick={() => showInfo('Adressänderung Prozess gestartet')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-orange-500 transition-colors group">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">Umzug / Adressänderung</div>
                            <div className="text-xs text-slate-500 mt-1 leading-snug">Zentrale Stammdatenänderung über alle Verträge im Kernsystem.</div>
                        </button>
                        <button onClick={() => showInfo('Vertragsänderung Prozess gestartet')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-orange-500 transition-colors group">
                            <div className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">Vertragsänderung (08/15)</div>
                            <div className="text-xs text-slate-500 mt-1 leading-snug">Fahrleistung (KFZ) oder Einschluss/Ausschluss melden.</div>
                        </button>
                    </div>
                </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
