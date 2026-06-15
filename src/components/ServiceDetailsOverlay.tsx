import { motion, AnimatePresence } from 'motion/react';
import { X, PlayCircle, Star, ShieldCheck, Clock, Layers, UserPlus } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export function ServiceDetailsOverlay({ service, onClose }: { service: any | null, onClose: () => void }) {
  const { t } = useI18n();

  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 md:p-10 flex flex-col">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <service.icon className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {service.desc} Dies ist ein Beispieltext für den Service, um zu demonstrieren, wie Details hier angezeigt werden. Es wird genau auf die Vorteile und Prozesse dieses Integrated Services eingegangen.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-4">
                 <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-slate-900">{t('Zertifiziert', 'Certified')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('Alle Prozesse sind DIN-Zertifiziert', 'All processes are DIN-certified')}</p>
                 </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-4">
                 <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-slate-900">{t('24/7 SLA', '24/7 SLA')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('Verfügbarkeit garantiert', 'Guaranteed availability')}</p>
                 </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-4">
                 <Layers className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-slate-900">{t('API Integration', 'API Integration')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('Nahtlose Anbindung ins CRM', 'Seamless CRM connection')}</p>
                 </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-4">
                 <UserPlus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-sm font-bold text-slate-900">{t('Lead Gen', 'Lead Gen')}</h4>
                    <p className="text-xs text-slate-500 mt-1">{t('Unterstützt Neukundengewinnung', 'Supports acquisition')}</p>
                 </div>
              </div>
            </div>

            <div className="mt-auto flex gap-4 pt-6 border-t border-slate-100">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                    {t('Service aktivieren', 'Activate Service')}
                </button>
                <button onClick={onClose} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                    {t('Später', 'Later')}
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
