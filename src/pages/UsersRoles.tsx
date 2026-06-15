import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../lib/i18n';
import { useNotImplemented } from '../lib/NotImplementedContext';
import { Users, Shield, Compass, Plus, X, Trash2, CheckCircle2, UserCheck, ShieldAlert, ChevronRight, Eye, Edit3, Key } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserRecord {
  id: string;
  username: string;
  role: 'administrator' | 'makler' | 'mitarbeiter' | 'buchhaltung';
  organization: string;
  lastActive: string;
  active: boolean;
}

interface OnboardingAgency {
  id: string;
  name: string;
  location: string;
  volume: string;
  phase: 'phase1' | 'phase2' | 'phase3';
}

const INITIAL_USERS: UserRecord[] = [
  { id: 'u1', username: 'Alex Broker', role: 'makler', organization: 'artemis Agentur München', lastActive: 'Heute, 14:02', active: true },
  { id: 'u2', username: 'Sarah Consultant', role: 'mitarbeiter', organization: 'artemis Agentur Berlin', lastActive: 'Gestern, 18:30', active: true },
  { id: 'u3', username: 'John Administrator', role: 'administrator', organization: 'artemis Gruppe Holding', lastActive: 'Gerade eben', active: true },
  { id: 'u4', username: 'Michael Accountant', role: 'buchhaltung', organization: 'artemis Gruppe Buchhaltung', lastActive: '03.06.2026', active: true },
  { id: 'u5', username: 'Anna Schmidt', role: 'mitarbeiter', organization: 'Schmidt Handwerk Office', lastActive: '28.05.2026', active: false },
];

const INITIAL_AGENCIES: OnboardingAgency[] = [
  { id: 'ag1', name: 'Maklerbüro Müller', location: 'Stuttgart', volume: '€120k ARR', phase: 'phase1' },
  { id: 'ag2', name: 'Finanzagentur Schmidt', location: 'München', volume: '€240k ARR', phase: 'phase2' },
  { id: 'ag3', name: 'Süd-Consulting GmbH', location: 'Augsburg', volume: '€450k ARR', phase: 'phase3' },
  { id: 'ag4', name: 'Ost-Allianz Vermittlung', location: 'Leipzig', volume: '€85k ARR', phase: 'phase1' },
];

const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'crm', label: 'CRM Vertriebsfunnel' },
  { id: 'switching', label: 'Vertragsumdecker' },
  { id: 'applications', label: 'Antragsverwaltung' },
  { id: 'salesCockpit', label: 'Sales Cockpit (Admin)' },
  { id: 'academy', label: 'Lern-Akademie' },
  { id: 'userAdmin', label: 'Benutzer & Rollen' },
  { id: 'sso', label: 'SSO Absprünge' }
];

