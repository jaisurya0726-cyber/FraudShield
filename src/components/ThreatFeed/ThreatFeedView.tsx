import React, { useState } from 'react';
import {
  Radio,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  ExternalLink,
  Plus,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { ThreatFeedItem } from '../../types';

interface ThreatFeedViewProps {
  threats: ThreatFeedItem[];
  onAddThreat: (threat: Omit<ThreatFeedItem, 'id' | 'timestamp'>) => void;
}

export const ThreatFeedView: React.FC<ThreatFeedViewProps> = ({ threats, onAddThreat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // New IOC submit state
  const [newIndicator, setNewIndicator] = useState('');
  const [newType, setNewType] = useState('URL');
  const [newThreatType, setNewThreatType] = useState('Banking Phishing');
  const [newCampaign, setNewCampaign] = useState('');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');

  const filteredThreats = threats.filter((item) => {
    const matchesSearch =
      item.indicator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.threatType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.severity === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddIoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndicator.trim()) return;

    onAddThreat({
      indicator: newIndicator.trim(),
      type: newType as any,
      threatType: newThreatType,
      campaign: newCampaign.trim() || 'Community Crowdsourced Report',
      source: 'User Telemetry',
      severity: newSeverity,
      verified: true,
      reportCount: 1,
    });

    setNewIndicator('');
    setNewCampaign('');
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Live Pulse */}
      <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              ACTIVE INTEL STREAM
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">Sync Interval: Real-time</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Global Scam & Threat Intelligence Feed
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Continuously updated Indicators of Compromise (IoCs), known phishing domains, malicious APK hashes, and scam telephone numbers reported across networks.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Threat IoC</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#020617] p-3 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search domain, phone, UPI, or campaign..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-mono">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List Table */}
      <div className="bg-[#020617] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Indicator (IoC)</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Threat Classification</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredThreats.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        item.severity === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : item.severity === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white max-w-xs truncate">
                    {item.indicator}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {item.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200">
                    {item.threatType}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                    {item.campaign}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono">
                      {item.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-400 font-bold">
                    {item.reportCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit IoC Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#020617] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              <span>Submit Indicator of Compromise (IoC)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Contribute a verified phishing link, fraudulent UPI ID, or scam phone number.
            </p>

            <form onSubmit={handleAddIoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Indicator (Domain, URL, Phone, or UPI ID)
                </label>
                <input
                  type="text"
                  value={newIndicator}
                  onChange={(e) => setNewIndicator(e.target.value)}
                  placeholder="e.g. sbi-kyc-verify-portal.top or +919876543210"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Indicator Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="URL">URL / Domain</option>
                    <option value="PHONE">Phone Number</option>
                    <option value="UPI">UPI VPA</option>
                    <option value="EMAIL">Email Address</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Threat Classification</label>
                <input
                  type="text"
                  value={newThreatType}
                  onChange={(e) => setNewThreatType(e.target.value)}
                  placeholder="e.g. Banking Phishing / Electricity Scam"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Notes / Details</label>
                <input
                  type="text"
                  value={newCampaign}
                  onChange={(e) => setNewCampaign(e.target.value)}
                  placeholder="e.g. KYC Account Suspension Wave"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                >
                  Submit IoC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
