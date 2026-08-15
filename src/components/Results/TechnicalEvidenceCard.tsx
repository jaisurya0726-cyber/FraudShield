import React, { useState } from 'react';
import {
  Cpu,
  Code,
  Globe,
  Radio,
  FileCheck,
  AlertOctagon,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { TechnicalEvidence } from '../../types';

interface TechnicalEvidenceCardProps {
  evidence?: TechnicalEvidence;
}

export const TechnicalEvidenceCard: React.FC<TechnicalEvidenceCardProps> = ({ evidence }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ml' | 'heuristics' | 'url' | 'intel'>('ml');

  const topFeatures = evidence?.mlClassification?.topFeatures || [];
  const heuristicRules = evidence?.heuristicRulesTriggered || [];
  const urlFindings = evidence?.urlFindings || [];
  const threatFeedMatches = evidence?.threatFeedMatches || [];

  return (
    <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Diagnostic Forensic Evidence & Model Weights
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic regex, TF-IDF lexical weights, domain heuristics, and threat feed correlations.
            </p>
          </div>
        </div>

        {/* Subtab selection */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('ml')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'ml'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ML & NLP Weights</span>
          </button>

          <button
            onClick={() => setActiveSubTab('heuristics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'heuristics'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Rules ({heuristicRules.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'url'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL Forensics ({urlFindings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'intel'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Threat Intel ({threatFeedMatches.length})</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Machine Learning & NLP */}
      {activeSubTab === 'ml' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-medium text-slate-400 block">Classifier Confidence</span>
              <span className="text-xl font-bold font-mono text-indigo-400 mt-1 block">
                {(((evidence?.mlClassification?.confidence || 0.94)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-medium text-slate-400 block">Urgency / Panic Score</span>
              <span className="text-xl font-bold font-mono text-amber-400 mt-1 block">
                {((evidence?.nlpSignals?.urgencyScore || 0.4) * 100).toFixed(0)}/100
              </span>
            </div>
            <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
              <span className="text-xs font-medium text-slate-400 block">Threat Classification</span>
              <span className="text-sm font-bold text-white mt-1 block truncate">
                {evidence?.mlClassification?.topCategory || 'Multi-Vector Phishing'}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Top Salient Feature Vectors (TF-IDF / N-gram Weight)
            </div>
            <div className="space-y-2">
              {topFeatures.length === 0 ? (
                <div className="p-3 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  No salient anomalous features extracted.
                </div>
              ) : (
                topFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-indigo-300 font-semibold">{feat.feature}</span>
                      <span className="text-[10px] text-slate-500">({feat.dimension})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (feat.weight || 0) * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] w-12 text-right">
                        {(feat.weight || 0).toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Heuristic Rules */}
      {activeSubTab === 'heuristics' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Deterministic Pattern Rules Triggered ({heuristicRules.length})
          </div>
          {heuristicRules.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 text-slate-400 text-xs text-center border border-slate-800">
              No high-severity deterministic heuristic rules were triggered by this payload.
            </div>
          ) : (
            <div className="space-y-2.5">
              {heuristicRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-400">{rule.ruleId}</span>
                      <span className="text-slate-200 font-semibold">{rule.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{rule.description}</p>
                    <div className="text-[10px] font-mono text-slate-500">Matched: "{rule.matchedSnippet}"</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono font-bold border border-rose-800 text-[10px]">
                      +{rule.pointsAdded} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: URL Deep Analysis */}
      {activeSubTab === 'url' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Extracted Hyperlink & Domain Forensics ({urlFindings.length})
          </div>
          {urlFindings.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 text-slate-400 text-xs text-center border border-slate-800">
              No URLs or domain targets found in the analyzed payload.
            </div>
          ) : (
            <div className="space-y-3">
              {urlFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-indigo-300 font-semibold truncate max-w-lg">
                      {finding.url}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        finding.riskScore > 50
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      Domain Risk: {finding.riskScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">Brand Impersonation</span>
                      <span className="text-white font-semibold">{finding.impersonatedBrand || 'None detected'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">Domain Age</span>
                      <span className="text-white font-semibold">{finding.domainAgeDays ? `${finding.domainAgeDays} days` : 'Newly Registered'}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">Typosquatting</span>
                      <span className={finding.isTyposquatting ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                        {finding.isTyposquatting ? 'DETECTED' : 'Clean'}
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <span className="text-slate-500 block">Shortener / Redirect</span>
                      <span className={finding.isShortener ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {finding.isShortener ? 'YES (Obfuscated)' : 'Direct URL'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subtab 4: Threat Intelligence */}
      {activeSubTab === 'intel' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Threat Intelligence Correlation & Blocklist Matches
          </div>
          {threatFeedMatches.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 text-slate-400 text-xs text-center border border-slate-800">
              Zero active blocklist matches in local community intel feed.
            </div>
          ) : (
            <div className="space-y-2">
              {threatFeedMatches.map((feed, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-indigo-300 font-semibold">{feed.indicator}</span>
                    <p className="text-[11px] text-slate-400">{feed.threatType} • {feed.campaign}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold uppercase font-mono">
                    {feed.source}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
