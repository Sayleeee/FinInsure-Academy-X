import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { X, TrendingUp, Users, Target, RefreshCw, Euro, ArrowRight, CheckCircle2, ChevronRight, Activity, CalendarDays, BarChart4 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface SalesCockpitDetailOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  detailType: string | null;
}

export function SalesCockpitDetailOverlay({ isOpen, onClose, detailType }: SalesCockpitDetailOverlayProps) {
  const { t } = useI18n();
  const [drillDownLevel, setDrillDownLevel] = useState<number>(1);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  if (!isOpen || !detailType) return null;

  const handleSubItemClick = (item: string) => {
    setSelectedSubItem(item);
    setDrillDownLevel(2);
  };

  const resetDrillDown = () => {
    setDrillDownLevel(1);
    setSelectedSubItem(null);
  };

  const renderContent = () => {
    if (drillDownLevel === 2 && selectedSubItem) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={resetDrillDown} className="text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors">
              {t('Zurück zur Übersicht', 'Back to Overview')}
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-bold text-slate-900">{selectedSubItem}</span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div>
                   <h4 className="text-lg font-bold text-slate-900">{selectedSubItem} - Detailanalyse</h4>
                   <p className="text-sm text-slate-500 mt-1">Transaktions- und Vertragsebene</p>
                </div>
                <div className="flex gap-2">
                   <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors">CSV Export</button>
                   <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors">PDF Report</button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-y border-slate-200">
                      <tr>
                         <th className="px-4 py-3">Datum</th>
                         <th className="px-4 py-3">Transaktion / Kunde</th>
                         <th className="px-4 py-3">Produkt / Sparte</th>
                         <th className="px-4 py-3 text-right">Wert</th>
                         <th className="px-4 py-3 text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {[1, 2, 3, 4, 5].map((i) => (
                         <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-slate-500">12.05.2026</td>
                            <td className="px-4 py-3 font-semibold text-slate-900">Mustermann GmbH & Co. KG</td>
                            <td className="px-4 py-3 text-slate-600">Betriebshaftpflicht Optima</td>
                            <td className="px-4 py-3 font-bold text-slate-900 text-right">€ 1.{i}50,00</td>
                            <td className="px-4 py-3 text-center">
                               <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold">Gebucht</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      );
    }

    // Level 1: Overview based on type
    switch (detailType) {
      case 'earnings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('Detailauswertung: Abgerechnete Courtagen', 'Detailed Analysis: Settled Commissions')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sach & Gewerbe</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">€ 4.200</p>
                  <p className="text-sm text-emerald-600 font-medium mt-1">+12% vs. Vormonat</p>
               </div>
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leben & Biometrie</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">€ 2.800</p>
                  <p className="text-sm text-emerald-600 font-medium mt-1">+5% vs. Vormonat</p>
               </div>
               <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kranken</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">€ 400</p>
                  <p className="text-sm text-amber-600 font-medium mt-1">-2% vs. Vormonat</p>
               </div>
            </div>

            <h4 className="font-bold text-slate-900 mb-4">{t('Top Courtage-Treiber diesen Monat', 'Top Commission Drivers this month')}</h4>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="divide-y divide-slate-100">
                  {['Neuabschluss D&O Versicherung (TechCorp)', 'Flottenversicherung Rahmenvertrag', 'Cyberversicherung Erweiterung'].map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group transition-colors" onClick={() => handleSubItemClick(item)}>
                        <div className="flex items-center gap-3">
                           <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
                              <Euro className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item}</p>
                              <p className="text-xs text-slate-500">Klick für Transaktionsdetails</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                     </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'switches':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('Detailauswertung: Umdeckungen', 'Detailed Analysis: Switches')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <RefreshCw className="w-32 h-32" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Automatisierte Umdeckungen</h4>
                  <p className="text-3xl font-bold text-slate-900">24 <span className="text-lg text-slate-500 font-normal">Verträge</span></p>
                  <div className="mt-4 flex gap-2">
                     <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded font-bold">18 Abgeschlossen</span>
                     <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded font-bold">6 In Bearbeitung</span>
                  </div>
               </div>
               
               <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Aufteilung nach Sparten</h4>
                  <div className="space-y-3">
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                           <span>KFZ (Flotte & Einzel)</span>
                           <span>45%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '45%' }}></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                           <span>Betriebshaftpflicht</span>
                           <span>35%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '35%' }}></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                           <span>Gebäude / Inhalt</span>
                           <span>20%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '20%' }}></div></div>
                     </div>
                  </div>
               </div>
            </div>

            <h4 className="font-bold text-slate-900 mb-4">{t('Aktuell in Bearbeitung (Drill-Down)', 'Currently Processing')}</h4>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="divide-y divide-slate-100">
                  {['Schreinerei Müller - Gebündelte Werkspolice', 'TechStartup GmbH - D&O', 'Spedition Schmidt - Flotte (32 Fzg)'].map((item, idx) => (
                     <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer group transition-colors" onClick={() => handleSubItemClick(item)}>
                        <div className="flex items-center gap-3">
                           <div className="bg-amber-50 text-amber-600 p-2 rounded-lg">
                              <RefreshCw className="w-5 h-5 animate-spin-slow" />
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{item}</p>
                              <p className="text-xs text-slate-500">Wartet auf Policierung im Kernsystem</p>
                           </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                     </div>
                  ))}
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart4 className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">Detailauswertung für {detailType}</h3>
            <p className="text-slate-500 max-w-sm">Klicken Sie auf einen Eintrag, um tiefer in die Daten vorzustoßen (Drill-Down Funktionalität).</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-slate-700" />
               </div>
               <div>
                 <h2 className="text-xl font-bold text-slate-900">{t('Performance Engine', 'Performance Engine')}</h2>
                 <p className="text-sm text-slate-500 uppercase tracking-widest">{t('Analyse & Insights', 'Analysis & Insights')}</p>
               </div>
            </div>
            <button 
              onClick={() => {
                resetDrillDown();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8">
             {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