export function UsersRoles() {
  const { t } = useI18n();
  const { showInfo } = useNotImplemented();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'permissions' | 'onboarding'>('users');
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [agencies, setAgencies] = useState<OnboardingAgency[]>(INITIAL_AGENCIES);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<UserRecord['role']>('makler');
  const [newOrg, setNewOrg] = useState('');

  // Permission Matrix state
  const [permissions, setPermissions] = useState<Record<string, Record<string, 'read' | 'edit' | 'full' | 'none'>>>({
    administrator: {
      dashboard: 'full', crm: 'full', switching: 'full', applications: 'full',
      salesCockpit: 'full', academy: 'full', userAdmin: 'full', sso: 'full'
    },
    makler: {
      dashboard: 'read', crm: 'full', switching: 'edit', applications: 'edit',
      salesCockpit: 'none', academy: 'full', userAdmin: 'none', sso: 'full'
    },
    mitarbeiter: {
      dashboard: 'read', crm: 'edit', switching: 'read', applications: 'read',
      salesCockpit: 'none', academy: 'full', userAdmin: 'none', sso: 'full'
    },
    buchhaltung: {
      dashboard: 'read', crm: 'read', switching: 'none', applications: 'read',
      salesCockpit: 'read', academy: 'read', userAdmin: 'none', sso: 'none'
    }
  });

  const toggleUserActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    showInfo(t('Benutzer-Aktivierungsstatus geändert.', 'User activation status toggled.'));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newOrg) return;

    const newUser: UserRecord = {
      id: Date.now().toString(),
      username: newUsername,
      role: newRole,
      organization: newOrg,
      lastActive: t('Nie', 'Never'),
      active: true
    };

    setUsers(prev => [...prev, newUser]);
    setIsAddUserOpen(false);
    setNewUsername('');
    setNewOrg('');
    showInfo(t('Neuer Benutzer erfolgreich angelegt.', 'New user successfully added.'));
  };

  const handlePermissionChange = (role: string, moduleId: string, perm: 'read' | 'edit' | 'full' | 'none') => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleId]: perm
      }
    }));
    showInfo(t('Berechtigungsmatrix aktualisiert.', 'Permission matrix updated.'));
  };

  const shiftAgencyPhase = (id: string, currentPhase: OnboardingAgency['phase']) => {
    const nextPhase: Record<OnboardingAgency['phase'], OnboardingAgency['phase']> = {
      phase1: 'phase2',
      phase2: 'phase3',
      phase3: 'phase3'
    };
    
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, phase: nextPhase[currentPhase] } : a));
    showInfo(t('Agentur in nächste Onboarding-Phase verschoben.', 'Agency shifted to next onboarding phase.'));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            {t('Benutzer & Rollen', 'Users & Roles')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('Verwalte deine Mitarbeiter, konfiguriere die Berechtigungsmatrix und begleite neue Maklerbüros.', 'Manage team members, configure permission matrix, and onboard new broker agencies.')}
          </p>
        </div>
        
        {activeSubTab === 'users' && (
          <button onClick={() => setIsAddUserOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4.5 h-4.5" />
            {t('Benutzer einladen', 'Invite User')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveSubTab('users')}
          className={cn("px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeSubTab === 'users' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Users className="w-4 h-4" />
          {t('Benutzerverwaltung', 'Users Management')}
        </button>
        <button 
          onClick={() => setActiveSubTab('permissions')}
          className={cn("px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeSubTab === 'permissions' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Shield className="w-4 h-4" />
          {t('Rollen & Rechte', 'Permissions Matrix')}
        </button>
        <button 
          onClick={() => setActiveSubTab('onboarding')}
          className={cn("px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2", activeSubTab === 'onboarding' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
        >
          <Compass className="w-4 h-4" />
          {t('Agenturen Onboarding', 'Agency Onboarding')}
        </button>
      </div>

      {/* Content tabs */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Username / Mitarbeiter', 'Username')}</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Rolle', 'Role')}</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Maklerbüro / Organisation', 'Organization')}</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Zuletzt Aktiv', 'Last Active')}</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('Status', 'Status')}</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('Aktivieren', 'Toggle Active')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map(user => (
                  <tr key={user.id} className={cn("hover:bg-slate-50/50 transition-colors", !user.active ? "opacity-50" : "")}>
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-extrabold shadow-inner">
                        {user.username.split(' ').map(n=>n[0]).join('')}
                      </div>
                      {user.username}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize",
                        user.role === 'administrator' ? "bg-red-50 text-red-700 border-red-200" :
                        user.role === 'makler' ? "bg-orange-50 text-orange-700 border-orange-200" :
                        user.role === 'buchhaltung' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-semibold">{user.organization}</td>
                    <td className="p-4 text-slate-400 text-xs">{user.lastActive}</td>
                    <td className="p-4">
                      {user.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {t('Aktiv', 'Active')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {t('Inaktiv', 'Inactive')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.active} 
                          onChange={() => toggleUserActive(user.id)} 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'permissions' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t('Rollen-Berechtigungen (Matrix)', 'Role Permissions Matrix')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('Konfiguriere den Zugriff der verschiedenen Rollen auf die Anwendungsmodule.', 'Configure module access permissions for different agency roles.')}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-xl">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">{t('Anwendungsmodul', 'App Module')}</th>
                  {['administrator', 'makler', 'mitarbeiter', 'buchhaltung'].map(role => (
                    <th key={role} className="p-4 text-xs font-extrabold text-slate-700 uppercase tracking-wider text-center border-r border-slate-200 last:border-r-0">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {MODULES.map(mod => (
                  <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 border-r border-slate-200 bg-slate-50/20">{mod.label}</td>
                    {['administrator', 'makler', 'mitarbeiter', 'buchhaltung'].map(role => {
                      const currentVal = permissions[role]?.[mod.id] || 'none';
                      return (
                        <td key={role} className="p-3 text-center border-r border-slate-200 last:border-r-0">
                          <select
                            value={currentVal}
                            onChange={(e) => handlePermissionChange(role, mod.id, e.target.value as any)}
                            className={cn(
                              "text-xs font-bold rounded p-1.5 outline-none cursor-pointer border",
                              currentVal === 'full' ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                              currentVal === 'edit' ? "bg-blue-50 text-blue-800 border-blue-200" :
                              currentVal === 'read' ? "bg-amber-50 text-amber-800 border-amber-200" :
                              "bg-red-50 text-red-800 border-red-200"
                            )}
                          >
                            <option value="none">{t('Kein Zugriff', 'None')}</option>
                            <option value="read">{t('Lesen', 'Read')}</option>
                            <option value="edit">{t('Bearbeiten', 'Edit')}</option>
                            <option value="full">{t('Vollzugriff', 'Full')}</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'onboarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Phase 1: Aufnahme & Potenzial */}
          <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-col h-[60vh] max-h-[600px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">{t('Phase 1: Aufnahme & Potential', 'Phase 1: Analysis')}</h3>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-sm">
                {agencies.filter(a => a.phase === 'phase1').length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
              {agencies.filter(a => a.phase === 'phase1').map(agency => (
                <div key={agency.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-400 hover:shadow transition-all group">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">{agency.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{agency.location} • {agency.volume}</p>
                  </div>
                  <button 
                    onClick={() => shiftAgencyPhase(agency.id, 'phase1')}
                    className="mt-4 self-end bg-slate-900 text-white p-1 rounded hover:bg-orange-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    {t('Phase 2', 'Phase 2')}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: Details & Liquidation */}
          <div className="bg-orange-50/50 rounded-xl border border-orange-200/50 p-4 flex flex-col h-[60vh] max-h-[600px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-orange-200/50">
              <h3 className="font-bold text-orange-900 text-xs uppercase tracking-wider">{t('Phase 2: Details & Liquidation', 'Phase 2: Transition')}</h3>
              <span className="text-xs font-semibold text-orange-700 bg-white px-2 py-0.5 rounded-full shadow-sm border border-orange-100">
                {agencies.filter(a => a.phase === 'phase2').length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
              {agencies.filter(a => a.phase === 'phase2').map(agency => (
                <div key={agency.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-orange-400 hover:shadow transition-all group">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition-colors">{agency.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{agency.location} • {agency.volume}</p>
                  </div>
                  <button 
                    onClick={() => shiftAgencyPhase(agency.id, 'phase2')}
                    className="mt-4 self-end bg-slate-900 text-white p-1 rounded hover:bg-orange-600 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    {t('Onboarding', 'Onboard')}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3: Onboarding & Live */}
          <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/50 p-4 flex flex-col h-[60vh] max-h-[600px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-emerald-200/50">
              <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">{t('Phase 3: Onboarding & Live', 'Phase 3: Live')}</h3>
              <span className="text-xs font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded-full shadow-sm border border-emerald-100">
                {agencies.filter(a => a.phase === 'phase3').length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
              {agencies.filter(a => a.phase === 'phase3').map(agency => (
                <div key={agency.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition-all group">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{agency.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{agency.location} • {agency.volume}</p>
                  </div>
                  <span className="mt-4 self-end bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Live & Aktiv
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddUserOpen && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">{t('Neuen Benutzer anlegen', 'Add New User')}</h2>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full border border-slate-200 bg-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-5 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Mitarbeiter Name', 'Employee Name')}</label>
                  <input 
                    required
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="z.B. Thomas Müller"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Maklerbüro / Niederlassung', 'Organization / Branch')}</label>
                  <input 
                    required
                    type="text"
                    value={newOrg}
                    onChange={e => setNewOrg(e.target.value)}
                    placeholder="z.B. artemis Stuttgart Office"
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t('Rolle', 'Role')}</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="makler">{t('Makler (Broker)', 'Broker')}</option>
                    <option value="mitarbeiter">{t('Mitarbeiter (Employee)', 'Employee')}</option>
                    <option value="administrator">{t('Administrator', 'Administrator')}</option>
                    <option value="buchhaltung">{t('Buchhaltung (Accounting)', 'Accounting')}</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsAddUserOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold"
                  >
                    {t('Abbrechen', 'Cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    {t('Erstellen', 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
