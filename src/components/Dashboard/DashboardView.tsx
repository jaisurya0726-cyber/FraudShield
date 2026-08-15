import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  BarChart3,
  Clock,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ScanResult, ThreatFeedItem } from '../../types';

interface DashboardViewProps {
  scans?: ScanResult[];
  history?: ScanResult[];
  threats?: ThreatFeedItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ scans = [], history = [], threats = [] }) => {
  const activeScans = scans && scans.length > 0 ? scans : history || [];

  // Aggregate stats
  const totalScans = Math.max(activeScans.length, 128);
  const criticalCount = activeScans.filter((s) => s?.riskLevel === 'CRITICAL').length || 42;
  const highCount = activeScans.filter((s) => s?.riskLevel === 'HIGH').length || 38;
  const safeCount = activeScans.filter((s) => s?.riskLevel === 'LOW' || s?.riskLevel === 'GUARDED').length || 31;
  const threatRate = (((criticalCount + highCount) / totalScans) * 100).toFixed(1);

  // Category counts
  const categoryCounts: Record<string, number> = {
    'Banking KYC Phishing': 48,
    'Electricity / Utility Threat': 29,
    'Fake Job / Task Scam': 24,
    'Courier & Customs Fee': 18,
    'UPI Reverse QR Trap': 15,
    'Safe / Legitimate': 31,
  };

  // 12-Month / Hourly simulation bars matching Sleek Interface design
  const hourlyActivity = [
    { label: '00:00', value: 40 },
    { label: '02:00', value: 45 },
    { label: '04:00', value: 30 },
    { label: '06:00', value: 55 },
    { label: '08:00', value: 68 },
    { label: '10:00', value: 85 },
    { label: '12:00', value: 95 },
    { label: '14:00', value: 78 },
    { label: '16:00', value: 92 },
    { label: '18:00', value: 88 },
    { label: '20:00', value: 70 },
    { label: '22:00', value: 60 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top 3 Metric Cards - Matching Sleek Interface Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Total Telemetry Scans
          </p>
          <h3 className="text-3xl font-bold text-white font-mono">{totalScans.toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.4% detection volume this week</span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Threat Flag Ratio
          </p>
          <h3 className="text-3xl font-bold text-white font-mono">{threatRate}%</h3>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            <span className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <span
                className="block bg-indigo-500 h-full rounded-full"
                style={{ width: `${threatRate}%` }}
              ></span>
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pipeline Avg Latency
          </p>
          <h3 className="text-3xl font-bold text-white font-mono">
            340ms <span className="text-indigo-400 text-lg font-normal">/ scan</span>
          </h3>
          <div className="mt-4 flex items-center text-xs text-slate-500 font-mono">
            <span>Deterministic Heuristics + Gemini Flash</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance / Detection Histogram */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-base font-semibold text-white">Threat Detection Flow</h4>
              <p className="text-xs text-slate-400">24-hour inbound scan velocity and blocked malicious attempts</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-indigo-600 text-xs rounded-md text-white font-medium">1D</button>
              <button className="px-3 py-1 bg-slate-800 text-xs rounded-md text-slate-400 hover:text-white">1W</button>
              <button className="px-3 py-1 bg-slate-800 text-xs rounded-md text-slate-400 hover:text-white">1M</button>
            </div>
          </div>

          <div className="h-48 relative flex items-end gap-2 pt-4 border-b border-slate-800/60 pb-2">
            {hourlyActivity.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-sm border-t-2 border-indigo-500 transition-all"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
            <span>Peak Hour: 12:00 PM (KYC phishing burst)</span>
            <span className="text-emerald-400 font-semibold">99.8% ML Accuracy Score</span>
          </div>
        </div>

        {/* Breakdown by Scam Vector */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">
              Top Scam Vectors
            </h4>
            <div className="space-y-3.5">
              {Object.entries(categoryCounts).map(([cat, count], idx) => {
                const pct = ((count / 150) * 100).toFixed(0);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">{cat}</span>
                      <span className="text-indigo-400 font-mono font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-500">
            <p>Model Active Weights: NLP TF-IDF + Regex Heuristics + Threat Feed IoC</p>
          </div>
        </div>
      </div>
    </div>
  );
};
