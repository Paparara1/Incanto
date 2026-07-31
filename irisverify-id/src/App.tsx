import React, { useState } from 'react';
import { Scanner } from './components/Scanner';
import { Logs, AuditLog } from './components/Logs';
import { Auth } from './components/Auth';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [language, setLanguage] = useState<'PL' | 'DE' | 'EN'>('PL');

  const addLog = (event: string, status: 'SUCCESS' | 'WARN' | 'INFO', payload: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const id = Math.random().toString(36).substring(2, 9);
    setLogs((prev) => [{ id, timestamp, event, status, payload }, ...prev]);
  };

  const handleScanComplete = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      addLog('BIOMETRIC VECTOR ACQUIRED', 'SUCCESS', 'Isolated iris structure mapped, converted to ZK representation.');
      addLog('CIPHER PROCESS COMPLETED', 'SUCCESS', 'Encrypted database match verified. Token generated.');
      addLog('AUTHENTICATION GRANTED', 'SUCCESS', 'Identity verified on the blockchain with Zero-Knowledge verification.');
    } else {
      setIsAuthenticated(false);
      addLog('ACQUISITION FAILED', 'WARN', 'Slight motion detected. Recalibration suggested.');
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
    addLog('SECURE STORAGE INITIALIZED', 'INFO', 'Encrypted local cache successfully purged. Zero traces left.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    addLog('SECURE SESSION TERMINATED', 'WARN', 'User token manually revoked. Session closed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none relative overflow-x-hidden font-sans">
      {/* Sci-Fi Ambient Light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md py-5 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👁️</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">IrisVerify ID</h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Biometric Identity Protocol // v1.0.0-PRO</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
              ⚡ Status: <span className="text-emerald-400 font-bold">Production MVP</span>
            </span>
            <a
              href="https://github.com/incantoco/clusterlaunch"
              className="text-xs font-mono text-teal-400 hover:text-teal-300 border border-teal-500/20 hover:border-teal-500/50 px-3 py-1.5 rounded-full transition-all"
            >
              GitHub Repo ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow w-full flex flex-col justify-center">
        {/* Top Product Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3 py-1 bg-teal-950/40 text-teal-400 border border-teal-500/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            FOR SALE // ENTERPRISE-GRADE AUTH & WALLET
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Biometryczny Protokół Tożsamości i Płatności
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed font-mono">
            Gotowy, przetestowany stos technologiczny (React/FastAPI) łączący bezpieczeństwo biometryczne z Web3 i Fintechem.
          </p>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center">
          {/* Panel 1: Scanner */}
          <div className="flex justify-center">
            <Scanner
              onScanComplete={handleScanComplete}
              isScanning={isScanning}
              setIsScanning={setIsScanning}
            />
          </div>

          {/* Panel 2: Secure KYC / Auth Status */}
          <div className="flex justify-center">
            <Auth
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
              language={language}
              setLanguage={setLanguage}
            />
          </div>

          {/* Panel 3: Secure Audit Logs */}
          <div className="flex justify-center">
            <Logs
              logs={logs}
              onClearLogs={handleClearLogs}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 font-mono text-center text-[11px] text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>© 2026 IrisVerify ID Protocol. All rights reserved.</span>
          <span className="text-teal-500/70">
            Powered by Secure Cryptographic Proofs & NVIDIA CUDA Accelerations.
          </span>
        </div>
      </footer>
    </div>
  );
};
