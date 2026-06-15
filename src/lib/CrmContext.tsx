import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Deal {
  id: string;
  name: string;
  email: string;
  company: string;
  value: string;
  age: string;
  stage: string;
  probability: number;
  temperature: 'hot' | 'warm' | 'cold';
  owner: string;
  category: 'bu' | 'pkv' | 'commercial' | 'fleet' | 'retirement' | 'property';
  lastActivity: string;
  nextStep: string;
  productName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'waiting' | 'completed';
  priority: 'low' | 'medium' | 'high';
  linkedCustomer: string;
  linkedDealId?: string;
  hasDocuments: boolean;
  documentName?: string;
  tags?: string[];
  comments?: { id: string, text: string, timestamp: string }[];
  syncStatus: 'synced' | 'pending';
}

export interface Customer {
  id: string;
  type: 'person' | 'company';
  name: string;
  email: string;
  phone: string;
  address: string;
  syncStatus: 'synced' | 'pending';
}

export interface Conversation {
  id: string;
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'email' | 'phone';
  participantName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  linkedCustomerId?: string;
  ticketNr?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'me' | 'contact';
  content: string;
  timestamp: string;
  isAiAction?: boolean;
}

export type SwitchingStatus = 'identifiziert' | 'angebot_erstellt' | 'kunde_informiert' | 'unterlagen_eingegangen' | 'umdeckung_beantragt' | 'abgeschlossen' | 'abgelehnt';

export interface SwitchingProcess {
  id: string;
  vuNr: string;
  customerId: string;
  customerName: string;
  originalProvider: string;
  newProvider: string;
  insuranceType: string;
  status: SwitchingStatus;
  fileName: string;
  oldPremium: string;
  newPremium: string;
  assignedTo: string; // initials like 'SB', 'MK', 'AD', etc.
  notes?: string;
  history?: Array<{ date: string; action: string }>;
  syncStatus: 'pending' | 'synced';
  createdAt: string;
}

interface CrmContextType {
  deals: Deal[];
  addDeal: (deal: Partial<Deal> & { name: string; company: string }) => void;
  updateDealStage: (id: string, newStage: string) => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'syncStatus'>) => void;
  updateTaskStatus: (id: string, newStatus: Task['status']) => void;
  addCommentToTask: (taskId: string, text: string) => void;
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'syncStatus'>) => void;
  updateCustomer: (id: string, updates: Partial<Omit<Customer, 'id' | 'syncStatus'>>) => void;
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (conversationId: string, content: string, isAiAction?: boolean) => void;
  linkConversationToCustomer: (conversationId: string, customerId: string) => void;
  markConversationRead: (conversationId: string) => void;
  switchingProcesses: SwitchingProcess[];
  addSwitchingProcess: (process: Omit<SwitchingProcess, 'id' | 'syncStatus' | 'createdAt' | 'vuNr' | 'history'>) => void;
  updateSwitchingProcessStatus: (id: string, newStatus: SwitchingProcess['status']) => void;
  updateSwitchingProcess: (id: string, updates: Partial<Omit<SwitchingProcess, 'id' | 'syncStatus' | 'createdAt'>>) => void;
  userRole: 'administrator' | 'makler' | 'mitarbeiter' | 'buchhaltung';
  setUserRole: (role: 'administrator' | 'makler' | 'mitarbeiter' | 'buchhaltung') => void;
}


