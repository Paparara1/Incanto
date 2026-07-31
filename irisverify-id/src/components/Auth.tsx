import React, { useState } from 'react';

interface AuthProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  language: 'PL' | 'DE' | 'EN';
  setLanguage: (lang: 'PL' | 'DE' | 'EN') => void;
}

const translations = {
  PL: {
    title: 'Autoryzacja Tożsamości',
    subtitle: 'Weryfikacja biometryczna IrisVerify ID',
    statusLabel: 'Status:',
    statusAuth: 'ZAUTORYZOWANO',
    statusNoAuth: 'OCZEKIWANIE NA SKAN',
    desc: 'Zaimplementowane w architekturze Zero-Knowledge, gotowe pod integracje z Fintech, Web3 oraz nowoczesnymi protokołami tożsamości.',
    buttonLogout: 'Zresetuj Sesję',
    lic: 'Licencja komercyjna dostępna za 18,000 €',
  },
  DE: {
    title: 'Identitätsautorisierung',
    subtitle: 'Biometrische Verifizierung IrisVerify ID',
    statusLabel: 'Status:',
    statusAuth: 'AUTORISIERT',
    statusNoAuth: 'WARTE AUF SCAN',
    desc: 'Implementiert in Zero-Knowledge-Architektur, bereit für die Integration mit Fintech, Web3 und modernen Identitätsprotokollen.',
    buttonLogout: 'Sitzung zurücksetzen',
    lic: 'Kommerzielle Lizenz verfügbar für 18.000 €',
  },
  EN: {
    title: 'Identity Authentication',
    subtitle: 'IrisVerify ID Biometric Verification',
    statusLabel: 'Status:',
    statusAuth: 'AUTHENTICATED',
    statusNoAuth: 'AWAITING ACQUISITION',
    desc: 'Implemented in Zero-Knowledge architecture, fully ready for integration with Fintech, Web3, and modern identity protocols.',
    buttonLogout: 'Reset Session',
    lic: 'Commercial license available for €18,000',
  }
};

export const Auth: React.FC<AuthProps> = ({ isAuthenticated, onLogout, language, setLanguage }) => {
  const t = translations[language];

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 shadow-2xl max-w-md w-full relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
      <div>
        {/* Language Selector */}
        <div className="flex justify-end space-x-1.5 mb-4 border-b border-slate-800 pb-3">
          {(['PL', 'DE', 'EN'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                language === lang
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">{t.title}</h2>
          <p className="text-xs text-teal-400/80 font-mono uppercase tracking-wider">{t.subtitle}</p>
        </div>

        {/* Authentication Status Indicator */}
        <div className="bg-slate-950 rounded-lg p-5 border border-slate-800 flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
              isAuthenticated
                ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400'
                : 'border-rose-500/30 bg-rose-950/10 text-rose-400 animate-pulse'
            }`}>
              {isAuthenticated ? '✓' : '⚠️'}
            </div>
            {isAuthenticated && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center text-[8px] text-slate-950 font-bold animate-ping"></div>
            )}
          </div>
          <div>
            <span className="block text-[10px] font-mono text-slate-500 uppercase">{t.statusLabel}</span>
            <span className={`block font-mono text-sm font-bold tracking-wider ${
              isAuthenticated ? 'text-emerald-400' : 'text-rose-400/80'
            }`}>
              {isAuthenticated ? t.statusAuth : t.statusNoAuth}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-mono bg-slate-950/30 p-3 rounded-lg border border-slate-800/40">
          {t.desc}
        </p>
      </div>

      {/* Pricing / Licensing & Controls */}
      <div className="border-t border-slate-800 pt-4 space-y-4">
        <div className="flex items-center justify-between text-[11px] text-teal-400/80 font-mono bg-teal-950/10 p-2.5 rounded border border-teal-500/10">
          <span>💼 {t.lic}</span>
        </div>

        {isAuthenticated && (
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 border border-rose-500/20 hover:border-rose-500/50 rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
          >
            {t.buttonLogout}
          </button>
        )}
      </div>
    </div>
  );
};
