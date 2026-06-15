import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, User, Euro, MessageSquare, Clock, MapPin, Phone, Mail, FileText, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Deal } from '../lib/CrmContext';
import { cn } from '../lib/utils';

export function DealDetailsOverlay({ dealId, onClose }: { dealId: string | null, onClose: () => void }) {
  const { t } = useI18n();
  const { deals, updateDealStage, addTask } = useCrm();
  const [createdTaskMessage, setCreatedTaskMessage] = useState(false);
  
  const deal = deals.find(d => d.id === dealId);

  const STAGES = [
    { id: 'lead', title: t('Lead', 'Lead') },
    { id: 'firstContact', title: t('Erstkontakt', 'First Contact') },
    { id: 'needsAnalysis', title: t('Bedarfsanalyse', 'Needs Analysis') },
    { id: 'consulting', title: t('Beratung', 'Consulting') },
    { id: 'offer', title: t('Angebot', 'Offer') },
    { id: 'negotiation', title: t('Verhandlung', 'Negotiation') },
    { id: 'closed', title: t('Abschluss', 'Closed') }
  ];

  const handleAutoTaskMissingDocs = () => {
    if (!deal) return;
    
    // Calculate a follow-up date (e.g. 3 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);
    
    addTask({
      title: 'Fehlende Dokumente anfordern (Auto)',
      description: `Wiedervorlage: Kunde ${deal.company} muss noch Unterlagen für das Angebot einreichen.`,
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'waiting',
      priority: 'high',
      linkedCustomer: deal.company,
      linkedDealId: deal.id,
      hasDocuments: false
    });
    
    updateDealStage(deal.id, 'needsAnalysis');
    
    setCreatedTaskMessage(true);
    setTimeout(() => setCreatedTaskMessage(false), 3000);
  };

  return (
    <AnimatePresence>
      {deal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col pt-4 overflow-hidden"
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 pb-8 mt-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                    {deal.company.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{deal.name}</h2>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {deal.company}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-8 space-y-8">
                
                {/* Stage Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('Aktuelle Phase', 'Current Stage')}</h3>
                  </div>
                  <div className="flex items-center">
                    {STAGES.map((stage, idx) => {
                      const isActive = deal.stage === stage.id;
                      const currentIndex = STAGES.findIndex(s => s.id === deal.stage);
                      const isPast = idx < currentIndex;
                      
                      return (
                        <div key={stage.id} className="flex-1 flex flex-col relative group">
                          {idx !== 0 && <div className={cn("absolute top-3 left-0 -ml-[50%] right-[50%] h-1 -mt-0.5 z-0", isPast || isActive ? "bg-orange-500" : "bg-slate-200")} />}
                          <button
                            onClick={() => updateDealStage(deal.id, stage.id)}
                            className="relative z-10 flex items-center justify-center cursor-pointer transition-transform group-hover:scale-110"
                            title={t('Setze Status auf: ', 'Set stage to: ') + stage.title}
                          >
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                              isActive ? "border-orange-600 bg-white" : isPast ? "border-orange-500 bg-orange-500 text-white" : "border-slate-300 bg-white"
                            )}>
                              {isPast && <CheckCircle2 className="w-4 h-4" />}
                              {isActive && <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />}
                            </div>
                          </button>
                          <span className={cn("text-xs font-semibold text-center mt-2 px-1", isActive ? "text-orange-700" : isPast ? "text-slate-700" : "text-slate-400")}>
                            {stage.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                       <Euro className="w-4 h-4" />
                       <span className="text-sm font-semibold">{t('Bedarfswert', 'Deal Value')}</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{deal.value}</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                       <Clock className="w-4 h-4" />
                       <span className="text-sm font-semibold">{t('Alter (Tage)', 'Age (Days)')}</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{deal.age}</span>
                  </div>
                </div>

                {/* Intelligent Follow-ups */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        {t('KI Empfehlungen', 'AI Insights')}
                     </h3>
                   </div>
                   <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 shadow-sm relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                      <h4 className="font-bold text-orange-900 text-sm mb-1">{t('Dokumente fehlen für Angebotserstellung', 'Missing documents for quote')}</h4>
                      <p className="text-sm text-orange-800/80 mb-4">{t('Das CRM hat erkannt, dass für dieses Produkt noch Pflichtdokumente vorliegen müssen.', 'The CRM detected missing incorporation documents required for this policy.')}</p>
                      
                      {createdTaskMessage ? (
                         <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 flex-shrink-0 w-fit">
                            <CheckCircle2 className="w-4 h-4" />
                            {t('Wiedervorlage erfolgreich erstellt.', 'Follow-up task created.')}
                         </div>
                      ) : (
                         <button 
                           onClick={handleAutoTaskMissingDocs}
                           className="bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer w-fit"
                         >
                           <Clock className="w-4 h-4" />
                           {t('Wiedervorlage + Kundeninfo (Auto)', 'Auto Follow-up + Notify')}
                         </button>
                      )}
                   </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">{t('Kontaktinformationen', 'Contact Information')}</h3>
                  <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Dr. Markus Schmidt</p>
                        <p className="text-xs text-slate-500">Geschäftsführer</p>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                      <div className="flex gap-3">
                        <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                          <a href="#" className="text-sm text-orange-600 hover:underline">markus@schmidt.biz</a>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
                          <a href="#" className="text-sm text-slate-900">0151 4567 8901</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Activity */}
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">{t('Aktivitäten', 'Activity')}</h3>
                   <div className="border-l-2 border-slate-100 ml-3 space-y-6 md:space-y-8 pb-8">
                     <div className="relative pl-6">
                       <div className="absolute w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center -left-[13px] top-0 ring-4 ring-white">
                         <MessageSquare className="w-3 h-3 text-orange-600" />
                       </div>
                       <p className="text-sm font-semibold text-slate-900">{t('Erstgespräch geführt', 'Initial call completed')}</p>
                       <p className="text-xs text-slate-500 mt-1">{deal.age}</p>
                       <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                         {t('Kunde ist interessiert an Rahmenvertrag für 15 Mitarbeiter. Angebot bis Freitag benötigt.', 'Client is interested in master agreement for 15 employees. Needs quote by Friday.')}
                       </div>
                     </div>
                     <div className="relative pl-6">
                       <div className="absolute w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center -left-[13px] top-0 ring-4 ring-white">
                         <Plus className="w-3 h-3 text-slate-600" />
                       </div>
                       <p className="text-sm text-slate-900">{t('Deal erstellt', 'Deal created')}</p>
                       <p className="text-xs text-slate-500 mt-1">{deal.age}</p>
                     </div>
                   </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors">
                {t('Notiz hinzufügen', 'Add Note')}
              </button>
              <button className="px-5 py-3 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 rounded-xl font-medium transition-colors">
                {t('Termin', 'Schedule')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
