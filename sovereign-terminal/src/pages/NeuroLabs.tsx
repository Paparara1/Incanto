import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Activity, Cpu, Radio, Globe, Server,
  Zap, Shield, Eye, Network, Scan, Clock, Heart
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

const FONT_MONO = "'JetBrains Mono', monospace";

// Colors
const TEAL = "#0cf5e3";
const MAGENTA = "#ff2d78";
const SLATE_BG = "#020617"; // slate-950
const CARD_BG = "rgba(12, 245, 227, 0.02)";
const BORDER = "#0f1d2a";

type NodeStatus = "SYNCING" | "SIGNAL STABLE" | "IDLE";

interface NeuralNode {
  id: number;
  label: string;
  status: NodeStatus;
  frequency: number;
}

const nodeStatusConfig: Record<NodeStatus, { color: string; glow: string }> = {
  "SYNCING": { color: TEAL, glow: `0 0 12px ${TEAL}66` },
  "SIGNAL STABLE": { color: "#39ff14", glow: "0 0 8px #39ff1444" },
  "IDLE": { color: "#334155", glow: "none" },
};

const edgeServers = [
  // Europe
  { name: "Frankfurt", x: 52, y: 28, region: "EU" },
  { name: "London", x: 48, y: 25, region: "EU" },
  { name: "Amsterdam", x: 50, y: 24, region: "EU" },
  { name: "Warsaw", x: 56, y: 26, region: "EU" },
  { name: "Paris", x: 49, y: 28, region: "EU" },
  { name: "Stockholm", x: 53, y: 20, region: "EU" },
  // USA
  { name: "Virginia", x: 26, y: 32, region: "US" },
  { name: "Oregon", x: 14, y: 28, region: "US" },
  { name: "Ohio", x: 23, y: 30, region: "US" },
  { name: "Texas", x: 20, y: 36, region: "US" },
  { name: "California", x: 12, y: 33, region: "US" },
  { name: "New York", x: 27, y: 30, region: "US" },
];

// Generate neural wave data
const generateWaveData = (length: number, type: "alpha" | "beta") => {
  return Array.from({ length }, (_, i) => {
    const t = i / 10;
    const baseFreq = type === "alpha" ? 10 : 22;
    const amplitude = type === "alpha" ? 40 : 25;
    const noise = (Math.random() - 0.5) * 15;
    return {
      t: i,
      value: Math.sin(t * baseFreq * 0.1) * amplitude + noise + 50,
    };
  });
};

