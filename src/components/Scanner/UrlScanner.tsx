import React, { useState } from 'react';
import { Globe, Send, ShieldAlert, CheckCircle } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';

interface UrlScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const UrlScanner: React.FC<UrlScannerProps> = ({ onScan, isScanning }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    onScan({
      type: 'url',
      content: `URL Analysis requested for: ${url.trim()}`,
      url: url.trim(),
    });
  };

  const sampleUrls = [
    { label: 'Phishing Domain', url: 'http://sbi-yono-update-online.xyz/login' },
    { label: 'Fake Delivery', url: 'http://indiapost-pkg-track.top/pay' },
    { label: 'Homoglyph Brand', url: 'https://gооgle.com/login-verify' },
    { label: 'Legitimate Domain', url: 'https://www.hdfcbank.com' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="pb-4 mb-4 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>URL, Domain & Link Threat Inspector</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Analyzes TLD risk, homoglyphs, brand typosquatting, raw IP servers, entropy, and known phishing patterns in a safe sandboxed environment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Target URL or Web Address <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="url-scan-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://account-verification-portal.xyz/secure/login"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
            />
            <div className="absolute right-3 top-3.5 text-slate-500">
              <Globe className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Quick Sample Links */}
        <div>
          <span className="text-xs text-slate-400 font-medium mr-2">Try Sample Links:</span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(s.url)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Safety Note & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Zero-risk sandbox inspection. The destination page is never opened in your browser.</span>
          </div>

          <button
            type="submit"
            id="url-scan-submit-btn"
            disabled={!url.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Inspect URL Threat Level</span>
          </button>
        </div>
      </form>
    </div>
  );
};
