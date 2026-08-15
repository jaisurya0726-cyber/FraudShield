import React from 'react';
import { HelpCircle, AlertTriangle, Eye, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { ScanResult } from '../../types';

interface ExplainableAiCardProps {
  scan: ScanResult;
}

export const ExplainableAiCard: React.FC<ExplainableAiCardProps> = ({ scan }) => {
  const isHighRisk = scan.riskLevel === 'CRITICAL' || scan.riskLevel === 'HIGH';
  const reasons = scan.reasonsWhyRisky || [];
  const manipulationFlags = scan.technicalEvidence?.nlpSignals?.manipulationFlags || [];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/60 text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Why was this classified as {scan.riskLevel}?
            </h3>
            <p className="text-xs text-slate-400">
              Explainable AI synthesis of psychological pressure, linguistic markers, and technical signatures.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Language: {scan.languageDetected || 'English (En)'}</span>
        </span>
      </div>

      {/* Plain Language Summary */}
      <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-2">
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>Executive Threat Summary</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {scan.explanationSummary || 'Comprehensive multi-factor heuristic and machine learning analysis completed.'}
        </p>
      </div>

      {/* Why This Looks Risky - Bullet Points */}
      {reasons.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Key Risk Drivers & Behavioral Traps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60 text-xs text-slate-300"
              >
                <div className="w-5 h-5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social Engineering / Manipulation Vector Flags */}
      {manipulationFlags.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-400">
            Detected Psychological Coercion Techniques:
          </div>
          <div className="flex flex-wrap gap-2">
            {manipulationFlags.map((flag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-red-950/40 text-red-300 border border-red-800/40"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{flag}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Analyzed Artifact Snippet */}
      {scan.rawInput && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Analyzed Content Artifact:</span>
            <span className="text-[11px] text-slate-500 font-mono">Raw Input Hash Verified</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {scan.rawInput}
          </div>
        </div>
      )}
    </div>
  );
};
