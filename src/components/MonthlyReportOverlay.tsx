import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { X, FileText, Download, Printer, Share2 } from 'lucide-react';

interface MonthlyReportOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MonthlyReportOverlay({ isOpen, onClose }: MonthlyReportOverlayProps) {
  const { t } = useI18n();
  const currentMonth = new Date().toLocaleString('de-DE', { month: 'long', year: 'numeric' });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-none">{t('Performance Report', 'Performance Report')}</h3>
                <p className="text-xs text-slate-500 mt-1">{currentMonth}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors">
                 <Download className="w-4 h-4" />
                 {t('Als PDF herunterladen', 'Download PDF')}
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Printer className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-300 mx-1"></div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Placeholder PDF Content Area */}
          <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-start justify-center">
             <div className="bg-white w-full max-w-2xl min-h-[800px] shadow-md border py-16 px-12 relative flex flex-col text-slate-800 font-sans">
                
                {/* PDF Header */}
                <div className="flex justify-between items-start border-b-2 border-primary-petrol pb-6 mb-8">
                   <div>
                      <h1 className="text-3xl font-bold tracking-tight text-primary-petrol">Performance Report</h1>
                      <p className="text-lg text-slate-600 mt-1">{currentMonth}</p>
                   </div>
                   <div className="flex flex-col items-end gap-1.5 text-right text-sm text-slate-500">
                      <img 
                         src="/assets/logo_artemis-gruppe.png" 
                         alt="artemis gruppe" 
                         className="h-9 w-auto object-contain mb-1" 
                         style={{ maxHeight: '36px' }}
                      />
                      <p>Agentur-Code: 49201</p>
                      <p>Erstellt: {new Date().toLocaleDateString()}</p>
                   </div>
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200">
                   <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Executive Summary</h2>
                   <div className="grid grid-cols-3 gap-6">
                      <div>
                         <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Courtage & Provision</p>
                         <p className="text-2xl font-bold text-emerald-700">€ 7.400</p>
                         <p className="text-xs text-emerald-600 font-bold mt-1">+148% v. Ziel</p>
                      </div>
                      <div>
                         <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Neugeschäft ARR</p>
                         <p className="text-2xl font-bold text-blue-700">€ 18.250</p>
                         <p className="text-xs text-slate-500 mt-1">12 Neukunden</p>
                      </div>
                      <div>
                         <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Conversion Rate</p>
                         <p className="text-2xl font-bold text-orange-700">42%</p>
                         <p className="text-xs text-orange-600 font-bold mt-1">+5% vs. Vormonat</p>
                      </div>
                   </div>
                </div>
                
                {/* Detailed Table */}
                <div className="mb-8">
                   <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Spartenaufteilung</h2>
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-600 uppercase tracking-wider">
                         <tr>
                            <th className="py-2 px-3">Sparte</th>
                            <th className="py-2 px-3">Anzahl</th>
                            <th className="py-2 px-3 text-right">Volumen</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Gewerbe (bKV, bAV, Haftpflicht)</td>
                            <td className="py-3 px-3">8</td>
                            <td className="py-3 px-3 text-right font-medium">€ 12.400</td>
                         </tr>
                         <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Biometrie & Leben</td>
                            <td className="py-3 px-3">15</td>
                            <td className="py-3 px-3 text-right font-medium">€ 4.250</td>
                         </tr>
                         <tr>
                            <td className="py-3 px-3 font-semibold text-slate-900">Sach Privat</td>
                            <td className="py-3 px-3">22</td>
                            <td className="py-3 px-3 text-right font-medium">€ 1.600</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
                
                {/* Footer Area */}
                <div className="mt-auto pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
                   <p>Automatisch generierter Report (artemis CRM System)</p>
                   <p>Für Rückfragen wenden Sie sich an Ihren Vertriebsleiter.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
