import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Download,
  Eye,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileJson
} from 'lucide-react';
import { ScanResult } from '../../types';

interface HistoryViewProps {
  scans?: ScanResult[];
  history?: ScanResult[];
  onSelectScan?: (scan: ScanResult) => void;
  onDeleteScan?: (id: string) => void;
  onClearHistory?: () => void;
  onClearAll?: () => void;
  onExportPdf?: (scan: ScanResult) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  history,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onClearAll,
  onExportPdf,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const historyList = scans || history || [];

  const filteredHistory = historyList.filter((item) => {
    if (!item) return false;
    const matchesSearch =
      (item.primaryCategory || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.rawInput || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRisk === 'ALL' || item.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const handleClear = () => {
    if (onClearHistory) onClearHistory();
    else if (onClearAll) onClearAll();
  };

  const exportAllHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(historyList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fraudshield-audit-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Scan Audit History & Incident Logs
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Review previous fraud scans, re-inspect explainability outputs, and export forensic reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyList.length > 0 && (
            <>
              <button
                onClick={exportAllHistory}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                title="Export all scans as JSON"
              >
                <Download className="w-4 h-4" />
                <span>Export All (JSON)</span>
              </button>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors"
                title="Clear local audit history"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge History</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#020617] p-3 rounded-2xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search category, snippet, or Scan ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-mono">
            <Filter className="w-3.5 h-3.5" /> Risk Level:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedRisk === risk
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-[#020617] border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <History className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <h4 className="text-sm font-semibold text-white">No scans found in history</h4>
          <p className="text-xs text-slate-500">Run a scan in the Scanner tab to generate audit records.</p>
        </div>
      ) : (
        <div className="bg-[#020617] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Content Preview</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-indigo-400 font-semibold">
                      {item.inputType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          item.riskLevel === 'CRITICAL'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : item.riskLevel === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : item.riskLevel === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {item.riskScore}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {item.primaryCategory}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                      {item.rawInput}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onSelectScan && (
                          <button
                            onClick={() => onSelectScan(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                            title="View Full Scan Analysis"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        )}
                        {onExportPdf && (
                          <button
                            onClick={() => onExportPdf(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                            title="Export PDF Report"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                        )}
                        {onDeleteScan && (
                          <button
                            onClick={() => onDeleteScan(item.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
