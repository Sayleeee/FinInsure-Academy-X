import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { Search, Sparkles, Building2, Target, Package, ChevronRight, X, ArrowRight, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export function KnowledgeBase() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const categories = [
    {
      id: 'companies',
      title: t('Unternehmen der Gruppe', 'Group Companies'),
      icon: Building2,
      articles: [
        { title: 'artemis Finanzdienstleistung GmbH - Muttergesellschaft', desc: 'Die Holding der gesamten artemis Gruppe.' },
        { title: 'SafeGuard Assekuranz', desc: 'Spezialisten für Gewerbe- und Industrieversicherungen.' },
        { title: 'LifeInvest GmbH', desc: 'Fokus auf Altersvorsorge und Investmentlösungen.' }
      ]
    },
    {
      id: 'usps',
      title: t('Unsere USPs', 'Our USPs'),
      icon: Target,
      articles: [
        { title: 'Digitale Antragsstrecken', desc: '100% papierlose Prozesse für alle Kernprodukte.' },
        { title: 'Best-Advice Garantie', desc: 'Unabhängige Produktauswahl nach objektiven Kriterien.' },
        { title: '24/7 Makler-Support', desc: 'Eigener Innendienst für alle angeschlossenen Partner.' }
      ]
    },
    {
      id: 'products',
      title: t('Kernprodukte', 'Core Products'),
      icon: Package,
      articles: [
        { title: 'Premium D&O Schutz', desc: 'Deckungskonzept mit weitreichenden Nachhaftungsfristen.' },
        { title: 'Fondsgebundene Rente', desc: 'Flexibles Investment mit Garantiefaktor-Optionen.' },
        { title: 'Cyber-Protection', desc: 'Rundumschutz inklusive Assistance-Leistungen bei Hacks.' }
      ]
    },
    {
      id: 'tariffs',
      title: t('Tarife, Bedingungen & Provisionen', 'Tariffs, Conditions & Commissions'),
      icon: Target,
      articles: [
        { title: 'Courtage-Übersicht 2026', desc: 'Detaillierte Liste der Abschlussprovisionen über alle Sparten.' },
        { title: 'Allg. Versicherungsbedingungen (AHB)', desc: 'Aktuelle AHB Version 01.2026 inkl. Leistungsverbesserungen.' },
        { title: 'Rating & Annahmerichtlinien', desc: 'Gesundheitsfragen und Annahmerichtlinien für Biometrie.' }
      ]
    }
  ];

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const userMessage = searchQuery;
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setSearchQuery('');
    setIsTyping(true);

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: t('Das ist eine gute Frage zu unserer Produktmatrix. Die artemis Gruppe bietet hierfür umfassende Lösungen über unsere digitalen Antragsstrecken an. Weitere Details findest du in unseren Steckbriefen.', 'That is a good question about our product matrix. The artemis Group offers comprehensive solutions for this via our digital application processes. You can find more details in our profiles.') 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Search / Chat Area */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-400" />
          {t('Wie kann ich helfen?', 'How can I help?')}
        </h2>
        <p className="text-slate-300 mb-6">
          {t('Stelle Fragen zur Gruppe, unseren USPs oder spezifischen Produktdetails.', 'Ask questions about the group, our USPs, or specific product details.')}
        </p>

        {chatHistory.length > 0 && (
          <div className="bg-white/10 rounded-xl p-4 mb-6 max-h-64 overflow-y-auto space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-white" /></div>}
                <div className={cn("px-4 py-2 rounded-2xl max-w-[80%] text-sm", msg.role === 'user' ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-800")}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0"><MessageCircle className="w-4 h-4 text-white" /></div>}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><Sparkles className="w-4 h-4 text-white" /></div>
                <div className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-500 text-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Frage an die Wissensdatenbank...", "Question for the knowledge base...")}
            className="w-full pl-4 pr-12 py-3.5 bg-white rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
          />
          <button 
            type="submit"
            disabled={!searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Categories & Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-50 p-2.5 rounded-lg">
                <cat.icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
            </div>
            <div className="space-y-3">
              {cat.articles.map((article, aIdx) => (
                <div 
                  key={aIdx} 
                  onClick={() => setSelectedArticle(article)}
                  className="group flex flex-col p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">{article.title}</h4>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{article.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Article Overlay */}
      <AnimatePresence>
        {selectedArticle && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900">{selectedArticle.title}</h2>
                <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors border border-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 mb-6">{selectedArticle.desc}</p>
                <h3 className="text-base font-bold text-slate-900 mb-3">{t('Details & Fakten', 'Details & Facts')}</h3>
                <p className="text-sm text-slate-600 mb-4 text-justify">
                  {t('Dies ist ein detaillierter Steckbrief für das ausgewählte Thema. Die artemis Gruppe legt großen Wert auf Transparenz und eine klare Kommunikation unserer Vorteile.', 'This is a detailed profile for the selected topic. The artemis Group places great value on transparency and clear communication of our advantages.')}
                </p>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                  <h4 className="text-sm font-bold text-orange-800 mb-2">{t('Kernaussage', 'Key takeaway')}</h4>
                  <p className="text-sm text-orange-700">{t('Perfekt geeignet für den Vertrieb und als Argumentationshilfe im Kundengespräch.', 'Perfectly suited for sales and as an argumentation aid in customer meetings.')}</p>
                </div>
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                  <li>{t('Höchste Qualitätsstandards in der Abwicklung.', 'Highest quality standards in processing.')}</li>
                  <li>{t('Schneller und zuverlässiger Support.', 'Fast and reliable support.')}</li>
                  <li>{t('Marktführende Konditionen.', 'Market-leading conditions.')}</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
