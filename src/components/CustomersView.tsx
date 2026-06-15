import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Building2, User, Mail, Phone, MapPin, RefreshCw, CheckCircle2, Edit2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Customer } from '../lib/CrmContext';
import { CreateCustomerOverlay } from './CreateCustomerOverlay';
import { CustomerRecordOverlay } from './CustomerRecordOverlay';
import { cn } from '../lib/utils';

export function CustomersView() {
  const { t } = useI18n();
  const { customers } = useCrm();

  const [searchQuery, setSearchQuery] = useState('');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsOverlayOpen(true);
  };

  const handleCreate = () => {
    setCustomerToEdit(null);
    setIsOverlayOpen(true);
  };

  const handleViewRecord = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsRecordOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Kunden suchen...", "Search customers...")}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </form>
          </div>
          
          <button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer">
            <Plus className="h-4 w-4" />
            {t('Kunde anlegen', 'Add Customer')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
               {t('Keine Kunden gefunden.', 'No customers found.')}
            </div>
          ) : (
            filteredCustomers.map(customer => (
               <div key={customer.id} onClick={() => handleViewRecord(customer)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all group flex flex-col cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                           {customer.type === 'company' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{customer.name}</h3>
                           <p className="text-xs text-slate-500 uppercase tracking-wider">{customer.type === 'company' ? t('Firma', 'Company') : t('Privatperson', 'Individual')}</p>
                        </div>
                     </div>
                     <button onClick={(e) => { e.stopPropagation(); handleEdit(customer); }} className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md">
                        <Edit2 className="w-4 h-4" />
                     </button>
                  </div>
                  
                  <div className="space-y-2 flex-1 text-sm text-slate-600">
                     {customer.email && (
                        <div className="flex items-center gap-2">
                           <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                           <span className="truncate">{customer.email}</span>
                        </div>
                     )}
                     {customer.phone && (
                        <div className="flex items-center gap-2">
                           <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                           <span>{customer.phone}</span>
                        </div>
                     )}
                     {customer.address && (
                        <div className="flex items-start gap-2">
                           <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                           <span className="line-clamp-2">{customer.address}</span>
                        </div>
                     )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-xs font-semibold text-slate-500">{t('Sync Status', 'Sync Status')}</span>
                     {customer.syncStatus === 'synced' ? (
                       <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t('Synchronisiert', 'Synced')}
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          {t('Wird synchronisiert...', 'Syncing...')}
                       </div>
                     )}
                  </div>
               </div>
            ))
          )}
      </div>

      <CreateCustomerOverlay 
         isOpen={isOverlayOpen} 
         onClose={() => setIsOverlayOpen(false)} 
         customerToEdit={customerToEdit} 
      />
      <CustomerRecordOverlay 
         isOpen={isRecordOpen}
         onClose={() => setIsRecordOpen(false)}
         customer={selectedCustomer}
      />
    </div>
  );
}
