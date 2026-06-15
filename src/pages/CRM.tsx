import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Kanban, TableProperties, User, 
  ArrowUpRight, TrendingUp, Calendar, Mail, Clock, MoreHorizontal, 
  Thermometer, Snowflake, Phone, SlidersHorizontal, 
  CheckCircle, BarChart3, TrendingDown, Target, Star
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Deal } from '../lib/CrmContext';
import { cn } from '../lib/utils';
import { CreateDealOverlay } from '../components/CreateDealOverlay';
import { DealDetailsOverlay } from '../components/DealDetailsOverlay';
import { useNotImplemented } from '../lib/NotImplementedContext';

const CAMPAIGNS = [
  { id: 1, name: 'BU 2026 Junge Berufstätige', category: 'BU & Einkommen', status: 'Aktiv', leads: 142, conversion: '18.3%', budgetUsed: 5120, budgetTotal: 8400 },
  { id: 2, name: 'Gewerbe-Cyber Q2', category: 'Gewerbe & Cyber', status: 'Aktiv', leads: 67, conversion: '11.9%', budgetUsed: 8900, budgetTotal: 12000 },
  { id: 3, name: 'PKV-Wechselsaison', category: 'Private Kranken', status: 'Pausiert', leads: 89, conversion: '22.4%', budgetUsed: 6000, budgetTotal: 6000 },
  { id: 4, name: 'Altersvorsorge 40+', category: 'Altersvorsorge', status: 'Aktiv', leads: 54, conversion: '14.8%', budgetUsed: 2100, budgetTotal: 4500 }
];

const ACTIVITIES = [
  { id: 1, type: 'appointment', title: 'Termin gebucht mit Petra Schulz', owner: 'S. Berger', time: 'vor 12 Min.' },
  { id: 2, type: 'email', title: 'Angebot versendet an MetaCorp GmbH', owner: 'M. Koch', time: 'vor 38 Min.' },
  { id: 3, type: 'phone', title: 'Anruf bei Familie Hoffmann (4:21)', owner: 'L. Frei', time: 'vor 1 Std.' },
  { id: 4, type: 'stage', title: 'Stage geändert: Lindner → Beratung', owner: 'A. Direktor', time: 'vor 2 Std.' },
  { id: 5, type: 'forecast', title: 'Abschluss Sandra Weiss erwartet', owner: 'J. Wenger', time: 'heute' }
];

