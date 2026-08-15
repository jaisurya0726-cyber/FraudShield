import React, { useState } from 'react';
import { Mail, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';
import { DEMO_PRESETS } from '../../data/demoPresets';

interface EmailScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const EmailScanner: React.FC<EmailScannerProps> = ({ onScan, isScanning }) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    onScan({
      type: 'email',
      content: body,
      sender: sender.trim() || undefined,
      subject: subject.trim() || undefined,
    });
  };

  const loadPreset = () => {
    const p = DEMO_PRESETS.find(x => x.id === 'demo_phishing_email');
    if (p?.payload) {
      setSender(p.payload.sender || '');
      setSubject(p.payload.subject || '');
      setBody(p.payload.text || '');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Phishing Email & Header Scanner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detects domain spoofing, urgency in subject lines, credential harvesting links, and deceptive sender aliases.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPreset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Load Sample Phishing Email</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              From / Sender Email <span className="text-slate-500 font-normal">(e.g. security@paypal-verify.xyz)</span>
            </label>
            <input
              type="text"
              id="email-sender-input"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. support@service-update-portal.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
            />
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Subject Line
            </label>
            <input
              type="text"
              id="email-subject-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Account Suspension Notice"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Email Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Email Body Content <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500">{body.length} characters</span>
          </div>
          <textarea
            id="email-body-input"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the full email text, including any hyperlinks or call-to-action buttons..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all leading-relaxed"
          />
        </div>

        {/* Safe notice & Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Attachments are never executed or downloaded automatically.</span>
          </div>

          <button
            type="submit"
            id="email-scan-submit-btn"
            disabled={!body.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Scan Email for Phishing</span>
          </button>
        </div>
      </form>
    </div>
  );
};
