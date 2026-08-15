import React from 'react';
import { ShieldCheck, PhoneCall, Lock, AlertTriangle, Globe } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section: Responsible AI Notice */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">
                Responsible AI & Legal Notice
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                FraudShield AI provides probabilistic risk assessments supported by multi-layer detection signals. It does not provide legal conclusions or absolute certainty. Always verify critical financial, legal, or institutional requests through official, independent direct channels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy & Data Hub</span>
            </button>
          </div>
        </div>

        {/* Middle Section: Emergency Contacts & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Emergency Helplines */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <span>Official Cybercrime Helplines</span>
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
                <span>India (National Cyber Crime)</span>
                <span className="font-mono font-bold text-cyan-400">1930 / cybercrime.gov.in</span>
              </li>
              <li className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
                <span>USA (FBI IC3 Complaint)</span>
                <span className="font-mono font-bold text-cyan-400">ic3.gov</span>
              </li>
              <li className="flex items-center justify-between bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/60">
                <span>UK (Action Fraud)</span>
                <span className="font-mono font-bold text-cyan-400">0300 123 2040</span>
              </li>
            </ul>
          </div>

          {/* Supported Detection Modalities */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supported Detection Layers</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Multi-vector scanning combining Deterministic Regex Heuristics, Statistical TF-IDF/ML Classifier, Domain Reputation & Homoglyph Analyzer, Live Threat Intel Feed, and Gemini 3.7 Flash AI Explainability.
            </p>
          </div>

          {/* Privacy Guarantee */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Zero-Retention Privacy Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              User submissions are processed in volatile memory for risk assessment. You maintain full ownership and can invoke <strong className="text-slate-200">"Delete My Data"</strong> at any time to purge all local history and audit traces.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
          <p>© 2026 FraudShield AI. All rights reserved. Designed for active cyber defense & scam prevention.</p>
          <div className="flex items-center gap-4">
            <span>Model: fraud-classifier-v2.4</span>
            <span>•</span>
            <span>AI: Gemini 3.7 Flash</span>
            <span>•</span>
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 underline">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
