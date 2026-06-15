import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Clock, Star, ArrowRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { CourseDetailsOverlay, Course } from '../components/CourseDetailsOverlay';

export function Catalog() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const CATEGORIES = [
    t('Alle Kategorien', 'All Categories'), 
    t('HubSpot CRM', 'HubSpot CRM'), 
    t('Sachversicherung', 'P&C Insurance'), 
    t('Personen & Vorsorge', 'Life & Health'), 
    t('Finanzen & Anlage', 'Finance'),
    t('Internal Services', 'Internal Services')
  ];

  const COURSES = [
    {
      id: 1,
      title: t('HubSpot CRM: Deals & Pipelines', 'HubSpot CRM: Deals & Pipelines'),
      category: 'HubSpot CRM',
      level: t('Einsteiger', 'Beginner'),
      duration: '1h 30m',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: t('Bedarfsanalyse im CRM dokumentieren', 'Documenting Assessments in CRM'),
      category: 'HubSpot CRM',
      level: t('Fortgeschritten', 'Advanced'),
      duration: '45m',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: t('Grundlagen der Privathaftpflicht', 'Basics of Personal Liability'),
      category: 'Sachversicherung',
      level: t('Einsteiger', 'Beginner'),
      duration: '2h 00m',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: t('Cross-Selling: Sach & Leben', 'Cross-Selling: P&C & Life'),
      category: 'Sales',
      level: t('Fortgeschritten', 'Advanced'),
      duration: '1h 15m',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: t('Tarifoptimierung PKV', 'Private Health Tariff Optimisation'),
      category: 'Personen & Vorsorge',
      level: t('Experte', 'Expert'),
      duration: '3h 30m',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      title: t('Expertenwissen Baufinanzierung', 'Expert Knowledge Mortgages'),
      category: 'Finanzen & Anlage',
      level: t('Fortgeschritten', 'Advanced'),
      duration: '4h 00m',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 7,
      title: t('Dunkelverarbeitung & KI', 'Dark Processing & AI'),
      category: 'Internal Services',
      level: t('Fortgeschritten', 'Advanced'),
      duration: '55m',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 8,
      title: t('Gewerbliche Sachversicherung', 'Commercial P&C Insurance'),
      category: 'Sachversicherung',
      level: t('Fortgeschritten', 'Advanced'),
      duration: '2h 15m',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 9,
      title: t('Altersvorsorge 2026', 'Retirement Planning 2026'),
      category: 'Personen & Vorsorge',
      level: t('Einsteiger', 'Beginner'),
      duration: '1h 50m',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 10,
      title: t('ETFs und Fondsgebundene Anlage', 'ETFs and Mutual Funds'),
      category: 'Finanzen & Anlage',
      level: t('Experte', 'Expert'),
      duration: '3h 10m',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0]);

  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Exact match on 'Alle Kategorien'/All Categories
    const matchesCategory = activeCategory === CATEGORIES[0] || 
                            course.category.toLowerCase() === activeCategory.toLowerCase();
                            
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('Akademie Katalog', 'Learning Catalog')}</h1>
          <p className="text-slate-500 mt-2 text-lg">
            {t('Durchsuche Kurse zu Software (HubSpot), Produkten und Vertrieb in unserem Netzwerk.', 'Browse software (HubSpot), product, and sales courses in our consortium.')}
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <form onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Kurse suchen...', 'Search courses...')}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat, i) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredCourses.length > 0 ? filteredCourses.map((course) => (
          <div key={course.id} onClick={() => setSelectedCourse(course)} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group flex flex-col hover:border-orange-200 cursor-pointer">
            <div className="h-44 relative overflow-hidden bg-slate-100">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase text-slate-800">
                {course.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                <span>&bull;</span>
                <span className="text-orange-600">{course.level}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{course.title}</h3>
              
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-700">{course.rating}</span>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  {t('Details ansehen', 'View Course')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            {t('Keine Kurse gefunden.', 'No courses found.')}
          </div>
        )}
      </div>
      
      <CourseDetailsOverlay course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </motion.div>
  );
}
