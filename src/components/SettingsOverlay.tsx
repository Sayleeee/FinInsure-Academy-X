import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Bell, Palette, Globe, Shield, CreditCard, Settings as SettingsIcon, Workflow, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { cn } from '../lib/utils';

export function SettingsOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t, lang, setLang } = useI18n();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: t('Profil', 'Profile') },
    { id: 'preferences', icon: Palette, label: t('Erscheinungsbild', 'Preferences') },
    { id: 'automation', icon: SettingsIcon, label: t('Automatisierung', 'Automation') },
    { id: 'notifications', icon: Bell, label: t('Benachrichtigungen', 'Notifications') },
    { id: 'security', icon: Shield, label: t('Sicherheit', 'Security') },
    { id: 'billing', icon: CreditCard, label: t('Abrechnung', 'Billing') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex border border-slate-200"
            style={{ height: '80vh', maxHeight: '800px' }}
          >
            {/* Sidebar */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 mb-6">{t('Einstellungen', 'Settings')}</h2>
              <nav className="flex-1 space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive 
                          ? 'bg-orange-50 text-orange-700' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                    >
                      <tab.icon className={cn('w-4 h-4', isActive ? 'text-orange-600' : 'text-slate-400')} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto p-10">
                {activeTab === 'profile' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{t('Profil', 'Profile')}</h3>
                      <p className="text-slate-500 mt-1">{t('Verwalte deine persönlichen Daten.', 'Manage your personal information.')}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="h-24 w-24 rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                        AB
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm mb-2">
                          {t('Bild hochladen', 'Upload photo')}
                        </button>
                        <p className="text-xs text-slate-500">{t('JPG, GIF oder PNG. Max. 1MB.', 'JPG, GIF or PNG. Max 1MB.')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">{t('Vorname', 'First name')}</label>
                        <input type="text" defaultValue="Alex" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">{t('Nachname', 'Last name')}</label>
                        <input type="text" defaultValue="Broker" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="block text-sm font-medium text-slate-700">{t('E-Mail-Adresse', 'Email address')}</label>
                        <input type="email" defaultValue="alex@artemis-gruppe.de" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex justify-end">
                      <button className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors">
                        {t('Speichern', 'Save changes')}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{t('Erscheinungsbild', 'Preferences')}</h3>
                      <p className="text-slate-500 mt-1">{t('Passe das Aussehen und die Sprache an.', 'Customize appearance and language.')}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('Sprache', 'Language')}</h4>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setLang('de')}
                          className={cn(
                            'p-4 border rounded-xl flex-1 flex items-center justify-between transition-colors',
                            lang === 'de' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <span className="font-semibold text-slate-900">Deutsch</span>
                          {lang === 'de' && <div className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                        </button>
                        <button 
                          onClick={() => setLang('en')}
                          className={cn(
                            'p-4 border rounded-xl flex-1 flex items-center justify-between transition-colors',
                            lang === 'en' ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <span className="font-semibold text-slate-900">English</span>
                          {lang === 'en' && <div className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('Thema', 'Theme')}</h4>
                      <div className="flex items-center gap-4">
                        <button className="p-4 border border-orange-500 bg-orange-50/50 ring-1 ring-orange-500 rounded-xl flex-1 flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-slate-900"></div>
                          </div>
                          <span className="font-semibold text-slate-900">Light</span>
                        </button>
                        <button className="p-4 border border-slate-200 hover:border-slate-300 rounded-xl flex-1 flex flex-col items-center gap-3 opacity-50 cursor-not-allowed">
                          <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-white"></div>
                          </div>
                          <span className="font-semibold text-slate-900">Dark <span className="text-xs font-normal text-slate-500">(Soon)</span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'automation' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{t('Globale Automatisierungsregeln', 'Global Automation Rules')}</h3>
                      <p className="text-slate-500 mt-1">{t('Definiere benutzerdefinierte Trigger für Aufgaben und Prozesse.', 'Define custom triggers for tasks and processes.')}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t('Aktive Regeln', 'Active Rules')}</h4>
                         <button className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1.5"><Plus className="w-4 h-4"/> {t('Regel hinzufügen', 'Add Rule')}</button>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg shrink-0">
                               <Workflow className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-900">Follow-up für Leads</h5>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                                  </label>
                               </div>
                               <p className="text-sm text-slate-600 mt-1">If a deal stays in the lead stage for more than 7 days, automatically create a follow-up task with high priority.</p>
                            </div>
                         </div>

                         <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-start gap-4">
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0">
                               <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-slate-900">Geburtstags-Erinnerung</h5>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                                  </label>
                               </div>
                               <p className="text-sm text-slate-600 mt-1">3 Tage vor dem Geburtstag eines Kunden eine Erinnerungsaufgabe für Glückwunsch-Mail anlegen.</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {(activeTab === 'notifications' || activeTab === 'security' || activeTab === 'billing') && (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      {activeTab === 'notifications' && <Bell className="w-8 h-8" />}
                      {activeTab === 'security' && <Shield className="w-8 h-8" />}
                      {activeTab === 'billing' && <CreditCard className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('Demnächst verfügbar', 'Coming Soon')}</h3>
                    <p className="text-slate-500 max-w-sm">
                      {t('Dieser Einstellungsbereich befindet sich noch in Entwicklung und wird in Kürze freigeschaltet.', 'This settings area is still under development and will be unlocked soon.')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
