import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { Shield, HeartPulse, Home, Car, TrendingUp, HandCoins, Building2, Briefcase, RefreshCw, FileCheck2, Lightbulb, Search, Filter, ArrowRight, CheckSquare, Square, X, Scale, BookOpen, PackageOpen } from 'lucide-react';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { CreateDealOverlay } from '../components/CreateDealOverlay';
import { ServiceDetailsOverlay } from '../components/ServiceDetailsOverlay';
import { KnowledgeBase } from '../components/KnowledgeBase';
import { cn } from '../lib/utils';

export function ProductMatrix() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const [activeMainTab, setActiveMainTab] = useState<'catalog' | 'knowledge'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [isBindModalOpen, setIsBindModalOpen] = useState(false);
  const [bindProductData, setBindProductData] = useState<{name: string, value?: string, company?: string}>({});
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const handleBindClick = (productName: string) => {
    const details = getProductDetails(productName);
    setBindProductData({
      name: `${t('Lead für', 'Lead for')} ${productName}`,
      value: details?.price?.includes('€') ? details.price : '€1,000/J'
    });
    setIsBindModalOpen(true);
    setShowComparison(false);
  };

  const toggleProductSelection = (productName: string) => {
    setSelectedProducts(prev => 
      prev.includes(productName) 
        ? prev.filter(p => p !== productName)
        : [...prev, productName].slice(0, 3)
    );
  };

  const categories = [
    {
      title: t('Sachversicherung (Privat)', 'Property & Casualty (Private)'),
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      products: [
        { name: t('Privathaftpflicht (PHV)', 'Personal Liability'), desc: t('Absicherung gegen Schadensersatzansprüche Dritter.', 'Protection against third-party liability claims.') },
        { name: t('Hausratversicherung', 'Home Contents'), desc: t('Schutz für Einrichtung bei Feuer, Leitungswasser, Sturm etc.', 'Protection for belongings against fire, water, storm etc.') },
        { name: t('Wohngebäudeversicherung', 'Residential Building'), desc: t('Sicherung der Immobilie selbst.', 'Securing the physical property itself.') },
        { name: t('Kfz-Versicherung', 'Motor Insurance'), desc: t('Haftpflicht, Teilkasko und Vollkasko.', 'Liability, partial, and fully comprehensive cover.') },
      ]
    },
    {
      title: t('Personen & Vorsorge', 'Life, Health & Provision'),
      icon: HeartPulse,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      products: [
        { name: t('Berufsunfähigkeitsversicherung (BU)', 'Disability Insurance'), desc: t('Einkommenssicherung bei Verlust der Arbeitskraft.', 'Income protection in case of inability to work.') },
        { name: t('Risikolebensversicherung', 'Term Life Insurance'), desc: t('Finanzielle Absicherung der Hinterbliebenen.', 'Financial protection for dependents.') },
        { name: t('Private Krankenversicherung (PKV)', 'Private Health Insurance'), desc: t('Umfassende Gesundheitsleistungen abseits der GKV.', 'Comprehensive health coverage beyond statutory care.') },
        { name: t('Pflegezusatzversicherung', 'Nursing Care Supplement'), desc: t('Schutz vor hohen Pflegekosten.', 'Protection against high care/nursing costs.') },
      ]
    },
    {
      title: t('Finanzen & Anlage', 'Finance & Investment'),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      products: [
        { name: t('Baufinanzierung', 'Mortgage / Real Estate Finance'), desc: t('Darlehen für den Immobilienkauf.', 'Loans for property purchasing.') },
        { name: t('Investment & Depots', 'Investment Funds & Portfolios'), desc: t('Aktien, ETFs und gemanagte Fonds.', 'Stocks, ETFs, and managed funds.') },
        { name: t('Riester- / Rürup-Rente', 'State-Subsidized Pensions'), desc: t('Staatlich geförderte Altersvorsorge.', 'State-supported retirement provision.') },
        { name: t('Bausparen', 'Building Savings'), desc: t('Kombination aus Sparen und Darlehensanspruch.', 'Combination of saving and loan eligibility.') },
      ]
    },
    {
      title: t('Gewerbe', 'Commercial'),
      icon: Building2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      products: [
        { name: t('Betriebshaftpflicht', 'Business Liability'), desc: t('Existenzschutz für Unternehmen.', 'Crucial liability protection for companies.') },
        { name: t('Inhaltsversicherung', 'Commercial Contents'), desc: t('Schutz für Firmeninventar.', 'Protection for company inventory.') },
        { name: t('D&O Versicherung', 'D&O Insurance'), desc: t('Managerhaftpflicht.', 'Directors & Officers liability.') },
        { name: t('Gewerbliche Immobilien', 'Commercial Property'), desc: t('Absicherung von Büro- oder Hallengebäuden.', 'Protection for office or industrial buildings.') },
      ]
    }
  ];

  const services = [
    { title: t('Bestandsanalyse', 'Portfolio Analysis'), icon: FileCheck2, desc: t('Tiefgreifende Überprüfung bestehender Verträge.', 'Deep review of existing contracts.') },
    { title: t('Umdeckungsservice (Parkplatz)', 'Switching Service (Parking Lot)'), icon: RefreshCw, desc: t('Automatisierter Workflow zur Umdeckung in das Kernsystem.', 'Automated workflow for switching into the core system.') },
    { title: t('Tarifoptimierung', 'Tariff Optimisation'), icon: Lightbulb, desc: t('Kosten senken, Leistungen verbessern nach §204 VVG.', 'Reduce costs, improve benefits.') },
  ];

  const searchLower = searchQuery.toLowerCase();

  const filteredCategories = categories.map(cat => {
    // Determine if the category title itself matches the search query
    const catMatches = cat.title.toLowerCase().includes(searchLower);
    
    // Filter products
    const filteredProducts = cat.products.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.desc.toLowerCase().includes(searchLower)
    );

    return {
      ...cat,
      products: filteredProducts,
      catMatches
    };
  }).filter(cat => {
    // First apply category filter
    if (activeCategory !== 'all' && cat.title !== activeCategory) {
      return false;
    }
    // Then apply search filter: return true if category matches or has matching products
    return cat.catMatches || cat.products.length > 0;
  });

  const filteredServices = services.filter(s => {
    if (activeCategory !== 'all' && activeCategory !== 'services') return false;
    return s.title.toLowerCase().includes(searchLower) || s.desc.toLowerCase().includes(searchLower);
  });

  const allCategoryTitles = [
    { id: 'all', label: t('Alle anzeigen', 'Show All') },
    ...categories.map(c => ({ id: c.title, label: c.title })),
    { id: 'services', label: t('Services', 'Services') }
  ];

  const getProductDetails = (productName: string) => {
    for (const cat of categories) {
      for (const p of cat.products) {
        if (p.name === productName) {
           return {
             name: p.name,
             category: cat.title,
             desc: p.desc,
             price: productName.toLowerCase().includes('haftpflicht') || productName.toLowerCase().includes('liability') ? 'ab 35 € / Jahr' : 'Individuell',
             coverage: productName.toLowerCase().includes('haftpflicht') || productName.toLowerCase().includes('liability') ? 'Bis 50 Mio. €' : 'Variabel nach Absprache',
             commission: productName.toLowerCase().includes('pkv') || productName.toLowerCase().includes('health') ? 'Bis zu 9 MBs' : 'Standard-Satz',
             support: '24/7 Makler-Service',
           };
        }
      }
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('artemis Produkt-Matrix', 'artemis Product Matrix')}</h1>
          <p className="text-slate-500 mt-2 text-lg">
            {t('Standard-Produktkatalog für den deutschen Finanz- und Versicherungsmarkt.', 'Standard product catalog for the German finance and insurance market.')}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button 
            onClick={() => setActiveMainTab('catalog')}
            className={cn("px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeMainTab === 'catalog' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <PackageOpen className="w-4 h-4" />
            {t('Produktkatalog', 'Product Catalog')}
          </button>
          <button 
            onClick={() => setActiveMainTab('knowledge')}
            className={cn("px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeMainTab === 'knowledge' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
          >
            <BookOpen className="w-4 h-4" />
            {t('Wissensdatenbank', 'Knowledge Base')}
          </button>
        </div>
      </div>

      {activeMainTab === 'knowledge' ? (
        <KnowledgeBase />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <form onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Produkte & Services suchen...', 'Search products & services...')}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </form>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
               <Lightbulb className="w-5 h-5" />
             </div>
             <div>
                <p className="text-sm font-bold text-blue-900">{t('Tipp: Tarife, Bedingungen & Provisionen', 'Tip: Tariffs, Terms & Commissions')}</p>
                <p className="text-sm text-blue-700">{t('Details zu Provisionen, Annahmerichtlinien und den Allg. Versicherungsbedingungen (AHB usw.) findest du zentral in der Wissensdatenbank oder direkt am Produktsteckbrief gebündelt.', 'Details on commissions, acceptance guidelines and general terms can be found centrally in the knowledge base or bundled directly on the product profiles.')}</p>
             </div>
          </div>

          {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {allCategoryTitles.map((cat) => (
          <button 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className={`p-4 border-b border-slate-100 flex items-center gap-3 ${cat.bg}`}>
              <cat.icon className={`h-6 w-6 ${cat.color}`} />
              <h2 className="text-lg font-bold text-slate-800">{cat.title}</h2>
            </div>
            <div className="p-5 flex-1 space-y-4">
              {cat.products.map((prod, pIdx) => (
                <div key={pIdx} className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleProductSelection(prod.name)}
                        className="mt-0.5 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                        title={t('Zum Vergleich hinzufügen', 'Add to compare')}
                      >
                         {selectedProducts.includes(prod.name) 
                           ? <CheckSquare className="w-5 h-5 text-orange-600" /> 
                           : <Square className="w-5 h-5" />
                         }
                      </button>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{prod.name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{prod.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => handleBindClick(prod.name)} className="flex-shrink-0 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 opacity-0 focus:opacity-100 group-hover:opacity-100 shadow-sm border border-orange-100 cursor-pointer">
                      {t('Abschließen', 'Bind')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && filteredServices.length === 0 && (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-500">{t('Keine Produkte oder Services gefunden.', 'No products or services found.')}</p>
          </div>
        )}
      </div>

      {filteredServices.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('Integrierte Servicedienstleistungen', 'Integrated Services')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((svc, idx) => (
              <div key={idx} onClick={() => setSelectedService(svc)} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <svc.icon className="h-6 w-6 text-slate-400 mb-4" />
                <h3 className="text-md font-bold text-slate-900">{svc.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
      )}

      {/* Floating Compare Action */}
      <AnimatePresence>
        {selectedProducts.length > 0 && !showComparison && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-8 z-40 border border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-2 rounded-lg">
                <Scale className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="font-bold text-sm">{selectedProducts.length} {t('Produkte ausgewählt', 'Products selected')}</p>
                <p className="text-xs text-slate-400">{t('Maximal 3 zum Vergleich', 'Compare up to 3')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedProducts([])}
                className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {t('Leeren', 'Clear')}
              </button>
              <button 
                onClick={() => setShowComparison(true)}
                className="bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedProducts.length < 2}
              >
                {t('Vergleichen', 'Compare')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showComparison && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{t('Produktvergleich', 'Product Comparison')}</h2>
                </div>
                <button 
                  onClick={() => setShowComparison(false)} 
                  className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-0 overflow-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr>
                      <th className="p-4 border-b border-slate-200 w-1/4 bg-slate-50/50"></th>
                      {selectedProducts.map(p => (
                        <th key={p} className="p-5 border-b border-slate-200 border-l border-slate-100 w-1/4 text-lg font-bold text-slate-900 leading-tight">
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-5 font-semibold text-slate-600 bg-slate-50/50">{t('Kategorie', 'Category')}</td>
                      {selectedProducts.map(p => {
                         const details = getProductDetails(p);
                         return <td key={p} className="p-5 text-sm text-slate-700 border-l border-slate-100 bg-white">{details?.category}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-5 font-semibold text-slate-600 bg-slate-50/50">{t('Beschreibung', 'Description')}</td>
                      {selectedProducts.map(p => {
                         const details = getProductDetails(p);
                         return <td key={p} className="p-5 text-sm text-slate-700 border-l border-slate-100 bg-white leading-relaxed">{details?.desc}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-5 font-semibold text-slate-600 bg-slate-50/50">{t('Beitrag / Prämie', 'Premium')}</td>
                      {selectedProducts.map(p => {
                         const details = getProductDetails(p);
                         return <td key={p} className="p-5 text-sm font-bold text-slate-900 border-l border-slate-100 bg-white">{details?.price}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-5 font-semibold text-slate-600 bg-slate-50/50">{t('Deckungssumme', 'Coverage')}</td>
                      {selectedProducts.map(p => {
                         const details = getProductDetails(p);
                         return <td key={p} className="p-5 text-sm text-slate-700 border-l border-slate-100 bg-white">{details?.coverage}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-5 font-semibold text-slate-600 bg-slate-50/50">{t('Provision', 'Commission')}</td>
                      {selectedProducts.map(p => {
                         const details = getProductDetails(p);
                         return <td key={p} className="p-5 text-sm font-bold text-orange-600 border-l border-slate-100 bg-orange-50/30">{details?.commission}</td>;
                      })}
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td className="p-5 border-t border-slate-200"></td>
                      {selectedProducts.map(p => (
                         <td key={p} className="p-5 border-t border-slate-200 border-l border-slate-100">
                           <button onClick={() => handleBindClick(p)} className="w-full flex justify-center items-center gap-2 text-center text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 cursor-pointer">
                             {t('Dieses Produkt wählen', 'Select Product')}
                             <ArrowRight className="w-4 h-4" />
                           </button>
                         </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CreateDealOverlay 
        isOpen={isBindModalOpen} 
        onClose={() => setIsBindModalOpen(false)} 
        initialData={bindProductData} 
      />
      <ServiceDetailsOverlay 
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </motion.div>
  );
}
