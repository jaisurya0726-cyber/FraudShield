import React, { useState } from 'react';
import { PhoneCall, Send, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';

interface PhoneScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const PhoneScanner: React.FC<PhoneScannerProps> = ({ onScan, isScanning }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contextNote, setContextNote] = useState('');

  const sampleNumbers = [
    { label: 'High-Spam Robocall Gateway', number: '+91 99990 12345', note: 'Called claiming to be Crime Branch Police Officer' },
    { label: 'Electricity Discom Impersonator', number: '+91 98765 43210', note: 'Sent SMS threatening power cut at 9:30 PM' },
    { label: 'US VOIP Advance-Fee Trap', number: '+1 (800) 555-0199', note: 'Automated voice claiming arrest warrant from IRS' },
    { label: 'Legitimate Helpline', number: '1930', note: 'National Cybercrime Toll-Free Helpline' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    onScan({
      type: 'phone',
      content: `Phone Number Risk Lookup: ${phoneNumber.trim()}${contextNote ? `\nContext: ${contextNote.trim()}` : ''}`,
      phoneNumber: phoneNumber.trim(),
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="pb-4 mb-4 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-400" />
          <span>Phone Number Risk & Scam Reputation Checker</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Evaluates carrier format validity, VOIP virtual spoofing patterns, and public spam report frequency.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Phone Number <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="phone-number-input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. +91 98765 43210 or +1 (555) 019-2834"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Optional Call / Message Context <span className="text-slate-500 font-normal">(e.g., what did they say?)</span>
          </label>
          <textarea
            rows={3}
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="e.g. Caller claimed to be an officer from Mumbai Police regarding an illegal narcotics courier..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Quick Sample Presets */}
        <div>
          <span className="text-xs text-slate-400 font-medium mr-2">Try Sample Numbers:</span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {sampleNumbers.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhoneNumber(s.number);
                  setContextNote(s.note);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button & Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Absence of previous spam reports does not guarantee safety.</span>
          </div>

          <button
            type="submit"
            id="phone-scan-submit-btn"
            disabled={!phoneNumber.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
          >
            <Shield className="w-4 h-4" />
            <span>Check Phone Number Risk</span>
          </button>
        </div>
      </form>
    </div>
  );
};
