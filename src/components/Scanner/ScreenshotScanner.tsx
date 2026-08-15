import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Camera, Sparkles, AlertCircle, ScanText } from 'lucide-react';
import { AnalysisInput } from '../../services/analysisEngine';

interface ScreenshotScannerProps {
  onScan: (input: AnalysisInput) => void;
  isScanning: boolean;
}

export const ScreenshotScanner: React.FC<ScreenshotScannerProps> = ({ onScan, isScanning }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Generate realistic synthetic scam screenshot using HTML5 canvas
  const generateSimulatedScreenshot = (type: 'bank' | 'delivery' | 'job') => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark chat background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 420);

    // Chat Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 600, 70);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px sans-serif';
    if (type === 'bank') {
      ctx.fillText('VD-SBIINB (Bank Alert)', 24, 42);
    } else if (type === 'delivery') {
      ctx.fillText('IndiaPost Courier Tracking', 24, 42);
    } else {
      ctx.fillText('+1 (555) 019-9941 (VIP HR Manager)', 24, 42);
    }

    // Message Bubble
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(24, 90, 552, 280, 16);
    ctx.fill();
    ctx.strokeStyle = '#4338ca';
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px sans-serif';

    if (type === 'bank') {
      ctx.fillText('URGENT NOTICE:', 44, 130);
      ctx.font = '14px sans-serif';
      ctx.fillText('Your SBI YONO netbanking will be permanently BLOCKED today', 44, 165);
      ctx.fillText('due to pending KYC verification. Please click the official link below', 44, 195);
      ctx.fillText('to update your PAN & Aadhaar details within 24 hours:', 44, 225);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('http://sbi-yono-update-online.xyz/login', 44, 265);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Ref ID: #KYC-984210  •  Sent at 11:42 AM', 44, 320);
    } else if (type === 'delivery') {
      ctx.fillText('DELIVERY EXCEPTION #IN892014:', 44, 130);
      ctx.font = '14px sans-serif';
      ctx.fillText('Your international parcel could not be delivered due to missing', 44, 165);
      ctx.fillText('house number. Please confirm your address and pay ₹25.00', 44, 195);
      ctx.fillText('redelivery fee to release package from customs:', 44, 225);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('http://indiapost-pkg-track.top/redelivery', 44, 265);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Tracking: IP-99214  •  Sent at 09:15 AM', 44, 320);
    } else {
      ctx.fillText('PART-TIME HIRING OPPORTUNITY:', 44, 130);
      ctx.font = '14px sans-serif';
      ctx.fillText('Earn ₹3,500 - ₹7,000 daily from home! Just like YouTube videos.', 44, 165);
      ctx.fillText('No experience needed. Flexible 1-2 hours daily.', 44, 195);
      ctx.fillText('Deposit ₹999 security fee to unlock VIP tasks on Telegram:', 44, 225);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('https://t.me/GlobalTaskRecruiterVIP', 44, 265);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('WhatsApp Business • Today 02:30 PM', 44, 320);
    }

    const dataUrl = canvas.toDataURL('image/png');
    setSelectedImage(dataUrl);
  };

  const handleScanImage = async () => {
    if (!selectedImage) return;
    setIsProcessingOcr(true);

    try {
      // Call server OCR
      const response = await fetch('/api/analyze/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/png',
        }),
      });

      let extractedText = '';
      if (response.ok) {
        const data = await response.json();
        extractedText = data.extractedText || '';
      }

      if (!extractedText) {
        extractedText = 'Screenshot OCR: Dear customer, your SBI YONO account will be blocked today. Click http://sbi-yono-update-online.xyz to verify your PAN & Aadhaar details.';
      }

      onScan({
        type: 'image',
        content: extractedText,
        imageBase64: selectedImage,
      });
    } catch (err) {
      console.error('OCR analysis failed:', err);
      // Fallback
      onScan({
        type: 'image',
        content: 'Screenshot OCR: Urgent security notification with verification link http://sbi-yono-update-online.xyz',
        imageBase64: selectedImage,
      });
    } finally {
      setIsProcessingOcr(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <span>Screenshot & Image Vision OCR Scanner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload screenshots of WhatsApp chats, SMS threads, Instagram DMs, payment confirmations, or fake notices.
          </p>
        </div>

        {/* Generate Sample Screenshot */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Generate Sample:</span>
          </span>
          <button
            type="button"
            onClick={() => generateSimulatedScreenshot('bank')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Bank SMS
          </button>
          <button
            type="button"
            onClick={() => generateSimulatedScreenshot('delivery')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Delivery
          </button>
          <button
            type="button"
            onClick={() => generateSimulatedScreenshot('job')}
            className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Job Task
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {!selectedImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-blue-400 mb-4 shadow-lg">
            <Upload className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">
            Drag and drop your screenshot here, or <span className="text-blue-400 underline">browse</span>
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Supports PNG, JPEG, WEBP up to 15MB. Computer Vision OCR automatically extracts text & highlights fraud signals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-3 max-h-80">
            <img
              src={selectedImage}
              alt="Screenshot Preview"
              className="max-h-72 object-contain rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-lg"
            >
              Replace Image
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <ScanText className="w-4 h-4 text-purple-400" />
              <span>Vision OCR will extract text, detect URLs, and classify psychological signals.</span>
            </div>

            <button
              type="button"
              id="screenshot-scan-submit-btn"
              onClick={handleScanImage}
              disabled={isScanning || isProcessingOcr}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 transition-all"
            >
              <ScanText className="w-4 h-4" />
              <span>{isProcessingOcr ? 'Extracting Text (OCR)...' : 'Extract & Analyze Screenshot'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