const INITIAL_DEALS: Deal[] = [
  { id: '1', name: 'Petra Schulz', email: 'petra.schulz@mail.de', company: 'BU Akademiker', value: '1.800 €', age: '2 Tage', stage: 'lead', probability: 15, temperature: 'warm', owner: 'S. Berger', category: 'bu', lastActivity: 'vor 2 Std.', nextStep: 'Erstkontakt anrufen', productName: 'BU Akademiker' },
  { id: '2', name: 'Auto Service Köhler', email: 'Köhler GmbH', company: 'KFZ-Flotte (8)', value: '6.400 €', age: '5 Tage', stage: 'lead', probability: 20, temperature: 'hot', owner: 'M. Koch', category: 'fleet', lastActivity: 'gestern', nextStep: 'Bedarf qualifizieren', productName: 'KFZ-Flotte (8)' },
  { id: '3', name: 'Hofbauer GbR', email: 'Hofbauer GbR', company: 'Inhaltsversicherung', value: '2.980 €', age: '3 Tage', stage: 'lead', probability: 15, temperature: 'warm', owner: 'A. Direktor', category: 'property', lastActivity: 'vor 3 Tagen', nextStep: 'Termin vereinbaren', productName: 'Inhaltsversicherung' },
  { id: '4', name: 'Jonas Lehmann', email: 'j.lehmann@web.de', company: 'BU Junior', value: '980 €', age: '1 Tag', stage: 'firstContact', probability: 25, temperature: 'warm', owner: 'S. Berger', category: 'bu', lastActivity: 'heute 09:14', nextStep: 'Termin vereinbaren', productName: 'BU Junior' },
  { id: '5', name: 'Familie Becker', email: 'becker@mail.de', company: 'Wohngebäude', value: '720 €', age: '4 Tage', stage: 'firstContact', probability: 20, temperature: 'cold', owner: 'L. Frei', category: 'property', lastActivity: 'vor 4 Tagen', nextStep: 'Wiedervorlage', productName: 'Wohngebäude' },
  { id: '6', name: 'Studio Nord GmbH', email: 'Studio Nord', company: 'Cyber Premium', value: '4.200 €', age: '4 Std.', stage: 'needsAnalysis', probability: 45, temperature: 'hot', owner: 'M. Koch', category: 'commercial', lastActivity: 'heute 11:22', nextStep: 'Risikoanalyse senden', productName: 'Cyber Premium' },
  { id: '7', name: 'Thomas Reuter', email: 'reuter@beratung.de', company: 'Rürup Rente', value: '2.400 €', age: '2 Tage', stage: 'needsAnalysis', probability: 40, temperature: 'warm', owner: 'S. Berger', category: 'retirement', lastActivity: 'gestern', nextStep: 'Vorschlag ausarbeiten', productName: 'Rürup Rente' },
  { id: '8', name: 'Markus Vogel', email: 'm.vogel@gmail.com', company: 'Riester + BU', value: '2.640 €', age: '1 Tag', stage: 'consulting', probability: 55, temperature: 'warm', owner: 'S. Berger', category: 'retirement', lastActivity: 'vor 1 Tag', nextStep: 'Vergleich präsentieren', productName: 'Riester + BU' },
  { id: '9', name: 'Brauerei Lindner', email: 'Lindner KG', company: 'Sachversicherung', value: '12.800 €', age: '3 Std.', stage: 'consulting', probability: 60, temperature: 'hot', owner: 'A. Direktor', category: 'commercial', lastActivity: 'vor 3 Std.', nextStep: 'Termin vor Ort', productName: 'Sachversicherung' },
  { id: '10', name: 'Familie Hoffmann', email: 'hoffmann@pkv.de', company: 'PKV-Familie', value: '7.344 €', age: '2 Tage', stage: 'offer', probability: 75, temperature: 'hot', owner: 'L. Frei', category: 'pkv', lastActivity: 'vor 2 Tagen', nextStep: 'Angebot besprechen', productName: 'PKV-Familie' },
  { id: '11', name: 'Sandra Weiss', email: 'sandra.w@web.de', company: 'PKV Singles', value: '3.120 €', age: '1 Std.', stage: 'negotiation', probability: 85, temperature: 'hot', owner: 'J. Wenger', category: 'pkv', lastActivity: 'heute', nextStep: 'Vertrag unterzeichnen', productName: 'PKV Singles' },
  { id: '12', name: 'TechWerk Solutions', email: 'TechWerk GmbH', company: 'Gewerbehaftpflicht', value: '1.840 €', age: 'gestern', stage: 'closed', probability: 100, temperature: 'hot', owner: 'M. Koch', category: 'commercial', lastActivity: 'gestern', nextStep: 'Policedatei hochladen', productName: 'Gewerbehaftpflicht' },
  { id: '13', name: 'Krause Logistik', email: 'krause@logistik.de', company: 'KFZ-Flotte (24)', value: '18.900 €', age: '1 Std.', stage: 'negotiation', probability: 80, temperature: 'hot', owner: 'M. Koch', category: 'fleet', lastActivity: 'vor 1 Std.', nextStep: 'Entwurf verhandeln', productName: 'KFZ-Flotte (24)' },
  { id: '14', name: 'MetaCorp GmbH', email: 'info@metacorp.de', company: 'D&O', value: '9.600 €', age: '4 Std.', stage: 'offer', probability: 70, temperature: 'hot', owner: 'A. Direktor', category: 'commercial', lastActivity: 'vor 4 Std.', nextStep: 'Freigabe anfordern', productName: 'D&O' }
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Gewerbeanmeldung anfordern', description: 'Kunde muss noch Gewerbeanmeldung für Betriebshaftpflicht nachreichen.', dueDate: new Date(Date.now() - 86400000).toISOString(), status: 'waiting', priority: 'high', linkedCustomer: 'Schmidt Handwerk', linkedDealId: '3', hasDocuments: false, tags: ['Dokumente'], comments: [], syncStatus: 'synced' },
  { id: 't2', title: 'Angebot Fuhrpark berechnen', description: 'Flottenangebot für Logistics Pro erstellen (15 Fahrzeuge).', dueDate: '2026-05-30', status: 'in_progress', priority: 'medium', linkedCustomer: 'Logistics Pro', linkedDealId: '2', hasDocuments: true, documentName: 'Fahrzeugliste_Logistics.xlsx', tags: ['Angebot', 'Kfz'], comments: [{ id: 'c1', text: 'Kunde bittet um Eile.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }], syncStatus: 'synced' },
  { id: 't3', title: 'Jahresgespräch vorbereiten', description: 'Aktuelle Policen auf Optimierungspotenzial prüfen.', dueDate: '2026-06-05', status: 'open', priority: 'low', linkedCustomer: 'Venture Partners', hasDocuments: false, tags: ['Termin'], comments: [], syncStatus: 'pending' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', type: 'company', name: 'TechNova Solutions GmbH', email: 'kontakt@technova.de', phone: '030 12345678', address: 'Tech-Allee 1\n10115 Berlin', syncStatus: 'synced' },
  { id: 'c2', type: 'person', name: 'Markus Weber', email: 'm.weber@privat.de', phone: '0151 9876543', address: 'Musterstraße 42\n80801 München', syncStatus: 'synced' },
  { id: 'c3', type: 'company', name: 'Schmidt Handwerk', email: 'info@schmidt-handwerk.biz', phone: '040 456789', address: 'Handwerkerweg 7\n20095 Hamburg', syncStatus: 'synced' }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: 'conv1', channel: 'whatsapp', participantName: 'Familie Hoffmann', lastMessage: 'Können wir den Termin auf nächste Woche verschieben?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), unreadCount: 1, ticketNr: 'K-30412' },
  { id: 'conv2', channel: 'email', participantName: 'k.mueller@example.de', lastMessage: 'Anfrage Tarifwechsel PKV — bitte Unterlagen senden', timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(), unreadCount: 1, ticketNr: 'K-10248' },
  { id: 'conv3', channel: 'instagram', participantName: '@sandra.m', lastMessage: 'Hallo, habe Frage zu BU für Selbständige', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), unreadCount: 1, ticketNr: 'Nicht zugewiesen' },
  { id: 'conv4', channel: 'linkedin', participantName: 'Markus Vogel', lastMessage: 'Perfekt, danke!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), unreadCount: 0, ticketNr: 'K-77821' },
  { id: 'conv5', channel: 'facebook', participantName: 'Brauerei Lindner', lastMessage: 'Haben Sie Zeit für ein kurzes Call?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unreadCount: 0, ticketNr: 'K-92010' },
  { id: 'conv6', channel: 'email', participantName: 'service@allianz.de', lastMessage: 'Police-Bestätigung KFZ Hoffmann', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), unreadCount: 0, ticketNr: 'K-30412' }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', conversationId: 'conv1', sender: 'contact', content: 'Können wir den Termin auf nächste Woche verschieben?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'm2', conversationId: 'conv2', sender: 'contact', content: 'Anfrage Tarifwechsel PKV — bitte Unterlagen senden', timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString() },
  { id: 'm3', conversationId: 'conv3', sender: 'contact', content: 'Hallo, habe Frage zu BU für Selbständige', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'm4', conversationId: 'conv4', sender: 'contact', content: 'Danke für das Beratungsgespräch!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: 'm5', conversationId: 'conv4', sender: 'me', content: 'Guten Tag, gerne kümmern wir uns darum. Ich melde mich umgehend bei ihnen.', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: 'm6', conversationId: 'conv4', sender: 'contact', content: 'Perfekt, danke!', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 'm7', conversationId: 'conv5', sender: 'contact', content: 'Haben Sie Zeit für ein kurzes Call?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: 'm8', conversationId: 'conv6', sender: 'contact', content: 'Police-Bestätigung KFZ Hoffmann', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
];

const INITIAL_SWITCHING_PROCESSES: SwitchingProcess[] = [
  {
    id: 's1',
    vuNr: 'VU-2026-0158',
    customerId: 'c1',
    customerName: 'Müller GmbH',
    insuranceType: 'Betriebshaftpflicht',
    originalProvider: 'HUK-Coburg',
    newProvider: 'Allianz',
    status: 'angebot_erstellt',
    oldPremium: '2.340 €/J',
    newPremium: '1.980 €/J',
    fileName: 'Police_HUK_Muel.pdf',
    assignedTo: 'SB',
    notes: '',
    history: [{ date: '02.06.2026', action: 'Angebot erstellt' }],
    syncStatus: 'synced',
    createdAt: '2026-06-02T10:00:00Z'
  },
  {
    id: 's2',
    vuNr: 'VU-2026-0157',
    customerId: 'c2',
    customerName: 'Familie Hoffmann',
    insuranceType: 'Wohngebäude',
    originalProvider: 'Versicherungskammer Bayern',
    newProvider: 'HDI',
    status: 'kunde_informiert',
    oldPremium: '420 €/J',
    newPremium: '380 €/J',
    fileName: 'Police_VKB_Hoffmann.pdf',
    assignedTo: 'MK',
    notes: '',
    history: [{ date: '02.06.2026', action: 'Kunde informiert' }],
    syncStatus: 'synced',
    createdAt: '2026-06-02T11:00:00Z'
  },
  {
    id: 's3',
    vuNr: 'VU-2026-0156',
    customerId: 'c3',
    customerName: 'Schmidt & Partner OHG',
    insuranceType: 'Rechtsschutz Gewerbe',
    originalProvider: 'R+V',
    newProvider: 'Zurich',
    status: 'umdeckung_beantragt',
    oldPremium: '1.120 €/J',
    newPremium: '940 €/J',
    fileName: 'RV_Rechtsschutz.pdf',
    assignedTo: 'AD',
    notes: '',
    history: [{ date: '01.06.2026', action: 'Umdeckung beantragt' }],
    syncStatus: 'synced',
    createdAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 's4',
    vuNr: 'VU-2026-0155',
    customerId: 'c1',
    customerName: 'Bäckerei Wagner',
    insuranceType: 'Inhaltsversicherung',
    originalProvider: 'Gothaer',
    newProvider: 'Generali',
    status: 'identifiziert',
    oldPremium: '1.680 €/J',
    newPremium: '1.450 €/J',
    fileName: 'Gothaer_Inhalt.pdf',
    assignedTo: 'SB',
    notes: '',
    history: [{ date: '31.05.2026', action: 'Identifiziert' }],
    syncStatus: 'synced',
    createdAt: '2026-05-31T14:30:00Z'
  },
  {
    id: 's5',
    vuNr: 'VU-2026-0154',
    customerId: 'c3',
    customerName: 'TechWerk Solutions GmbH',
    insuranceType: 'D&O Versicherung',
    originalProvider: 'AXA',
    newProvider: 'Allianz',
    status: 'unterlagen_eingegangen',
    oldPremium: '3.200 €/J',
    newPremium: '2.850 €/J',
    fileName: 'AXA_DO_Police.pdf',
    assignedTo: 'AD',
    notes: '',
    history: [{ date: '30.05.2026', action: 'Unterlagen eingegangen' }],
    syncStatus: 'synced',
    createdAt: '2026-05-30T16:15:00Z'
  },
  {
    id: 's6',
    vuNr: 'VU-2026-0153',
    customerId: 'c2',
    customerName: 'Dr. Anna Müller',
    insuranceType: 'Berufsunfähigkeit Schutz',
    originalProvider: 'Allianz',
    newProvider: 'HDI',
    status: 'abgeschlossen',
    oldPremium: '1.800 €/J',
    newPremium: '1.620 €/J',
    fileName: 'Allianz_BU_Anna.pdf',
    assignedTo: 'LF',
    notes: 'Erfolgreich umgedeckt, Kunde spart 180 Euro jährlich.',
    history: [{ date: '28.05.2026', action: 'Abgeschlossen' }],
    syncStatus: 'synced',
    createdAt: '2026-05-28T10:00:00Z'
  },
  {
    id: 's7',
    vuNr: 'VU-2026-0152',
    customerId: 'c1',
    customerName: 'Müller & Söhne GmbH',
    insuranceType: 'Inhaltsversicherung',
    originalProvider: 'Gothaer',
    newProvider: 'Generali',
    status: 'abgelehnt',
    oldPremium: '2.100 €/J',
    newPremium: '2.050 €/J',
    fileName: 'Gothaer_Inhalt.pdf',
    assignedTo: 'JW',
    notes: 'Kunde lehnte ab, da Ersparnis zu gering.',
    history: [{ date: '25.05.2026', action: 'Abgelehnt' }],
    syncStatus: 'synced',
    createdAt: '2026-05-25T14:00:00Z'
  },
  {
    id: 's8',
    vuNr: 'VU-2026-0159',
    customerId: 'c2',
    customerName: 'Dr. Anna Müller',
    insuranceType: 'Betriebshaftpflicht',
    originalProvider: 'Ergo',
    newProvider: 'Allianz',
    status: 'angebot_erstellt',
    oldPremium: '980 €/J',
    newPremium: '820 €/J',
    fileName: 'Ergo_Betrieb.pdf',
    assignedTo: 'SB',
    notes: '',
    history: [{ date: '02.06.2026', action: 'Angebot erstellt' }],
    syncStatus: 'synced',
    createdAt: '2026-06-02T15:30:00Z'
  }
];

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export function CrmProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [switchingProcesses, setSwitchingProcesses] = useState<SwitchingProcess[]>(INITIAL_SWITCHING_PROCESSES);
  const [userRole, setUserRole] = useState<'administrator' | 'makler' | 'mitarbeiter' | 'buchhaltung'>('administrator');

  const addDeal = (deal: Partial<Deal> & { name: string; company: string }) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      name: deal.name,
      email: deal.email || 'lead@antigravity.academy',
      company: deal.company,
      value: deal.value || '1.000 €',
      age: deal.age || '1 Tag',
      stage: deal.stage || 'lead',
      probability: deal.probability || 10,
      temperature: deal.temperature || 'warm',
      owner: deal.owner || 'S. Berger',
      category: deal.category || 'bu',
      lastActivity: deal.lastActivity || 'gerade eben',
      nextStep: deal.nextStep || 'Erstkontakt anrufen',
      productName: deal.productName || deal.company
    };
    setDeals(prev => [...prev, newDeal]);
  };

  const updateDealStage = (id: string, newStage: string) => {
    const defaultProbabilities: Record<string, number> = {
      lead: 15,
      firstContact: 25,
      needsAnalysis: 40,
      consulting: 55,
      offer: 75,
      negotiation: 85,
      closed: 100
    };
    setDeals(prev => prev.map(d => d.id === id ? { 
      ...d, 
      stage: newStage,
      probability: defaultProbabilities[newStage] ?? d.probability 
    } : d));
  };

  const addTask = (task: Omit<Task, 'id' | 'syncStatus'>) => {
    const newTask: Task = { ...task, id: 't' + Date.now().toString(), syncStatus: 'pending' };
    setTasks(prev => [...prev, newTask]);
    
    // Simulate sync
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, syncStatus: 'synced' } : t));
    }, 2000);
  };

  const updateTaskStatus = (id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const addCommentToTask = (taskId: string, text: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newComment = { id: 'c' + Date.now().toString(), text, timestamp: new Date().toISOString() };
        return { ...t, comments: [...(t.comments || []), newComment] };
      }
      return t;
    }));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'syncStatus'>) => {
    const newCustomer: Customer = { ...customer, id: 'c' + Date.now().toString(), syncStatus: 'pending' };
    setCustomers(prev => [...prev, newCustomer]);
    
    // Simulate sync
    setTimeout(() => {
      setCustomers(prev => prev.map(c => c.id === newCustomer.id ? { ...c, syncStatus: 'synced' } : c));
    }, 2000);
  };

  const updateCustomer = (id: string, updates: Partial<Omit<Customer, 'id' | 'syncStatus'>>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates, syncStatus: 'pending' } : c));
    
    // Simulate sync
    setTimeout(() => {
      setCustomers(prev => prev.map(c => c.id === id ? { ...c, syncStatus: 'synced' } : c));
    }, 2000);
  };

  const sendMessage = (conversationId: string, content: string, isAiAction?: boolean) => {
    const newMessage: ChatMessage = {
      id: 'm' + Date.now().toString(),
      conversationId,
      sender: 'me',
      content,
      timestamp: new Date().toISOString(),
      isAiAction
    };
    
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, lastMessage: content, timestamp: newMessage.timestamp } : c
    ));
  };

  const linkConversationToCustomer = (conversationId: string, customerId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, linkedCustomerId: customerId } : c
    ));
  };

  const markConversationRead = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const addSwitchingProcess = (process: Omit<SwitchingProcess, 'id' | 'syncStatus' | 'createdAt' | 'vuNr' | 'history'>) => {
    const nextNum = 154 + switchingProcesses.length;
    const newProcess: SwitchingProcess = {
      ...process,
      id: 'sw' + Date.now().toString(),
      vuNr: `VU-2026-0${nextNum}`,
      history: [{ date: new Date().toLocaleDateString(), action: 'Identifiziert' }],
      syncStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    setSwitchingProcesses(prev => [newProcess, ...prev]);

    // Simulate sync
    setTimeout(() => {
      setSwitchingProcesses(prev => prev.map(p => 
        p.id === newProcess.id ? { ...p, syncStatus: 'synced' } : p
      ));
    }, 2000);
  };

  const updateSwitchingProcessStatus = (id: string, newStatus: SwitchingProcess['status']) => {
    setSwitchingProcesses(prev => prev.map(p => {
      if (p.id === id) {
        const newHistory = [...(p.history || [])];
        const label = newStatus.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
        newHistory.push({ date: new Date().toLocaleDateString(), action: label });
        return { ...p, status: newStatus, history: newHistory };
      }
      return p;
    }));
  };

  const updateSwitchingProcess = (id: string, updates: Partial<Omit<SwitchingProcess, 'id' | 'syncStatus' | 'createdAt'>>) => {
    setSwitchingProcesses(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        if (updates.status && updates.status !== p.status) {
          const newHistory = [...(p.history || [])];
          const label = updates.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
          newHistory.push({ date: new Date().toLocaleDateString(), action: label });
          updated.history = newHistory;
        }
        return updated;
      }
      return p;
    }));
  };

  return (
    <CrmContext.Provider value={{ deals, addDeal, updateDealStage, tasks, addTask, updateTaskStatus, addCommentToTask, customers, addCustomer, updateCustomer, conversations, messages, sendMessage, linkConversationToCustomer, markConversationRead, switchingProcesses, addSwitchingProcess, updateSwitchingProcessStatus, updateSwitchingProcess, userRole, setUserRole }}>
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) throw new Error('useCrm must be used within CrmProvider');
  return context;
}

