import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, PhoneCall, ExternalLink, AlertTriangle } from 'lucide-react';
import { SecurityAdvice } from '../../types';

interface SecurityAdvisorCardProps {
  advice?: SecurityAdvice;
  category?: string;
}

export const SecurityAdvisorCard: React.FC<SecurityAdvisorCardProps> = ({ advice, category = 'Threat' }) => {
  const dontActions = advice?.dontActions || [];
  const doActions = advice?.doActions || [];
  const officialHelplines = advice?.officialHelplines || [];

  return (
    <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Security Advisor & Immediate Action Plan
            </h3>
            <p className="text-xs text-slate-400">
              Prescriptive defensive steps customized for {category} threat mitigation.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Protective Shield</span>
        </span>
      </div>

      {/* Grid of DO NOT and DO actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PROHIBITED (DO NOT) */}
        <div className="bg-slate-900/40 rounded-xl p-5 border border-rose-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>Prohibited Actions (DO NOT)</span>
          </div>
          <ul className="space-y-2.5">
            {dontActions.length === 0 ? (
              <li className="text-xs text-slate-500">No specific critical restrictions.</li>
            ) : (
              dontActions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* RECOMMENDED (DO) */}
        <div className="bg-slate-900/40 rounded-xl p-5 border border-emerald-900/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Protective Actions (DO)</span>
          </div>
          <ul className="space-y-2.5">
            {doActions.length === 0 ? (
              <li className="text-xs text-slate-500">Verify the source independently before sharing sensitive info.</li>
            ) : (
              doActions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Official Verified Helplines */}
      {officialHelplines.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified Official Emergency Escalations</span>
            </div>
            <span className="text-[11px] text-slate-500">Toll-Free & Official Reporting</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {officialHelplines.map((line, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white truncate">{line.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{line.description}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400">{line.contact}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Direct Line</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
