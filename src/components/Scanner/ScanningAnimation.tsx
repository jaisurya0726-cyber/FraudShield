import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';

interface ScanningAnimationProps {
  onComplete?: () => void;
}

export const ScanningAnimation: React.FC<ScanningAnimationProps> = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: 'Extracting tokens & linguistic structures...', duration: 250 },
    { label: 'Matching deterministic scam & urgency rule patterns...', duration: 300 },
    { label: 'Inspecting URL entropy, homoglyphs & TLD reputation...', duration: 350 },
    { label: 'Running statistical ML feature classification...', duration: 350 },
    { label: 'Correlating with active threat intelligence feeds...', duration: 300 },
    { label: 'Synthesizing Explainable AI security advisory...', duration: 400 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 320);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl shadow-blue-500/10 text-center relative overflow-hidden backdrop-blur-xl">
      {/* Scanning radar sweep animation background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Central HUD Icon */}
      <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-xl shadow-cyan-500/20 mb-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/20 animate-ping" />
        <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
      </div>

      <h3 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
        <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
        <span>ANALYZING THREAT SIGNALS...</span>
      </h3>
      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
        Passing submitted payload through 6 multi-layer security detection pipelines.
      </p>

      {/* Sequential Pipeline Checklist */}
      <div className="mt-6 space-y-2.5 text-left max-w-md mx-auto bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-all duration-200 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Engines: Regex + TF-IDF ML + Threat Intel + Gemini 3.7 Flash</span>
      </div>
    </div>
  );
};
