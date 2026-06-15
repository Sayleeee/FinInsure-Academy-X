import { motion, AnimatePresence } from 'motion/react';
import { X, PlayCircle, Clock, Star, Users, CheckCircle2, Award, Calendar } from 'lucide-react';
import { useI18n } from '../lib/i18n';

export interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  image: string;
}

export function CourseDetailsOverlay({ course, onClose }: { course: Course | null, onClose: () => void }) {
  const { t } = useI18n();

  if (!course) return null;

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
          className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-10 hidden md:block"
          >
            <X className="w-5 h-5 text-slate-900 drop-shadow-sm" />
          </button>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md transition-colors z-10 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Hero / Image Section */}
          <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-100 flex-shrink-0">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-3">
                {course.category}
              </div>
              <div className="flex items-center gap-4 text-white text-sm font-medium">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-orange-400" /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {course.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              {course.level}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">{course.title}</h2>
            
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              {t('Erfahre alles, was du wissen musst, um dieses Thema in deinem Berufsalltag als Makler sicher und professionell anzuwenden. Dieser Kurs kombiniert theoretisches Wissen mit praktischen Übungen aus dem echten Leben.', 'Learn everything you need to know to safely and professionally apply this topic in your daily broker life. This course combines theoretical knowledge with practical real-world exercises.')}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Teilnehmer', 'Enrolled')}</span>
                <span className="flex items-center gap-2 text-slate-900 font-semibold"><Users className="w-4 h-4 text-slate-400" /> 1,248</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Letztes Update', 'Last Update')}</span>
                <span className="flex items-center gap-2 text-slate-900 font-semibold"><Calendar className="w-4 h-4 text-slate-400" /> {t('Vor 2 Monaten', '2 months ago')}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Sprache', 'Language')}</span>
                <span className="text-slate-900 font-semibold">{t('Deutsch', 'German')}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Zertifikat', 'Certificate')}</span>
                <span className="text-slate-900 font-semibold">{t('Ja', 'Yes')}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">{t('Das wirst du lernen', 'What you will learn')}</h3>
            <ul className="space-y-3 mb-10">
              {[
                t('Best Practices für den Agenturalltag', 'Best practices for agency operations'),
                t('Live-Demos und Anwendungsbeispiele', 'Live demos and use cases'),
                t('Vermeidung häufiger regulatorischer Fehler', 'Avoiding common regulatory mistakes'),
                t('Tipps für bessere Conversion-Rates', 'Tips for better conversion rates')
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors shadow-sm focus:ring-4 focus:ring-orange-500/20">
                <PlayCircle className="w-5 h-5" />
                {t('Kurs starten', 'Start Course')}
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg transition-colors focus:ring-4 focus:ring-slate-500/10">
                {t('Auf die Merkliste', 'Add to Wishlist')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
