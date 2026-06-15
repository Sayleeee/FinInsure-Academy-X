import { motion } from 'motion/react';
import { SalesCockpit } from '../components/SalesCockpit';

export function SalesCockpitPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <SalesCockpit />
    </motion.div>
  );
}
