import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useCrm } from '../lib/CrmContext';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { ClipboardCheck, Sparkles, Award, PlayCircle, Clock, CheckCircle2, ChevronRight, Activity, Users, Euro, FileText, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { CourseDetailsOverlay, Course } from '../components/CourseDetailsOverlay';

interface ActivityItem {
  id: string;
  type: 'application' | 'claim' | 'communication' | 'mandate';
  title: string;
  time: string;
  desc: string;
}

const ACTIVITIES: ActivityItem[] = [
  { id: 'act1', type: 'communication', title: 'WhatsApp von Markus Weber', time: 'Vor 5 Min', desc: 'Fragt nach SEPA Mandat für die Kfz-Versicherung.' },
  { id: 'act2', type: 'application', title: 'Antrag eingereicht (#ANT-2026-004)', time: 'Vor 15 Min', desc: 'D&O Versicherung Standard für Dr. Anna Müller.' },
  { id: 'act3', type: 'claim', title: 'Wasserschaden erfasst (TechNova Solutions)', time: 'Vor 30 Min', desc: 'Rohrbruch im Serverraum. KI-Dunkelverarbeitung angestoßen.' },
  { id: 'act4', type: 'mandate', title: 'Mandat freigegeben (Venture Partners)', time: 'Vor 2 Std', desc: 'Maklervertrag digital unterzeichnet und verifiziert.' },
  { id: 'act5', type: 'application', title: 'Antrag im Status Risikoprüfung (#ANT-2026-001)', time: 'Vor 4 Std', desc: 'Gewerbe & Cyber Risk für TechNova Solutions.' },
  { id: 'act6', type: 'claim', title: 'KFZ Auffahrunfall gemeldet (Schmidt Handwerk)', time: 'Gestern', desc: 'Crafter Firmenwagen Unfall HH-SH 402.' },
];

export function Dashboard() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const { customers, conversations, tasks, updateTaskStatus } = useCrm();

  const [activeFeedTab, setActiveFeedTab] = useState<'all' | 'application' | 'claim' | 'communication' | 'mandate'>('all');
  const [dashboardTab, setDashboardTab] = useState<'sales' | 'academy'>('sales');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const dashCourse1: Course = {
    id: 101,
    title: t('Pipeline-Management & Deal-Tracking für Makler', 'Pipeline Management & Deal Tracking for Brokers'),
    category: 'HubSpot CRM Setup',
    level: t('Einsteiger', 'Beginner'),
    duration: '1h 30m',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };

  const dashCourse2: Course = {
    id: 102,
    title: t('Gewerbliche Deckungskonzepte', 'Commercial Coverage Concepts'),
    category: t('Sachversicherung', 'P&C'),
    level: t('Fortgeschritten', 'Advanced'),
    duration: '2h 15m',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };

  const activeClientsCount = customers.length;
  const unprocessedMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const openApplicationsCount = 4; // Mocked stat
  const portfolioCommission = '€24,500'; // Mocked stat

  const filteredActivities = ACTIVITIES.filter(item => activeFeedTab === 'all' || item.type === activeFeedTab);

  const openTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'application': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'claim': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'communication': return <MessageCircle className="w-4 h-4 text-green-600" />;
      case 'mandate': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Welcome & Dashboard Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('Willkommen zurück, Alex.', 'Welcome back, Alex.')}</h1>
          <p className="text-slate-500 mt-1">{t('Hier ist der aktuelle Überblick deiner Onboarding- und Makleraktivitäten.', 'Here is the current overview of your onboarding and broker activities.')}</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button 
            onClick={() => setDashboardTab('sales')}
            className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", dashboardTab === 'sales' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Activity className="w-4 h-4" />
            {t('Broker Cockpit', 'Broker Cockpit')}
          </button>
          <button 
            onClick={() => setDashboardTab('academy')}
            className={cn("px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", dashboardTab === 'academy' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <Award className="w-4 h-4" />
            {t('Lernbereich', 'Learning Area')}
          </button>
        </div>
      </div>

      {dashboardTab === 'sales' ? (
        <div className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Aktive Kunden', 'Active Customers')}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{activeClientsCount}</span>
                <span className="text-xs font-semibold text-slate-400">PKV + Gewerbe</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Offene Anträge', 'Open Applications')}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{openApplicationsCount}</span>
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">Risikoprüfung</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Bestandsprovision', 'Portfolio Commission')}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{portfolioCommission}</span>
                <span className="text-xs font-semibold text-slate-400">YTD</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Unbearbeitete Nachrichten', 'Unprocessed Messages')}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{unprocessedMessagesCount}</span>
                {unprocessedMessagesCount > 0 && (
                  <span className="text-xs font-bold text-white bg-orange-600 px-2 py-0.5 rounded-full">Neu</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Feed Section */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col h-[60vh]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">{t('Letzte Aktivitäten', 'Latest Activities')}</h3>
                
                {/* Feed Filters */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold border border-slate-200 overflow-x-auto">
                  {[
                    { id: 'all', label: t('Alle', 'All') },
                    { id: 'application', label: t('Anträge', 'Apps') },
                    { id: 'claim', label: t('Schäden', 'Claims') },
                    { id: 'communication', label: t('Komm.', 'Comms') },
                    { id: 'mandate', label: t('Mandate', 'Mandates') }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFeedTab(tab.id as any)}
                      className={cn(
                        "px-2 py-1 rounded transition-all whitespace-nowrap",
                        activeFeedTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {filteredActivities.map(act => (
                  <div key={act.id} className="flex gap-4 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="bg-slate-100 p-2 rounded-lg shrink-0 w-8 h-8 flex items-center justify-center">
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="space-y-0.5 flex-1 text-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900">{act.title}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{act.time}</span>
                      </div>
                      <p className="text-slate-500 text-xs">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist / Tasks Widget */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5 flex flex-col h-[60vh]">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">{t('Anstehende Aufgaben', 'Your Open Tasks')}</h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {openTasks.map(task => (
                  <label key={task.id} className="flex items-start gap-3 cursor-pointer group p-2 rounded hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      onChange={() => {
                        updateTaskStatus(task.id, 'completed');
                        showInfo(t('Aufgabe als erledigt markiert.', 'Task marked as completed.'));
                      }}
                      className="mt-1 flex-shrink-0 w-4 h-4 text-orange-600 border-slate-300 rounded cursor-pointer" 
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">{task.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{task.linkedCustomer} • {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  </label>
                ))}
                
                {openTasks.length === 0 && (
                  <div className="text-center text-slate-400 py-12">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold">{t('Keine offenen Aufgaben.', 'No pending tasks.')}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('Dein Lernpfad fortsetzen', 'Continue Your Learning Track')}</h2>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-orange-500">
              <div onClick={() => setSelectedCourse(dashCourse1)} className="p-6 flex items-start gap-6 border-b border-slate-100 cursor-pointer group hover:bg-slate-50 transition-colors">
                <div className="w-48 h-32 bg-slate-100 rounded-lg flex-shrink-0 relative overflow-hidden hidden sm:block">
                  <img src={dashCourse1.image} alt="CRM" className="object-cover w-full h-full opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">{dashCourse1.category}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{t('45 Min verbleibend', '45m left')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{dashCourse1.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700">{t('Modul 3: Automatisierte Workflows', 'Module 3: Automated Workflows')}</span>
                      <span className="text-orange-600">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div onClick={() => setSelectedCourse(dashCourse2)} className="p-6 flex items-start gap-6 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer group">
                <div className="w-48 h-32 bg-slate-100 rounded-lg flex-shrink-0 relative overflow-hidden hidden sm:block">
                  <img src={dashCourse2.image} alt="Client relations" className="object-cover w-full h-full opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{dashCourse2.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{dashCourse2.title}</h3>
                  <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-orange-600 transition-colors mt-4">
                    {t('Modul starten', 'Start Module')} <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">{t('Onboarding Milestones', 'Onboarding Milestones')}</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="bg-emerald-50 p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                  <span className="text-xs font-bold text-slate-800">{t('Registrierung vervollständigen', 'Complete registration')}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-emerald-50 p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                  <span className="text-xs font-bold text-slate-800">{t('Compliance Schulung bestehen', 'Pass compliance course')}</span>
                </div>
                <div className="flex gap-3 items-center opacity-50">
                  <div className="bg-slate-100 p-1.5 rounded-full"><PlayCircle className="w-4 h-4 text-slate-400" /></div>
                  <span className="text-xs font-bold text-slate-600">{t('Bedarfsanalyse quiz', 'Needs assessment quiz')}</span>
                </div>
                <div className="flex gap-3 items-center opacity-50">
                  <div className="bg-slate-100 p-1.5 rounded-full"><PlayCircle className="w-4 h-4 text-slate-400" /></div>
                  <span className="text-xs font-bold text-slate-600">{t('Die ersten 5 Leads anlegen', 'Log first 5 leads')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CourseDetailsOverlay course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </motion.div>
  );
}
