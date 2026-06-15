import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Users, GraduationCap, Bell, Search, Settings, Layers, LogOut, UserCircle, Server, Shield, PiggyBank, Loader2, ExternalLink, Calculator, Car, Home, ClipboardList, RefreshCw, MessageSquare, Calendar, TrendingUp, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { SettingsOverlay } from './SettingsOverlay';
import { useCrm } from '../lib/CrmContext';

const COURSES = [
  { id: 1, title: 'HubSpot CRM: Deals & Pipelines', category: 'HubSpot CRM' },
  { id: 2, title: 'Bedarfsanalyse im CRM dokumentieren', category: 'HubSpot CRM' },
  { id: 3, title: 'Grundlagen der Privathaftpflicht', category: 'Sachversicherung' },
  { id: 4, title: 'Cross-Selling: Sach & Leben', category: 'Sales' },
  { id: 5, title: 'Tarifoptimierung PKV', category: 'Personen & Vorsorge' },
  { id: 6, title: 'Expertenwissen Baufinanzierung', category: 'Finanzen & Anlage' },
  { id: 7, title: 'Dunkelverarbeitung & KI', category: 'Internal Services' }
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const { showInfo } = useNotImplemented();
  const { userRole, setUserRole, deals, customers, switchingProcesses } = useCrm();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSystemsOpen, setIsSystemsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const systemsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (systemsRef.current && !systemsRef.current.contains(event.target as Node)) {
        setIsSystemsOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSystemJump = (system: string) => {
    setIsSystemsOpen(false);
    setIsRedirecting(system);
    // Simulate SSO redirect delay
    setTimeout(() => {
      setIsRedirecting(null);
      // In a real application, this would do a window.location.href or window.open to the core system SSO URL
      showInfo(t('SSO-Anmeldung war erfolgreich. Das Kernsystem würde nun in einem neuen Tab geöffnet werden.', 'SSO login successful. The core system would now open in a new tab.'));
    }, 2500);
  };

  const navigation = [
    { name: t('Dashboard', 'Dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('Anträge', 'Applications'), href: '/applications', icon: ClipboardList },
    { name: t('Vertragsumdecker', 'Policy Switcher'), href: '/switching', icon: RefreshCw },
    { name: t('CRM Vertriebsfunnel', 'CRM Funnel'), href: '/crm', icon: Users },
    { name: t('Kundenkommunikation', 'Inbox'), href: '/communication', icon: MessageSquare },
    { name: t('Kalender & Aufgaben', 'Calendar & Tasks'), href: '/calendar', icon: Calendar },
    { name: t('Kunden-Datenbank', 'Customers DB'), href: '/customers', icon: Users },
    { name: t('Produktmatrix', 'Product Matrix'), href: '/products', icon: Layers },
    { name: t('Sales Cockpit (Admin)', 'Sales Cockpit (Admin)'), href: '/sales-cockpit', icon: TrendingUp, adminOnly: true },
    { name: t('Lern-Akademie', 'Academy'), href: '/catalog', icon: GraduationCap },
    { name: t('Benutzer & Rollen', 'Users & Roles'), href: '/users', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - dark, reminiscent of Camunda/HubSpot sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col fixed inset-y-0 z-10">
        <div className="p-6 flex items-center justify-center border-b border-slate-800 bg-slate-900">
          <img 
            src="/assets/logo_artemis-gruppe_negative.png" 
            alt="artemis gruppe" 
            className="h-9 w-auto object-contain" 
            style={{ maxHeight: '36px' }}
          />
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">{t('Hauptmenü', 'Main Menu')}</div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const isLocked = item.adminOnly && userRole !== 'administrator';
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group relative',
                  isActive 
                    ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isActive && (
                    <motion.div 
                      layoutId="active-navIndicator"
                      className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full" 
                    />
                  )}
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-orange-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span className="font-medium text-sm truncate">{item.name}</span>
                </div>
                {isLocked && (
                  <Lock className="w-3.5 h-3.5 text-slate-600 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white w-full rounded-lg hover:bg-slate-800/50 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="font-medium text-sm">{t('Einstellungen', 'Settings')}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="w-96 relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <form onSubmit={(e) => { e.preventDefault(); }}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t("Kurse, Produkte oder Kunden suchen...", "Search courses, products, or clients...")}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-transparent focus:border-orange-500 focus:bg-white rounded-md text-sm outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
              />
            </form>
            
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-[480px] bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-50 text-sm"
                >
                  <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {t('Graph-Datenbank Index-Suche', 'Graph DB Index Search')}
                    </span>
                    <span>{searchQuery ? t('Ergebnisse', 'Results') : t('Schnellvorschläge', 'Quick suggestions')}</span>
                  </div>
                  
                  <div className="max-h-[360px] overflow-y-auto p-2 space-y-4">
                    {!searchQuery ? (
                      <div className="p-2 space-y-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Beliebte Suchen', 'Popular searches')}</div>
                        <div className="flex flex-wrap gap-2">
                          {['Markus Weber', 'Cyber Risk', 'HubSpot', 'Dunkelverarbeitung'].map(term => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                setSearchQuery(term);
                                setIsSearchFocused(true);
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors border border-slate-200/50 cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      (() => {
                        const filteredCustomers = customers?.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())) || [];
                        const filteredDeals = deals?.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.company.toLowerCase().includes(searchQuery.toLowerCase())) || [];
                        const filteredCourses = COURSES.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase())) || [];
                        const filteredSwitching = switchingProcesses?.filter(s => s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || s.originalProvider.toLowerCase().includes(searchQuery.toLowerCase()) || s.insuranceType.toLowerCase().includes(searchQuery.toLowerCase())) || [];
                        const hasResults = filteredCustomers.length > 0 || filteredDeals.length > 0 || filteredCourses.length > 0 || filteredSwitching.length > 0;

                        if (!hasResults) {
                          return (
                            <div className="p-6 text-center text-slate-500 text-xs">
                              {t('Keine Treffer in Kunden, Deals, Kursen oder Verträgen.', 'No matches found in clients, deals, courses, or policies.')}
                            </div>
                          );
                        }

                        return (
                          <>
                            {/* Customers */}
                            {filteredCustomers.length > 0 && (
                              <div>
                                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Kunden', 'Customers')}</div>
                                <div className="space-y-1">
                                  {filteredCustomers.map(c => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        navigate('/customers');
                                        setIsSearchFocused(false);
                                        setSearchQuery('');
                                        showInfo(t(`Zu Kunde '${c.name}' navigiert.`, `Navigated to customer '${c.name}'.`));
                                      }}
                                      className="w-full text-left p-2 hover:bg-orange-50/50 rounded-lg flex items-center gap-2.5 transition-colors group cursor-pointer"
                                    >
                                      <Users className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-xs truncate">{c.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{c.email} • {c.phone}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Deals */}
                            {filteredDeals.length > 0 && (
                              <div>
                                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Deals / Opportunities', 'Deals')}</div>
                                <div className="space-y-1">
                                  {filteredDeals.map(d => (
                                    <button
                                      key={d.id}
                                      type="button"
                                      onClick={() => {
                                        navigate('/crm');
                                        setIsSearchFocused(false);
                                        setSearchQuery('');
                                        showInfo(t(`Zu Deal '${d.name}' navigiert.`, `Navigated to deal '${d.name}'.`));
                                      }}
                                      className="w-full text-left p-2 hover:bg-orange-50/50 rounded-lg flex items-center gap-2.5 transition-colors group cursor-pointer"
                                    >
                                      <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-xs truncate">{d.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{d.company} • {d.value}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Courses */}
                            {filteredCourses.length > 0 && (
                              <div>
                                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Akademie-Kurse', 'Academy Courses')}</div>
                                <div className="space-y-1">
                                  {filteredCourses.map(c => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        navigate('/catalog');
                                        setIsSearchFocused(false);
                                        setSearchQuery('');
                                        showInfo(t(`Zu Kurs '${c.title}' navigiert.`, `Navigated to course '${c.title}'.`));
                                      }}
                                      className="w-full text-left p-2 hover:bg-orange-50/50 rounded-lg flex items-center gap-2.5 transition-colors group cursor-pointer"
                                    >
                                      <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-xs truncate">{c.title}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{c.category}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Switching Processes */}
                            {filteredSwitching.length > 0 && (
                              <div>
                                <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('Umdeckungs-Verträge', 'Switching Policies')}</div>
                                <div className="space-y-1">
                                  {filteredSwitching.map(s => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => {
                                        navigate('/switching');
                                        setIsSearchFocused(false);
                                        setSearchQuery('');
                                        showInfo(t(`Zu Umdeckung für '${s.customerName}' navigiert.`, `Navigated to switching workflow for '${s.customerName}'.`));
                                      }}
                                      className="w-full text-left p-2 hover:bg-orange-50/50 rounded-lg flex items-center gap-2.5 transition-colors group cursor-pointer"
                                    >
                                      <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                                      <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800 text-xs truncate">{s.customerName}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{s.insuranceType} • {s.originalProvider}</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-100 p-1 rounded-md">
              <button 
                onClick={() => setLang('de')}
                className={cn('px-2 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors', lang === 'de' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700')}
              >
                DE
              </button>
              <button 
                onClick={() => setLang('en')}
                className={cn('px-2 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors', lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700')}
              >
                EN
              </button>
            </div>
            
            <div className="relative" ref={systemsRef}>
              <button 
                onClick={() => setIsSystemsOpen(!isSystemsOpen)} 
                className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Server className="h-4 w-4 text-orange-500" />
                {t('Kernsysteme', 'Core Systems')}
              </button>
              <AnimatePresence>
                {isSystemsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 text-sm"
                  >
                    <div className="p-3 border-b border-slate-100 font-bold text-slate-900 text-xs uppercase tracking-wider bg-slate-50">
                       {t('Absprung via SSO', 'Jump via SSO')}
                    </div>
                    <div className="p-2">
                       <button 
                         onClick={() => handleSystemJump('insurance')}
                         className="w-full text-left p-3 hover:bg-orange-50 flex items-start gap-3 rounded-lg group transition-colors"
                       >
                          <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                             <Shield className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{t('Versicherung', 'Insurance')}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{t('Policen & Schaden', 'Policies & Claims')}</p>
                          </div>
                       </button>
                       <button 
                         onClick={() => handleSystemJump('finance')}
                         className="w-full text-left p-3 hover:bg-blue-50 flex items-start gap-3 rounded-lg group transition-colors mt-1"
                       >
                          <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                             <PiggyBank className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{t('Investment', 'Investment')}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{t('Fonds & Depots', 'Funds & Portfolios')}</p>
                          </div>
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={toolsRef}>
              <button 
                onClick={() => setIsToolsOpen(!isToolsOpen)} 
                className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Calculator className="h-4 w-4 text-emerald-500" />
                {t('Rechner & Portale', 'Calculators & Portals')}
              </button>
              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 text-sm"
                  >
                    <div className="p-3 border-b border-slate-100 font-bold text-slate-900 text-xs uppercase tracking-wider bg-slate-50">
                       {t('Vergleichsrechner (Auto-Login)', 'Comparison Tools (Auto-Login)')}
                    </div>
                    <div className="p-2 border-b border-slate-100 grid grid-cols-2 gap-2">
                       <button onClick={() => handleSystemJump('nafi')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <Car className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">NAFIKFZ</p>
                            <p className="text-[10px] text-slate-500">Auto & Flotte</p>
                          </div>
                       </button>
                       <button onClick={() => handleSystemJump('cpit')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <Home className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">Cpit</p>
                            <p className="text-[10px] text-slate-500">Gewerbe & Sach</p>
                          </div>
                       </button>
                       <button onClick={() => handleSystemJump('thinkinsurance')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <Calculator className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">ThinkInsurance</p>
                            <p className="text-[10px] text-slate-500">Biometrie & Leben</p>
                          </div>
                       </button>
                       <button onClick={() => handleSystemJump('psponline')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <Shield className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">PSPonline</p>
                            <p className="text-[10px] text-slate-500">Plattform Tarifierung</p>
                          </div>
                       </button>
                    </div>
                    
                    <div className="p-3 border-b border-slate-100 font-bold text-slate-900 text-xs uppercase tracking-wider bg-slate-50 mt-1">
                       {t('Direkt-Portale', 'Direct Portals')}
                    </div>
                    <div className="p-2 grid grid-cols-2 gap-2">
                       <button onClick={() => handleSystemJump('bawue')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">BaWü Login</p>
                          </div>
                       </button>
                       <button onClick={() => handleSystemJump('hdi')} className="text-left p-2 hover:bg-slate-50 flex flex-col gap-1 items-start rounded-lg group transition-colors border border-transparent hover:border-slate-200">
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          <div>
                            <p className="font-bold text-slate-900">HDI Business</p>
                          </div>
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={notificationsRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer focus:outline-none">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 text-sm"
                  >
                    <div className="p-4 border-b border-slate-100 font-bold text-slate-900 flex justify-between items-center">
                       {t('Benachrichtigungen', 'Notifications')}
                       <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">3 neu</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                        <p className="font-semibold text-slate-800">{t('Neuer Deal', 'New Deal')}</p>
                        <p className="text-slate-500 text-xs mt-1">{t('Ein neuer Deal wurde im CRM hinzugefügt.', 'A new deal was added in CRM.')}</p>
                      </div>
                      <div className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                        <p className="font-semibold text-slate-800">{t('Kurszertifikat', 'Course Certificate')}</p>
                        <p className="text-slate-500 text-xs mt-1">{t('Dein Kurs "HubSpot CRM" wurde abgeschlossen.', 'Your course "HubSpot CRM" is completed.')}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={profileRef}>
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Gawain MacMilan</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold">
                    {userRole === 'administrator' ? t('Admin', 'Administrator') : 
                     userRole === 'makler' ? t('Makler', 'Broker') :
                     userRole === 'mitarbeiter' ? t('Mitarbeiter', 'Employee') :
                     t('Buchhaltung', 'Accounting')}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center shadow-inner">
                  <span className="text-sm font-bold text-white">GM</span>
                </div>
              </div>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 text-sm"
                  >
                    <div className="py-2">
                       <div className="px-4 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          {t('Rolle wechseln', 'Switch Role')}
                       </div>
                       <div className="px-3 py-1.5">
                          <select
                            value={userRole}
                            onChange={(e) => {
                              setUserRole(e.target.value as any);
                              setIsProfileOpen(false);
                              showInfo(t(`Rolle zu ${e.target.value.toUpperCase()} gewechselt`, `Role changed to ${e.target.value.toUpperCase()}`));
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                          >
                            <option value="administrator">Administrator</option>
                            <option value="makler">Makler (Broker)</option>
                            <option value="mitarbeiter">Mitarbeiter (Employee)</option>
                            <option value="buchhaltung">Buchhaltung</option>
                          </select>
                       </div>
                       <div className="h-px bg-slate-100 my-1"></div>
                       <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700">
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          {t('Mein Profil', 'My Profile')}
                       </button>
                       <button onClick={() => { setIsProfileOpen(false); setIsSettingsOpen(true); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 border-b border-slate-100">
                          <Settings className="w-4 h-4 text-slate-400" />
                          {t('Einstellungen', 'Settings')}
                       </button>
                        <button onClick={() => { sessionStorage.removeItem('fininsure_auth'); window.location.reload(); }} className="w-full text-left px-4 py-2 mt-1 hover:bg-slate-50 flex items-center gap-2 text-orange-600">
                           <LogOut className="w-4 h-4 text-orange-500" />
                           {t('Abmelden', 'Log out')}
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
      <SettingsOverlay isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* SSO Redirect Overlay */}
      <AnimatePresence>
        {isRedirecting && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center justify-center p-8 text-center"
            >
              <div className={cn("p-4 rounded-full mb-6 relative", 
                isRedirecting === 'insurance' ? "bg-orange-100" : 
                isRedirecting === 'finance' ? "bg-blue-100" : 
                "bg-emerald-100"
              )}>
                 {isRedirecting === 'insurance' ? (
                    <Shield className="w-10 h-10 text-orange-600" />
                 ) : isRedirecting === 'finance' ? (
                    <PiggyBank className="w-10 h-10 text-blue-600" />
                 ) : isRedirecting === 'nafi' ? (
                    <Car className="w-10 h-10 text-emerald-600" />
                 ) : isRedirecting === 'cpit' ? (
                    <Home className="w-10 h-10 text-emerald-600" />
                 ) : isRedirecting === 'thinkinsurance' || isRedirecting === 'psponline' ? (
                    <Calculator className="w-10 h-10 text-emerald-600" />
                 ) : (
                    <ExternalLink className="w-10 h-10 text-emerald-600" />
                 )}
                 <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                 {isRedirecting === 'insurance' ? t('Verbinde zu ICIS®', 'Connecting to ICIS®') : 
                  isRedirecting === 'finance' ? t('Verbinde zu FinConnect', 'Connecting to FinConnect') :
                  isRedirecting === 'nafi' ? t('Öffne NAFIKFZ', 'Opening NAFIKFZ') :
                  isRedirecting === 'cpit' ? t('Öffne Cpit', 'Opening Cpit') :
                  isRedirecting === 'thinkinsurance' ? t('Öffne ThinkInsurance', 'Opening ThinkInsurance') :
                  isRedirecting === 'psponline' ? t('Öffne PSPonline', 'Opening PSPonline') :
                  isRedirecting === 'bawue' ? t('Verbinde zu BaWü', 'Connecting to BaWü') :
                  isRedirecting === 'hdi' ? t('Verbinde zu HDI', 'Connecting to HDI') :
                  t('Verbinde...', 'Connecting...')}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                 {t('Automatischer SSO-Login wird durchgeführt. Bitte haben Sie einen Moment Geduld...', 'Automated SSO login in progress. Please bear with us a moment...')}
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2.5, ease: "linear" }}
                   className={cn("h-full rounded-full", isRedirecting === 'insurance' ? "bg-orange-500" : isRedirecting === 'finance' ? "bg-blue-500" : "bg-emerald-500")}
                 />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
