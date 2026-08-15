import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Download,
  MessageSquareWarning,
  Flame,
  AlertTriangle,
  Info,
  Layers,
  ArrowDownToLine,
  FileCode
} from 'lucide-react';
import { ScanResult } from '../../types';

interface RiskScoreCardProps {
  scan: ScanResult;
  onOpenFeedback: () => void;
  onExportPdf?: () => void;
  onExportJson?: () => void;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  scan,
  onOpenFeedback,
  onExportPdf,
  onExportJson,
}) => {
  const isHighRisk = scan.riskLevel === 'CRITICAL' || scan.riskLevel === 'HIGH';
  const isMediumRisk = scan.riskLevel === 'MEDIUM';

  const secondaryCategories = scan.secondaryCategories || [];
  const keyIndicators = scan.keyIndicators || [];

  // Theme styling based on threat score level
  const getBadgeTheme = () => {
    switch (scan.riskLevel) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-950/80',
          border: 'border-red-600',
          text: 'text-red-400',
          glow: 'shadow-red-950/50',
          label: 'CRITICAL FRAUD THREAT',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-950/80',
          border: 'border-orange-600',
          text: 'text-orange-400',
          glow: 'shadow-orange-950/50',
          label: 'HIGH RISK SUSPICIOUS',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-600',
          text: 'text-amber-400',
          glow: 'shadow-amber-950/50',
          label: 'GUARDED / SUSPICIOUS',
        };
      default:
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-600',
          text: 'text-emerald-400',
          glow: 'shadow-emerald-950/50',
          label: 'VERIFIED LEGITIMATE / LOW RISK',
        };
    }
  };

  const badge = getBadgeTheme();

  return (
    <div
      className={`rounded-3xl border ${badge.border} bg-[#020617] p-6 sm:p-8 shadow-2xl relative overflow-hidden`}
    >
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 relative">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${badge.bg} ${badge.text} border ${badge.border}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{badge.label}</span>
          </span>
          <span className="text-xs font-mono text-slate-400">
            Scan ID: <span className="text-slate-300 font-semibold">{scan.id || 'N/A'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          )}

          {onExportJson && (
            <button
              onClick={onExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          )}

          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Flag / Feedback</span>
          </button>
        </div>
      </div>

      {/* Main Score & Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 relative">
        {/* Left: Huge Score Meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 text-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Aggregate Risk Score
          </div>
          <div className="relative my-2 flex items-baseline justify-center">
            <span className={`text-6xl sm:text-7xl font-black font-mono tracking-tighter ${badge.text}`}>
              {scan.riskScore ?? 0}
            </span>
            <span className="text-xl font-bold text-slate-500 ml-1">/ 100</span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, scan.riskScore ?? 0))}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
            <span>Confidence: {((scan.confidenceScore || 0.95) * 100).toFixed(0)}%</span>
            <span>Latency: {scan.latencyMs || 280}ms</span>
          </div>
        </div>

        {/* Right: Threat Category & Detected Vectors */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Likely Threat Category
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              {isHighRisk ? (
                <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              )}
              <span>{scan.primaryCategory || 'General Scan'}</span>
            </div>
          </div>

          {/* Secondary Tags */}
          {secondaryCategories.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                Associated Scam Vectors:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {secondaryCategories.map((sec, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-300 border border-slate-700/80"
                  >
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>{sec}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Indicators Highlights */}
          {keyIndicators.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                Primary Threat Signals Detected:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keyIndicators.slice(0, 4).map((ind, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 text-slate-300 border border-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="truncate max-w-xs">{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
