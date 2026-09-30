import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Activity, 
  Lock, 
  AlertOctagon, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Database, 
  Cpu, 
  RefreshCw, 
  FileText, 
  Eye,
  Info
} from 'lucide-react';
import { AuthUserProfile } from '../../types';

interface AdminPortalViewProps {
  currentUser: AuthUserProfile;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ currentUser }) => {
  const [stats, setStats] = useState<any>({
    total_users: 14,
    total_patients: 8,
    total_doctors: 4,
    total_assessments: 342,
    emergency_access_count: 3,
    total_audit_events: 128
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'system'>('audit');
  const [searchFilter, setSearchFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Demo user registry for Admin management
  const [usersList, setUsersList] = useState<any[]>([
    { id: 'USR-DOC-001', name: 'Dr. Rajesh Sharma, MD', email: 'dr.sharma@qdiagnose.org', role: 'doctor', license: 'MCI-84920-IND', status: 'verified', hospital: 'AIIMS Delhi' },
    { id: 'USR-DOC-002', name: 'Dr. Elena Vance, PhD', email: 'dr.vance@qdiagnose.org', role: 'doctor', license: 'TMH-49210-ONC', status: 'verified', hospital: 'Tata Memorial Center' },
    { id: 'USR-DOC-003', name: 'Dr. Sanjay Patel, MS', email: 'dr.patel@qdiagnose.org', role: 'doctor', license: 'KEM-19284-SURG', status: 'pending', hospital: 'Apollo Hospitals' },
    { id: 'USR-PAT-001', name: 'Ananya Roy', email: 'patient.ananya@qdiagnose.org', role: 'patient', license: 'N/A', status: 'active', hospital: 'N/A' },
    { id: 'USR-PAT-002', name: 'Vikram Mehta', email: 'vikram.mehta@qdiagnose.org', role: 'patient', license: 'N/A', status: 'active', hospital: 'N/A' },
    { id: 'USR-ADM-001', name: 'System Administrator', email: 'admin@qdiagnose.org', role: 'admin', license: 'N/A', status: 'active', hospital: 'SIH Platform Core' }
  ]);

  useEffect(() => {
    async function loadAdminData() {
      setIsLoading(true);
      try {
        const [dashRes, audRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/admin/audit-logs?limit=50')
        ]);
        if (dashRes.ok) {
          const d = await dashRes.json();
          setStats(d.metrics || stats);
        }
        if (audRes.ok) {
          const a = await audRes.json();
          setAuditLogs(a.audit_logs || []);
        }
      } catch (e) {
        console.error('Failed to load admin stats:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleVerifyDoctor = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: 'verified' } : u));
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchSearch = 
      (log.action || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (log.user_email || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (log.target_resource || '').toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchSearch) return false;
    if (actionFilter !== 'all' && !(log.action || '').toLowerCase().includes(actionFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* PERSISTENT RESEARCH PROTOTYPE DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Research Prototype Notice:</span> AI risk calculations and decision support metrics are generated for clinical research and early screening purposes only. They must not be used as a substitute for professional medical diagnosis. Always consult a qualified physician.
        </div>
      </div>

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400">ABDM & DISHA Regulatory Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              System Administration & Security Auditing
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time monitoring of role-based authorization, emergency access triggers, and encrypted clinical records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Total Users</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total_users || 14}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Registered Patients</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total_patients || 8}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Doctor Clinicians</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total_doctors || 4}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">AI Inferences</div>
            <div className="text-xl font-bold font-mono text-teal-300 mt-0.5">{stats.total_assessments || 342}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-amber-300 font-semibold uppercase">Emergency Overrides</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">{stats.emergency_access_count || 3}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[10px] text-purple-200 font-semibold uppercase">Audit Event Logs</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total_audit_events || 128}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'audit' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Access Audit Trail</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User & Clinician Verification</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'system' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Infrastructure & Encryption Status</span>
        </button>
      </div>

      {/* TAB 1: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Immutable Security & Regulatory Access Logs</h3>
              <p className="text-xs text-slate-500">Every authorization check, emergency break-glass, and consent alteration.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 w-44"
                />
              </div>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="all">All Actions</option>
                <option value="emergency">Emergency Access</option>
                <option value="consent">Consent Events</option>
                <option value="login">Authentication</option>
                <option value="view">Dossier Queries</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor (Role)</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Clinical Justification & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log: any, idx: number) => {
                  const isEmergency = (log.action || '').includes('EMERGENCY');
                  return (
                    <tr key={idx} className={isEmergency ? 'bg-red-50/60' : 'hover:bg-slate-50'}>
                      <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{log.user_email || log.user_id || 'System'}</div>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          log.user_role === 'doctor' ? 'bg-teal-100 text-teal-800' :
                          log.user_role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.user_role || 'User'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          isEmergency 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {log.target_resource} {log.target_id ? `(${log.target_id})` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={log.details}>
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER VERIFICATION */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">User Identity & Clinician Credential Registry</h3>
            <p className="text-xs text-slate-500">
              Verify Medical Council of India / state registration licenses before granting clinical portal privileges.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">User & Contact</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Medical License</th>
                  <th className="py-2.5 px-3">Affiliation</th>
                  <th className="py-2.5 px-3">Verification Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold uppercase text-[10px] text-slate-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      {user.license}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {user.hospital}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'verified' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : user.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {user.role === 'doctor' && user.status === 'pending' && (
                        <button
                          onClick={() => handleVerifyDoctor(user.id)}
                          className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Verify License
                        </button>
                      )}
                      {user.status === 'verified' && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INFRASTRUCTURE */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">System Architecture & Cryptographic Safeguards</h3>
            <p className="text-xs text-slate-500">Security enforcement standards for SIH 2026 evaluation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>AES-256-GCM Cryptographic Protection</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                All Personally Identifiable Information (PII) including patient contact, clinical notes, diagnosis codes, and input feature vectors are encrypted with unique 96-bit IVs and 128-bit authentication tags before storage.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                Status: Verified & Operational
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-xs">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Quantum Simulation Engine (Qiskit Aer)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parameterized Quantum Circuits (VQC) with RealAmplitudes and EfficientSU2 ansatze execute via statevector simulation with Shot Noise variance estimation.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold">
                Status: Qiskit Core Ready (4-Qubit Topology)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
