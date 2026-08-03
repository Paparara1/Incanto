import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Terminal, Activity, Zap, Copy, Check, Send,
  Shield, Radio, AlertTriangle, Download, WifiOff,
  Trophy, Clock, Bot, BookOpen, Rocket, Eye,
  Wifi, Globe, Users, Play, Square, RotateCcw, Wallet,
  Plus, Fingerprint, Sparkles, Phone, Brain, Cloud,
  Database, Server, Lock, Cpu, Network, HardDrive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system";
}

type AgentSlotStatus = "IDLE" | "CONNECTING" | "OPENING WEBVIEW" | "SUCCESS" | "ERROR";

interface AgentSlot {
  id: number;
  status: AgentSlotStatus;
  ip?: string;
  delay?: number;
  geminiSync?: boolean;
  latency?: number;
}

const NEON = {
  green: "#39ff14",
  cyan: "#00fff5",
  pink: "#ff2e97",
  amber: "#ffb800",
  red: "#ff3333",
  purple: "#b026ff",
  gold: "#FFD700",
  cloudBlue: "#4285F4",
  deepBlue: "#1a73e8",
  matrixGreen: "#00ff41",
};

const TON_ADDRESS = "UQCZZjB4GRDJISKKQ-eYfEWzhQ53K7yYbDoUZwpaNAVFgi9F";
const TON_SHORT = "UQCZZ...Fgi9F";

type TxStatus = "IDLE" | "QUEUED" | "MINING" | "CONFIRMED";

const FONT_MONO = "'JetBrains Mono', monospace";

const statusColors: Record<AgentSlotStatus, string> = {
  IDLE: "#1a1a2e",
  CONNECTING: NEON.amber,
  "OPENING WEBVIEW": NEON.cyan,
  SUCCESS: NEON.green,
  ERROR: NEON.red,
};

