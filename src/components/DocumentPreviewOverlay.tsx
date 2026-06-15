import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { X, FileText, Download, Printer, Share2 } from 'lucide-react';

interface DocumentPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string | null;
}

export function DocumentPreviewOverlay({ isOpen, onClose, fileName }: DocumentPreviewOverlayProps) {
  const { t } = useI18n();

  if (!isOpen || !fileName) return null;

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
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-none">{fileName}</h3>
                <p className="text-xs text-slate-500 mt-1">{t('Dokumenten-Vorschau', 'Document Preview')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <Share2 className="w-4 h-4" />
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

          {/* Placeholder Content Area */}
          <div className="flex-1 bg-slate-100 p-8 overflow-y-auto flex items-start justify-center">
             <div className="bg-white w-full max-w-2xl min-h-[800px] shadow-sm border border-slate-200 p-12 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <FileText className="w-64 h-64" />
                </div>
                
                <h1 className="text-2xl font-serif text-slate-900 mb-6 border-b pb-4">Versicherungsschein / Anlage</h1>
                
                <div className="space-y-4 text-sm text-slate-700 font-serif leading-relaxed">
                   <div className="flex justify-between items-start mb-12 text-xs text-slate-500">
                     <div>
                       <p>Mustermann GmbH</p>
                       <p>Hauptstraße 123</p>
                       <p>10115 Berlin</p>
                     </div>
                     <div className="text-right">
                       <p>Dokument NR: 491-039-2</p>
                       <p>Datum: 12.05.2023</p>
                     </div>
                   </div>

                   <p className="font-bold text-lg mb-2">Betriebshaftpflichtversicherung</p>
                   <p>Sehr geehrte Damen und Herren,</p>
                   <p>anbei erhalten Sie die Dokumentation zu Ihrem bestehenden Vertrag. Dieses Dokument dient als Nachweis über die aktuell gültigen Deckungssummen und Einschlüsse.</p>
                   
                   <div className="my-8 bg-slate-50 p-6 border border-slate-200 rounded">
                      <table className="w-full text-left font-sans">
                         <tbody className="divide-y divide-slate-200">
                            <tr>
                               <td className="py-2 font-semibold">Versicherer</td>
                               <td className="py-2">BaWü Versicherungs AG</td>
                            </tr>
                            <tr>
                               <td className="py-2 font-semibold">Sparte</td>
                               <td className="py-2">Firmen Haftpflicht</td>
                            </tr>
                            <tr>
                               <td className="py-2 font-semibold">Deckungssumme</td>
                               <td className="py-2">5.000.000 EUR (Pauschal)</td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                   
                   <p>Für Rückfragen steht Ihnen Ihr Betreuer zur Verfügung.</p>
                   
                   <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400">
                      <p>Maschinell erstellt. Dieses Dokument ist ein digitales Platzhalter-Preview.</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
