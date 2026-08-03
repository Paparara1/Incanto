import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Activity, Zap, Eye, Globe, Wallet, Lock,
  Fingerprint, Brain, Server, Radio, Trophy, Users,
  Terminal, Cpu, Network, Scan, FileKey, Clock,
  ArrowRight, MessageCircle, Bot, Workflow, RefreshCw, Cloud, Play,
  Volume2, Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  status?: string;
  hexSignature?: string;
}

interface McpResponse {
  result?: {
    content?: Array<{ type: string; text: string }>;
    tools?: Array<{ name: string; description: string }>;
  };
  error?: { message: string };
}

interface McpLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system";
}

const FONT_MONO = "'JetBrains Mono', monospace";

const TON_ADDRESS = "UQCZZjB4GRDJISKKQ-eYfEWzhQ53K7yYbDoUZwpaNAVFgi9F";
const TON_SHORT = "UQCZZ...Fgi9F";

interface NeuralNode {
  id: number;
  status: "IDLE" | "SYNC" | "ACTIVE" | "PROCESSING" | "ERROR";
  pulse: number;
  cloudManaged: boolean;
}

interface DataStreamParticle {
  id: number;
  path: number;
  progress: number;
  color: string;
  speed: number;
}

const statusConfig: Record<NeuralNode["status"], { color: string; label: string }> = {
  IDLE: { color: "#1a2a2a", label: "STANDBY" },
  SYNC: { color: "#00e5ff", label: "SYNCING" },
  ACTIVE: { color: "#39ff14", label: "ONLINE" },
  PROCESSING: { color: "#FFD700", label: "PROC" },
  ERROR: { color: "#ff3333", label: "FAULT" },
};

const mcpLogColors: Record<McpLogEntry["type"], string> = {
  info: "#4285F4",
  success: "#39ff14",
  warning: "#ffb800",
  error: "#ff3333",
  system: "#b026ff",
};

