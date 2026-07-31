import React, { useState, useEffect } from 'react';

interface ScannerProps {
  onScanComplete: (success: boolean) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete, isScanning, setIsScanning }) => {
  const [progress, setProgress] = useState<number>(0);
  const [hudMessage, setHudMessage] = useState<string>('READY FOR ACQUISITION');
  const [irisVector, setIrisVector] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      setProgress(0);
      setIrisVector(null);
      setHudMessage('CALIBRATING RETINA FIELD...');

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            const generatedVector = '0x' + Array.from({ length: 32 }, () =>
              Math.floor(Math.random() * 16).toString(16)
            ).join('').toUpperCase();
            setIrisVector(generatedVector);
            setHudMessage('ACQUISITION COMPLETE');
            onScanComplete(true);
            return 100;
          }

          // Dynamic status updates based on progress
          if (prev === 25) setHudMessage('ISOLATING IRIS CONTOUR...');
          if (prev === 50) setHudMessage('EXTRACTING BIOMETRIC DESCRIPTORS...');
          if (prev === 75) setHudMessage('HASHING IRIS CODE (SHA-256)...');

          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleStartScan = () => {
    setIsScanning(true);
  };

  return (
    <div className="bg-slate-900 border border-teal-500/30 rounded-xl p-6 shadow-2xl shadow-teal-950/20 max-w-md w-full relative overflow-hidden backdrop-blur-sm">
      {/* Sci-Fi Grid Background Effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 border-b border-teal-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></div>
          <h2 className="text-teal-400 font-mono text-sm tracking-wider uppercase">IRISVERIFY // SCANNER_UNIT_V1</h2>
        </div>
        <span className="text-xs font-mono text-teal-500/70">SYS_OK: 98.7%</span>
      </div>

      {/* Iris HUD Visualizer */}
      <div className="flex flex-col items-center justify-center py-8 relative">
        <div className="relative w-56 h-56 rounded-full border-4 border-dashed border-teal-500/20 flex items-center justify-center animate-spin-slow">
          {/* Animated Scanning Circle */}
          <div className={`absolute inset-2 rounded-full border-2 border-teal-400/30 flex items-center justify-center ${isScanning ? 'animate-pulse' : ''}`}>
            {/* Outer HUD ring */}
            <div className="absolute inset-4 rounded-full border border-teal-500/50 border-t-transparent animate-spin"></div>
            {/* Inner target ring */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-teal-400/60 flex items-center justify-center">
              {/* Retina central iris model */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-400/80 flex items-center justify-center ${isScanning ? 'scale-110 transition-transform duration-300' : ''}`}>
                <div className="w-6 h-6 rounded-full bg-slate-950 border border-teal-400 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* HUD Crosshairs */}
          <div className="absolute w-full h-[1px] bg-teal-500/30"></div>
          <div className="absolute h-full w-[1px] bg-teal-500/30"></div>
        </div>

        {/* Laser Scan Line Overlay */}
        {isScanning && (
          <div className="absolute w-56 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent top-[30%] shadow-lg shadow-teal-500/50 animate-scan-line"></div>
        )}
      </div>

      {/* Info Display */}
      <div className="bg-slate-950/80 border border-teal-500/20 rounded-lg p-4 font-mono text-xs text-teal-300 space-y-2 mb-6">
        <div className="flex justify-between">
          <span>STATUS:</span>
          <span className="text-teal-400 font-bold">{hudMessage}</span>
        </div>
        <div className="flex justify-between">
          <span>ACQUISITION:</span>
          <span>{progress}%</span>
        </div>
        {irisVector && (
          <div className="pt-2 border-t border-teal-500/10">
            <span className="block text-teal-500/70 mb-1">HASH VECTOR (SHA-256):</span>
            <span className="block text-emerald-400 break-all select-all bg-emerald-950/20 p-1 rounded border border-emerald-500/20">{irisVector}</span>
          </div>
        )}
      </div>

      {/* Control Button */}
      <button
        onClick={handleStartScan}
        disabled={isScanning}
        className={`w-full py-3 px-4 rounded-lg font-mono text-sm tracking-wider uppercase transition-all duration-300 border ${
          isScanning
            ? 'bg-teal-500/10 text-teal-500/50 border-teal-500/20 cursor-not-allowed'
            : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-bold border-teal-400 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isScanning ? 'INITIALIZING ACQUISITION...' : 'START BIOMETRIC SCAN'}
      </button>
    </div>
  );
};
