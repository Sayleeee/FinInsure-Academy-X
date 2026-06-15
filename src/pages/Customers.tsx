import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { CustomersView } from '../components/CustomersView';

export function Customers() {
  const { t } = useI18n();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('CRM Kundendatenbank', 'CRM Customers DB')}</h1>
        <p className="text-slate-500 mt-2">{t('Kundenverzeichnis filterbar nach Privatkunden und Firmenkunden mit vollständiger Akte.', 'Customer directory filterable by individual and corporate clients with complete profile cards.')}</p>
      </div>

      <CustomersView />
    </motion.div>
  );
}
