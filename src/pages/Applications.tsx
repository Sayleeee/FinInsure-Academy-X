import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { ClipboardList, Search, Download, User, CheckCircle2, AlertCircle, RefreshCw, X, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface Application {
  id: string;
  appNo: string;
  customerName: string;
  productName: string;
  status: 'submitted' | 'underwriting' | 'issued' | 'awaiting_documents' | 'rejected';
  premium: string;
  date: string;
  assignedBroker: string;
}

const INITIAL_APPLICATIONS: Application[] = [
  { id: 'a1', appNo: 'ANT-2026-001', customerName: 'TechNova Solutions GmbH', productName: 'Gewerbe & Cyber Risk', status: 'underwriting', premium: '€3,800/J', date: '2026-06-04', assignedBroker: 'Gawain MacMilan' },
  { id: 'a2', appNo: 'ANT-2026-002', customerName: 'Markus Weber', productName: 'Private Krankenversicherung (PKV Premium)', status: 'issued', premium: '€6,200/J', date: '2026-06-02', assignedBroker: 'Sarah Consultant' },
  { id: 'a3', appNo: 'ANT-2026-003', customerName: 'Schmidt Handwerk', productName: 'Betriebshaftpflicht Komfort', status: 'awaiting_documents', premium: '€1,200/J', date: '2026-05-28', assignedBroker: 'Gawain MacMilan' },
  { id: 'a4', appNo: 'ANT-2026-004', customerName: 'Dr. Anna Müller', productName: 'D&O Versicherung Standard', status: 'submitted', premium: '€4,500/J', date: '2026-06-05', assignedBroker: 'Sarah Consultant' },
  { id: 'a5', appNo: 'ANT-2026-005', customerName: 'Logistics Pro KG', productName: 'Flotten-Kraftfahrt-Haftpflicht', status: 'rejected', premium: '€12,500/J', date: '2026-05-15', assignedBroker: 'John Administrator' },
  { id: 'a6', appNo: 'ANT-2026-006', customerName: 'Müller & Söhne GmbH', productName: 'Inhaltsversicherung', status: 'issued', premium: '€2,100/J', date: '2026-05-20', assignedBroker: 'Sarah Consultant' },
  { id: 'a7', appNo: 'ANT-2026-007', customerName: 'Sabine Becker', productName: 'Berufsunfähigkeits-Schutz', status: 'underwriting', premium: '€1,800/J', date: '2026-06-01', assignedBroker: 'Gawain MacMilan' },
];

const BROKERS = ['Gawain MacMilan', 'Sarah Consultant', 'John Administrator', 'Michael Accountant'];

export function Applications() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleBrokerChange = (id: string, newBroker: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, assignedBroker: newBroker } : app));
    showInfo(t('Zuweisung erfolgreich aktualisiert.', 'Assignment successfully updated.'));
  };

  const handleStatusChange = (id: string, newStatus: Application['status']) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    showInfo(t('Antragsstatus aktualisiert.', 'Application status updated.'));
  };

  const simulateExport = (type: 'csv' | 'pdf') => {
    setIsExporting(type);
    setTimeout(() => {
      setIsExporting(null);
      showInfo(t(`Export als ${type.toUpperCase()} erfolgreich gestartet.`, `Export as ${type.toUpperCase()} successfully started.`));
    }, 1500);
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.appNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200">{t('Eingereicht', 'Submitted')}</span>;
      case 'underwriting':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">{t('Risikoprüfung', 'Underwriting')}</span>;
      case 'issued':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">{t('Police erstellt', 'Issued')}</span>;
      case 'awaiting_documents':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-orange-50 text-orange-700 border-orange-200">{t('Wartet Unterlagen', 'Awaiting Docs')}</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-red-50 text-red-700 border-red-200">{t('Abgelehnt', 'Rejected')}</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-600" />
            {t('Antragsverwaltung', 'Applications Management')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('Gruppen- und maklerübergreifende Übersicht aller eingereichten Anträge.', 'Agency-wide overview of all submitted policy applications.')}
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            disabled={isExporting !== null}
            onClick={() => simulateExport('csv')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            {isExporting === 'csv' ? <RefreshCw className="w-4 h-4 animate-spin text-slate-500" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            {t('CSV Export', 'CSV Export')}
          </button>
          <button 
            disabled={isExporting !== null}
            onClick={() => simulateExport('pdf')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            {isExporting === 'pdf' ? <RefreshCw className="w-4 h-4 animate-spin text-slate-500" /> : <FileText className="w-4 h-4 text-red-500" />}
            {t('PDF Bericht', 'PDF Report')}
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Anträge, Kunden, Produkte suchen...", "Search applications, customers, products...")}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
          />
        </div>
        
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: t('Alle', 'All') },
            { id: 'submitted', label: t('Eingereicht', 'Submitted') },
            { id: 'underwriting', label: t('Risikoprüfung', 'Underwriting') },
            { id: 'issued', label: t('Police erstellt', 'Issued') },
            { id: 'awaiting_documents', label: t('Wartet Unterlagen', 'Awaiting Docs') },
            { id: 'rejected', label: t('Abgelehnt', 'Rejected') }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap",
                statusFilter === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Antrags-Nr', 'Application No')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Kunde', 'Customer')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Produkt / Sparte', 'Product / Type')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Jahresbeitrag', 'Premium')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'Status')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Erstellungsdatum', 'Created Date')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Makler / Mitarbeiter', 'Assigned Broker')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('Aktionen', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-sm">
                    {t('Keine Anträge gefunden.', 'No applications found.')}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-sm">{app.appNo}</td>
                    <td className="p-4 font-semibold text-slate-800 text-sm">{app.customerName}</td>
                    <td className="p-4 text-slate-600 text-sm">{app.productName}</td>
                    <td className="p-4 font-bold text-slate-900 text-sm">{app.premium}</td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4 text-slate-500 text-xs">{new Date(app.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={app.assignedBroker}
                          onChange={(e) => handleBrokerChange(app.id, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-md p-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                        >
                          {BROKERS.map(broker => (
                            <option key={broker} value={broker}>{broker}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                        className="text-xs border border-slate-200 rounded-md p-1 bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                      >
                        <option value="submitted">{t('Eingereicht', 'Submitted')}</option>
                        <option value="underwriting">{t('Risikoprüfung', 'Underwriting')}</option>
                        <option value="issued">{t('Police erstellt', 'Issued')}</option>
                        <option value="awaiting_documents">{t('Wartet Unterlagen', 'Awaiting Docs')}</option>
                        <option value="rejected">{t('Abgelehnt', 'Rejected')}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Export Loader Overlay */}
      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-white rounded-xl p-8 max-w-xs text-center shadow-xl border border-slate-100 flex flex-col items-center">
              <RefreshCw className="w-10 h-10 text-orange-600 animate-spin mb-4" />
              <h3 className="font-bold text-slate-900 mb-1">{t('Generiere Datei...', 'Generating file...')}</h3>
              <p className="text-xs text-slate-500">{t('Bitte warten Sie, während die Daten aufbereitet werden.', 'Please wait while we compile the dataset.')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
