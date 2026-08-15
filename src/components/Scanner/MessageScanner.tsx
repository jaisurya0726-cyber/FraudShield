import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';
import { DEMO_PRESETS } from '../../data/demoPresets';

interface MessageScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({ onScan, isScanning }) => {
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onScan({
      type: 'message',
      content,
      sender: sender.trim() || undefined,
    });
  };

  const loadPreset = (presetId: string) => {
    const p = DEMO_PRESETS.find(x => x.id === presetId);
    if (p?.payload) {
      setContent(p.payload.text || '');
      setSender(p.payload.sender || '');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>SMS, WhatsApp & Chat Message Scanner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detects bank suspension threats, OTP harvesting, fake job offers, and delivery traps.
          </p>
        </div>

        {/* Quick Example Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Load Sample:</span>
          </span>
          <button
            type="button"
            onClick={() => loadPreset('demo_banking')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-300 transition-colors"
          >
            Bank Scam
          </button>
          <button
            type="button"
            onClick={() => loadPreset('demo_delivery')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-orange-950/60 hover:bg-orange-900/60 border border-orange-800/60 text-orange-300 transition-colors"
          >
            Postal Fee
          </button>
          <button
            type="button"
            onClick={() => loadPreset('demo_job')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 text-purple-300 transition-colors"
          >
            Part-Time Job
          </button>
          <button
            type="button"
            onClick={() => loadPreset('demo_electricity')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 transition-colors"
          >
            Power Cut
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Optional Sender */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Sender Name or Number <span className="text-slate-500 font-normal">(Optional, e.g. "VD-SBIINB", "+919876543210")</span>
          </label>
          <input
            type="text"
            id="message-sender-input"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="e.g. +91 98765 43210 or Unknown Telegram ID"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
          />
        </div>

        {/* Message Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Message Body / Text Content <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-500">{content.length} characters</span>
          </div>
          <textarea
            id="message-content-input"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the suspicious SMS, WhatsApp message, Telegram text, or Instagram DM here... (e.g. 'Your bank account will be blocked today. Verify immediately at http://...')"
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Analyzes English, Hindi (हिन्दी), Telugu (తెలుగు), and mixed Hinglish.</span>
          </div>

          <button
            type="submit"
            id="message-scan-submit-btn"
            disabled={!content.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Analyze Message Risk</span>
          </button>
        </div>
      </form>
    </div>
  );
};