const NeuroLabs = () => {
  const [systemTime, setSystemTime] = useState(new Date());
  const [alphaWave, setAlphaWave] = useState(() => generateWaveData(100, "alpha"));
  const [betaWave, setBetaWave] = useState(() => generateWaveData(100, "beta"));
  const [nodes, setNodes] = useState<NeuralNode[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      label: `NΞ-${String(i + 1).padStart(3, "0")}`,
      status: (["IDLE", "SIGNAL STABLE", "SYNCING"] as NodeStatus[])[Math.floor(Math.random() * 3)],
      frequency: Math.random() * 40 + 8,
    }))
  );
  const [syncActive, setSyncActive] = useState(false);
  const [globalPulse, setGlobalPulse] = useState(0);

  // System clock
  useEffect(() => {
    const t = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Realtime wave updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlphaWave(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const t = (last.t + 1) / 10;
        next.push({
          t: last.t + 1,
          value: Math.sin(t * 10 * 0.1) * 40 + (Math.random() - 0.5) * 15 + 50,
        });
        return next;
      });
      setBetaWave(prev => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const t = (last.t + 1) / 10;
        next.push({
          t: last.t + 1,
          value: Math.sin(t * 22 * 0.1) * 25 + (Math.random() - 0.5) * 15 + 50,
        });
        return next;
      });
      setGlobalPulse(p => (p + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Randomly shift node statuses
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => {
        if (Math.random() > 0.92) {
          const statuses: NodeStatus[] = ["SYNCING", "SIGNAL STABLE", "IDLE"];
          return { ...n, status: statuses[Math.floor(Math.random() * 3)], frequency: Math.random() * 40 + 8 };
        }
        return n;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Full sync animation
  const initiateSync = useCallback(() => {
    if (syncActive) return;
    setSyncActive(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= 30) {
        clearInterval(interval);
        setNodes(prev => prev.map(n => ({ ...n, status: "SIGNAL STABLE" })));
        setTimeout(() => setSyncActive(false), 1000);
        return;
      }
      setNodes(prev => prev.map((n, idx) => {
        if (idx === i) return { ...n, status: "SYNCING" };
        if (idx < i) return { ...n, status: "SIGNAL STABLE" };
        return n;
      }));
      i++;
    }, 60);
  }, [syncActive]);

  const timeStr = systemTime.toLocaleTimeString("en-US", { hour12: false });
  const activeCount = nodes.filter(n => n.status === "SIGNAL STABLE").length;
  const syncingCount = nodes.filter(n => n.status === "SYNCING").length;

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ background: SLATE_BG, color: "#94a3b8", fontFamily: FONT_MONO }}>
      {/* Scanline */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.012]" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${TEAL}18 2px, ${TEAL}18 4px)`,
      }} />

      <div className="container max-w-7xl py-4 space-y-4 relative z-10 px-3 md:px-6">

        {/* ═══ HEADER ═══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <Brain className="h-8 w-8" style={{ color: TEAL }} />
            </motion.div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-[0.12em]" style={{ color: TEAL }}>
                PERCEPTIO NEURO LABS
              </h1>
              <p className="text-[9px] tracking-[0.4em]" style={{ color: "#1e293b" }}>
                MEDICAL TELEMETRY SIT v2.0 · NEURAL PATTERN ANALYSIS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px]" style={{ color: "#334155" }}>TELEMETRY CLOCK</div>
              <div className="text-sm font-bold" style={{ color: TEAL }}>{timeStr}</div>
            </div>
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ background: TEAL }}
              animate={{ opacity: [1, 0.3, 1], boxShadow: [`0 0 8px ${TEAL}`, `0 0 24px ${TEAL}`, `0 0 8px ${TEAL}`] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </div>

        {/* ═══ VITAL STATS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { icon: Brain, label: "NEURAL NODES", value: "30", color: TEAL },
            { icon: Activity, label: "STABLE SIGNALS", value: activeCount.toString(), color: "#39ff14" },
            { icon: Radio, label: "SYNCING", value: syncingCount.toString(), color: MAGENTA },
            { icon: Heart, label: "ALPHA BAND", value: `${(alphaWave[alphaWave.length - 1]?.value ?? 0).toFixed(1)} Hz`, color: TEAL },
            { icon: Zap, label: "BETA BAND", value: `${(betaWave[betaWave.length - 1]?.value ?? 0).toFixed(1)} Hz`, color: MAGENTA },
          ].map((s, i) => (
            <div key={i} className="rounded-md p-3 border" style={{ background: CARD_BG, borderColor: BORDER }}>
              <div className="flex items-center gap-1.5 text-[9px] mb-1" style={{ color: "#334155" }}>
                <s.icon className="h-3 w-3" /> {s.label}
              </div>
              <div className="text-sm font-bold truncate" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ═══ NEURAL WAVE MONITOR ═══ */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Alpha Band */}
          <motion.div
            className="rounded-lg border p-4 space-y-2"
            style={{ background: CARD_BG, borderColor: BORDER }}
            animate={{ boxShadow: [`0 0 15px ${TEAL}06`, `0 0 30px ${TEAL}12`, `0 0 15px ${TEAL}06`] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: TEAL }}>
                <Activity className="h-3.5 w-3.5" /> ALPHA BAND · 8–13 Hz
              </div>
              <motion.div
                className="px-2 py-0.5 rounded text-[8px] font-bold"
                style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}33` }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                LIVE
              </motion.div>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={alphaWave}>
                  <defs>
                    <linearGradient id="alphaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={TEAL}
                    strokeWidth={1.5}
                    fill="url(#alphaGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Beta Band */}
          <motion.div
            className="rounded-lg border p-4 space-y-2"
            style={{ background: CARD_BG, borderColor: BORDER }}
            animate={{ boxShadow: [`0 0 15px ${MAGENTA}06`, `0 0 30px ${MAGENTA}12`, `0 0 15px ${MAGENTA}06`] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: MAGENTA }}>
                <Zap className="h-3.5 w-3.5" /> BETA BAND · 13–30 Hz
              </div>
              <motion.div
                className="px-2 py-0.5 rounded text-[8px] font-bold"
                style={{ background: `${MAGENTA}15`, color: MAGENTA, border: `1px solid ${MAGENTA}33` }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                LIVE
              </motion.div>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={betaWave}>
                  <defs>
                    <linearGradient id="betaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={MAGENTA} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={MAGENTA} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={MAGENTA}
                    strokeWidth={1.5}
                    fill="url(#betaGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* ═══ NEURAL NODE GRID (Intentio Dashboard) ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: TEAL }}>
              <Cpu className="h-4 w-4" /> INTENTIO DASHBOARD — 30 NEURAL NODES
            </div>
            <motion.button
              onClick={initiateSync}
              disabled={syncActive}
              className="px-3 py-1 rounded text-[10px] font-bold border disabled:opacity-40"
              style={{ borderColor: MAGENTA, color: MAGENTA, background: `${MAGENTA}0a` }}
              whileHover={{ boxShadow: `0 0 20px ${MAGENTA}33` }}
              whileTap={{ scale: 0.95 }}
            >
              {syncActive ? "CALIBRATING..." : "▶ FULL CALIBRATION"}
            </motion.button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5">
            {nodes.map(node => {
              const cfg = nodeStatusConfig[node.status];
              return (
                <motion.div
                  key={node.id}
                  className="relative rounded border flex flex-col items-center justify-center p-2"
                  style={{
                    borderColor: cfg.color + "33",
                    background: node.status !== "IDLE" ? cfg.color + "08" : "rgba(15,23,42,0.5)",
                    boxShadow: cfg.glow,
                    minHeight: "52px",
                  }}
                  animate={node.status === "SYNCING" ? {
                    borderColor: [`${TEAL}22`, TEAL, `${TEAL}22`],
                    boxShadow: [`0 0 0px ${TEAL}`, `0 0 16px ${TEAL}`, `0 0 0px ${TEAL}`],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                >
                  <span className="text-[9px] font-bold" style={{ color: cfg.color }}>
                    {node.label}
                  </span>
                  <span className="text-[7px] mt-0.5" style={{ color: cfg.color + "88" }}>
                    {node.status}
                  </span>
                  {node.status !== "IDLE" && (
                    <span className="text-[6px] mt-0.5" style={{ color: "#475569" }}>
                      {node.frequency.toFixed(1)} Hz
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-[8px] pt-1" style={{ color: "#475569" }}>
            {(Object.entries(nodeStatusConfig) as [NodeStatus, { color: string }][]).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: v.color }} /> {k}
              </div>
            ))}
          </div>
        </div>

        {/* ═══ GLOBAL NETWORK STATUS ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: TEAL }}>
            <Globe className="h-3.5 w-3.5" /> GLOBAL NETWORK STATUS — EDGE COMPUTE GRID
          </div>

          {/* Neon Grid Map */}
          <div className="relative rounded-lg overflow-hidden" style={{ background: "#020a12", border: `1px solid ${BORDER}` }}>
            {/* Grid lines */}
            <svg viewBox="0 0 100 60" className="w-full h-auto" style={{ minHeight: "200px" }}>
              {/* Grid */}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 6} x2="100" y2={i * 6} stroke={TEAL} strokeOpacity="0.04" strokeWidth="0.1" />
              ))}
              {Array.from({ length: 21 }, (_, i) => (
                <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="60" stroke={TEAL} strokeOpacity="0.04" strokeWidth="0.1" />
              ))}

              {/* Rough continent outlines (simplified neon lines) */}
              {/* North America */}
              <polyline points="8,18 12,16 18,15 22,17 28,16 30,20 28,28 26,34 22,38 18,40 14,38 10,34 8,30 8,24"
                fill="none" stroke={TEAL} strokeOpacity="0.08" strokeWidth="0.2" />
              {/* Europe */}
              <polyline points="44,16 48,14 54,14 58,16 60,20 58,26 56,30 52,32 48,30 46,26 44,22"
                fill="none" stroke={TEAL} strokeOpacity="0.08" strokeWidth="0.2" />

              {/* Connection lines between servers */}
              {edgeServers.map((s, i) =>
                edgeServers.slice(i + 1).filter(s2 => s.region === s2.region).map((s2, j) => (
                  <line key={`conn-${i}-${j}`}
                    x1={s.x} y1={s.y} x2={s2.x} y2={s2.y}
                    stroke={TEAL} strokeOpacity="0.06" strokeWidth="0.15" strokeDasharray="0.5,0.5"
                  />
                ))
              )}

              {/* Transatlantic link */}
              <line x1="27" y1="30" x2="48" y2="25" stroke={MAGENTA} strokeOpacity="0.12" strokeWidth="0.2" strokeDasharray="1,1" />

              {/* Server points */}
              {edgeServers.map((s, i) => (
                <g key={s.name}>
                  <motion.circle
                    cx={s.x} cy={s.y} r="0.8"
                    fill={s.region === "EU" ? TEAL : MAGENTA}
                    animate={{
                      r: [0.6, 1.2, 0.6],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
                  />
                  <motion.circle
                    cx={s.x} cy={s.y} r="2"
                    fill="none"
                    stroke={s.region === "EU" ? TEAL : MAGENTA}
                    strokeWidth="0.1"
                    animate={{ r: [1.5, 3, 1.5], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: "easeInOut" }}
                  />
                  <text x={s.x} y={s.y - 2} textAnchor="middle"
                    fill={s.region === "EU" ? TEAL : MAGENTA} fontSize="1.4" fontFamily={FONT_MONO} opacity="0.5">
                    {s.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Server list */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {edgeServers.map((s, i) => (
              <motion.div
                key={s.name}
                className="rounded border px-2 py-1.5 text-[8px] flex items-center gap-1.5"
                style={{
                  borderColor: BORDER,
                  background: CARD_BG,
                  color: s.region === "EU" ? TEAL : MAGENTA,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <motion.div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: s.region === "EU" ? TEAL : MAGENTA }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 + i * 0.2 }}
                />
                <Server className="h-2.5 w-2.5" />
                {s.name} <span style={{ color: "#334155" }}>· {s.region}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="flex items-center justify-between py-3 border-t text-[8px]" style={{ borderColor: BORDER, color: "#1e293b" }}>
          <span>PERCEPTIO NEURO LABS · MEDICAL TELEMETRY SIT v2.0 © {new Date().getFullYear()}</span>
          <span>OPERATOR: OJJJA · CLEARANCE: ULTIMA</span>
        </div>
      </div>
    </div>
  );
};

export default NeuroLabs;