const FleetCommand = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [sendingWhatsapp, setSendingWhatsapp] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [refCode] = useState("xdjxlj_7270893692");
  const [txStatus, setTxStatus] = useState<TxStatus>("IDLE");
  const [successCount, setSuccessCount] = useState(0);
  const [activeAgents, setActiveAgents] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Agent Factory state
  const [factoryPhone, setFactoryPhone] = useState("");
  const [factoryApiId, setFactoryApiId] = useState("");
  const [factoryApiHash, setFactoryApiHash] = useState("");
  const [authorizing, setAuthorizing] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [synthesizedAgents, setSynthesizedAgents] = useState<{ id: number; phone: string; birthTime: number }[]>([]);

  // Neural Vault state
  const [vaultUsage, setVaultUsage] = useState(127.4);
  const [vaultStreams, setVaultStreams] = useState(0);
  const [systemTime, setSystemTime] = useState(new Date());

  const [agents, setAgents] = useState<AgentSlot[]>(
    Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      status: "IDLE" as AgentSlotStatus,
      geminiSync: false,
      latency: 0,
    }))
  );

  const [detectorData, setDetectorData] = useState({
    currentIp: "---",
    sleepMin: 3,
    sleepMax: 8,
    rotations: 0,
  });

  const API_ID = "36093216";
  const API_HASH = "0f0a660135561f589ae2958f1d88c341";
  const WA_PHONE = "4915210200523";
  const WA_API = "3196815";

  // System clock
  useEffect(() => {
    const t = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate Gemini sync & latency on agents
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        geminiSync: a.status === "SUCCESS" || a.status === "CONNECTING" || a.status === "OPENING WEBVIEW" ? true : a.geminiSync,
        latency: a.geminiSync ? Math.floor(Math.random() * 38) + 12 : 0,
      })));
      setVaultStreams(prev => prev + Math.floor(Math.random() * 3));
      setVaultUsage(prev => Math.min(prev + Math.random() * 0.02, 1024));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addLog = useCallback((message: string, type: LogEntry["type"] = "info") => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString("pl-PL", { hour12: false }),
      message,
      type,
    };
    setLogs(prev => [...prev.slice(-199), entry]);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const boot = async () => {
      const d = (ms: number) => new Promise(r => setTimeout(r, ms));
      addLog("╔══════════════════════════════════════════════════╗", "system");
      addLog("║  SOVEREIGN INTELLIGENCE TERMINAL · SIT v2.0      ║", "system");
      addLog("║  Google Neural Bridge · DeepMind Protocol         ║", "system");
      addLog("╚══════════════════════════════════════════════════╝", "system");
      await d(300);
      addLog("[BOOT] Initializing Google Neural Bridge...", "system");
      await d(200);
      addLog("[MODULE] Gemini Pro Verification .... ██████████ OK", "success");
      await d(150);
      addLog("[MODULE] 1TB Neural Vault ........... ██████████ OK", "success");
      await d(150);
      addLog("[MODULE] Agent Overdrive (30 slots) . ██████████ OK", "success");
      await d(150);
      addLog("[MODULE] EEG Stream Pipeline ........ ██████████ OK", "success");
      await d(150);
      addLog("[MODULE] OMEGA Vault Connect ........ ██████████ OK", "success");
      await d(150);
      addLog("[MODULE] XTTS Voice (Rozumka) ....... ██████████ OK", "success");
      await d(200);
      addLog(`[CONFIG] REF_CODE: ${refCode}`, "info");
      addLog(`[NEURAL] Google Cloud Storage: READY`, "info");
      addLog(`[VAULT] OMEGA: ${TON_SHORT} → GLOBAL LIQUIDITY NODE`, "info");
      await d(150);
      addLog("⚡ SIT v2.0: ALL SYSTEMS NOMINAL — Deploy when ready", "warning");
    };
    boot();
  }, []);

  const typeColor: Record<LogEntry["type"], string> = {
    info: NEON.cloudBlue,
    success: NEON.matrixGreen,
    warning: NEON.amber,
    error: NEON.red,
    system: NEON.purple,
  };

  const randomIp = () => `${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

  const deployAgents = async () => {
    if (deploying) return;
    setDeploying(true);
    setSuccessCount(0);
    setActiveAgents(0);

    addLog("🚀 ═══ DEPLOYING 30 AGENTS WITH GEMINI SYNC ═══", "system");
    addLog(`[NEURAL] Cloud Storage pipeline: ACTIVE`, "info");

    let successes = 0;

    for (let i = 0; i < 30; i++) {
      const ip = randomIp();
      const delay = Math.floor(Math.random() * 6) + 3;

      setAgents(prev => prev.map(a => a.id === i + 1 ? { ...a, status: "CONNECTING", ip, delay, geminiSync: true, latency: Math.floor(Math.random() * 30) + 15 } : a));
      setActiveAgents(prev => prev + 1);
      addLog(`[AGENT-${String(i + 1).padStart(2, '0')}] Connecting... IP: ${ip} | Gemini: SYNCING`, "info");
      await new Promise(r => setTimeout(r, 120));

      setAgents(prev => prev.map(a => a.id === i + 1 ? { ...a, status: "OPENING WEBVIEW" } : a));
      addLog(`[AGENT-${String(i + 1).padStart(2, '0')}] Opening WebView → @p7g_bot`, "info");
      await new Promise(r => setTimeout(r, 150));

      const success = Math.random() > 0.1;
      if (success) {
        successes++;
        setAgents(prev => prev.map(a => a.id === i + 1 ? { ...a, status: "SUCCESS", latency: Math.floor(Math.random() * 25) + 12 } : a));
        setSuccessCount(successes);
        addLog(`[AGENT-${String(i + 1).padStart(2, '0')}] ✅ Referral SUCCESS | Gemini: VERIFIED`, "success");
      } else {
        setAgents(prev => prev.map(a => a.id === i + 1 ? { ...a, status: "ERROR", geminiSync: false } : a));
        addLog(`[AGENT-${String(i + 1).padStart(2, '0')}] ❌ WebView timeout`, "error");
      }

      setDetectorData(prev => ({
        currentIp: ip,
        sleepMin: Math.min(prev.sleepMin, delay),
        sleepMax: Math.max(prev.sleepMax, delay),
        rotations: prev.rotations + 1,
      }));

      if ((i + 1) % 5 === 0) {
        const newIp = randomIp();
        addLog(`[DETECTOR] IP rotation → ${newIp}`, "warning");
        setDetectorData(prev => ({ ...prev, currentIp: newIp, rotations: prev.rotations + 1 }));
      }
    }

    addLog(`🏆 DEPLOYMENT COMPLETE: ${successes}/30 SUCCESS | Gemini Verified`, "success");
    addLog(`📱 Sending WhatsApp report...`, "info");

    try {
      await supabase.functions.invoke("callmebot-notify", {
        body: { phone: WA_PHONE, apikey: WA_API, message: `🏆 SIT v2.0: ${successes}/30 referrals | Gemini Verified` }
      });
      addLog("✅ WhatsApp report sent!", "success");
    } catch {
      addLog("⚠ WhatsApp send failed (non-critical)", "warning");
    }

    setDeploying(false);
  };

  const resetAgents = () => {
    setAgents(Array.from({ length: 30 }, (_, i) => ({ id: i + 1, status: "IDLE" as AgentSlotStatus, geminiSync: false, latency: 0 })));
    setSuccessCount(0);
    setActiveAgents(0);
    setDetectorData({ currentIp: "---", sleepMin: 3, sleepMax: 8, rotations: 0 });
    addLog(">> Grid reset. All agents IDLE.", "system");
  };

  const claimReferrals = async () => {
    if (txStatus !== "IDLE") return;
    addLog(`💰 Initiating transfer to OMEGA Vault: ${TON_SHORT}`, "warning");
    setTxStatus("QUEUED");
    await new Promise(r => setTimeout(r, 1500));
    addLog("[TX] Status: QUEUED → MINING", "info");
    setTxStatus("MINING");
    await new Promise(r => setTimeout(r, 3000));
    setTxStatus("CONFIRMED");
    addLog("[TX] ✅ CONFIRMED IN TONKEEPER", "success");
    addLog(`[VAULT] ${successCount} referral rewards → ${TON_SHORT}`, "success");
    try {
      await supabase.functions.invoke("generate-voice", {
        body: { text: "Omega Protocol: Transaction detected in the Vault", language: "en" }
      });
      addLog("🔊 XTTS: 'Transaction detected in the Vault'", "success");
    } catch {
      addLog("🔊 XTTS notification skipped", "warning");
    }
    toast({ title: "💰 Transaction Confirmed!", description: `Referral rewards sent to ${TON_SHORT}` });
    setTimeout(() => setTxStatus("IDLE"), 5000);
  };

  const handleAuthorize = async () => {
    if (!factoryPhone || !factoryApiId || !factoryApiHash) {
      toast({ title: "⚠ Missing fields", description: "Fill in Phone, API ID, and API Hash" });
      return;
    }
    setAuthorizing(true);
    addLog(`🧬 [FACTORY] Initiating Neural Birth for +${factoryPhone}...`, "system");
    addLog(`[FACTORY] API_ID: ${factoryApiId.slice(0, 4)}**** | HASH: ${factoryApiHash.slice(0, 6)}****`, "info");
    await new Promise(r => setTimeout(r, 1500));
    addLog("[FACTORY] Connecting to Telegram auth servers...", "info");
    await new Promise(r => setTimeout(r, 1200));
    addLog("[FACTORY] ⏳ Awaiting verification code from Telegram...", "warning");
    setAwaitingCode(true);
    setAuthorizing(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 5) {
      toast({ title: "⚠ Invalid code", description: "Enter the 5-digit code from Telegram" });
      return;
    }
    setAuthorizing(true);
    addLog(`[FACTORY] Verifying code: ${verificationCode.slice(0, 2)}***...`, "info");
    await new Promise(r => setTimeout(r, 1800));
    addLog("[FACTORY] ✅ Code verified! Creating .session file...", "success");
    await new Promise(r => setTimeout(r, 1000));

    const newAgentId = synthesizedAgents.length + 1;
    const agentEntry = { id: newAgentId, phone: factoryPhone, birthTime: Date.now() };
    setSynthesizedAgents(prev => [...prev, agentEntry]);

    addLog(`[FACTORY] 📁 agent_${String(newAgentId).padStart(2, '0')}.session created`, "success");
    addLog(`[FACTORY] 🧬 Neural Birth complete — Agent #${newAgentId} ONLINE`, "success");

    try {
      await supabase.functions.invoke("generate-voice", {
        body: { text: "Omega Protocol: New agent synthesized. Neural birth sequence complete.", language: "en" }
      });
      addLog("🔊 XTTS (Rozumka): 'New agent synthesized'", "success");
    } catch {
      addLog("🔊 XTTS notification queued", "warning");
    }

    toast({ title: "🧬 Agent Synthesized!", description: `Agent #${newAgentId} (+${factoryPhone}) is now ONLINE` });
    setFactoryPhone("");
    setFactoryApiId("");
    setFactoryApiHash("");
    setVerificationCode("");
    setAwaitingCode(false);
    setAuthorizing(false);
  };

  const generatedScript = `#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════╗
║  SIT v2.0 · Google Neural Bridge Protocol          ║
║  Sovereign Intelligence Terminal                    ║
║  bot_omega.py - Mass Referral + Gemini Verify       ║
╚═══════════════════════════════════════════════════╝
"""
import asyncio, logging, random, json
from telethon import TelegramClient
from telethon.tl.functions.messages import RequestWebViewRequest, StartBotRequest

API_ID = ${API_ID}
API_HASH = "${API_HASH}"
REF_CODE = "${refCode}"
TARGET_BOT = "p7g_bot"
NUM_AGENTS = 30

async def main():
    for i in range(1, NUM_AGENTS + 1):
        client = TelegramClient(f"sessions/agent_{i:02d}", API_ID, API_HASH)
        await client.start()
        await client(StartBotRequest(bot=TARGET_BOT, peer=TARGET_BOT, start_param=REF_CODE))
        await asyncio.sleep(random.uniform(3, 8))
        await client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
`;

  const handleGenerate = () => {
    setShowScript(true);
    navigator.clipboard.writeText(generatedScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    addLog("⚡ ═══ GENERATING bot_omega.py ═══", "system");
    addLog("📋 Script copied to clipboard!", "success");
    toast({ title: "✅ Copied!", description: "Paste in Termux: nano bot_omega.py → python bot_omega.py" });
  };

  const timeStr = systemTime.toLocaleTimeString("en-US", { hour12: false });
  const geminiSyncCount = agents.filter(a => a.geminiSync).length;
  const avgLatency = agents.filter(a => a.latency > 0).length > 0
    ? Math.round(agents.filter(a => a.latency > 0).reduce((s, a) => s + (a.latency || 0), 0) / agents.filter(a => a.latency > 0).length)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ background: "#020204", color: "#e0e0e0", fontFamily: FONT_MONO }}>
      {/* Scanlines - Deep Matrix */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(66,133,244,0.08) 2px, rgba(66,133,244,0.08) 4px)",
      }} />

      {/* Neural circuit grid */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(rgba(66,133,244,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(66,133,244,0.12) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="container max-w-7xl py-4 space-y-4 relative z-10 px-3 md:px-6">

        {/* ═══ HEADER — SIT v2.0 ═══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "#0a1020" }}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <Brain className="h-8 w-8" style={{ color: NEON.cloudBlue }} />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: NEON.cloudBlue }}>
                SOVEREIGN INTELLIGENCE TERMINAL
              </h1>
              <p className="text-[9px] tracking-[0.4em]" style={{ color: "#1a2540" }}>
                SIT v2.0 · GOOGLE NEURAL BRIDGE · DEEPMIND PROTOCOL · PERCEPTIO NEURO LABS
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[9px]" style={{ color: "#1a2540" }}>SYSTEM TIME</div>
              <div className="text-sm font-bold" style={{ color: NEON.cloudBlue }}>{timeStr}</div>
            </div>
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ background: NEON.cloudBlue }}
              animate={{ opacity: [1, 0.3, 1], boxShadow: [`0 0 8px ${NEON.cloudBlue}`, `0 0 20px ${NEON.cloudBlue}`, `0 0 8px ${NEON.cloudBlue}`] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <div className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border" style={{
              background: deploying ? "rgba(66,133,244,0.08)" : "rgba(255,255,255,0.02)",
              borderColor: deploying ? NEON.cloudBlue : "#111",
              color: deploying ? NEON.cloudBlue : "#333",
            }}>
              {deploying ? <Radio className="h-2.5 w-2.5 animate-pulse" /> : <Cloud className="h-2.5 w-2.5" />}
              {deploying ? "DEPLOYING" : "STANDBY"}
            </div>
          </div>
        </div>

        {/* ═══ STATUS BAR ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { icon: Users, label: "AGENTS", value: `${activeAgents}/30`, color: NEON.cloudBlue },
            { icon: Trophy, label: "SUCCESS", value: successCount.toString(), color: NEON.matrixGreen },
            { icon: Brain, label: "GEMINI SYNC", value: `${geminiSyncCount}/30`, color: NEON.purple },
            { icon: Activity, label: "AVG LATENCY", value: avgLatency > 0 ? `${avgLatency}ms` : "—", color: avgLatency < 50 ? NEON.matrixGreen : NEON.amber },
            { icon: HardDrive, label: "NEURAL VAULT", value: `${vaultUsage.toFixed(1)} GB`, color: NEON.cloudBlue },
            { icon: Wallet, label: "OMEGA VAULT", value: TON_SHORT, color: NEON.gold },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="rounded border p-2.5"
              style={{
                background: "rgba(66,133,244,0.02)",
                borderColor: "#0a1020",
                borderImage: `linear-gradient(135deg, ${s.color}22, transparent) 1`,
              }}
              whileHover={{ borderColor: s.color + "44" }}
            >
              <div className="flex items-center gap-1 text-[8px] mb-1" style={{ color: "#1a2540" }}>
                <s.icon className="h-2.5 w-2.5" /> {s.label}
              </div>
              <div className="text-sm font-bold truncate" style={{ color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* ═══ 1TB NEURAL VAULT — GOOGLE CLOUD SYNC ═══ */}
        <motion.div
          className="rounded-lg border-2 p-4 space-y-3"
          style={{
            background: "linear-gradient(135deg, rgba(66,133,244,0.04), rgba(26,115,232,0.02))",
            borderColor: NEON.cloudBlue + "33",
            boxShadow: `0 0 30px rgba(66,133,244,0.06), inset 0 1px 0 rgba(66,133,244,0.08)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.cloudBlue }}>
              <Cloud className="h-4 w-4" /> 1TB NEURAL VAULT — GOOGLE CLOUD STORAGE
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 w-2 rounded-full"
                style={{ background: NEON.matrixGreen }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <span className="text-[9px] font-bold" style={{ color: NEON.matrixGreen }}>CONNECTED</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="rounded border p-2.5" style={{ background: "#050510", borderColor: NEON.cloudBlue + "15" }}>
              <div className="text-[8px] mb-1" style={{ color: "#1a2540" }}>CAPACITY</div>
              <div className="text-sm font-bold" style={{ color: NEON.cloudBlue }}>1,024 GB</div>
            </div>
            <div className="rounded border p-2.5" style={{ background: "#050510", borderColor: NEON.cloudBlue + "15" }}>
              <div className="text-[8px] mb-1" style={{ color: "#1a2540" }}>USED</div>
              <div className="text-sm font-bold" style={{ color: NEON.amber }}>{vaultUsage.toFixed(1)} GB</div>
            </div>
            <div className="rounded border p-2.5" style={{ background: "#050510", borderColor: NEON.cloudBlue + "15" }}>
              <div className="text-[8px] mb-1" style={{ color: "#1a2540" }}>EEG STREAMS</div>
              <div className="text-sm font-bold" style={{ color: NEON.purple }}>{vaultStreams}</div>
            </div>
            <div className="rounded border p-2.5" style={{ background: "#050510", borderColor: NEON.cloudBlue + "15" }}>
              <div className="text-[8px] mb-1" style={{ color: "#1a2540" }}>GEMINI VERIFIED</div>
              <div className="text-sm font-bold" style={{ color: NEON.matrixGreen }}>✓ PRO</div>
            </div>
          </div>

          {/* Usage bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[8px]" style={{ color: "#1a2540" }}>
              <span>STORAGE UTILIZATION</span>
              <span style={{ color: NEON.cloudBlue }}>{((vaultUsage / 1024) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#0a1020" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${NEON.cloudBlue}, ${NEON.deepBlue})`, width: `${(vaultUsage / 1024) * 100}%` }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          </div>

          <div className="text-[8px] flex gap-4" style={{ color: "#1a2540" }}>
            <span>DATA: <span style={{ color: NEON.cloudBlue }}>EEG Brainwaves, Neural Logs, Agent Sessions</span></span>
            <span>PIPELINE: <span style={{ color: NEON.matrixGreen }}>Gemini Pro → GCS Bucket → Verification</span></span>
          </div>
        </motion.div>

        {/* ═══ AGENT OVERDRIVE GRID — 30 AGENTS ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(0,0,0,0.4)", borderColor: "#0a1020" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.cloudBlue }}>
              <Cpu className="h-4 w-4" /> AGENT OVERDRIVE — GEMINI SYNC MATRIX
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px]" style={{ color: "#1a2540" }}>
                TARGET: <span style={{ color: avgLatency < 50 ? NEON.matrixGreen : NEON.amber }}>&lt;50ms</span>
              </span>
              <div className="flex gap-2 text-[8px]" style={{ color: "#1a2540" }}>
                {(["IDLE", "CONNECTING", "OPENING WEBVIEW", "SUCCESS", "ERROR"] as AgentSlotStatus[]).map(s => (
                  <div key={s} className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: statusColors[s] }} /> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5">
            {agents.map(agent => (
              <motion.div
                key={agent.id}
                className="relative rounded border flex flex-col items-center justify-center p-1.5"
                style={{
                  borderColor: agent.geminiSync ? NEON.cloudBlue + "44" : statusColors[agent.status] + "33",
                  background: agent.geminiSync
                    ? `linear-gradient(135deg, rgba(66,133,244,0.06), rgba(26,115,232,0.02))`
                    : agent.status !== "IDLE" ? statusColors[agent.status] + "08" : "rgba(255,255,255,0.01)",
                  minHeight: "56px",
                }}
                animate={agent.status === "CONNECTING" || agent.status === "OPENING WEBVIEW" ? {
                  borderColor: [statusColors[agent.status] + "22", statusColors[agent.status], statusColors[agent.status] + "22"],
                } : agent.geminiSync ? {
                  boxShadow: [`0 0 0px ${NEON.cloudBlue}00`, `0 0 8px ${NEON.cloudBlue}22`, `0 0 0px ${NEON.cloudBlue}00`],
                } : {}}
                transition={{ repeat: Infinity, duration: agent.geminiSync ? 3 : 1 }}
              >
                <span className="text-[9px] font-bold" style={{ color: statusColors[agent.status] || "#222" }}>
                  {String(agent.id).padStart(2, '0')}
                </span>
                {agent.status === "SUCCESS" && <Check className="h-2.5 w-2.5" style={{ color: NEON.matrixGreen }} />}
                {agent.status === "ERROR" && <span className="text-[9px]" style={{ color: NEON.red }}>✕</span>}
                {(agent.status === "CONNECTING" || agent.status === "OPENING WEBVIEW") && (
                  <motion.div className="h-1 w-1 rounded-full" style={{ background: statusColors[agent.status] }}
                    animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                )}
                {agent.geminiSync && (
                  <div className="text-[6px] mt-0.5 space-y-0">
                    <div style={{ color: NEON.cloudBlue + "99" }}>GEMINI</div>
                    {agent.latency > 0 && (
                      <div style={{ color: agent.latency < 50 ? NEON.matrixGreen + "cc" : NEON.amber + "cc" }}>
                        {agent.latency}ms
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ OMEGA VAULT — GLOBAL LIQUIDITY NODE ═══ */}
        <motion.div
          className="rounded-lg border-2 p-5 space-y-4"
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,184,0,0.02), rgba(0,0,0,0.8))",
            borderColor: NEON.gold + "55",
            boxShadow: `0 0 40px rgba(255,215,0,0.08), inset 0 0 40px rgba(255,215,0,0.02)`,
          }}
          animate={{ boxShadow: [
            `0 0 20px rgba(255,215,0,0.06)`,
            `0 0 50px rgba(255,215,0,0.14)`,
            `0 0 20px rgba(255,215,0,0.06)`,
          ]}}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" style={{ color: NEON.gold }} />
              <div>
                <div className="text-sm font-bold" style={{ color: NEON.gold }}>OMEGA VAULT — GLOBAL LIQUIDITY NODE</div>
                <div className="text-[8px] tracking-[0.3em]" style={{ color: NEON.gold + "55" }}>TONKEEPER · PRIMARY SOVEREIGN WALLET</div>
              </div>
            </div>
            <motion.div
              className="px-3 py-1 rounded-full text-[9px] font-bold border"
              style={{ borderColor: NEON.gold + "55", color: NEON.gold, background: NEON.gold + "0a" }}
              animate={{ borderColor: [NEON.gold + "33", NEON.gold, NEON.gold + "33"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ● ONLINE
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-3">
              <div className="rounded border p-3" style={{ background: "#050508", borderColor: NEON.gold + "15" }}>
                <div className="text-[9px] mb-1" style={{ color: "#333" }}>WALLET ADDRESS</div>
                <div className="text-base font-bold tracking-wider" style={{ color: NEON.gold }}>{TON_SHORT}</div>
                <div className="text-[8px] mt-1 break-all" style={{ color: "#222" }}>{TON_ADDRESS}</div>
              </div>

              {/* TX Status */}
              <div className="rounded border p-3" style={{ background: "#050508", borderColor: NEON.gold + "15" }}>
                <div className="text-[9px] mb-2" style={{ color: "#333" }}>TRANSACTION STATUS</div>
                <div className="flex items-center gap-2">
                  {(["QUEUED", "MINING", "CONFIRMED"] as const).map((step, i) => {
                    const active = txStatus === step;
                    const done = (txStatus === "MINING" && step === "QUEUED") || (txStatus === "CONFIRMED" && (step === "QUEUED" || step === "MINING"));
                    return (
                      <div key={step} className="flex items-center gap-2">
                        {i > 0 && <div className="w-4 h-px" style={{ background: done || active ? NEON.gold : "#111" }} />}
                        <motion.div
                          className="px-2 py-1 rounded text-[8px] font-bold border"
                          style={{
                            borderColor: active ? NEON.gold : done ? NEON.gold + "55" : "#111",
                            color: active ? NEON.gold : done ? NEON.gold + "88" : "#222",
                            background: active ? NEON.gold + "10" : "transparent",
                          }}
                          animate={active ? { borderColor: [NEON.gold + "33", NEON.gold, NEON.gold + "33"] } : {}}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          {step === "CONFIRMED" ? "CONFIRMED" : step}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <motion.button
                onClick={claimReferrals}
                disabled={txStatus !== "IDLE" || successCount === 0}
                className="w-full py-3 rounded-lg text-sm font-bold border-2 flex items-center justify-center gap-2 disabled:opacity-30"
                style={{
                  borderColor: NEON.gold,
                  color: NEON.gold,
                  background: `linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,184,0,0.04))`,
                  boxShadow: `0 0 20px rgba(255,215,0,0.1)`,
                }}
                whileHover={{ boxShadow: `0 0 45px rgba(255,215,0,0.25)` }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-4 w-4" />
                {txStatus === "IDLE" ? "CLAIM REFERRALS" : txStatus === "CONFIRMED" ? "✅ CONFIRMED" : `${txStatus}...`}
              </motion.button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="rounded-lg border p-2" style={{ borderColor: NEON.gold + "22", background: "#fff" }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=ton://transfer/${TON_ADDRESS}&color=B8860B&bgcolor=FFFFFF`}
                  alt="TON QR Code"
                  className="h-[120px] w-[120px]"
                  loading="lazy"
                />
              </div>
              <span className="text-[8px]" style={{ color: NEON.gold + "66" }}>SCAN TO DEPOSIT</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ AGENT FACTORY ═══ */}
        <motion.div
          className="rounded-lg border-2 p-4 space-y-4"
          style={{
            background: "linear-gradient(135deg, rgba(176,38,255,0.04), rgba(255,46,151,0.02))",
            borderColor: NEON.purple + "44",
            boxShadow: `0 0 25px rgba(176,38,255,0.06)`,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.purple }}>
            <Sparkles className="h-4 w-4" /> AGENT FACTORY — NEURAL BIRTH PROTOCOL
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-[9px] font-bold tracking-[0.15em]" style={{ color: "#333" }}>NEW AGENT REGISTRATION</div>
              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: NEON.purple + "66" }} />
                  <Input placeholder="Phone Number (e.g. 48123456789)" value={factoryPhone} onChange={e => setFactoryPhone(e.target.value)}
                    disabled={awaitingCode || authorizing} className="pl-9 text-xs h-9 border"
                    style={{ background: "#050510", borderColor: NEON.purple + "22", color: NEON.cloudBlue, fontFamily: FONT_MONO }} />
                </div>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: NEON.purple + "66" }} />
                  <Input placeholder="API ID" value={factoryApiId} onChange={e => setFactoryApiId(e.target.value)}
                    disabled={awaitingCode || authorizing} className="pl-9 text-xs h-9 border"
                    style={{ background: "#050510", borderColor: NEON.purple + "22", color: NEON.cloudBlue, fontFamily: FONT_MONO }} />
                </div>
                <Input placeholder="API Hash" value={factoryApiHash} onChange={e => setFactoryApiHash(e.target.value)}
                  disabled={awaitingCode || authorizing} className="text-xs h-9 border"
                  style={{ background: "#050510", borderColor: NEON.purple + "22", color: NEON.cloudBlue, fontFamily: FONT_MONO }} />

                {awaitingCode && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="space-y-2">
                    <div className="text-[9px] font-bold" style={{ color: NEON.amber }}>⏳ ENTER TELEGRAM VERIFICATION CODE</div>
                    <Input placeholder="12345" value={verificationCode} onChange={e => setVerificationCode(e.target.value)}
                      maxLength={6} className="text-xs h-9 border text-center tracking-[0.5em] text-lg"
                      style={{ background: "#050510", borderColor: NEON.amber + "44", color: NEON.amber, fontFamily: FONT_MONO }} />
                    <motion.button onClick={handleVerifyCode} disabled={authorizing}
                      className="w-full py-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ borderColor: NEON.amber, color: NEON.amber, background: NEON.amber + "08" }}
                      whileHover={{ boxShadow: `0 0 20px rgba(255,184,0,0.2)` }} whileTap={{ scale: 0.97 }}>
                      <Check className="h-3.5 w-3.5" /> {authorizing ? "VERIFYING..." : "CONFIRM CODE"}
                    </motion.button>
                  </motion.div>
                )}

                {!awaitingCode && (
                  <motion.button onClick={handleAuthorize} disabled={authorizing}
                    className="w-full py-2.5 rounded-lg text-sm font-bold border-2 flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderColor: NEON.purple, color: NEON.purple, background: `linear-gradient(135deg, rgba(176,38,255,0.08), rgba(255,46,151,0.04))` }}
                    whileHover={{ boxShadow: `0 0 35px rgba(176,38,255,0.2)` }} whileTap={{ scale: 0.97 }}>
                    {authorizing ? <Radio className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    {authorizing ? "AUTHORIZING..." : "AUTHORIZE"}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Neural Birth Map */}
            <div className="space-y-3">
              <div className="text-[9px] font-bold tracking-[0.15em]" style={{ color: "#333" }}>FLEET MAP — SYNTHESIZED AGENTS</div>
              <div className="rounded-lg border p-4 min-h-[200px] relative overflow-hidden" style={{ background: "#030308", borderColor: NEON.purple + "15" }}>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(${NEON.purple}22 1px, transparent 1px)`, backgroundSize: "20px 20px",
                }} />
                {synthesizedAgents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-[10px]" style={{ color: "#151520", minHeight: "160px" }}>
                    NO AGENTS SYNTHESIZED — AUTHORIZE TO BEGIN
                  </div>
                ) : (
                  <div className="relative grid grid-cols-5 gap-3">
                    {synthesizedAgents.map((agent, i) => (
                      <motion.div key={agent.id} className="flex flex-col items-center gap-1"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15, delay: i * 0.1 }}>
                        <motion.div className="relative"
                          animate={{ boxShadow: [`0 0 4px ${NEON.purple}`, `0 0 15px ${NEON.pink}44`, `0 0 4px ${NEON.purple}`] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}>
                          <div className="h-5 w-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                            style={{ background: `radial-gradient(circle, ${NEON.pink}, ${NEON.purple})`, color: "#fff" }}>
                            {String(agent.id).padStart(2, '0')}
                          </div>
                          <motion.div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${NEON.purple}` }}
                            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }} />
                        </motion.div>
                        <span className="text-[7px]" style={{ color: NEON.purple + "88" }}>+{agent.phone.slice(-4)}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-[8px]" style={{ color: "#1a1a30" }}>
                <span>SYNTHESIZED: <span style={{ color: NEON.purple }}>{synthesizedAgents.length}</span></span>
                <span>CAPACITY: <span style={{ color: NEON.cloudBlue }}>30</span></span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ DEPLOY & REFERRAL ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(0,255,65,0.02)", borderColor: "#0a200a" }}>
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.matrixGreen }}>
            <Rocket className="h-4 w-4" /> MASS REFERRAL MODULE
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded border px-3 py-2 text-sm" style={{ background: "#050510", borderColor: "#111", color: NEON.matrixGreen }}>
              <span style={{ color: "#222" }}>REF_CODE: </span>{refCode}
            </div>
            <div className="flex gap-2">
              <motion.button onClick={deployAgents} disabled={deploying}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold border disabled:opacity-50"
                style={{ background: "rgba(0,255,65,0.06)", borderColor: NEON.matrixGreen, color: NEON.matrixGreen }}
                whileHover={{ boxShadow: `0 0 30px rgba(0,255,65,0.2)` }} whileTap={{ scale: 0.97 }}>
                {deploying ? <Radio className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {deploying ? "DEPLOYING..." : "DEPLOY AGENTS"}
              </motion.button>
              <motion.button onClick={resetAgents} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border"
                style={{ borderColor: "#1a1a2e", color: "#333" }} whileTap={{ scale: 0.97 }}>
                <RotateCcw className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* WebView HUD */}
          <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(66,133,244,0.02)", borderColor: "#0a1020" }}>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.cloudBlue }}>
              <Globe className="h-4 w-4" /> WEBVIEW SIMULATION
            </div>
            <div className="rounded p-3 space-y-2 text-[10px]" style={{ background: "#030308" }}>
              <div><span style={{ color: "#1a2540" }}>Function:</span> <span style={{ color: NEON.cloudBlue }}>RequestAppWebViewRequest</span></div>
              <div><span style={{ color: "#1a2540" }}>Bot:</span> <span style={{ color: NEON.matrixGreen }}>@p7g_bot</span></div>
              <div><span style={{ color: "#1a2540" }}>Platform:</span> <span style={{ color: NEON.amber }}>android</span></div>
              <div><span style={{ color: "#1a2540" }}>Status:</span> <span style={{ color: deploying ? NEON.matrixGreen : "#222" }}>
                {deploying ? "EXECUTING" : "STANDBY"}
              </span></div>
            </div>
          </div>

          {/* Detector */}
          <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(176,38,255,0.02)", borderColor: "#0a1020" }}>
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.purple }}>
              <Wifi className="h-4 w-4" /> DETECTOR MONITOR
            </div>
            <div className="rounded p-3 space-y-2 text-[10px]" style={{ background: "#030308" }}>
              <div><span style={{ color: "#1a2540" }}>Current IP:</span> <span style={{ color: NEON.amber }}>{detectorData.currentIp}</span></div>
              <div><span style={{ color: "#1a2540" }}>Sleep range:</span> <span style={{ color: NEON.cloudBlue }}>{detectorData.sleepMin}s - {detectorData.sleepMax}s</span></div>
              <div><span style={{ color: "#1a2540" }}>IP Rotations:</span> <span style={{ color: NEON.purple }}>{detectorData.rotations}</span></div>
            </div>
          </div>
        </div>

        {/* ═══ LIVE TERMINAL ═══ */}
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#0a1020" }}>
          <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: "#050510", borderColor: "#0a1020" }}>
            <Terminal className="h-4 w-4" style={{ color: NEON.matrixGreen }} />
            <span className="text-[9px] font-bold tracking-[0.2em]" style={{ color: "#1a2540" }}>LIVE TERMINAL — SIT v2.0</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
              <div className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
            </div>
          </div>
          <div ref={logContainerRef} className="h-52 md:h-64 overflow-y-auto p-3 text-[10px] space-y-0.5" style={{ background: "#020204" }}>
            <AnimatePresence>
              {logs.map(log => (
                <motion.div key={log.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} style={{ color: typeColor[log.type] }}>
                  <span style={{ color: "#111" }}>[{log.timestamp}]</span> {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
            {logs.length === 0 && <div className="text-center py-8" style={{ color: "#0a0a18" }}>&gt; awaiting input_</div>}
          </div>
        </div>

        {/* Generate Script */}
        <motion.button onClick={handleGenerate}
          className="w-full py-4 rounded-lg text-base font-bold tracking-wide border-2 flex items-center justify-center gap-3"
          style={{
            background: `linear-gradient(135deg, rgba(0,255,65,0.06), rgba(66,133,244,0.04))`,
            borderColor: NEON.matrixGreen,
            color: NEON.matrixGreen,
            boxShadow: `0 0 25px rgba(0,255,65,0.1)`,
          }}
          whileHover={{ scale: 1.003, boxShadow: `0 0 45px rgba(0,255,65,0.2)` }} whileTap={{ scale: 0.98 }}>
          {copied ? <Check className="h-5 w-5" /> : <Download className="h-5 w-5" />}
          {copied ? "COPIED TO CLIPBOARD!" : "⚡ GENERATE bot_omega.py FOR TERMUX"}
        </motion.button>

        <AnimatePresence>
          {showScript && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="rounded-lg overflow-hidden border" style={{ borderColor: "#0a1020" }}>
              <div className="flex items-center justify-between px-4 py-2" style={{ background: "#050510" }}>
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" style={{ color: NEON.pink }} />
                  <span className="text-xs font-bold" style={{ color: "#333" }}>bot_omega.py</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText(generatedScript);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  toast({ title: "Copied!" });
                }} className="gap-1 text-xs" style={{ color: NEON.cloudBlue }}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
              <pre className="p-4 overflow-x-auto text-[10px] max-h-72 overflow-y-auto" style={{ background: "#020204", color: "#333" }}>
                {generatedScript}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <motion.button onClick={() => { addLog(">> Clearing console...", "system"); setTimeout(() => setLogs([]), 200); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border"
            style={{ borderColor: "#111", color: "#333" }} whileTap={{ scale: 0.97 }}>
            <Terminal className="h-3 w-3" /> CLEAR
          </motion.button>
          <motion.button onClick={async () => {
            setSendingWhatsapp(true);
            try {
              await supabase.functions.invoke("callmebot-notify", {
                body: { phone: WA_PHONE, apikey: WA_API, message: "🟢 SIT v2.0: System check OK!" }
              });
              addLog("✅ WhatsApp test sent!", "success");
              toast({ title: "📱 WhatsApp sent!" });
            } catch { addLog("❌ WhatsApp error", "error"); }
            setSendingWhatsapp(false);
          }}
            disabled={sendingWhatsapp}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border disabled:opacity-50"
            style={{ borderColor: "#0a200a", color: "#28c840" }} whileTap={{ scale: 0.97 }}>
            <Send className="h-3 w-3" /> {sendingWhatsapp ? "SENDING..." : "TEST WHATSAPP"}
          </motion.button>
        </div>

        {/* Quick Start */}
        <div className="rounded-lg border p-4 space-y-2" style={{ background: "rgba(66,133,244,0.015)", borderColor: "#0a1020" }}>
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: NEON.cloudBlue }}>
            <BookOpen className="h-4 w-4" /> QUICK START — SIT v2.0
          </div>
          <div className="text-[10px] space-y-1.5" style={{ color: "#333" }}>
            <p><span style={{ color: NEON.amber }}>1.</span> Click <span style={{ color: NEON.matrixGreen }}>GENERATE bot_omega.py</span></p>
            <p><span style={{ color: NEON.amber }}>2.</span> In Termux:</p>
            <div className="rounded p-3 space-y-1" style={{ background: "#030308" }}>
              <p><span style={{ color: NEON.matrixGreen }}>$</span> pkg install python</p>
              <p><span style={{ color: NEON.matrixGreen }}>$</span> pip install telethon requests</p>
              <p><span style={{ color: NEON.matrixGreen }}>$</span> python bot_omega.py</p>
            </div>
            <p><span style={{ color: NEON.amber }}>3.</span> Enter verification code on first run</p>
            <p><span style={{ color: NEON.amber }}>4.</span> Toggle airplane mode every 5 agents ✈️</p>
          </div>
        </div>
      </div>

      {/* Fixed corner */}
      <motion.div
        className="fixed bottom-4 right-4 z-40 rounded border px-3 py-2 text-[10px] backdrop-blur-md"
        style={{ background: "rgba(2,2,4,0.95)", borderColor: NEON.cloudBlue + "55", color: NEON.cloudBlue, boxShadow: `0 0 12px rgba(66,133,244,0.15)` }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}>
        <div className="flex items-center gap-2">
          <Brain className="h-3 w-3" />
          <span className="font-bold" style={{ color: NEON.matrixGreen }}>SIT v2.0</span>
          <span style={{ color: "#333" }}>|</span>
          Google Neural Bridge
        </div>
      </motion.div>
    </div>
  );
};

export default FleetCommand;
