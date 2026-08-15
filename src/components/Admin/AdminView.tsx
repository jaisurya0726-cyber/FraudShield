import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code,
  Shield,
  MessageSquare
} from 'lucide-react';
import { DEFAULT_RULES } from '../../data/defaultRules';
import { UserFeedback } from '../../types';

interface AdminViewProps {
  feedbacks?: UserFeedback[];
}

export const AdminView: React.FC<AdminViewProps> = ({ feedbacks = [] }) => {
  const [rules, setRules] = useState(DEFAULT_RULES || []);
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [highThreshold, setHighThreshold] = useState(60);
  const [enableGeminiSynthesis, setEnableGeminiSynthesis] = useState(true);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      (prev || []).map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleWeightChange = (id: string, weight: number) => {
    setRules((prev) =>
      (prev || []).map((r) => (r.id === id ? { ...r, severityWeight: weight } : r))
    );
  };

  const handleSave = () => {
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const handleReset = () => {
    setRules(DEFAULT_RULES || []);
    setCriticalThreshold(80);
    setHighThreshold(60);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Fraud Detection Engine & Model Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Tune deterministic pattern regex severities, pipeline score thresholds, and Gemini Flash LLM explainability parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saveNotice ? 'Weights Saved!' : 'Apply Model Changes'}</span>
          </button>
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Critical Risk Threshold</span>
            <span className="text-xs font-mono font-bold text-rose-400">{criticalThreshold}+ pts</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={criticalThreshold}
            onChange={(e) => setCriticalThreshold(Number(e.target.value))}
            className="w-full accent-rose-500"
          />
          <p className="text-[11px] text-slate-500">Scores at or above this value trigger red incident advisory.</p>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">High Risk Threshold</span>
            <span className="text-xs font-mono font-bold text-amber-400">{highThreshold}+ pts</span>
          </div>
          <input
            type="range"
            min="40"
            max="79"
            value={highThreshold}
            onChange={(e) => setHighThreshold(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <p className="text-[11px] text-slate-500">Scores at or above this trigger strong cautionary guidance.</p>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Gemini Flash AI Layer</span>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {enableGeminiSynthesis ? 'Active' : 'Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Deep Explainability Synthesis</span>
            <button
              onClick={() => setEnableGeminiSynthesis(!enableGeminiSynthesis)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                enableGeminiSynthesis ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {enableGeminiSynthesis ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
          <p className="text-[11px] text-slate-500">Synthesizes psychological pressure factors.</p>
        </div>
      </div>

      {/* User Feedback & Community Corrections */}
      {feedbacks && feedbacks.length > 0 && (
        <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Active Learning / Community Corrections ({feedbacks.length})</h3>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold">Active Feedback Logs</span>
          </div>

          <div className="space-y-2">
            {feedbacks.map((fb, idx) => (
              <div
                key={fb.id || idx}
                className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      fb.isAccurate ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {fb.isAccurate ? 'VERIFIED ACCURATE' : 'USER CORRECTION'}
                    </span>
                    <span className="text-slate-300 font-medium">{fb.userProvidedCategory || 'General Assessment'}</span>
                  </div>
                  {fb.comment && <p className="text-slate-400 text-[11px] mt-1">{fb.comment}</p>}
                </div>
                <span className="text-slate-500 font-mono text-[10px]">
                  {new Date(fb.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heuristic Rules Customizer */}
      <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Deterministic Pattern Heuristic Engine</h3>
            <p className="text-xs text-slate-400">Enable or tune score impact for each pattern detector.</p>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-semibold">{rules.length} active rules</span>
        </div>

        <div className="space-y-3">
          {(rules || []).map((rule) => (
            <div
              key={rule.id}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">{rule.id}</span>
                  <span className="text-xs font-semibold text-slate-200">{rule.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                    {rule.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
                <div className="text-[11px] font-mono text-slate-500 truncate max-w-xl">
                  Regex: {rule.patterns?.[0] || 'Pattern'}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Weight:</span>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={rule.severityWeight}
                    onChange={(e) => handleWeightChange(rule.id, Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-center text-white font-mono"
                  />
                </div>

                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'MUTED'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
