import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useCrm } from '../lib/CrmContext';
import { Euro, Users, TrendingUp, RefreshCw, Target, CheckCircle2, ShieldAlert, Download, Landmark, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../lib/utils';

interface CommissionRun {
  id: string;
  monthYear: string;
  amount: string;
  brokerNo: string;
  status: 'ready' | 'paid';
}

const INITIAL_RUNS: CommissionRun[] = [
  { id: 'RUN-2026-001', monthYear: '05/2026', amount: '€14,850.00', brokerNo: 'BR-9842', status: 'ready' },
  { id: 'RUN-2026-002', monthYear: '05/2026', amount: '€9,420.00', brokerNo: 'BR-1104', status: 'paid' },
  { id: 'RUN-2026-003', monthYear: '04/2026', amount: '€18,120.00', brokerNo: 'BR-9842', status: 'paid' },
  { id: 'RUN-2026-004', monthYear: '04/2026', amount: '€11,350.00', brokerNo: 'BR-1104', status: 'paid' },
  { id: 'RUN-2026-005', monthYear: '03/2026', amount: '€15,400.00', brokerNo: 'BR-9842', status: 'paid' },
];

export function SalesCockpit() {
  const { t } = useI18n();
  const { userRole, setUserRole } = useCrm();
  const [runs, setRuns] = useState<CommissionRun[]>(INITIAL_RUNS);
  const [chartMode, setChartMode] = useState<'value' | 'percentage'>('value');
  const [isExporting, setIsExporting] = useState(false);

  const handleApprove = (id: string) => {
    setRuns(prev => prev.map(run => run.id === id ? { ...run, status: 'paid' } : run));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  // Sparte Chart Data
  const sparteDataValue = [
    { name: 'PKV', value: 84000, target: 80000 },
    { name: t('Leben / Rente', 'Life / Pension'), value: 52000, target: 50000 },
    { name: 'KFZ', value: 38000, target: 40000 },
    { name: t('Gewerbe', 'Commercial'), value: 46000, target: 45000 },
    { name: 'BU', value: 24000, target: 20000 },
    { name: t('Sonstige', 'Others'), value: 12000, target: 10000 },
  ];

  const sparteDataPercentage = sparteDataValue.map(item => {
    const total = sparteDataValue.reduce((sum, d) => sum + d.value, 0);
    return {
      name: item.name,
      value: Math.round((item.value / total) * 100),
    };
  });

  // Restricted Access Guard UI
  if (userRole !== 'administrator') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-12 text-center max-w-xl mx-auto space-y-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto border border-red-100">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{t('Zugriff verweigert', 'Access Denied')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t(
              'Das Sales Cockpit ist exklusiv für Administratoren freigegeben. Standard-Mitarbeiter und Makler haben keinen Zugriff auf Provisionsläufe und sensible Bestandskennzahlen.',
              'The Sales Cockpit is restricted to administrators. Standard employees and brokers do not have access to commission runs and sensitive portfolio metrics.'
            )}
          </p>
        </div>
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => setUserRole('administrator')}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
          >
            {t('Rolle zu Administrator wechseln', 'Switch Role to Administrator')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-orange-600" />
            {t('Sales Cockpit (Admin)', 'Sales Cockpit (Admin)')}
          </h2>
          <p className="text-slate-500">{t('Provisionsfreigaben und Bestandsverteilung für Holding/Agentur.', 'Commission approvals and portfolio shares for agency.')}</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {t('Provisionsbericht exportieren', 'Export Commissions Report')}
        </button>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Bestandsgröße */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Euro className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Gesamtbestand', 'Total Portfolio')}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('Bestandsgröße (Jahresprämie)', 'Portfolio Size (Annual Premium)')}</p>
            <p className="text-3xl font-extrabold text-slate-900">€ 256,000</p>
          </div>
        </div>

        {/* Aktive Mandate */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Users className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4.2% MoM</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('Aktive Mandate', 'Active Mandates')}</p>
            <p className="text-3xl font-extrabold text-slate-900">142</p>
          </div>
        </div>

        {/* Provision YTD */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <TrendingUp className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">92.4% {t('Planerreichung', 'Plan Achievement')}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('Provisionen YTD', 'Commissions YTD')}</p>
            <p className="text-3xl font-extrabold text-slate-900">€ 86,400</p>
          </div>
        </div>

        {/* Stornoquote */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <Target className="w-5 h-5 text-slate-700" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Holding Avg: 1.8%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('Stornoquote', 'Cancellation Rate')}</p>
            <p className="text-3xl font-extrabold text-slate-900">1.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sparte charts */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t('Bestandsverteilung nach Sparte', 'Portfolio Distribution by Sparte')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t('Aktuelles Portfolio-Volumen in Euro oder Prozent.', 'Current portfolio volume in Euros or percentages.')}</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setChartMode('value')}
                className={cn('px-2.5 py-1 text-xs font-bold rounded transition-colors', chartMode === 'value' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
              >
                €
              </button>
              <button
                onClick={() => setChartMode('percentage')}
                className={cn('px-2.5 py-1 text-xs font-bold rounded transition-colors', chartMode === 'percentage' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500')}
              >
                %
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartMode === 'value' ? sparteDataValue : sparteDataPercentage}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={value => (chartMode === 'value' ? `€${(value / 1000).toFixed(0)}k` : `${value}%`)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [chartMode === 'value' ? `€ ${value.toLocaleString()}` : `${value}%`, t('Volumen', 'Volume')]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="value" name={t('Ist-Bestand', 'Actual')} fill="#00677F" radius={[4, 4, 0, 0]} />
                {chartMode === 'value' && <Bar dataKey="target" name={t('Soll-Ziel', 'Target')} fill="#78BE20" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick info right side */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">{t('Bestands-Zusammenfassung', 'Portfolio Summary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">PKV</span>
                <span className="font-bold text-slate-900">€84,000 (33%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">{t('Gewerbe', 'Commercial')}</span>
                <span className="font-bold text-slate-900">€46,000 (18%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Leben / Rente</span>
                <span className="font-bold text-slate-900">€52,000 (20%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">KFZ</span>
                <span className="font-bold text-slate-900">€38,000 (15%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">BU</span>
                <span className="font-bold text-slate-900">€24,000 (9%)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Sonstige</span>
                <span className="font-bold text-slate-900">€12,000 (5%)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 bg-slate-50 p-4 rounded-xl">
             <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-1">Mitarbeiter-Rolle wechseln</h4>
             <p className="text-[10px] text-slate-500 mb-3">Teste die Zugriffsbeschränkung aus Mitarbeiter-Sicht:</p>
             <button
               onClick={() => setUserRole('makler')}
               className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
             >
               Zu Rolle "Makler" wechseln
             </button>
          </div>
        </div>
      </div>

      {/* Commission Run Releases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900">{t('Provisionsfreigaben', 'Commission Run Releases')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('Ausstehende Payouts zur Prüfung und Freigabe.', 'Pending payouts awaiting review and approval.')}</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Lauf Nr / Code', 'Run No')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Monat / Jahr', 'Month / Year')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Betrag', 'Amount')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Makler-Nr', 'Broker No')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'Status')}</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('Aktionen', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{run.id}</td>
                  <td className="p-4 font-semibold text-slate-700">{run.monthYear}</td>
                  <td className="p-4 font-bold text-slate-950">{run.amount}</td>
                  <td className="p-4 text-slate-600">{run.brokerNo}</td>
                  <td className="p-4">
                    {run.status === 'ready' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-amber-50 text-amber-700 border-amber-200">
                        {t('Bereit zur Freigabe', 'Ready for Release')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {t('Ausgezahlt', 'Paid Out')}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {run.status === 'ready' ? (
                      <button
                        onClick={() => handleApprove(run.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      >
                        {t('Freigeben', 'Release Payout')}
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium text-xs flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {t('Erledigt', 'Completed')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
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
              <h3 className="font-bold text-slate-900 mb-1">{t('Kompiliere Bericht...', 'Compiling report...')}</h3>
              <p className="text-xs text-slate-500">{t('Generiere Provisionsdaten des aktuellen Monats.', 'Generating commissions statement.')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
