import React, { useState } from 'react';
import { QrCode, Upload, Send, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';

interface QrScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, isScanning }) => {
  const [qrPayload, setQrPayload] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const sampleQrs = [
    { label: 'UPI / Payment QR Trap', payload: 'upi://pay?pa=scammerchant@okhdfcbank&pn=Electricity_Bill_Refund&am=25000&cu=INR' },
    { label: 'Phishing Verification Link', payload: 'http://sbi-yono-update.xyz/verify-qr?user=98401' },
    { label: 'APK Malware Download', payload: 'https://download-bank-security-app.top/update.apk' },
    { label: 'Official Safe Portal', payload: 'https://www.cybercrime.gov.in' },
  ];

  const handleGenerateSampleQr = (payload: string, label: string) => {
    setQrPayload(payload);

    // Render visual QR simulation placeholder on canvas
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 240, 240);

    // Draw stylized QR patterns
    ctx.fillStyle = '#0f172a';
    // Corner 1
    ctx.fillRect(20, 20, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 30, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(38, 38, 14, 14);

    // Corner 2
    ctx.fillRect(170, 20, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(180, 30, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(188, 38, 14, 14);

    // Corner 3
    ctx.fillRect(20, 170, 50, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 180, 30, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(38, 188, 14, 14);

    // Matrix dots
    for (let x = 80; x < 160; x += 15) {
      for (let y = 30; y < 210; y += 15) {
        if ((x + y) % 2 === 0) {
          ctx.fillRect(x, y, 10, 10);
        }
      }
    }

    setPreviewImage(canvas.toDataURL());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrPayload.trim()) return;

    onScan({
      type: 'qr',
      content: `QR Code decoded payload: ${qrPayload.trim()}`,
      qrPayload: qrPayload.trim(),
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="pb-4 mb-4 border-b border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <QrCode className="w-4 h-4 text-amber-400" />
          <span>QR Code Threat & Payload Security Inspector</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Decodes and sanitizes QR destinations (Quishing), UPI payment strings, and malware APK download links without navigating.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick Sample Presets */}
        <div>
          <span className="text-xs text-slate-400 font-medium mr-2">Load Sample QR Payload:</span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {sampleQrs.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGenerateSampleQr(s.payload, s.label)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* QR visual placeholder if loaded */}
          {previewImage && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
              <img src={previewImage} alt="QR Code" className="w-32 h-32 rounded-lg border border-slate-800 shadow" />
              <span className="text-[11px] text-slate-400 mt-2 font-mono">Decoded Payload Ready</span>
            </div>
          )}

          {/* Decoded QR Content Input */}
          <div className={previewImage ? 'md:col-span-2' : 'md:col-span-3'}>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Decoded QR Target Payload / URL <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              id="qr-payload-input"
              value={qrPayload}
              onChange={(e) => setQrPayload(e.target.value)}
              placeholder="Paste decoded QR code URL, UPI payment string, or web address (e.g. upi://pay?pa=... or https://login-bank-portal.xyz)..."
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Safety Note & Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>FraudShield AI never triggers automatic redirects or authorizes transactions.</span>
          </div>

          <button
            type="submit"
            id="qr-scan-submit-btn"
            disabled={!qrPayload.trim() || isScanning}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 disabled:opacity-50 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Analyze QR Risk Level</span>
          </button>
        </div>
      </form>
    </div>
  );
};
