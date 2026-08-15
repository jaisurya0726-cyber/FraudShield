import React, { useState } from 'react';
import {
  Radio,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Flame,
  Globe,
  Clock,
  ArrowUpRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { ThreatCampaign } from '../../types';
import { LIVE_THREAT_FEED } from '../../data/threatFeed';

interface ThreatFeedViewProps {
  onScanCampaign: (samplePayload: string, type: 'message' | 'email' | 'url') => void;
}

export const ThreatFeedView: React.FC<ThreatFeedViewProps> = ({ onScanCampaign }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const threatFeed = LIVE_THREAT_FEED || [];

  const filteredThreats = threatFeed.filter((t) => {
    if (!t) return false;
    const title = (t.title || '').toLowerCase();
    const desc = (t.description || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      title.includes(query) ||
      desc.includes(query) ||
      (t.targetedInstitutions || []).some(i => (i || '').toLowerCase().includes(query)) ||
      (t.indicatorsOfCompromise || []).some(ioc => (ioc || '').toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'ALL' || t.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const categories = ['ALL', 'Banking & KYC', 'Courier & Logistics', 'Job & Task Scam', 'Utility & Energy', 'Crypto & Investment'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sleek Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
              REAL-TIME THREAT INTEL RADAR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Live Global Scam & Threat Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Continuously updated cyber threat streams tracking active smishing waves, fake APK campaigns, phishing kits, and impersonation domains.
          </p>
        </div>

        {/* Global Live Threat Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Active Waves</div>
              <div className="text-lg font-bold text-white font-mono">14 Campaigns</div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Telemetry Nodes</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">4,820 Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <input
            type="text"
            id="threat-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns, bank names, domains, or indicators..."
            className="w-full bg-[#020617] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        {/* Category selector */}
        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div className="md:col-span-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-[#020617] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
          </select>
        </div>
      </div>

      {/* Threats Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThreats.map((threat) => {
          const isCritical = threat.severity === 'CRITICAL';
          const isHigh = threat.severity === 'HIGH';
          const institutions = threat.targetedInstitutions || [];
          const iocs = threat.indicatorsOfCompromise || [];

          return (
            <div
              key={threat.id}
              className="bg-[#020617] border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
            >
              <div className="space-y-3.5">
                {/* Top Badge & Time */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isCritical
                        ? 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                        : isHigh
                        ? 'bg-orange-950/80 text-orange-400 border border-orange-800/60'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {threat.severity} ALERT
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{threat.activeSince}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                    {threat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                    {threat.description}
                  </p>
                </div>

                {/* Target Brands */}
                {institutions.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      Targeted Entities & Brands:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {institutions.map((inst, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800 font-medium"
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indicators of Compromise (IoCs) */}
                {iocs.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      Sample Indicators (IoCs):
                    </span>
                    <div className="space-y-1">
                      {iocs.slice(0, 2).map((ioc, i) => (
                        <div
                          key={i}
                          className="text-[11px] font-mono text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800/80 truncate"
                          title={ioc}
                        >
                          {ioc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button: Test with Scanner */}
              <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {threat.victimCountEstimate} estimated victims
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const sampleText = `[Simulated Threat] ${threat.title}\n\nUrgent: Your account requires validation immediately. Click ${iocs[0] || 'http://verify-bank-portal.xyz'} to prevent disruption.`;
                    onScanCampaign(sampleText, 'message');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 transition-all"
                >
                  <span>Test in Scanner</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
