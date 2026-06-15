import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Send, Sparkles, Instagram, Facebook, 
  Linkedin, MessageCircle, Clock, Mail, CheckCircle2,
  Calendar, ShieldAlert, ArrowRight
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useCrm, Conversation, ChatMessage } from '../lib/CrmContext';
import { cn } from '../lib/utils';

export function InboxView() {
  const { t } = useI18n();
  const { conversations, messages, sendMessage, markConversationRead } = useCrm();

  const [activeConvId, setActiveConvId] = useState<string | null>('conv4'); // Markus Vogel active by default
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeMessages = messages.filter(m => m.conversationId === activeConvId);

  useEffect(() => {
    if (activeConvId && activeConv?.unreadCount) {
      markConversationRead(activeConvId);
    }
  }, [activeConvId, activeConv?.unreadCount, markConversationRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChannel = activeChannelFilter === 'all' || 
                          (activeChannelFilter === 'facebook' ? c.channel === 'facebook' : c.channel === activeChannelFilter);
    return matchesSearch && matchesChannel;
  });

  const getChannelIcon = (channel: string, className?: string) => {
    switch (channel) {
      case 'whatsapp': 
        return <MessageCircle className={cn("text-green-500 shrink-0", className)} />;
      case 'instagram': 
        return <Instagram className={cn("text-red-500 shrink-0", className)} />;
      case 'facebook': 
        return <Facebook className={cn("text-blue-600 shrink-0", className)} />;
      case 'linkedin': 
        return <Linkedin className={cn("text-blue-500 shrink-0", className)} />;
      case 'email': 
        return <Mail className={cn("text-blue-500 shrink-0", className)} />;
      default: 
        return <MessageCircle className={cn("shrink-0", className)} />;
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;
    sendMessage(activeConvId, replyText);
    setReplyText('');
  };

  const handleSelectTemplate = (type: 'confirm' | 'request' | 'proposal' | 'followup') => {
    let templateText = '';
    const name = activeConv?.participantName || 'Kunde';
    
    switch (type) {
      case 'confirm':
        templateText = t(
          `Hallo ${name}, hiermit bestätige ich unseren Termin. Sie können den Termin über folgenden Link direkt eintragen: [Link]`,
          `Hello ${name}, I hereby confirm our meeting. You can add the appointment directly via this link: [Link]`
        );
        break;
      case 'request':
        templateText = t(
          `Hallo ${name}, zur weiteren Bearbeitung benötigen wir bitte noch folgende Unterlagen von Ihnen: [Unterlagen]. Vielen Dank!`,
          `Hello ${name}, for further processing we kindly need the following documents from you: [Documents]. Thank you!`
        );
        break;
      case 'proposal':
        templateText = t(
          `Hallo ${name}, basierend auf unserer Analyse habe ich Ihnen ein unverbindliches Beratungsangebot ausgearbeitet. Passt es Ihnen für ein kurzes Telefonat?`,
          `Hello ${name}, based on our analysis I have prepared a non-binding offer. Does a quick call work for you?`
        );
        break;
      case 'followup':
        templateText = t(
          `Hallo ${name}, vielen Dank für das informative Gespräch heute. Anbei sende ich Ihnen die besprochenen Unterlagen. Bei Fragen stehe ich gerne zur Verfügung.`,
          `Hello ${name}, thank you for the informative call today. Attached are the discussed documents. Let me know if you have any questions.`
        );
        break;
    }
    setReplyText(templateText);
  };

  const getAiProposalText = () => {
    switch (activeConvId) {
      case 'conv1':
        return t(
          "Terminverschiebung auf nächste Woche vorschlagen. Kalenderlink beilegen. Tonfall: freundlich-zuvorkommend.",
          "Suggest meeting reschedule to next week. Attach calendar link. Tone: friendly-helpful."
        );
      case 'conv2':
        return t(
          "PKV-Tarifwechselunterlagen per E-Mail anbieten. Nach aktuellem Status der Dokumente fragen. Tonfall: professionell.",
          "Offer private health insurance change forms. Ask for document status. Tone: professional."
        );
      case 'conv3':
        return t(
          "BU-Infos für Selbstständige bereitstellen und Rückruf anbieten. Tonfall: einladend.",
          "Provide occupational disability details for self-employed and offer callback. Tone: inviting."
        );
      case 'conv4':
        return t(
          "Termin auf Mi, 11.06 um 10:00 vorschlagen. Kalenderlink anhängen. Tonfall: freundlich-professionell.",
          "Propose appointment on Wed, 11.06 at 10:00. Attach calendar link. Tone: friendly-professional."
        );
      case 'conv5':
        return t(
          "Terminvorschläge für Telefonat anbieten. Verfügbare Zeiten: heute 15:00, morgen 10:00. Tonfall: serviceorientiert.",
          "Offer phone call slots. Available times: today 15:00, tomorrow 10:00. Tone: service-oriented."
        );
      case 'conv6':
        return t(
          "Police-Bestätigung bestätigen, Archivierung im Kundenkonto Hoffmann avisieren. Tonfall: sachlich.",
          "Confirm policy confirmation, advise archiving in customer account Hoffmann. Tone: factual."
        );
      default:
        return t("Antwort auf Kundenanfrage formulieren.", "Formulate reply to customer query.");
    }
  };

  const handleApplyAiProposal = () => {
    let reply = '';
    const name = activeConv?.participantName || 'Kunde';
    
    switch (activeConvId) {
      case 'conv1':
        reply = t(
          "Hallo Familie Hoffmann, kein Problem! Sollen wir den Termin auf nächsten Dienstag um 14:00 Uhr verschieben? Anbei finden Sie meinen Kalenderlink.",
          "Hello Hoffmann family, no problem! Shall we move the meeting to next Tuesday at 14:00? Below is my calendar link."
        );
        break;
      case 'conv2':
        reply = t(
          "Sehr geehrter Herr Müller, anbei sende ich Ihnen die gewünschten Unterlagen für den PKV-Tarifwechsel. Wie steht es um Ihren aktuellen Gesundheitszustand?",
          "Dear Mr. Müller, attached are the requested PKV tariff change documents. What is your current health status?"
        );
        break;
      case 'conv3':
        reply = t(
          "Hallo Sandra, gerne beantworte ich deine Fragen zur Berufsunfähigkeitsversicherung für Selbstständige. Sollen wir dazu kurz telefonieren?",
          "Hello Sandra, I'd be happy to answer your questions regarding disability cover for the self-employed. Shall we hop on a quick call?"
        );
      case 'conv4':
        reply = t(
          "Guten Tag Herr Vogel, vielen Dank! Sollen wir einen neuen Termin für Mittwoch, den 11.06. um 10:00 Uhr vereinbaren? Hier ist mein Kalenderlink: [Link].",
          "Hello Mr. Vogel, thank you! Shall we schedule a new slot for Wednesday, 11.06. at 10:00? Here is my calendar link: [Link]."
        );
        break;
      case 'conv5':
        reply = t(
          "Hallo Herr Lindner, gerne! Passt es Ihnen heute Nachmittag um 15:00 Uhr für einen kurzen Call?",
          "Hello Mr. Lindner, sure! Does this afternoon at 15:00 work for a quick call?"
        );
        break;
      case 'conv6':
        reply = t(
          "Sehr geehrte Damen und Herren, vielen Dank für die Police-Bestätigung. Ich habe diese dem Kundenkonto Hoffmann zugeordnet.",
          "Dear Sir or Madam, thank you for the policy confirmation. I have mapped this to the Hoffmann customer file."
        );
        break;
    }
    setReplyText(reply);
  };

  const FILTERS = [
    { id: 'all', label: 'Alle' },
    { id: 'email', label: 'Email' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'facebook', label: 'Meta' }
  ];

  const getAvatarInitials = (name: string) => {
    // Special handling to match Markus Vogel -> "MA" avatar in screenshot
    if (name === 'Markus Vogel') return 'MA';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[720px] items-stretch">
      {/* Column 1: Conversations list (3 cols) */}
      <div className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveChannelFilter(f.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border",
                  activeChannelFilter === f.id
                    ? "bg-[#0f172a] border-[#0f172a] text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-semibold">
              {t('Keine Konversationen gefunden.', 'No conversations found.')}
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isActive = activeConvId === conv.id;
              const hasUnread = conv.unreadCount > 0;
              const isUnassigned = conv.ticketNr === 'Nicht zugewiesen';
              
              return (
                <div 
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors relative flex items-start gap-3 border-l-2", 
                    isActive 
                      ? "bg-slate-50/80 border-slate-900" 
                      : "border-transparent hover:bg-slate-50/40"
                  )}
                >
                  {/* Channel icon on left */}
                  <div className="mt-1 shrink-0">
                    {getChannelIcon(conv.channel, "w-4 h-4")}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h4 className={cn(
                        "text-xs font-extrabold truncate", 
                        hasUnread ? "text-slate-900" : "text-slate-800"
                      )}>
                        {conv.participantName}
                      </h4>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                          {conv.timestamp}
                        </span>
                        {hasUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                        )}
                      </div>
                    </div>

                    <p className={cn(
                      "text-[11px] line-clamp-2 leading-relaxed pr-2", 
                      hasUnread ? "text-slate-800 font-semibold" : "text-slate-500"
                    )}>
                      {conv.lastMessage}
                    </p>

                    {/* Assigned / Unassigned Badges */}
                    <div className="pt-1">
                      {isUnassigned ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-orange-50 border border-orange-200 text-orange-700">
                          {t('Nicht zugewiesen', 'Unassigned')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-100 border border-slate-200 text-slate-600">
                          <ArrowRight className="w-2.5 h-2.5" />
                          {conv.ticketNr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 2: Chat window (6 cols) */}
      <div className="col-span-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        {activeConvId && activeConv ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                  {getAvatarInitials(activeConv.participantName)}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {activeConv.participantName}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-wider">
                    {activeConv.channel === 'facebook' ? 'Meta' : activeConv.channel} · {activeConv.ticketNr}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/40">
              {activeMessages.map(msg => {
                const isMe = msg.sender === 'me';
                const formattedTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const timeString = isMe ? "vor 4 Min" : (msg.content.includes('Perfekt') ? "vor 2 Min" : "vor 2 Std");

                return (
                  <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl max-w-[80%] shadow-sm", 
                      isMe 
                        ? "bg-[#2b85e0] text-white" 
                        : "bg-white border border-slate-200 text-slate-800"
                    )}>
                      <p className="text-xs font-semibold leading-relaxed">{msg.content}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 mt-1.5 px-1 uppercase tracking-wider">
                      {timeString}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-3">
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t("Antwort schreiben oder KI-Vorlage wählen...", "Write a response or choose an AI template...")}
                rows={3}
                className="w-full p-4 bg-white border border-slate-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all text-xs font-semibold placeholder:text-slate-400 leading-relaxed resize-none"
              />
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleApplyAiProposal}
                  className="flex items-center gap-1.5 bg-blue-50/80 hover:bg-blue-100/60 border border-blue-200 text-blue-600 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('KI-Antwort generieren', 'Generate AI Response')}
                </button>
                <button 
                  onClick={() => handleSend()}
                  disabled={!replyText.trim()}
                  className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  {t('Senden', 'Send')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
            <h4 className="font-bold text-slate-800">{t('Posteingang', 'Inbox')}</h4>
            <p className="text-xs text-center mt-1.5 max-w-xs leading-relaxed text-slate-400 font-semibold">
              {t('Wählen Sie eine Konversation aus, um den Chatverlauf zu sehen.', 'Select a conversation to view the chat history.')}
            </p>
          </div>
        )}
      </div>

      {/* Column 3: AI Assistant (3 cols) */}
      <div className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        {/* Header Block */}
        <div className="bg-[#112a46] p-4 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">
              {t('KI-Assistent', 'AI Assistant')}
            </h3>
          </div>
          <p className="text-[10px] text-slate-350 font-bold mt-1.5 leading-relaxed">
            {t('Analysiert Verlauf und schlägt passende Antworten vor.', 'Analyzes context and proposes tailored reply drafts.')}
          </p>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
          {/* Templates Section */}
          <div className="space-y-2.5">
            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              {t('Vorlagen', 'Templates')}
            </h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleSelectTemplate('confirm')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] font-extrabold text-slate-700 text-left transition-all cursor-pointer shadow-sm"
              >
                {t('Terminbestätigung & Kalenderlink', 'Appointment Confirmation & Link')}
              </button>
              <button 
                onClick={() => handleSelectTemplate('request')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] font-extrabold text-slate-700 text-left transition-all cursor-pointer shadow-sm"
              >
                {t('Unterlagen-Anfrage höflich', 'Polite Documents Request')}
              </button>
              <button 
                onClick={() => handleSelectTemplate('proposal')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] font-extrabold text-slate-700 text-left transition-all cursor-pointer shadow-sm"
              >
                {t('Beratungsangebot vorschlagen', 'Propose Consulting Offer')}
              </button>
              <button 
                onClick={() => handleSelectTemplate('followup')}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3 rounded-lg text-[10px] font-extrabold text-slate-700 text-left transition-all cursor-pointer shadow-sm"
              >
                {t('Follow-up nach Gespräch', 'Follow-up post Meeting')}
              </button>
            </div>
          </div>

          {/* AI Suggestions Section */}
          {activeConvId && (
            <div className="space-y-2.5">
              <h4 className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                {t('KI-Vorschlag', 'AI Draft Proposal')}
              </h4>
              <div className="bg-blue-50/65 border border-blue-200 p-4 rounded-xl space-y-3">
                <p className="text-[10.5px] font-bold text-slate-750 leading-relaxed">
                  {getAiProposalText()}
                </p>
                <button 
                  onClick={handleApplyAiProposal}
                  className="w-full bg-white hover:bg-blue-50/50 border border-blue-200 text-[#2563eb] py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm text-center"
                >
                  {t('Übernehmen', 'Apply')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
