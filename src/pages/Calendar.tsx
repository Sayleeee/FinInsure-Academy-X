import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { useCrm, Task } from '../lib/CrmContext';
import { Calendar as CalendarIcon, Clock, Plus, RefreshCw, CheckCircle2, ChevronLeft, ChevronRight, User, GraduationCap, X, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { TasksView } from '../components/TasksView';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'idd' | 'task';
  date: string; // YYYY-MM-DD
  time: string;
  linkedCustomer?: string;
  duration?: string;
  completed?: boolean;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Jahresgespräch vorbereiten (Venture Partners)', type: 'meeting', date: '2026-06-05', time: '10:00', linkedCustomer: 'Venture Partners', duration: '1 Std.' },
  { id: 'e2', title: 'IDD: Cyber Security im Mittelstand', type: 'idd', date: '2026-06-12', time: '14:00', duration: '2 Std.' },
  { id: 'e3', title: 'Bedarfsanalyse: Logistics Pro GmbH', type: 'meeting', date: '2026-06-08', time: '11:30', linkedCustomer: 'Logistics Pro', duration: '1.5 Std.' },
  { id: 'e4', title: 'IDD: Compliance Grundkurs 2026', type: 'idd', date: '2026-06-18', time: '09:00', duration: '1 Std.' },
  { id: 'e5', title: 'Nacharbeit: Schmidt Handwerk', type: 'task', date: '2026-06-05', time: '15:00', linkedCustomer: 'Schmidt Handwerk', completed: false },
];

