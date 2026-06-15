import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, List, LayoutGrid, Calendar as CalendarIcon, CheckCircle2, Clock, AlertCircle, RefreshCw, FileText, Paperclip, AlertTriangle } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Task } from '../lib/CrmContext';
import { CreateTaskOverlay } from './CreateTaskOverlay';
import { cn } from '../lib/utils';

const TASK_STATUSES_BASE = [
  { id: 'open', titleKey: 'Offen', color: 'bg-slate-200' },
  { id: 'in_progress', titleKey: 'In Bearbeitung', color: 'bg-blue-200' },
  { id: 'waiting', titleKey: 'Wartend', color: 'bg-orange-200' },
  { id: 'completed', titleKey: 'Abgeschlossen', color: 'bg-emerald-200' },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-orange-600 bg-orange-100';
    case 'low': return 'text-slate-600 bg-slate-100';
    default: return 'text-slate-600 bg-slate-100';
  }
};

const getPriorityLabel = (priority: string, t: any) => {
  switch (priority) {
    case 'high': return t('Hoch', 'High');
    case 'medium': return t('Mittel', 'Medium');
    case 'low': return t('Niedrig', 'Low');
    default: return priority;
  }
};

const TaskRow = ({ task }: { task: Task, key?: any }) => {
  const { t } = useI18n();
  const { updateTaskStatus, addCommentToTask } = useCrm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isOverdue = new Date(task.dueDate).getTime() < new Date().setHours(0,0,0,0) && task.status !== 'completed';
  
  const handleAddComment = (e: React.FormEvent) => {
     e.preventDefault();
     if (!newComment.trim()) return;
     addCommentToTask(task.id, newComment);
     setNewComment('');
  };

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors border-b border-slate-100 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
           <select 
             value={task.status}
             onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
             className="text-sm bg-slate-50 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
           >
              {TASK_STATUSES_BASE.map(s => <option key={s.id} value={s.id}>{t(s.titleKey, s.titleKey)}</option>)}
           </select>
        </td>
        <td className="px-6 py-4">
           <div className="flex items-center gap-2">
             <p className="text-sm font-bold text-slate-900">{task.title}</p>
             {task.hasDocuments && (
               <div className="group relative">
                 <Paperclip className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                 <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max z-10">
                   <div className="bg-slate-800 text-white text-xs rounded py-1 px-2 shadow-sm">
                     {task.documentName || t('Angehängtes Dokument', 'Attached Document')}
                   </div>
                   <div className="w-2 h-2 bg-slate-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                 </div>
               </div>
             )}
             {task.comments && task.comments.length > 0 && (
                <div className="flex items-center gap-1 text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                   <FileText className="w-3 h-3" />
                   {task.comments.length}
                </div>
             )}
           </div>
           <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-500">{task.linkedCustomer}</p>
              {task.tags && task.tags.length > 0 && task.tags.map(tag => (
                 <span key={tag} className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded-sm font-medium">{tag}</span>
              ))}
           </div>
        </td>
        <td className={cn("px-6 py-4 flex items-center gap-2 text-sm", isOverdue ? "text-red-600 font-semibold" : "text-slate-600")}>
           {isOverdue ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CalendarIcon className="w-4 h-4 text-slate-400" />}
           {new Date(task.dueDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 text-sm font-medium">
           <span className={cn("px-2.5 py-1 rounded-full text-xs whitespace-nowrap", getPriorityColor(task.priority))}>
             {getPriorityLabel(task.priority, t)}
           </span>
        </td>
        <td className="px-6 py-4">
            {task.syncStatus === 'synced' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
            )}
        </td>
      </tr>
      {isExpanded && (
         <tr className="bg-slate-50/50">
            <td colSpan={5} className="px-6 py-4 border-b border-slate-200">
               <div className="max-w-3xl ml-12">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">{t('Kommentare & Verlauf', 'Comments & History')}</h4>
                  
                  {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-3 mb-4">
                       {task.comments.map(c => (
                          <div key={c.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm text-sm">
                             <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-slate-800">{t('Notiz', 'Note')}</span>
                                <span className="text-xs text-slate-400">{new Date(c.timestamp).toLocaleString()}</span>
                             </div>
                             <p className="text-slate-600">{c.text}</p>
                          </div>
                       ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 mb-4 italic">{t('Keine Kommentare vorhanden.', 'No comments yet.')}</p>
                  )}
                  
                  <form onSubmit={handleAddComment} className="flex gap-2">
                     <input 
                        type="text" 
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder={t('Neuen Kommentar hinzufügen...', 'Add new comment...')}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:border-orange-500 bg-white"
                     />
                     <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 bg-slate-900 text-white rounded text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50">
                        {t('Speichern', 'Save')}
                     </button>
                  </form>
               </div>
            </td>
         </tr>
      )}
    </>
  );
};

export function TasksView() {
  const { t } = useI18n();
  const { tasks, updateTaskStatus } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'calendar'>('list');
  const [groupBy, setGroupBy] = useState<'none' | 'priority' | 'dueDate'>('none');
  const [filterTag, setFilterTag] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTasks = tasks.filter(t => 
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.linkedCustomer.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterTag === '' || (t.tags && t.tags.includes(filterTag)))
  );

  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || []))).sort();

  const TASK_STATUSES = [
    { id: 'open', title: t('Offen', 'Open'), color: 'bg-slate-200' },
    { id: 'in_progress', title: t('In Bearbeitung', 'In Progress'), color: 'bg-blue-200' },
    { id: 'waiting', title: t('Wartend', 'Waiting'), color: 'bg-orange-200' },
    { id: 'completed', title: t('Abgeschlossen', 'Completed'), color: 'bg-emerald-200' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return t('Hoch', 'High');
      case 'medium': return t('Mittel', 'Medium');
      case 'low': return t('Niedrig', 'Low');
      default: return priority;
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, statusId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, statusId as any);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Aufgaben suchen...", "Search tasks...")}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </form>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium text-slate-700 max-w-[150px]"
            >
               <option value="">{t('Alle Kategorien', 'All Categories')}</option>
               {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            
            <select 
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium text-slate-700"
            >
               <option value="none">{t('Normale Ansicht', 'Default View')}</option>
               <option value="priority">{t('Nach Priorität gruppieren', 'Group by Priority')}</option>
               <option value="dueDate">{t('Nach Fälligkeit gruppieren', 'Group by Due Date')}</option>
            </select>
          </div>
          
          <div className="flex bg-slate-200 p-1 rounded-lg">
             <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded-md transition-colors", viewMode === 'list' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}><List className="w-4 h-4" /></button>
             <button onClick={() => setViewMode('board')} className={cn("p-1.5 rounded-md transition-colors", viewMode === 'board' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}><LayoutGrid className="w-4 h-4" /></button>
             <button onClick={() => setViewMode('calendar')} className={cn("p-1.5 rounded-md transition-colors", viewMode === 'calendar' ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700")}><CalendarIcon className="w-4 h-4" /></button>
          </div>
          
          <button onClick={() => setIsCreateOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <Plus className="h-4 w-4" />
            {t('Aufgabe erstellen', 'Create Task')}
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                 <tr>
                    <th className="px-6 py-4">{t('Status', 'Status')}</th>
                    <th className="px-6 py-4">{t('Titel & Kunde', 'Title & Customer')}</th>
                    <th className="px-6 py-4">{t('Wiedervorlage', 'Due Date')}</th>
                    <th className="px-6 py-4">{t('Priorität', 'Priority')}</th>
                    <th className="px-6 py-4">{t('Sync', 'Sync')}</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {filteredTasks.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">{t('Keine Aufgaben gefunden.', 'No tasks found.')}</td></tr>
                 ) : groupBy === 'none' ? (
                    filteredTasks.map(task => (
                       <TaskRow key={task.id} task={task} />
                    ))
                 ) : (
                    (Object.entries(
                      filteredTasks.reduce((groups, task) => {
                         let key = '';
                         if (groupBy === 'priority') {
                            key = getPriorityLabel(task.priority);
                         } else if (groupBy === 'dueDate') {
                            key = new Date(task.dueDate).toLocaleDateString();
                         }
                         if (!groups[key]) groups[key] = [];
                         groups[key].push(task);
                         return groups;
                      }, {} as Record<string, Task[]>)
                    ) as [string, Task[]][]).map(([groupKey, tasksInGroup]) => (
                      <React.Fragment key={groupKey}>
                         <tr className="bg-slate-50 border-y border-slate-200">
                             <td colSpan={5} className="px-6 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider">{groupKey} ({tasksInGroup.length})</td>
                         </tr>
                         {tasksInGroup.map(task => (
                             <TaskRow key={task.id} task={task} />
                         ))}
                      </React.Fragment>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      )}

      {viewMode === 'board' && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {TASK_STATUSES.map((status) => {
            const statusTasks = filteredTasks.filter(t => t.status === status.id);
            return (
              <div 
                key={status.id} 
                className="min-w-[320px] w-[320px] bg-slate-100 rounded-xl flex flex-col border border-slate-200"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status.id)}
              >
                <div className="p-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${status.color}`}></span>
                      <h3 className="font-bold text-slate-700 text-sm">{status.title}</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm">{statusTasks.length}</span>
                  </div>
                </div>
                
                <div className="flex-1 p-3 flex flex-col gap-3 min-h-[200px]">
                  {statusTasks.map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:border-orange-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors text-sm">{task.title}</p>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{task.linkedCustomer}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-500">
                          <div className="flex items-center gap-1.5" title="Wiedervorlage">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          {task.hasDocuments && (
                            <FileText className="w-3.5 h-3.5" title="Dokumente angehängt" />
                          )}
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", getPriorityColor(task.priority))}>
                             {getPriorityLabel(task.priority)}
                          </span>
                          {task.syncStatus === 'synced' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Synchronisiert" />
                          ) : (
                            <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" title="Wird synchronisiert..." />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {statusTasks.length === 0 && (
                     <div className="text-center text-xs text-slate-400 py-6 border-2 border-dashed border-slate-200 rounded-lg">
                        {t('Keine Aufgaben', 'No tasks')}
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'calendar' && (
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <CalendarIcon className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">{t('Kalender Ansicht', 'Calendar View')}</h3>
            <p className="text-slate-500 mt-2 max-w-sm">
               {t('Klicken Sie auf den Button, um den Systemkalender zu öffnen oder Aufgaben nach Datum gefiltert anzuzeigen.', 'Click the button to open system calendar or view tasks filtered by date.')}
            </p>
            <button className="mt-6 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
               {t('In Systemkalender öffnen', 'Open in System Calendar')}
            </button>
         </div>
      )}

      <CreateTaskOverlay isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
