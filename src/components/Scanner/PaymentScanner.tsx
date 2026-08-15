import React, { useState } from 'react';
import { CreditCard, Send, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';
import { DEMO_PRESETS } from '../../data/demoPresets';

interface PaymentScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const PaymentScanner: React.FC<PaymentScannerProps> = ({ onScan, isScanning }) => {
  const [requestText, setRequestText] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    onScan({
      type: 'payment',
      content: `Payment Request: ${requestText.trim()}`,
      amount: amount.trim() || undefined,
      paymentMethod,
    });
  };

  const loadPreset = () => {
    const p = DEMO_PRESETS.find(x => x.id === 'demo_investment');
    if (p?.payload) {
      setRequestText(p.payload.text || '');
      setAmount(p.payload.amount || '');
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-rose-400" />
            <span>Payment & Financial Scam Analyzer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detects advance-fee traps, fake refund scams, UPI PIN reverse fraud, gift-card coercion, and fake investment demands.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPreset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Load Crypto Investment Sample</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Requested Amount
            </label>
            <input
              type="text"
              id="payment-amount-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. ₹25,000 or $500"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Method Demanded
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            >
              <option value="UPI / QR Code">UPI / QR Code (GPay, PhonePe, Paytm)</option>
              <option value="Direct Bank Wire / IMPS">Direct Bank Wire / IMPS / RTGS</option>
              <option value="Cryptocurrency (USDT / BTC)">Cryptocurrency (USDT / BTC / Tron)</option>
              <option value="Gift Cards (Amazon / Apple)">Gift Cards (Apple, Amazon, Google Play)</option>
              <option value="Credit / Debit Card Form">Credit / Debit Card Web Form</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Payment Request Message / Pitch / Invoice Note <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={5}
            id="payment-request-input"
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="Paste what the requester is claiming (e.g. 'Send ₹25,000 now to unlock your investment account' or 'Scan this QR code to receive your refund of ₹5,000')..."
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all leading-relaxed"
          />
        </div>

        {/* Note & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>CRITICAL RULE: Entering your UPI PIN always DEDUCTS money, it never receives money.</span>
          </div>

          <button
            type="submit"
            id="payment-scan-submit-btn"
            disabled={!requestText.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-500/25 disabled:opacity-50 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Analyze Financial Risk</span>
          </button>
        </div>
      </form>
    </div>
  );
};