export function Calendar() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const { tasks } = useCrm();

  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks'>('calendar');
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'idle'>('connected');
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState<'meeting' | 'idd' | 'task'>('meeting');
  const [newCustomer, setNewCustomer] = useState('');
  const [newDuration, setNewDuration] = useState('1 Std.');

  const handleSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('connected');
      showInfo(t('Synchronisation mit Google Calendar & Outlook erfolgreich.', 'Synced with Google Calendar & Outlook successfully.'));
    }, 2000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newTime) return;

    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      linkedCustomer: newCustomer || undefined,
      duration: newDuration,
    };

    setEvents(prev => [...prev, newEv]);
    setIsNewEventOpen(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewCustomer('');
    showInfo(t('Termin erfolgreich angelegt.', 'Appointment successfully scheduled.'));
  };

  // Simple Month View Grid generation (June 2026)
  // June 1st, 2026 is a Monday. June has 30 days.
  const daysInJune = 30;
  const startDayOffset = 0; // Monday start
  const daysArray = Array.from({ length: daysInJune }, (_, i) => i + 1);

  const getEventsForDay = (dayNum: number) => {
    const dayStr = `2026-06-${dayNum.toString().padStart(2, '0')}`;
    return events.filter(e => e.date === dayStr);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title & Sync Widget */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-orange-600" />
            {t('Kalender & Aufgaben', 'Calendar & Tasks')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('Behalte anstehende Meetings, IDD-Schulungen und deine To-Dos im Blick.', 'Keep track of upcoming meetings, IDD training sessions, and your to-dos.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-sm font-semibold">
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            {syncStatus === 'syncing' ? t('Synchronisiere...', 'Syncing...') : t('Outlook & Google synchronisiert', 'Outlook & Google Synced')}
          </div>
          <button 
            disabled={syncStatus === 'syncing'}
            onClick={handleSync}
            className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 rounded-lg hover:shadow-sm transition-colors cursor-pointer"
            title={t('Kalender synchronisieren', 'Sync Calendars')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Switcher Tab */}
      <div className="flex bg-slate-100 p-1 rounded-xl self-start w-fit">
        <button 
          onClick={() => setActiveTab('calendar')}
          className={cn("px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeTab === 'calendar' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <CalendarIcon className="w-4 h-4" />
          {t('Kalenderansicht', 'Calendar')}
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={cn("px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeTab === 'tasks' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Clock className="w-4 h-4" />
          {t('Aufgabenliste', 'Tasks List')}
        </button>
      </div>

      {activeTab === 'calendar' ? (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar Grid Container */}
          <div className="xl:col-span-3 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Juni 2026</h2>
              <div className="flex items-center gap-2">
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setIsNewEventOpen(true)} className="ml-2 bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  {t('Termin anlegen', 'Add Event')}
                </button>
              </div>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div>{t('Mo', 'Mon')}</div>
              <div>{t('Di', 'Tue')}</div>
              <div>{t('Mi', 'Wed')}</div>
              <div>{t('Do', 'Thu')}</div>
              <div>{t('Fr', 'Fri')}</div>
              <div>{t('Sa', 'Sat')}</div>
              <div>{t('So', 'Sun')}</div>
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isToday = day === 5; // June 5, 2026 is our current date mockup
                return (
                  <div 
                    key={day} 
                    className={cn(
                      "min-h-[110px] bg-slate-50/50 hover:bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex flex-col justify-between transition-colors",
                      isToday ? "border-orange-500 bg-orange-50/20 ring-1 ring-orange-500" : ""
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", isToday ? "bg-orange-500 text-white" : "text-slate-600")}>
                        {day}
                      </span>
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[80px] flex-1 mt-1 scrollbar-none">
                      {dayEvents.map(e => (
                        <div 
                          key={e.id}
                          className={cn(
                            "text-[9px] font-bold p-1 rounded-md border truncate leading-tight",
                            e.type === 'meeting' ? "bg-blue-50 text-blue-800 border-blue-100" : 
                            e.type === 'idd' ? "bg-orange-50 text-orange-800 border-orange-100" : 
                            "bg-slate-100 text-slate-800 border-slate-200"
                          )}
                          title={`${e.time} - ${e.title}`}
                        >
                          <span className="font-extrabold mr-0.5">{e.time}</span>
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Agenda & Training feed on side */}
          <div className="space-y-6">
            
            {/* Compulsory IDD Progress Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-slate-800">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Compulsory IDD</span>
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-1">{t('Weiterbildungsstatus', 'IDD Training Hours')}</h3>
              <p className="text-2xl font-extrabold">9.5 <span className="text-sm font-medium text-slate-400">/ 15 Std.</span></p>
              <div className="w-full bg-slate-700/80 rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '63.3%' }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">{t('Noch 5.5 Stunden bis zum 31.12.2026.', '5.5 hours remaining until Dec 31, 2026.')}</p>
            </div>

            {/* Upcoming Agenda Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">{t('Anstehende Termine', 'Upcoming Agenda')}</h3>
              
              <div className="space-y-4">
                {events.sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map(e => (
                  <div key={e.id} className="flex gap-3 items-start group">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0",
                      e.type === 'meeting' ? "bg-blue-500" : e.type === 'idd' ? "bg-orange-500" : "bg-slate-400"
                    )}></div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs leading-normal group-hover:text-orange-600 transition-colors">{e.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span>{new Date(e.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{e.time} {t('Uhr', '')}</span>
                        {e.duration && (
                          <>
                            <span>•</span>
                            <span>{e.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <TasksView />
      )}

      {/* New Event Modal Overlay */}
      <AnimatePresence>
        {isNewEventOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">{t('Neuen Termin planen', 'Schedule New Appointment')}</h2>
                <button onClick={() => setIsNewEventOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full border border-slate-200 bg-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Titel / Zweck', 'Title / Purpose')}</label>
                  <input 
                    required
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="z.B. Beratungsgespräch Cyber"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Datum', 'Date')}</label>
                    <input 
                      required
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Uhrzeit', 'Time')}</label>
                    <input 
                      required
                      type="time"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Termin-Typ', 'Type')}</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="meeting">{t('Kunden-Meeting', 'Client Meeting')}</option>
                      <option value="idd">{t('IDD Schulung', 'IDD Course')}</option>
                      <option value="task">{t('Aufgabe', 'Task')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Dauer', 'Duration')}</label>
                    <input 
                      type="text"
                      value={newDuration}
                      onChange={e => setNewDuration(e.target.value)}
                      placeholder="z.B. 1 Std."
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Verknüpfter Kunde', 'Linked Customer')}</label>
                  <input 
                    type="text"
                    value={newCustomer}
                    onChange={e => setNewCustomer(e.target.value)}
                    placeholder="Kundenname optional"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsNewEventOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold"
                  >
                    {t('Abbrechen', 'Cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    {t('Planen', 'Schedule')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
