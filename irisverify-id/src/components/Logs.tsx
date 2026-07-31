import React, { useState, useEffect } from 'react';

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'SUCCESS' | 'WARN' | 'INFO';
  payload: string;
}

interface LogsProps {
  logs: AuditLog[];
  onClearLogs: () => void;
}

export const Logs: React.FC<LogsProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-2xl max-w-md w-full relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
          <h2 className="text-slate-200 font-mono text-sm tracking-wider uppercase">BIOMETRIC AUDIT LOGS // SECURE_TRAIL</h2>
        </div>
        <button
          onClick={onClearLogs}
          className="text-[10px] font-mono text-rose-400/70 hover:text-rose-400 border border-rose-500/20 hover:border-rose-500/50 px-2 py-0.5 rounded transition-all"
        >
          RESET SECURE STORAGE
        </button>
      </div>

      {/* Audit Log Box */}
      <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] h-72 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950 border border-slate-800">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic">
            No secure sessions detected. Initiate biometric scan to generate logs.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border-b border-slate-900 pb-2 last:border-none">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500">{log.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  log.status === 'SUCCESS'
                    ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20'
                    : log.status === 'WARN'
                    ? 'bg-amber-950/50 text-amber-400 border border-amber-500/20'
                    : 'bg-blue-950/50 text-blue-400 border border-blue-500/20'
                }`}>
                  {log.status}
                </span>
              </div>
              <div className="text-slate-300 font-bold mb-0.5">{log.event}</div>
              <div className="text-slate-400 break-all bg-slate-900/50 p-1 rounded border border-slate-900">{log.payload}</div>
            </div>
          ))
        )}
      </div>

      {/* GDPR Privacy Badge */}
      <div className="mt-4 flex items-center justify-between bg-slate-950/40 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-2">
          {/* Padlock icon representation */}
          <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            🔒
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-300 uppercase">Privacy-by-Design Protocol</span>
            <span className="block text-[9px] text-slate-500">Biometric data is instantly hashed and zero-knowledge formatted.</span>
          </div>
        </div>
        <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">GDPR READY</span>
      </div>
    </div>
  );
};
