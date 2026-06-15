import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useCrm, SwitchingProcess, SwitchingStatus } from '../lib/CrmContext';
import { FileUp, FileText, CheckCircle2, Clock, RefreshCw, UploadCloud, Building2, Shield, X, AlertCircle, ShieldCheck, Send, Check, ChevronDown, SlidersHorizontal, Download, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { DocumentPreviewOverlay } from './DocumentPreviewOverlay';

const BROKERS = [
  { initials: 'SB', name: 'S. Berger', role: 'Makler' },
  { initials: 'MK', name: 'M. Koch', role: 'Makler' },
  { initials: 'AD', name: 'A. Direktor', role: 'Vertriebsleiter' },
  { initials: 'JW', name: 'J. Wenger', role: 'Innendienst' },
  { initials: 'LF', name: 'L. Frei', role: 'Makler' }
];

const STATUS_CONFIG: Record<SwitchingStatus, { label: string; color: string; icon: React.ComponentType<any> }> = {
  identifiziert: { 
    label: 'Identifiziert', 
    color: 'bg-slate-100 text-slate-700 border-slate-200', 
    icon: FileText 
  },
  angebot_erstellt: { 
    label: 'Angebot erstellt', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    icon: ShieldCheck 
  },
  kunde_informiert: { 
    label: 'Kunde informiert', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    icon: Send 
  },
  unterlagen_eingegangen: { 
    label: 'Unterlagen eingegangen', 
    color: 'bg-teal-50 text-teal-700 border-teal-200', 
    icon: CheckCircle2 
  },
  umdeckung_beantragt: { 
    label: 'Umdeckung beantragt', 
    color: 'bg-orange-50 text-orange-700 border-orange-200', 
    icon: RefreshCw 
  },
  abgeschlossen: { 
    label: 'Abgeschlossen', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    icon: CheckCircle2 
  },
  abgelehnt: { 
    label: 'Abgelehnt', 
    color: 'bg-red-50 text-red-700 border-red-200', 
    icon: XCircle 
  }
};

export function SwitchingParkingLotView() {
  const { t } = useI18n();
  const { switchingProcesses, customers, addSwitchingProcess, updateSwitchingProcess } = useCrm();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalProvider, setOriginalProvider] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [insuranceType, setInsuranceType] = useState('');
  const [oldPremium, setOldPremium] = useState('');
  const [newPremium, setNewPremium] = useState('');
  const [assignedTo, setAssignedTo] = useState('SB');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [previewFileName, setPreviewFileName] = useState<string | null>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<string>('Alle');

  // Drawer / Editing state
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [editAssignedTo, setEditAssignedTo] = useState('SB');
  const [editStatus, setEditStatus] = useState<SwitchingStatus>('identifiziert');
  const [editNotes, setEditNotes] = useState('');
  const [isBrokerDropdownOpen, setIsBrokerDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const selectedProcess = switchingProcesses.find(p => p.id === selectedProcessId);

  const openDrawer = (process: SwitchingProcess) => {
    setSelectedProcessId(process.id);
    setEditAssignedTo(process.assignedTo || 'SB');
    setEditStatus(process.status);
    setEditNotes(process.notes || '');
    setIsBrokerDropdownOpen(false);
    setIsStatusDropdownOpen(false);
  };

  const handleSaveChanges = () => {
    if (!selectedProcessId) return;
    
    updateSwitchingProcess(selectedProcessId, {
      assignedTo: editAssignedTo,
      status: editStatus,
      notes: editNotes
    });
    
    setSelectedProcessId(null);
    showInfo(t('Änderungen erfolgreich gespeichert.', 'Changes successfully saved.'));
  };

  const showInfo = (msg: string) => {
    // We can use a simple browser alert or custom logs for feedback.
    alert(msg);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedFile || !originalProvider || !insuranceType) return;
    
    setIsSubmitting(true);
    const customer = customers.find(c => c.id === selectedCustomerId);

    setTimeout(() => {
      addSwitchingProcess({
        customerId: selectedCustomerId,
        customerName: customer?.name || 'Unbekannt',
        originalProvider,
        newProvider: newProvider || 'Allianz',
        insuranceType,
        status: 'identifiziert',
        fileName: selectedFile.name,
        oldPremium: oldPremium || '1.000 €/J',
        newPremium: newPremium || '800 €/J',
        assignedTo: assignedTo || 'SB',
        notes: ''
      });
      setIsSubmitting(false);
      setIsUploadOpen(false);
      setSelectedFile(null);
      setSelectedCustomerId('');
      setOriginalProvider('');
      setNewProvider('');
      setInsuranceType('');
      setOldPremium('');
      setNewPremium('');
      setAssignedTo('SB');
    }, 1000);
  };

  // Stats calculation
  const offeneCount = switchingProcesses.filter(p => p.status !== 'abgeschlossen' && p.status !== 'abgelehnt').length;
  const abgeschlossenCount = switchingProcesses.filter(p => p.status === 'abgeschlossen').length;
  const imProzessCount = switchingProcesses.filter(p => p.status !== 'identifiziert' && p.status !== 'abgeschlossen' && p.status !== 'abgelehnt').length;
  const abgelehntCount = switchingProcesses.filter(p => p.status === 'abgelehnt').length;

  const tabToStatusMap: Record<string, string> = {
    'Alle': 'all',
    'Identifiziert': 'identifiziert',
    'Angebot erstellt': 'angebot_erstellt',
    'Kunde informiert': 'kunde_informiert',
    'Unterlagen eingegangen': 'unterlagen_eingegangen',
    'Umdeckung beantragt': 'umdeckung_beantragt',
    'Abgeschlossen': 'abgeschlossen',
    'Abgelehnt': 'abgelehnt',
  };

  const filteredProcesses = switchingProcesses.filter(process => {
    const targetStatus = tabToStatusMap[activeFilterTab];
    if (targetStatus === 'all') return true;
    return process.status === targetStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-600" />
            {t('Vertragsumdecker', 'Policy Switcher')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('Übersicht und Bearbeitung aller Verträge im Umdeckungsprozess.', 'Overview and processing of all policies in switching process.')}
          </p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
        >
          <FileUp className="w-4 h-4" />
          {t('Police hochladen & markieren', 'Upload & Mark Policy')}
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Offene Umdeckungen */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Offene Umdeckungen', 'Open Switchings')}</span>
            <p className="text-3xl font-extrabold text-slate-900">{offeneCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Abgeschlossen */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Abgeschlossen', 'Completed')}</span>
            <p className="text-3xl font-extrabold text-slate-900">{abgeschlossenCount}</p>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Im Prozess */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Im Prozess', 'In Progress')}</span>
            <p className="text-3xl font-extrabold text-slate-900">{imProzessCount}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Abgelehnt */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Abgelehnt', 'Rejected')}</span>
            <p className="text-3xl font-extrabold text-slate-900">{abgelehntCount}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-red-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter tabs & action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {Object.keys(tabToStatusMap).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                activeFilterTab === tab
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => showInfo(t('Erweiterte Filteroptionen geöffnet.', 'Advanced filters opened.'))}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            {t('Filter', 'Filter')}
          </button>
          <button 
            onClick={() => showInfo(t('Export erfolgreich gestartet.', 'Export successfully started.'))}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            {t('Export', 'Export')}
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">{t('VU-NR.', 'VU-No.')}</th>
                <th className="p-4">{t('KUNDE', 'Customer')}</th>
                <th className="p-4">{t('PRODUKT', 'Product')}</th>
                <th className="p-4">{t('ALTER VERSICHERER', 'Old Insurer')}</th>
                <th className="p-4">{t('NEUER VERSICHERER', 'New Insurer')}</th>
                <th className="p-4">{t('STATUS', 'Status')}</th>
                <th className="p-4">{t('ALT', 'Old')}</th>
                <th className="p-4">{t('NEU', 'New')}</th>
                <th className="p-4">{t('DATUM', 'Date')}</th>
                <th className="p-4">{t('ZUGEWIESEN', 'Assigned')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    {t('Keine passenden Umdeckungen gefunden.', 'No matching switching processes found.')}
                  </td>
                </tr>
              ) : (
                filteredProcesses.map((process) => {
                  const statusInfo = STATUS_CONFIG[process.status];
                  const StatusIcon = statusInfo.icon;
                  const assignedBroker = BROKERS.find(b => b.initials === process.assignedTo) || BROKERS[0];
                  
                  return (
                    <tr key={process.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* VU-Nr (Clickable Link) */}
                      <td className="p-4 font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                        <button 
                          onClick={() => openDrawer(process)}
                          className="hover:underline focus:outline-none cursor-pointer"
                        >
                          {process.vuNr}
                        </button>
                      </td>
                      {/* Kunde */}
                      <td className="p-4 font-extrabold text-slate-905">{process.customerName}</td>
                      {/* Produkt */}
                      <td className="p-4 text-slate-600">{process.insuranceType}</td>
                      {/* Alter Versicherer */}
                      <td className="p-4 text-slate-600">{process.originalProvider}</td>
                      {/* Neuer Versicherer */}
                      <td className="p-4 text-slate-600">{process.newProvider}</td>
                      {/* Status */}
                      <td className="p-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", statusInfo.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      {/* Alt Premium */}
                      <td className="p-4 text-slate-500 font-medium">{process.oldPremium}</td>
                      {/* Neu Premium */}
                      <td className="p-4 text-slate-900 font-extrabold">{process.newPremium}</td>
                      {/* Datum */}
                      <td className="p-4 text-slate-500 text-xs">
                        {new Date(process.createdAt).toLocaleDateString('de-DE')}
                      </td>
                      {/* Zugewiesen */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shadow-inner">
                            {assignedBroker.initials}
                          </span>
                          <span className="text-xs text-slate-700 font-semibold">
                            {assignedBroker.name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer for Details & Edit */}
      <AnimatePresence>
        {selectedProcessId && selectedProcess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProcessId(null)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-[460px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-start gap-2.5">
                  <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600 mt-1">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedProcess.customerName}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{selectedProcess.vuNr}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProcessId(null)}
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors border border-slate-200 bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 space-y-6">
                
                {/* Details Section */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Produkt', 'Product')}</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedProcess.insuranceType}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Umdeckung', 'Switching')}</p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {selectedProcess.originalProvider} → {selectedProcess.newProvider}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Beitrag alt', 'Old Premium')}</p>
                    <p className="font-semibold text-slate-400 line-through mt-0.5">{selectedProcess.oldPremium}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t('Beitrag neu', 'New Premium')}</p>
                    <p className="font-bold text-slate-900 text-base mt-0.5">{selectedProcess.newPremium}</p>
                  </div>
                </div>

                {/* Zuweisung Custom Dropdown */}
                <div className="space-y-1.5 relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Zuweisung', 'Assignment')}</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBrokerDropdownOpen(!isBrokerDropdownOpen);
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                        {editAssignedTo}
                      </span>
                      <span>
                        {BROKERS.find(b => b.initials === editAssignedTo)?.name} · {BROKERS.find(b => b.initials === editAssignedTo)?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {isBrokerDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 text-sm">
                      <div className="p-1">
                        {BROKERS.map(broker => (
                          <button
                            key={broker.initials}
                            type="button"
                            onClick={() => {
                              setEditAssignedTo(broker.initials);
                              setIsBrokerDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between rounded-md transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                                {broker.initials}
                              </span>
                              <span className="font-bold text-slate-800">
                                {broker.name} <span className="text-slate-400 font-medium">· {broker.role}</span>
                              </span>
                            </div>
                            {editAssignedTo === broker.initials && <Check className="w-4 h-4 text-slate-800" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Selection */}
                <div className="space-y-3 relative">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'Status')}</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      setIsBrokerDropdownOpen(false);
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-sm font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                  >
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border", STATUS_CONFIG[editStatus].color)}>
                      {React.createElement(STATUS_CONFIG[editStatus].icon, { className: "w-3.5 h-3.5" })}
                      {STATUS_CONFIG[editStatus].label}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {isStatusDropdownOpen && (
                    <div className="absolute top-[48px] left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 text-sm">
                      <div className="p-1">
                        {(Object.keys(STATUS_CONFIG) as SwitchingStatus[]).map(statusKey => {
                          const config = STATUS_CONFIG[statusKey];
                          return (
                            <button
                              key={statusKey}
                              type="button"
                              onClick={() => {
                                setEditStatus(statusKey);
                                setIsStatusDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between rounded-md transition-colors cursor-pointer"
                            >
                              <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border", config.color)}>
                                {React.createElement(config.icon, { className: "w-3 h-3" })}
                                {config.label}
                              </span>
                              {editStatus === statusKey && <Check className="w-4 h-4 text-slate-800" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Status pills below */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Object.keys(STATUS_CONFIG) as SwitchingStatus[]).map(statusKey => {
                      const config = STATUS_CONFIG[statusKey];
                      const isActive = editStatus === statusKey;
                      return (
                        <button
                          key={statusKey}
                          type="button"
                          onClick={() => setEditStatus(statusKey)}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all cursor-pointer",
                            isActive 
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                          )}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes/Activities */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Notiz / Aktivität', 'Notes / Activities')}</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder={t("z. B. Kunde angerufen, Unterlagen angefordert ...", "e.g. called customer, requested files...")}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white resize-none"
                  />
                </div>

                {/* History list */}
                {selectedProcess.history && selectedProcess.history.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {t('Verlauf', 'History')}
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-100">
                      {selectedProcess.history.map((hist, idx) => (
                        <div key={idx} className="p-3 text-xs flex justify-between items-center text-slate-600 font-semibold">
                          <span>{hist.date}</span>
                          <span className="font-extrabold text-slate-800">{hist.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedProcessId(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                >
                  {t('Abbrechen', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm transition-colors shadow-sm cursor-pointer"
                >
                  {t('Änderungen speichern', 'Save Changes')}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <div>
                   <h2 className="text-xl font-bold text-slate-900">{t('Police zur Umdeckung hochladen', 'Upload Policy for Switching')}</h2>
                   <p className="text-xs text-slate-500 mt-1">{t('Dokument wird ins Kernsystem synchronisiert und der Workflow angestoßen.', 'Document will be synced to core system and workflow triggered.')}</p>
                </div>
                <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors border border-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Kunde auswählen', 'Select Customer')}</label>
                    <select 
                      required
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                    >
                      <option value="">{t('Kunde wählen...', 'Select customer...')}</option>
                      {customers.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Vorversicherer', 'Original Provider')}</label>
                       <input 
                         required
                         type="text"
                         value={originalProvider}
                         onChange={(e) => setOriginalProvider(e.target.value)}
                         placeholder="z.B. HUK-Coburg"
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Neuer Versicherer', 'New Provider')}</label>
                       <input 
                         required
                         type="text"
                         value={newProvider}
                         onChange={(e) => setNewProvider(e.target.value)}
                         placeholder="z.B. Allianz"
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                       />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-1">
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Sparte', 'Insurance Type')}</label>
                       <input 
                         required
                         type="text"
                         value={insuranceType}
                         onChange={(e) => setInsuranceType(e.target.value)}
                         placeholder="z.B. Wohngebäude"
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Beitrag Alt', 'Old Premium')}</label>
                       <input 
                         required
                         type="text"
                         value={oldPremium}
                         onChange={(e) => setOldPremium(e.target.value)}
                         placeholder="e.g. 420 €/J"
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Beitrag Neu', 'New Premium')}</label>
                       <input 
                         required
                         type="text"
                         value={newPremium}
                         onChange={(e) => setNewPremium(e.target.value)}
                         placeholder="e.g. 380 €/J"
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
                       />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Zuweisung', 'Assignee')}</label>
                       <select
                         value={assignedTo}
                         onChange={(e) => setAssignedTo(e.target.value)}
                         className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white cursor-pointer"
                       >
                         {BROKERS.map(b => (
                           <option key={b.initials} value={b.initials}>{b.name} ({b.role})</option>
                         ))}
                       </select>
                     </div>
                  </div>
                </div>

                <div className="pt-2">
                   <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Dokument (Fremdpolice)', 'Document (External Policy)')}</label>
                   <div 
                     className={cn(
                       "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative",
                       isDragging ? "border-orange-500 bg-orange-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100",
                       selectedFile ? "border-emerald-500 bg-emerald-50" : ""
                     )}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                     onDrop={handleDrop}
                   >
                     <input 
                       type="file" 
                       onChange={handleFileChange}
                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       accept=".pdf,.jpg,.jpeg,.png"
                       required
                     />
                     
                     {selectedFile ? (
                        <div className="flex flex-col items-center">
                           <div className="bg-emerald-100 p-3 rounded-full mb-3">
                              <FileText className="w-6 h-6 text-emerald-600" />
                           </div>
                           <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                           <p className="text-xs text-emerald-600 font-medium mt-1">{t('Erfolgreich hinzugefügt', 'Successfully added')}</p>
                        </div>
                     ) : (
                        <>
                           <div className="bg-white p-3 rounded-full shadow-sm border border-slate-200 mb-3">
                              <UploadCloud className="w-6 h-6 text-slate-400" />
                           </div>
                           <p className="text-sm font-bold text-slate-900 mb-1">{t('Klicken oder Datei hierher ziehen', 'Click or drag file here')}</p>
                           <p className="text-xs text-slate-500">PDF, JPG, PNG {t('bis zu', 'up to')} 10MB</p>
                        </>
                     )}
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm cursor-pointer"
                  >
                    {t('Abbrechen', 'Cancel')}
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !selectedFile || !selectedCustomerId || !originalProvider || !insuranceType}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {t('Sync & Workflow starten', 'Sync & Start Workflow')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DocumentPreviewOverlay 
        isOpen={!!previewFileName} 
        onClose={() => setPreviewFileName(null)} 
        fileName={previewFileName} 
      />
    </div>
  );
}
