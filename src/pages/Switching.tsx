import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { SwitchingParkingLotView } from '../components/SwitchingParkingLotView';

export function Switching() {
  const { t } = useI18n();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('Vertragsumdecker', 'Policy Switcher')}</h1>
        <p className="text-slate-500 mt-2">{t('Übertrage Bestandsverträge zu optimierten Konditionen und verwalte Dokumente.', 'Transfer portfolio policies to optimized conditions and manage documents.')}</p>
      </div>

      <SwitchingParkingLotView />
    </motion.div>
  );
}