export function CRM() {
  const { t } = useI18n();
  const { deals, addDeal, updateDealStage } = useCrm();
  const { showInfo } = useNotImplemented();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'kanban' | 'campaigns' | 'forecast' | 'activities'>('pipeline');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const handleStageChange = (id: string, newStage: string) => {
    updateDealStage(id, newStage);
  };

  const STAGES = [
    { id: 'lead', title: t('Lead', 'Lead'), color: 'bg-slate-200 text-slate-800' },
    { id: 'firstContact', title: t('Erstkontakt', 'First Contact'), color: 'bg-indigo-100 text-indigo-800' },
    { id: 'needsAnalysis', title: t('Bedarfsanalyse', 'Needs Analysis'), color: 'bg-orange-100 text-orange-800' },
    { id: 'consulting', title: t('Beratung', 'Consulting'), color: 'bg-sky-100 text-sky-800' },
    { id: 'offer', title: t('Angebot', 'Offer'), color: 'bg-amber-100 text-amber-800' },
    { id: 'negotiation', title: t('Verhandlung', 'Negotiation'), color: 'bg-pink-100 text-pink-800' },
    { id: 'closed', title: t('Abschluss', 'Closed'), color: 'bg-emerald-100 text-emerald-800' }
  ];

  const categories = [
    { id: 'bu', label: t('BU & Einkommen', 'BU & Income'), color: 'bg-slate-900' },
    { id: 'pkv', label: t('Private Kranken', 'Private Health'), color: 'bg-blue-600' },
    { id: 'commercial', label: t('Gewerbe & Cyber', 'Commercial & Cyber'), color: 'bg-teal-500' },
    { id: 'fleet', label: t('KFZ & Flotte', 'Auto & Fleet'), color: 'bg-amber-500' },
    { id: 'retirement', label: t('Altersvorsorge', 'Retirement'), color: 'bg-green-500' },
    { id: 'property', label: t('Sach & Wohngebäude', 'Property & Residential'), color: 'bg-sky-400' }
  ];

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = selectedOwner === 'all' || deal.owner === selectedOwner;
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    return matchesSearch && matchesOwner && matchesCategory;
  });

  // KPI Calculations
  const parseVal = (v: string) => parseInt(v.replace(/[^0-9]/g, '')) || 0;
  
  const totalValue = filteredDeals.reduce((sum, d) => sum + parseVal(d.value), 0);
  const weightedForecast = filteredDeals.reduce((sum, d) => sum + (parseVal(d.value) * d.probability) / 100, 0);
  const openDealsCount = filteredDeals.filter(d => d.stage !== 'closed').length;
  const closedMTD = filteredDeals.filter(d => d.stage === 'closed').reduce((sum, d) => sum + parseVal(d.value), 0);

  const getTempColor = (temp: Deal['temperature']) => {
    switch (temp) {
      case 'hot': return 'text-red-600 bg-red-50 border-red-200';
      case 'warm': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cold': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTempIcon = (temp: Deal['temperature']) => {
    switch (temp) {
      case 'hot':
      case 'warm':
        return <Thermometer className="w-3 h-3 text-red-500" />;
      case 'cold':
        return <Snowflake className="w-3 h-3 text-blue-500" />;
    }
  };

  // Funnel Conversion card counts calculation
  const getStageCount = (stageId: string) => filteredDeals.filter(d => d.stage === stageId).length;

  const getKanbanHeaderStyle = (stageId: string) => {
    switch (stageId) {
      case 'lead':
      case 'firstContact':
      case 'needsAnalysis':
      case 'consulting':
        return 'bg-slate-50 border-b border-slate-200 text-slate-800';
      case 'offer':
      case 'negotiation':
        return 'bg-[#faebd7] border-b border-[#fed7aa] text-[#854d0e]';
      case 'closed':
        return 'bg-[#d1fae5] border-b border-[#a7f3d0] text-[#065f46]';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getCategoryForecastData = (catId: string) => {
    const catDeals = deals.filter(d => d.category === catId && d.stage !== 'closed');
    const total = catDeals.reduce((sum, d) => sum + parseVal(d.value), 0);
    const weighted = catDeals.reduce((sum, d) => sum + (parseVal(d.value) * d.probability) / 100, 0);
    return {
      count: catDeals.length,
      used: Math.round(weighted),
      total: total
    };
  };

  // Starred Top Deals selector (fetching by ID for dynamic UI updates)
  const topDeals = deals
    .filter(d => ['13', '9', '14', '10', '11'].includes(d.id))
    .sort((a, b) => parseVal(b.value) - parseVal(a.value));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('CRM & Vertriebs-Funnel', 'CRM & Sales Funnel')}</h1>
        <p className="text-slate-500 mt-2">{t('Pipeline, Kampagnen und Lead-Management auf einen Blick.', 'Pipeline, campaigns and lead management at a glance.')}</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Pipeline (offen)', 'Pipeline (Open)')}</span>
            <span className="text-xs font-bold text-slate-500">€</span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{(totalValue - closedMTD).toLocaleString('de-DE')} €</p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12,4%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Forecast (gewichtet)', 'Weighted Forecast')}</span>
            <span className="text-xs font-bold text-slate-500">
              <Target className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{weightedForecast.toLocaleString('de-DE', { maximumFractionDigits: 0 })} €</p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8,1%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Abschlüsse MTD', 'Closed MTD')}</span>
            <span className="text-xs font-bold text-slate-500">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{closedMTD.toLocaleString('de-DE')} €</p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +3,2%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Win-Rate', 'Win Rate')}</span>
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">50.0%</p>
            <span className="text-[10px] font-bold text-red-500 flex items-center gap-0.5 mt-1">
              <TrendingDown className="w-3.5 h-3.5" /> -1,8%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Offene Deals', 'Open Deals')}</span>
            <span className="text-xs font-bold text-slate-500">
              <User className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">{openDealsCount}</p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Ø Deal Größe', 'Avg Deal Size')}</span>
            <span className="text-xs font-bold text-slate-500">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-xl font-extrabold text-slate-900">
              {openDealsCount > 0 ? Math.round((totalValue - closedMTD) / openDealsCount).toLocaleString('de-DE') : '0'} €
            </p>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +€220
            </span>
          </div>
        </div>
      </div>

      {/* Controls: Search, Filters, Add Deal */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Deals, Kunden, Produkte suchen...", "Search deals, clients, products...")}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button 
            onClick={() => showInfo(t('Erweiterte Filteroptionen geöffnet.', 'Advanced filters opened.'))}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          </button>
          
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="all">{t('Alle Owner', 'All Owners')}</option>
              <option value="S. Berger">S. Berger</option>
              <option value="M. Koch">M. Koch</option>
              <option value="L. Frei">L. Frei</option>
              <option value="J. Wenger">J. Wenger</option>
              <option value="A. Direktor">A. Direktor</option>
            </select>
          </div>

          <button onClick={() => setIsCreateOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            {t('Neuer Deal', 'Create Deal')}
          </button>
        </div>
      </div>

      {/* Funnel Category Pills Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
            selectedCategory === 'all'
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          <span className={cn("w-2 h-2 rounded-full", selectedCategory === 'all' ? "bg-white" : "bg-blue-600")}></span>
          {t('Alle Funnels', 'All Funnels')}
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1", selectedCategory === 'all' ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-500")}>
            {deals.length}
          </span>
        </button>
        {categories.map((cat) => {
          const count = deals.filter(d => d.category === cat.id).length;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                isActive 
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", cat.color)}></span>
              {cat.label}
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1", isActive ? "bg-slate-850 text-slate-350" : "bg-slate-100 text-slate-500")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Switcher Sub-tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={cn("px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer", activeTab === 'pipeline' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <TableProperties className="w-4 h-4" />
          {t('Pipeline', 'Pipeline')}
        </button>
        <button 
          onClick={() => setActiveTab('kanban')}
          className={cn("px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer", activeTab === 'kanban' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Kanban className="w-4 h-4" />
          {t('Kanban-Board', 'Kanban')}
        </button>
        <button 
          onClick={() => setActiveTab('campaigns')}
          className={cn("px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer", activeTab === 'campaigns' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Target className="w-4 h-4" />
          {t('Kampagnen', 'Campaigns')}
        </button>
        <button 
          onClick={() => setActiveTab('forecast')}
          className={cn("px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer", activeTab === 'forecast' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <BarChart3 className="w-4 h-4" />
          {t('Forecast', 'Forecast')}
        </button>
        <button 
          onClick={() => setActiveTab('activities')}
          className={cn("px-5 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2 cursor-pointer", activeTab === 'activities' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Clock className="w-4 h-4" />
          {t('Aktivitäten', 'Activities')}
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'pipeline' && (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Funnel Conversion visual */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{t('Funnel-Konversion', 'Funnel Conversion')}</h3>
              
              <div className="grid grid-cols-7 gap-4">
                {[
                  { id: 'lead', label: 'Lead', color: 'bg-[#e2e8f0]' },
                  { id: 'firstContact', label: 'Erstkontakt', color: 'bg-[#e2e8f0]' },
                  { id: 'needsAnalysis', label: 'Bedarfsanalyse', color: 'bg-[#e2e8f0]' },
                  { id: 'consulting', label: 'Beratung', color: 'bg-[#e2e8f0]' },
                  { id: 'offer', label: 'Angebot', color: 'bg-[#fbe7c6]' },
                  { id: 'negotiation', label: 'Verhandlung', color: 'bg-[#fbe7c6]' },
                  { id: 'closed', label: 'Abschluss', color: 'bg-[#a3cda3]' }
                ].map((step) => {
                  const count = getStageCount(step.id);
                  return (
                    <div key={step.id} className="flex flex-col">
                      <div className={cn("w-full h-14 rounded-lg shadow-sm border border-black/5", step.color)}></div>
                      <span className="text-[11px] font-bold text-slate-500 text-center mt-2 leading-none">{step.label}</span>
                      <span className="text-sm font-extrabold text-slate-800 text-center mt-1">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pipeline Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4">{t('Deal', 'Deal')}</th>
                      <th className="p-4">{t('Produkt', 'Product')}</th>
                      <th className="p-4">{t('Stage', 'Stage')}</th>
                      <th className="p-4">{t('Wert', 'Value')}</th>
                      <th className="p-4">{t('Wahrsch.', 'Prob.')}</th>
                      <th className="p-4">{t('Temp.', 'Temp.')}</th>
                      <th className="p-4">{t('Owner', 'Owner')}</th>
                      <th className="p-4">{t('Letzte Aktivität', 'Last Activity')}</th>
                      <th className="p-4">{t('Nächster Schritt', 'Next Step')}</th>
                      <th className="p-4 text-right">{t('Aktion', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredDeals.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-500">
                          {t('Keine Deals gefunden.', 'No deals found.')}
                        </td>
                      </tr>
                    ) : (
                      filteredDeals.map((deal) => (
                        <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Deal Initials & Name */}
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                {deal.name.split(' ').map(n => n[0]).join('')}
                              </span>
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">{deal.name}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{deal.email}</p>
                              </div>
                            </div>
                          </td>
                          {/* Produkt */}
                          <td className="p-4 text-slate-600 font-semibold">{deal.productName}</td>
                          {/* Stage */}
                          <td className="p-4">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                              STAGES.find(s => s.id === deal.stage)?.color
                            )}>
                              {STAGES.find(s => s.id === deal.stage)?.title}
                            </span>
                          </td>
                          {/* Wert */}
                          <td className="p-4 font-bold text-slate-900">{deal.value}</td>
                          {/* Wahrscheinlichkeit Progress */}
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${deal.probability}%` }}></div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500">{deal.probability}%</span>
                            </div>
                          </td>
                          {/* Temp */}
                          <td className="p-4">
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase", getTempColor(deal.temperature))}>
                              {getTempIcon(deal.temperature)}
                              {deal.temperature}
                            </span>
                          </td>
                          {/* Owner */}
                          <td className="p-4 font-semibold text-slate-700">{deal.owner}</td>
                          {/* Letzte Aktivität */}
                          <td className="p-4 text-xs text-slate-500 font-medium">{deal.lastActivity}</td>
                          {/* Nächster Schritt */}
                          <td className="p-4 text-xs font-semibold text-slate-700">{deal.nextStep}</td>
                          {/* Action Button */}
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => setSelectedDealId(deal.id)}
                              className="text-xs font-bold text-slate-800 hover:text-orange-600 bg-slate-100 hover:bg-slate-200/60 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              {t('Bearbeiten', 'Edit')}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'kanban' && (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-4 overflow-x-auto pb-4 max-w-full items-start scrollbar-thin"
          >
            {STAGES.map((stage) => {
              const stageDeals = filteredDeals.filter(d => d.stage === stage.id);
              const stageSum = stageDeals.reduce((sum, d) => sum + parseVal(d.value), 0);
              const avgProb = stageDeals.length > 0 ? Math.round(stageDeals.reduce((sum, d) => sum + d.probability, 0) / stageDeals.length) : 0;
              
              return (
                <div key={stage.id} className="min-w-[280px] w-[280px] bg-slate-100 rounded-xl flex flex-col border border-slate-200 max-h-[70vh] shadow-inner">
                  {/* Column Header */}
                  <div className={cn("p-3 rounded-t-xl shrink-0", getKanbanHeaderStyle(stage.id))}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-[11px] uppercase tracking-wider">{stage.title}</h3>
                      <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-sm">{stageDeals.length}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      {stageSum.toLocaleString('de-DE')} € · Ø {avgProb}%
                    </p>
                  </div>
                  
                  {/* Card Container */}
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[150px]">
                    {stageDeals.map((deal) => (
                      <div 
                        key={deal.id} 
                        onClick={() => setSelectedDealId(deal.id)} 
                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group relative space-y-3"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors leading-tight">{deal.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{deal.productName}</p>
                          </div>
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded-md font-semibold border flex-shrink-0 uppercase flex items-center gap-0.5", getTempColor(deal.temperature))}>
                            {getTempIcon(deal.temperature)}
                            {deal.temperature}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-extrabold text-blue-600 text-sm">{deal.value}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{deal.owner}</span>
                        </div>

                        {/* Slide progress track with caregivers carets */}
                        <div className="flex items-center justify-between gap-1 text-slate-350 select-none">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const prevIdx = STAGES.findIndex(s => s.id === stage.id) - 1;
                              if (prevIdx >= 0) {
                                handleStageChange(deal.id, STAGES[prevIdx].id);
                              }
                            }}
                            className="text-[12px] font-bold text-slate-400 hover:text-slate-800 transition-colors px-1 cursor-pointer"
                          >
                            &lsaquo;
                          </button>
                          <div className="flex-1 relative h-1 bg-slate-100 rounded-full overflow-hidden mx-1">
                            <div className="bg-slate-700 h-1 rounded-full animate-pulse-once" style={{ width: `${deal.probability}%` }}></div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = STAGES.findIndex(s => s.id === stage.id) + 1;
                              if (nextIdx < STAGES.length) {
                                handleStageChange(deal.id, STAGES[nextIdx].id);
                              }
                            }}
                            className="text-[12px] font-bold text-slate-400 hover:text-slate-800 transition-colors px-1 cursor-pointer"
                          >
                            &rsaquo;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'campaigns' && (
          <motion.div 
            key="campaigns"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {CAMPAIGNS.map(camp => (
              <div key={camp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border",
                    camp.status === 'Aktiv' ? "bg-slate-900 text-white border-slate-900" : "bg-slate-200 text-slate-700 border-slate-200"
                  )}>
                    {camp.status}
                  </span>
                  <button className="text-slate-400 hover:text-slate-700"><MoreHorizontal className="w-4 h-4" /></button>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{camp.name}</h4>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{camp.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-100 py-3 text-sm">
                  <div>
                    <p className="text-lg font-extrabold text-slate-900">{camp.leads}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('Leads', 'Leads')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-blue-600">{camp.conversion}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('Conversion', 'Conversion')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>{t('Budget', 'Budget')}</span>
                    <span className="text-slate-700">{camp.budgetUsed.toLocaleString('de-DE')} € / {camp.budgetTotal.toLocaleString('de-DE')} €</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: `${(camp.budgetUsed / camp.budgetTotal) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'forecast' && (
          <motion.div 
            key="forecast"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Category progress lists */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{t('Forecast nach Funnel', 'Forecast by Funnel')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('Gewichtetes Volumen vs. Gesamtziel nach Produktkategorie.', 'Weighted volume vs total target by product category.')}</p>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'BU & Einkommen', id: 'bu', color: 'bg-slate-900' },
                  { label: 'Private Kranken', id: 'pkv', color: 'bg-blue-600' },
                  { label: 'Gewerbe & Cyber', id: 'commercial', color: 'bg-teal-500' },
                  { label: 'KFZ & Flotte', id: 'fleet', color: 'bg-amber-500' },
                  { label: 'Altersvorsorge', id: 'retirement', color: 'bg-green-500' },
                  { label: 'Sach & Wohngebäude', id: 'property', color: 'bg-sky-400' }
                ].map((item, idx) => {
                  const data = getCategoryForecastData(item.id);
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-baseline text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", item.color)}></span>
                          <span className="text-slate-800 font-extrabold">{item.label}</span>
                          <span className="text-[10px] text-slate-400 font-bold">({data.count})</span>
                        </div>
                        <span className="text-slate-900 font-extrabold">
                          {data.used.toLocaleString('de-DE')} € <span className="text-slate-400 font-semibold">/ {data.total.toLocaleString('de-DE')} €</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={cn("h-1.5 rounded-full transition-all duration-500", item.color)} 
                          style={{ width: `${data.total > 0 ? (data.used / data.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Top Deals list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">{t('Top Deals', 'Top Deals')}</h3>
              
              <div className="space-y-3">
                {topDeals.map((deal) => (
                  <div 
                    key={deal.id} 
                    onClick={() => setSelectedDealId(deal.id)}
                    className="p-3 border border-slate-100 hover:border-orange-200 rounded-xl flex items-center justify-between hover:shadow-sm transition-all group cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs leading-normal flex items-center gap-1 group-hover:text-orange-600 transition-colors">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {deal.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{deal.productName} · {deal.owner}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-sm">{deal.value}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{deal.probability}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div 
            key="activities"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 shadow-sm rounded-xl divide-y divide-slate-100"
          >
            {ACTIVITIES.map(act => (
              <div key={act.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-inner border bg-blue-50 text-blue-600 border-blue-100">
                    {act.type === 'appointment' && <Calendar className="w-4 h-4" />}
                    {act.type === 'email' && <Mail className="w-4 h-4" />}
                    {act.type === 'phone' && <Phone className="w-4 h-4" />}
                    {act.type === 'stage' && <ArrowUpRight className="w-4 h-4" />}
                    {act.type === 'forecast' && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{act.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{act.owner} · {act.time}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => showInfo(t('Aktivitäts-Details geöffnet.', 'Activity details opened.'))}
                  className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {t('Öffnen', 'Open')}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <CreateDealOverlay isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <DealDetailsOverlay dealId={selectedDealId} onClose={() => setSelectedDealId(null)} />
    </motion.div>
  );
}
