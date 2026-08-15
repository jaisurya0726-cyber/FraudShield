import React from 'react';
import { Calculator, Plus, Minus, Info } from 'lucide-react';
import { ScoreBreakdownItem } from '../../types';

interface ScoringBreakdownCardProps {
  breakdown?: ScoreBreakdownItem[];
  totalScore?: number;
}

export const ScoringBreakdownCard: React.FC<ScoringBreakdownCardProps> = ({
  breakdown = [],
  totalScore = 0,
}) => {
  const items = breakdown || [];

  return (
    <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              Mathematical Score Breakdown (0 - 100)
            </h3>
            <p className="text-xs text-slate-400">
              Audit-compliant risk calculation showing all additive and subtractive factors.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase font-semibold">Net Total Score</span>
          <div className="text-xl font-black text-white font-mono">{totalScore}/100</div>
        </div>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="p-4 text-xs text-slate-500 text-center bg-slate-900/40 rounded-xl border border-slate-800">
            Baseline score calculated based on default behavioral vectors.
          </div>
        ) : (
          items.map((item, idx) => {
            const isPositive = (item.points || 0) >= 0;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">{item.component}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.detail}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      isPositive
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    }`}
                  >
                    {isPositive ? `+${item.points}` : `${item.points}`} pts
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 bg-slate-900/30 rounded-xl border border-slate-800/40 text-[11px] text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>Scores are capped between 0 (safe) and 100 (critical). Deterministic triggers apply immediate overrides.</span>
      </div>
    </div>
  );
};