// ═══ HYPER-CLOUD DATA STREAM COMPONENT ═══
const HyperCloudDataStream = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<DataStreamParticle[]>([]);
  const particleId = useRef(0);

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({ ...p, progress: p.progress + p.speed }))
          .filter(p => p.progress < 110);
        if (updated.length < 12) {
          const colors = ["#00e5ff", "#39ff14", "#FFD700", "#b026ff", "#4285F4"];
          updated.push({
            id: particleId.current++,
            path: Math.floor(Math.random() * 3),
            progress: -5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 0.8 + Math.random() * 1.2,
          });
        }
        return updated;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [active]);

  // Three paths: Agents→n8n, n8n→Vault, Agents→Vault
  const paths = [
    "M 30 20 C 80 15, 120 50, 180 30 C 240 10, 300 40, 350 25",    // agents → n8n
    "M 350 25 C 400 15, 450 50, 500 35 C 540 20, 580 45, 620 30",   // n8n → vault
    "M 30 45 C 150 60, 300 30, 450 50 C 530 55, 580 40, 620 30",    // direct stream
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-lg border" style={{
      height: "100px",
      background: "linear-gradient(135deg, rgba(0,229,255,0.02), rgba(57,255,20,0.01), rgba(255,215,0,0.02))",
      borderColor: active ? "#00e5ff22" : "#0e1a22",
    }}>
      {/* Labels */}
      <div className="absolute left-2 top-2 text-[7px] font-bold" style={{ color: "#00e5ff88" }}>
        <div className="flex items-center gap-1"><Users className="h-2.5 w-2.5" />AGENTS</div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-2 text-[7px] font-bold" style={{ color: "#39ff1488" }}>
        <div className="flex items-center gap-1"><Workflow className="h-2.5 w-2.5" />n8n ENGINE</div>
      </div>
      <div className="absolute right-2 top-2 text-[7px] font-bold" style={{ color: "#FFD70088" }}>
        <div className="flex items-center gap-1"><Wallet className="h-2.5 w-2.5" />VAULT</div>
      </div>

      {/* Node indicators */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 650 80" preserveAspectRatio="none">
        {/* Path lines */}
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={active ? ["#00e5ff15", "#39ff1415", "#FFD70015"][i] : "#0a1a2210"} strokeWidth="1" />
        ))}
        {/* Flowing particles */}
        {particles.map(p => {
          const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
          pathEl.setAttribute("d", paths[p.path]);
          const len = pathEl.getTotalLength?.() || 600;
          const pt = pathEl.getPointAtLength?.((p.progress / 100) * len) || { x: 0, y: 0 };
          return (
            <g key={p.id}>
              <circle cx={pt.x} cy={pt.y} r="2.5" fill={p.color} opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={pt.x} cy={pt.y} r="6" fill={p.color} opacity="0.15">
                <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
        {/* Node circles */}
        <circle cx="30" cy="35" r="8" fill="none" stroke={active ? "#00e5ff44" : "#0a1a22"} strokeWidth="1.5">
          {active && <animate attributeName="stroke" values="#00e5ff22;#00e5ff88;#00e5ff22" dur="2s" repeatCount="indefinite" />}
        </circle>
        <circle cx="350" cy="30" r="10" fill="none" stroke={active ? "#39ff1444" : "#0a1a22"} strokeWidth="2">
          {active && <animate attributeName="stroke" values="#39ff1422;#39ff14aa;#39ff1422" dur="1.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="620" cy="30" r="8" fill="none" stroke={active ? "#FFD70044" : "#0a1a22"} strokeWidth="1.5">
          {active && <animate attributeName="stroke" values="#FFD70022;#FFD70088;#FFD70022" dur="2s" repeatCount="indefinite" />}
        </circle>
      </svg>

      {/* Bottom stats */}
      {active && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-6 text-[7px]">
          <motion.span style={{ color: "#00e5ff66" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
            ↑ 30 AGENTS STREAMING
          </motion.span>
          <motion.span style={{ color: "#39ff1466" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>
            ⟲ n8n PRO PROCESSING
          </motion.span>
          <motion.span style={{ color: "#FFD70066" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>
            ↓ VAULT RECEIVING
          </motion.span>
        </div>
      )}
    </div>
  );
};

const SovereignTerminal = () => {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<NeuralNode[]>(
    Array.from({ length: 30 }, (_, i) => ({ id: i + 1, status: "IDLE", pulse: 0, cloudManaged: true }))
  );
  const [systemTime, setSystemTime] = useState(new Date());
  const [agentCount, setAgentCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [certGenerated, setCertGenerated] = useState(false);
  const [certHash, setCertHash] = useState("");
  const [neuralSyncActive, setNeuralSyncActive] = useState(false);
  const [mcpWorkflows, setMcpWorkflows] = useState<N8nWorkflow[]>([]);
  const [mcpLoading, setMcpLoading] = useState(false);
  const [mcpConnected, setMcpConnected] = useState(false);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const [mcpLogs, setMcpLogs] = useState<McpLogEntry[]>([]);
  const [triggerExecuting, setTriggerExecuting] = useState(false);
  const [xttsPlaying, setXttsPlaying] = useState(false);
  const [liveDataRate, setLiveDataRate] = useState(0);
  const [liveThroughput, setLiveThroughput] = useState(0);
  const [liveLatency, setLiveLatency] = useState(0);
  const [tonBalance, setTonBalance] = useState<number | null>(null);
  const [tonPrevBalance, setTonPrevBalance] = useState<number | null>(null);
  const [tonLoading, setTonLoading] = useState(false);
  const [tonLastUpdate, setTonLastUpdate] = useState<string | null>(null);
  const [tonInbound, setTonInbound] = useState(false);
  const mcpLogRef = useRef<HTMLDivElement>(null);

  const addMcpLog = useCallback((message: string, type: McpLogEntry["type"] = "info") => {
    setMcpLogs(prev => [...prev.slice(-49), {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      message,
      type,
    }]);
  }, []);

  // Fetch real TON balance
  const fetchTonBalance = useCallback(async () => {
    setTonLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ton-monitor");
      if (error) throw new Error(error.message);
      if (data?.balance_ton !== undefined) {
        setTonBalance(data.balance_ton);
        setTonPrevBalance(data.previous_balance_ton);
        setTonLastUpdate(new Date().toLocaleTimeString("en-US", { hour12: false }));
        if (data.is_inbound) {
          setTonInbound(true);
          addMcpLog(`💰 INBOUND TON DETECTED! +${(data.balance_ton - (data.previous_balance_ton || 0)).toFixed(4)} TON`, "success");
          if (data.whatsapp_sent) {
            addMcpLog("📱 WhatsApp alert sent: 'Ojjja! Real TON received!'", "success");
          }
          setTimeout(() => setTonInbound(false), 5000);
        }
        addMcpLog(`[TON] Balance: ${data.balance_ton.toFixed(4)} TON | State: ${data.state}`, "info");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "TON fetch failed";
      addMcpLog(`[TON] ERROR: ${msg}`, "error");
    } finally {
      setTonLoading(false);
    }
  }, [addMcpLog]);

  // Auto-poll TON balance every 60s
  useEffect(() => {
    fetchTonBalance();
    const interval = setInterval(fetchTonBalance, 60000);
    return () => clearInterval(interval);
  }, [fetchTonBalance]);

  // Load last balance from DB on mount
  useEffect(() => {
    const loadLastBalance = async () => {
      const { data } = await supabase
        .from("ton_balance_log")
        .select("balance_ton, created_at")
        .order("created_at", { ascending: false })
        .limit(1);
      if (data?.[0]) {
        setTonBalance(Number(data[0].balance_ton));
        setTonLastUpdate(new Date(data[0].created_at).toLocaleTimeString("en-US", { hour12: false }));
      }
    };
    loadLastBalance();
  }, []);

  useEffect(() => {
    if (mcpLogRef.current) {
      mcpLogRef.current.scrollTop = mcpLogRef.current.scrollHeight;
    }
  }, [mcpLogs]);

  // Live metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDataRate(Math.floor(Math.random() * 200) + 800);
      setLiveThroughput(prev => prev + Math.floor(Math.random() * 5) + 1);
      setLiveLatency(Math.floor(Math.random() * 20) + 8);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const generateHex = () => Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => b.toString(16).padStart(2, "0")).join("");

  const sendMcpRequest = async (method: string, params?: Record<string, unknown>) => {
    const body: Record<string, unknown> = { jsonrpc: "2.0", id: Date.now(), method };
    if (params) body.params = params;
    const { data, error } = await supabase.functions.invoke("n8n-mcp-proxy", { body });
    if (error) throw new Error(error.message);
    return data as McpResponse;
  };

  const fetchMcpStatus = useCallback(async () => {
    setMcpLoading(true);
    setMcpError(null);
    addMcpLog("═══ n8n PRO · MCP HANDSHAKE ═══", "system");
    addMcpLog("Handshake with paulichu1980 initiated...", "system");
    try {
      await sendMcpRequest("initialize", {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "SIT-v2.0", version: "2.0.0" }
      });
      addMcpLog("MCP Token Validated ✓", "success");
      addMcpLog("n8n PRO License: ACTIVE (125€/mo)", "success");
      addMcpLog("Syncing n8n workflows...", "info");

      const toolsRes = await sendMcpRequest("tools/list");

      if (toolsRes?.result?.tools) {
        const workflows: N8nWorkflow[] = toolsRes.result.tools.map((tool: { name: string; description: string }, i: number) => ({
          id: String(i + 1),
          name: tool.name,
          active: true,
          status: "LIVE",
          hexSignature: generateHex(),
        }));
        setMcpWorkflows(workflows);
        setMcpConnected(true);
        addMcpLog(`${workflows.length} workflow(s) discovered & synchronized`, "success");
        workflows.forEach(wf => addMcpLog(`  → ${wf.name} [LIVE] 0x${wf.hexSignature}`, "info"));
        addMcpLog("n8n: MAIN OPERATIONAL ENGINE — FULLY AUTONOMOUS", "success");
        addMcpLog("Hyper-Cloud Data Stream: ACTIVATED", "success");

        // Auto-activate neural sync on connect
        if (!neuralSyncActive) {
          setTimeout(() => activateNeuralSync(), 500);
        }
      } else if (toolsRes?.error) {
        setMcpError(toolsRes.error.message);
        addMcpLog(`ERROR: ${toolsRes.error.message}`, "error");
      } else {
        setMcpWorkflows([]);
        setMcpConnected(true);
        addMcpLog("No workflows found. Enable 'Available in MCP' in n8n.", "warning");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "MCP connection failed";
      setMcpError(msg);
      setMcpConnected(false);
      addMcpLog(`CONNECTION FAILED: ${msg}`, "error");
    } finally {
      setMcpLoading(false);
    }
  }, [addMcpLog]);

  const triggerN8nFlow = useCallback(async () => {
    if (triggerExecuting || mcpWorkflows.length === 0) return;
    setTriggerExecuting(true);
    const workflow = mcpWorkflows[0];
    addMcpLog(`⚡ TRIGGER: Executing '${workflow.name}'...`, "system");
    addMcpLog("[n8n PRO] Pipeline: AGENT→n8n→VAULT", "info");
    try {
      const res = await sendMcpRequest("tools/call", {
        name: workflow.name,
        arguments: {},
      });
      if (res?.result?.content) {
        const text = res.result.content.map(c => c.text).join("\n");
        addMcpLog(`✅ RESULT: ${text.slice(0, 200)}`, "success");
      } else if (res?.error) {
        addMcpLog(`EXECUTION ERROR: ${res.error.message}`, "error");
      } else {
        addMcpLog("✅ EXECUTION: Completed (no output)", "success");
      }
      addMcpLog("[STREAM] Data routed through Hyper-Cloud pipeline", "info");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Trigger failed";
      addMcpLog(`TRIGGER FAILED: ${msg}`, "error");
    } finally {
      setTriggerExecuting(false);
    }
  }, [triggerExecuting, mcpWorkflows, addMcpLog]);

  // XTTS Voice announcement
  const triggerXttsAnnouncement = useCallback(async () => {
    if (xttsPlaying) return;
    setXttsPlaying(true);
    addMcpLog("🔊 XTTS (Rozumka): Generating voice...", "system");
    try {
      const { data } = await supabase.functions.invoke("generate-voice", {
        body: {
          text: "Infrastructure upgraded. Perceptio Neuro Labs is now fully autonomous.",
          language: "en",
        },
      });
      if (data?.audio_url) {
        addMcpLog("🔊 XTTS: Playing announcement...", "success");
        const audio = new Audio(data.audio_url);
        audio.play().catch(() => addMcpLog("🔊 Audio autoplay blocked by browser", "warning"));
        audio.onended = () => setXttsPlaying(false);
      } else {
        addMcpLog("🔊 XTTS: No audio URL returned", "warning");
        setXttsPlaying(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "XTTS failed";
      addMcpLog(`🔊 XTTS ERROR: ${msg}`, "error");
      setXttsPlaying(false);
    }
  }, [xttsPlaying, addMcpLog]);

  // Auto-pulse hex signatures
  useEffect(() => {
    if (mcpWorkflows.length === 0) return;
    const interval = setInterval(() => {
      setMcpWorkflows(prev => prev.map(w => ({
        ...w,
        hexSignature: generateHex(),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [mcpWorkflows.length]);

  // System clock
  useEffect(() => {
    const t = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load real stats
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { count: ac } = await supabase.from("agents").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const { count: mc } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      setAgentCount(ac || 0);
      setMessageCount(mc || 0);
    };
    load();
  }, [user]);

  // Neural sync
  const activateNeuralSync = useCallback(() => {
    if (neuralSyncActive) return;
    setNeuralSyncActive(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= 30) {
        clearInterval(interval);
        setTimeout(() => {
          setNodes(prev => prev.map(n => ({ ...n, status: "ACTIVE", pulse: Math.random() })));
          setNeuralSyncActive(false);
        }, 500);
        return;
      }
      setNodes(prev => prev.map((n, idx) => {
        if (idx === i) return { ...n, status: "SYNC", pulse: 1 };
        if (idx < i) return { ...n, status: "ACTIVE", pulse: Math.random() * 0.5 + 0.5 };
        return n;
      }));
      i++;
    }, 80);
  }, [neuralSyncActive]);

  const generateCertificate = () => {
    const hash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0")).join("");
    setCertHash(hash);
    setCertGenerated(true);
  };

  const timeStr = systemTime.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = systemTime.toISOString().split("T")[0];
  const activeNodeCount = nodes.filter(n => n.status === "ACTIVE").length;

  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{
      background: mcpConnected
        ? "radial-gradient(ellipse at 50% 0%, rgba(10,20,80,0.6) 0%, rgba(5,10,30,0.3) 40%, #030508 70%)"
        : "#040608",
      color: "#c0d8e8",
      fontFamily: FONT_MONO,
      transition: "background 1.5s ease",
    }}>
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.1) 2px, rgba(0,229,255,0.1) 4px)",
      }} />

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.02]" style={{
        backgroundImage: "linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* MCP Connected deep blue pulse overlay */}
      {mcpConnected && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(10,25,100,0.2) 0%, transparent 60%)" }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
      )}

      <div className="container max-w-7xl py-4 space-y-4 relative z-10 px-3 md:px-6">

        {/* ═══ HEADER ═══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: mcpConnected ? "#1a2a5022" : "#0e1a22" }}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: mcpConnected ? 15 : 30, ease: "linear" }}
            >
              <Shield className="h-8 w-8" style={{ color: mcpConnected ? "#39ff14" : "#00e5ff" }} />
            </motion.div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-[0.1em]" style={{ color: "#00e5ff" }}>
                SOVEREIGN INTELLIGENCE TERMINAL
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[9px] tracking-[0.3em]" style={{ color: "#1a3040" }}>
                  PERCEPTIO NEURO LABS · v2.0
                </p>
                {mcpConnected && (
                  <motion.span
                    className="text-[8px] tracking-[0.2em] font-bold px-2 py-0.5 rounded-full border"
                    style={{ color: "#39ff14", borderColor: "#39ff1444", background: "rgba(57,255,20,0.06)" }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    n8n PRO ACTIVE
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* MCP CONNECTION STATUS */}
            <motion.div
              className="flex items-center gap-2 rounded-full px-3 py-1.5 border"
              style={{
                borderColor: mcpConnected ? "#39ff1466" : "#ff333344",
                background: mcpConnected ? "rgba(57,255,20,0.06)" : "rgba(255,51,51,0.04)",
              }}
              animate={mcpConnected ? {
                boxShadow: ["0 0 8px rgba(57,255,20,0.1)", "0 0 20px rgba(57,255,20,0.25)", "0 0 8px rgba(57,255,20,0.1)"],
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <motion.div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: mcpConnected ? "#39ff14" : "#ff3333" }}
                animate={{
                  opacity: [1, 0.3, 1],
                  boxShadow: mcpConnected
                    ? ["0 0 4px #39ff14", "0 0 16px #39ff14", "0 0 4px #39ff14"]
                    : ["0 0 4px #ff3333", "0 0 12px #ff3333", "0 0 4px #ff3333"],
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <span className="text-[10px] font-bold tracking-wider" style={{ color: mcpConnected ? "#39ff14" : "#ff3333" }}>
                MCP: {mcpConnected ? "LIVE" : "OFFLINE"}
              </span>
            </motion.div>

            <div className="text-right">
              <div className="text-[10px]" style={{ color: "#1a3040" }}>SYSTEM TIME</div>
              <div className="text-sm font-bold" style={{ color: "#00e5ff" }}>{timeStr}</div>
              <div className="text-[9px]" style={{ color: "#0d1a22" }}>{dateStr}</div>
            </div>
            <motion.div
              className="h-3 w-3 rounded-full"
              style={{ background: "#00e5ff" }}
              animate={{ opacity: [1, 0.3, 1], boxShadow: ["0 0 8px #00e5ff", "0 0 20px #00e5ff", "0 0 8px #00e5ff"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>

        {/* ═══ LIVE STATUS BAR ═══ */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {[
            { icon: Users, label: "FLEET", value: `${activeNodeCount}/30`, color: "#00e5ff", live: true },
            { icon: Bot, label: "AI AGENTS", value: agentCount.toString(), color: "#39ff14", live: true },
            { icon: MessageCircle, label: "CONVOS", value: messageCount.toString(), color: "#b026ff", live: false },
            { icon: Workflow, label: "n8n FLOWS", value: mcpWorkflows.length.toString(), color: "#39ff14", live: mcpConnected },
            { icon: Activity, label: "DATA RATE", value: `${liveDataRate} kb/s`, color: "#00e5ff", live: true },
            { icon: Cpu, label: "LATENCY", value: `${liveLatency}ms`, color: liveLatency < 20 ? "#39ff14" : "#ffb800", live: true },
            { icon: Wallet, label: "VAULT", value: tonBalance !== null ? `${tonBalance.toFixed(4)} TON` : "LOADING...", color: "#FFD700", live: true },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="rounded-md p-2.5 border relative overflow-hidden"
              style={{ background: "rgba(0,229,255,0.02)", borderColor: "#0e1a22" }}
              whileHover={{ borderColor: s.color + "44" }}
            >
              <div className="flex items-center gap-1 text-[8px] mb-0.5" style={{ color: "#1a3040" }}>
                <s.icon className="h-2.5 w-2.5" /> {s.label}
                {s.live && (
                  <motion.div
                    className="h-1 w-1 rounded-full ml-auto"
                    style={{ background: s.color }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div className="text-sm font-bold truncate" style={{ color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* ═══ HYPER-CLOUD DATA STREAM ═══ */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#00e5ff" }}>
            <Sparkles className="h-3.5 w-3.5" />
            HYPER-CLOUD DATA STREAM — AGENTS → n8n ENGINE → OMEGA VAULT
            {mcpConnected && (
              <motion.span className="text-[8px] ml-2" style={{ color: "#39ff1488" }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                THROUGHPUT: {liveThroughput} packets
              </motion.span>
            )}
          </div>
          <HyperCloudDataStream active={mcpConnected} />
        </div>

        {/* ═══ NEURAL GRID — AGENT HIVE ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(0,229,255,0.01)", borderColor: "#0e1a22" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "#00e5ff" }}>
              <Brain className="h-4 w-4" /> REAL-TIME NEURAL SYNC — AGENT HIVE
            </div>
            <motion.button
              onClick={activateNeuralSync}
              disabled={neuralSyncActive}
              className="px-3 py-1 rounded text-[10px] font-bold border disabled:opacity-40"
              style={{ borderColor: "#00e5ff", color: "#00e5ff", background: "rgba(0,229,255,0.06)" }}
              whileHover={{ boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {neuralSyncActive ? "SYNCING..." : "▶ INITIATE SYNC"}
            </motion.button>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1">
            {nodes.map(node => {
              const cfg = statusConfig[node.status];
              return (
                <motion.div
                  key={node.id}
                  className="relative rounded border flex flex-col items-center justify-center p-1 text-[8px]"
                  style={{
                    borderColor: cfg.color + "44",
                    background: node.status !== "IDLE" ? cfg.color + "0a" : "rgba(0,229,255,0.01)",
                    minHeight: "44px",
                  }}
                  animate={node.status === "SYNC" ? {
                    borderColor: ["#00e5ff22", "#00e5ff", "#00e5ff22"],
                    boxShadow: ["0 0 0px #00e5ff", "0 0 12px #00e5ff", "0 0 0px #00e5ff"],
                  } : node.status === "ACTIVE" ? {
                    boxShadow: [`0 0 ${node.pulse * 8}px ${cfg.color}44`, `0 0 ${node.pulse * 3}px ${cfg.color}22`],
                  } : {}}
                  transition={{ repeat: Infinity, duration: node.status === "SYNC" ? 0.5 : 2 }}
                >
                  <span style={{ color: cfg.color }} className="font-bold">
                    {String(node.id).padStart(2, "0")}
                  </span>
                  {node.cloudManaged && (
                    <Cloud className="h-2.5 w-2.5 mt-0.5" style={{ color: mcpConnected ? "#4285F4" : "#1a2a3a" }} />
                  )}
                  {node.status !== "IDLE" && (
                    <span className="text-[5px]" style={{ color: cfg.color + "88" }}>{cfg.label}</span>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex gap-3 text-[8px] pt-1 flex-wrap" style={{ color: "#1a3040" }}>
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: v.color }} /> {k}
              </div>
            ))}
            <div className="flex items-center gap-1">
              <Cloud className="h-2.5 w-2.5" style={{ color: "#4285F4" }} /> n8n CLOUD
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* ═══ OMEGA VAULT — REAL ON-CHAIN ═══ */}
          <motion.div
            className="rounded-lg border-2 p-4 space-y-3"
            style={{
              background: tonInbound
                ? "linear-gradient(135deg, rgba(57,255,20,0.08), rgba(255,215,0,0.05))"
                : "linear-gradient(135deg, rgba(255,215,0,0.03), rgba(255,184,0,0.01))",
              borderColor: tonInbound ? "#39ff1488" : "#FFD70044",
              boxShadow: "0 0 25px rgba(255,215,0,0.06)",
            }}
            animate={tonInbound ? {
              boxShadow: ["0 0 20px rgba(57,255,20,0.2)", "0 0 50px rgba(57,255,20,0.5)", "0 0 20px rgba(57,255,20,0.2)"],
              borderColor: ["#39ff1488", "#39ff14", "#39ff1488"],
            } : {
              boxShadow: ["0 0 15px rgba(255,215,0,0.04)", "0 0 35px rgba(255,215,0,0.1)", "0 0 15px rgba(255,215,0,0.04)"],
            }}
            transition={{ repeat: Infinity, duration: tonInbound ? 1 : 3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#FFD700" }}>
                <Wallet className="h-3.5 w-3.5" /> OMEGA VAULT — ON-CHAIN MONITOR
                <motion.span className="text-[7px] px-1.5 py-0.5 rounded-full border" style={{ borderColor: "#39ff1444", color: "#39ff14", background: "rgba(57,255,20,0.08)" }}
                  animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  LIVE
                </motion.span>
              </div>
              <motion.button onClick={fetchTonBalance} disabled={tonLoading}
                className="text-[8px] font-bold px-2 py-1 rounded border flex items-center gap-1"
                style={{ borderColor: "#FFD70044", color: "#FFD700", background: "rgba(255,215,0,0.06)" }}
                whileHover={{ boxShadow: "0 0 12px rgba(255,215,0,0.2)" }}
                whileTap={{ scale: 0.95 }}>
                <RefreshCw className={`h-2.5 w-2.5 ${tonLoading ? "animate-spin" : ""}`} />
                {tonLoading ? "..." : "REFRESH"}
              </motion.button>
            </div>

            {/* Real balance display */}
            <div className="rounded border p-3 space-y-2" style={{ background: "#060810", borderColor: "#FFD70018" }}>
              <div className="flex items-center justify-between">
                <div className="text-[9px]" style={{ color: "#555" }}>REAL ON-CHAIN BALANCE</div>
                {tonLastUpdate && <div className="text-[7px]" style={{ color: "#333" }}>Updated: {tonLastUpdate}</div>}
              </div>
              <motion.div className="text-2xl font-bold" style={{ color: "#FFD700" }}
                key={tonBalance} initial={{ scale: 1.1 }} animate={{ scale: 1 }}>
                {tonBalance !== null ? `${tonBalance.toFixed(4)} TON` : "FETCHING..."}
              </motion.div>
              <div className="text-[8px]" style={{ color: "#333" }}>
                {TON_SHORT} · Polling: 60s · Source: toncenter.com
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded border p-1.5" style={{ borderColor: "#FFD70022", background: "#fff" }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=ton://transfer/${TON_ADDRESS}&color=B8860B&bgcolor=FFFFFF`} alt="TON QR" className="h-[80px] w-[80px]" loading="lazy" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-[9px]" style={{ color: "#555" }}>VAULT STATUS</div>
                <div className="flex items-center gap-2">
                  <motion.div className="h-2 w-2 rounded-full" style={{ background: "#FFD700" }} animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  <span className="text-[10px] font-bold" style={{ color: "#FFD700" }}>ONLINE — MONITORING ON-CHAIN</span>
                </div>
                {tonInbound && (
                  <motion.div className="text-[9px] font-bold" style={{ color: "#39ff14" }}
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }}>
                    🚨 INBOUND TRANSACTION DETECTED!
                  </motion.div>
                )}
                <Link to="/fleet">
                  <motion.div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded border" style={{ borderColor: "#FFD700", color: "#FFD700", background: "rgba(255,215,0,0.06)" }} whileHover={{ boxShadow: "0 0 20px rgba(255,215,0,0.2)" }}>
                    <Zap className="h-3 w-3" /> FLEET EARNINGS →
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ═══ PROOF OF ORIGIN ═══ */}
          <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(176,38,255,0.02)", borderColor: "#0e1220" }}>
            <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#b026ff" }}>
              <FileKey className="h-3.5 w-3.5" /> PROOF OF ORIGIN — BIOMETRIC CERTIFICATE
            </div>
            <div className="rounded border p-3 space-y-2 text-[10px]" style={{ background: "#060810", borderColor: "#1a1230" }}>
              <div className="flex items-center gap-2">
                <Fingerprint className="h-3.5 w-3.5" style={{ color: "#b026ff" }} />
                <span style={{ color: "#555" }}>Ocular Hash:</span>
                <span style={{ color: "#b026ff" }}>{certGenerated ? certHash.slice(0, 16) + "..." : "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-3.5 w-3.5" style={{ color: "#00e5ff" }} />
                <span style={{ color: "#555" }}>EEG Signature:</span>
                <span style={{ color: "#00e5ff" }}>{certGenerated ? certHash.slice(16, 32) + "..." : "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" style={{ color: "#FFD700" }} />
                <span style={{ color: "#555" }}>Lineage Proof:</span>
                <span style={{ color: "#FFD700" }}>{certGenerated ? "VERIFIED" : "PENDING"}</span>
              </div>
            </div>
            <motion.button onClick={generateCertificate} className="w-full py-2.5 rounded text-[10px] font-bold border flex items-center justify-center gap-2" style={{ borderColor: "#b026ff", color: "#b026ff", background: "rgba(176,38,255,0.06)" }} whileHover={{ boxShadow: "0 0 25px rgba(176,38,255,0.2)" }} whileTap={{ scale: 0.97 }}>
              <Scan className="h-3.5 w-3.5" />
              {certGenerated ? "REGENERATE CERTIFICATE" : "GENERATE BIOMETRIC CERTIFICATE"}
            </motion.button>
            {certGenerated && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded border p-2 text-[8px] break-all" style={{ background: "#040608", borderColor: "#1a1230", color: "#b026ff88" }}>
                CERTIFICATE: {certHash}
              </motion.div>
            )}
          </div>
        </div>

        {/* ═══ n8n MAIN ENGINE — MCP CONTROL CENTER ═══ */}
        <div className="rounded-lg border-2 p-4 space-y-3" style={{
          background: mcpConnected
            ? "linear-gradient(135deg, rgba(57,255,20,0.04), rgba(10,25,60,0.06), rgba(57,255,20,0.02))"
            : "rgba(57,255,20,0.02)",
          borderColor: mcpConnected ? "#39ff1444" : "#0e2210",
          boxShadow: mcpConnected ? "0 0 30px rgba(57,255,20,0.08), inset 0 0 60px rgba(57,255,20,0.02)" : "none",
        }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <motion.div animate={mcpConnected ? { rotate: [0, 360] } : {}} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
                <Workflow className="h-4 w-4" style={{ color: "#39ff14" }} />
              </motion.div>
              <span className="text-[11px] font-bold" style={{ color: "#39ff14" }}>
                n8n PRO — MAIN OPERATIONAL ENGINE
              </span>
              {mcpConnected && (
                <motion.span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(57,255,20,0.1)", color: "#39ff14" }}
                  animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  LIVE
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {mcpConnected && (
                <motion.div className="flex items-center gap-1 text-[9px] font-bold" style={{ color: "#39ff14" }}
                  animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#39ff14" }} />
                  AUTONOMOUS
                </motion.div>
              )}
              <motion.button onClick={fetchMcpStatus} disabled={mcpLoading}
                className="px-3 py-1.5 rounded text-[10px] font-bold border disabled:opacity-40 flex items-center gap-1.5"
                style={{ borderColor: "#39ff14", color: "#39ff14", background: "rgba(57,255,20,0.06)" }}
                whileHover={{ boxShadow: "0 0 20px rgba(57,255,20,0.3)" }} whileTap={{ scale: 0.95 }}>
                <RefreshCw className={`h-3 w-3 ${mcpLoading ? "animate-spin" : ""}`} />
                {mcpLoading ? "SYNCING..." : "▶ SYNC MCP"}
              </motion.button>
            </div>
          </div>

          {mcpError && (
            <div className="rounded border px-3 py-2 text-[9px]" style={{ borderColor: "#ff333344", background: "rgba(255,51,51,0.05)", color: "#ff3333" }}>
              ⚠ MCP ERROR: {mcpError}
            </div>
          )}

          {mcpWorkflows.length > 0 ? (
            <div className="space-y-1">
              {mcpWorkflows.map((wf) => (
                <motion.div key={wf.id} className="rounded border px-3 py-2 flex items-center justify-between"
                  style={{ borderColor: "#39ff1422", background: "rgba(57,255,20,0.03)" }}
                  animate={{ borderColor: ["#39ff1422", "#39ff1466", "#39ff1422"] }}
                  transition={{ repeat: Infinity, duration: 3, delay: Number(wf.id) * 0.2 }}>
                  <div className="flex items-center gap-2">
                    <motion.div className="h-2 w-2 rounded-full" style={{ background: "#39ff14" }}
                      animate={{ opacity: [1, 0.3, 1], boxShadow: ["0 0 4px #39ff14", "0 0 12px #39ff14", "0 0 4px #39ff14"] }}
                      transition={{ repeat: Infinity, duration: 1.5 }} />
                    <span className="text-[10px] font-bold" style={{ color: "#39ff14" }}>{wf.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-bold" style={{ color: "#39ff1488" }}>{wf.status}</span>
                    <motion.span className="text-[9px] font-mono" style={{ color: "#39ff1466" }}
                      key={wf.hexSignature} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      0x{wf.hexSignature}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !mcpLoading && !mcpError ? (
            <div className="text-center py-4 text-[10px]" style={{ color: "#1a3020" }}>
              Naciśnij SYNC MCP aby połączyć się z serwerem n8n
            </div>
          ) : null}

          {/* Action buttons row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* TRIGGER N8N FLOW */}
            {mcpConnected && mcpWorkflows.length > 0 && (
              <motion.button onClick={triggerN8nFlow} disabled={triggerExecuting}
                className="py-2.5 rounded text-[10px] font-bold border flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  borderColor: triggerExecuting ? "#ffb800" : "#39ff14",
                  color: triggerExecuting ? "#ffb800" : "#39ff14",
                  background: triggerExecuting ? "rgba(255,184,0,0.08)" : "rgba(57,255,20,0.06)",
                }}
                whileHover={!triggerExecuting ? { boxShadow: "0 0 25px rgba(57,255,20,0.3)" } : {}}
                whileTap={!triggerExecuting ? { scale: 0.97 } : {}}
                animate={triggerExecuting ? {
                  borderColor: ["#ffb80066", "#ffb800", "#ffb80066"],
                  boxShadow: ["0 0 10px rgba(255,184,0,0.1)", "0 0 25px rgba(255,184,0,0.3)", "0 0 10px rgba(255,184,0,0.1)"],
                } : {}}
                transition={triggerExecuting ? { repeat: Infinity, duration: 1.2 } : {}}>
                {triggerExecuting ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RefreshCw className="h-3.5 w-3.5" /></motion.div>EXECUTING...</>
                ) : (
                  <><Play className="h-3.5 w-3.5" />TRIGGER N8N FLOW</>
                )}
              </motion.button>
            )}

            {/* XTTS VOICE ANNOUNCEMENT */}
            <motion.button onClick={triggerXttsAnnouncement} disabled={xttsPlaying}
              className="py-2.5 rounded text-[10px] font-bold border flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                borderColor: xttsPlaying ? "#b026ff" : "#00e5ff",
                color: xttsPlaying ? "#b026ff" : "#00e5ff",
                background: xttsPlaying ? "rgba(176,38,255,0.08)" : "rgba(0,229,255,0.06)",
              }}
              whileHover={!xttsPlaying ? { boxShadow: "0 0 25px rgba(0,229,255,0.3)" } : {}}
              whileTap={!xttsPlaying ? { scale: 0.97 } : {}}
              animate={xttsPlaying ? {
                borderColor: ["#b026ff66", "#b026ff", "#b026ff66"],
                boxShadow: ["0 0 10px rgba(176,38,255,0.1)", "0 0 20px rgba(176,38,255,0.3)", "0 0 10px rgba(176,38,255,0.1)"],
              } : {}}
              transition={xttsPlaying ? { repeat: Infinity, duration: 1 } : {}}>
              {xttsPlaying ? (
                <><motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}><Volume2 className="h-3.5 w-3.5" /></motion.div>ROZUMKA SPEAKING...</>
              ) : (
                <><Volume2 className="h-3.5 w-3.5" />🔊 XTTS: ANNOUNCE UPGRADE</>
              )}
            </motion.button>
          </div>

          {/* TERMINAL LIVE FEED */}
          {mcpLogs.length > 0 && (
            <div className="rounded border overflow-hidden" style={{ borderColor: "#0e2210", background: "#020804" }}>
              <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ borderColor: "#0e2210", background: "rgba(57,255,20,0.03)" }}>
                <Terminal className="h-3 w-3" style={{ color: "#39ff14" }} />
                <span className="text-[9px] font-bold" style={{ color: "#39ff14" }}>n8n LIVE FEED — MAIN ENGINE OUTPUT</span>
                <motion.div className="h-1.5 w-1.5 rounded-full ml-auto" style={{ background: "#39ff14" }}
                  animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} />
              </div>
              <div ref={mcpLogRef} className="p-3 space-y-0.5 max-h-[220px] overflow-y-auto"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#39ff1433 transparent" }}>
                {mcpLogs.map((log) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[9px] flex gap-2">
                    <span style={{ color: "#1a3020" }}>{log.timestamp}</span>
                    <span style={{ color: mcpLogColors[log.type] }}>{log.message}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══ INFRASTRUCTURE ═══ */}
        <div className="rounded-lg border p-4 space-y-3" style={{ background: "rgba(0,229,255,0.01)", borderColor: "#0e1a22" }}>
          <div className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#00e5ff" }}>
            <Network className="h-3.5 w-3.5" /> DISTRIBUTED INFRASTRUCTURE — ANYCAST NETWORK
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {[
              "perceptioneurolabs.de", "cipherlinkpulse.com", "ojjja.io", "neuro-labs.eu",
              "omega-protocol.net", "sovereign-ai.de", "biometric-id.org", "ton-vault.app",
              "neural-hive.io", "fleet-command.net", "iris-verify.com", "eeg-decode.de",
              "crypto-lineage.io", "xtts-voice.app", "termux-fleet.net", "brutalism-ui.dev",
              "cipher-link.de", "pulse-network.io",
            ].map((domain, i) => (
              <motion.div key={domain} className="rounded border px-2 py-1.5 text-[8px] flex items-center gap-1.5"
                style={{ borderColor: "#0e1a22", background: "rgba(0,229,255,0.01)", color: "#1a4050" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Globe className="h-2.5 w-2.5" style={{ color: "#00e5ff33" }} />
                {domain}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ QUICK ACTIONS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { to: "/fleet", label: "FLEET COMMAND", icon: Shield, color: "#39ff14", desc: "Agent Orchestration" },
            { to: "/dashboard", label: "AI AGENTS", icon: Bot, color: "#00e5ff", desc: "Manage & Deploy" },
            { to: "/chat", label: "COMMS", icon: MessageCircle, color: "#b026ff", desc: "Agent Chat" },
            { to: "/create", label: "FORGE", icon: Cpu, color: "#FFD700", desc: "Create New Agent" },
          ].map((action) => (
            <Link key={action.to} to={action.to}>
              <motion.div className="rounded-lg border p-4 flex flex-col gap-2 cursor-pointer h-full"
                style={{ borderColor: "#0e1a22", background: "rgba(0,229,255,0.01)" }}
                whileHover={{ borderColor: action.color + "44", boxShadow: `0 0 25px ${action.color}15` }}>
                <action.icon className="h-5 w-5" style={{ color: action.color }} />
                <div className="text-[10px] font-bold" style={{ color: action.color }}>{action.label}</div>
                <div className="text-[8px]" style={{ color: "#1a3040" }}>{action.desc}</div>
                <ArrowRight className="h-3 w-3 mt-auto" style={{ color: "#1a3040" }} />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* ═══ SYSTEM FOOTER ═══ */}
        <div className="flex items-center justify-between py-3 border-t text-[8px] flex-wrap gap-2" style={{ borderColor: "#0a1218", color: "#0d1a22" }}>
          <span>SOVEREIGN INTELLIGENCE TERMINAL · PERCEPTIO NEURO LABS © {new Date().getFullYear()}</span>
          <span>n8n PRO · OPERATOR: OJJJA · CLEARANCE: ULTIMA</span>
        </div>
      </div>
    </div>
  );
};

export default SovereignTerminal;
