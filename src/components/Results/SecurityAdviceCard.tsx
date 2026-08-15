import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, PhoneCall, ExternalLink, AlertOctagon } from 'lucide-react';
import { SecurityAdvice } from '../../types';

interface SecurityAdviceCardProps {
  advice: SecurityAdvice;
  riskLevel: string;
}

export const SecurityAdviceCard: React.FC<SecurityAdviceCardProps> = ({ advice, riskLevel }) => {
  const isHighRisk = riskLevel === 'CRITICAL' || riskLevel === 'HIGH';

  return (
    <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Actionable Security Guidance & Incident Response
            </h3>
            <p className="text-xs text-slate-400">
              Immediate preventive measures to mitigate financial loss and credential compromise.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* DO NOT Column */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>DO NOT (Prohibited Actions)</span>
          </div>
          <ul className="space-y-2.5">
            {advice.dontActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-rose-400 font-bold mt-0.5 font-mono">✗</span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DO Column */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>DO (Recommended Protective Actions)</span>
          </div>
          <ul className="space-y-2.5">
            {advice.doActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold mt-0.5 font-mono">✓</span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Official Helplines & Portals */}
      <div className="pt-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
          <span>Official Fraud Reporting Helplines</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {advice.officialHelplines.map((line, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">{line.name}</span>
                <span className="text-[11px] text-slate-400 leading-snug">{line.description}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400">{line.contact}</span>
                <span className="text-[10px] text-slate-500">Toll Free</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
