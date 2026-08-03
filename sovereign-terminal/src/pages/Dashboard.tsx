import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, MessageCircle, Settings, ArrowRight, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Agent = Tables<"agents">;

const typeEmoji: Record<string, string> = {
  przyjaciel: "💛", mentor: "🧠", asystent: "⚡", coach: "🔥", własny: "✨",
};

const langLabel: Record<string, string> = {
  pl: "🇵🇱 Polski", en: "🇬🇧 Angielski", de: "🇩🇪 Niemiecki", es: "🇪🇸 Hiszpański", fr: "🇫🇷 Francuski",
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationCounts, setConversationCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("agents").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) {
        setAgents(data);
        // Get conversation counts
        const counts: Record<string, number> = {};
        for (const agent of data) {
          const { count } = await supabase.from("conversations").select("*", { count: "exact", head: true }).eq("agent_id", agent.id);
          counts[agent.id] = count || 0;
        }
        setConversationCounts(counts);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const deleteAgent = async (agentId: string) => {
    const { error } = await supabase.from("agents").delete().eq("id", agentId);
    if (!error) {
      setAgents(prev => prev.filter(a => a.id !== agentId));
      toast({ title: "Agent usunięty" });
    }
  };

  if (loading) return <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-muted-foreground">Ładowanie...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Moi agenci</h1>
            <p className="mt-1 text-muted-foreground">Zarządzaj swoimi agentami AI</p>
          </div>
          <Link to="/create">
            <Button variant="hero" className="gap-2"><Plus className="h-4 w-4" /> Nowy agent</Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {agents.map((agent, i) => (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="group rounded-2xl border-2 border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-soft">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                      {typeEmoji[agent.type] || "✨"}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{agent.type} · {langLabel[agent.language] || agent.language}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteAgent(agent.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {conversationCounts[agent.id] || 0} rozmów
                  </div>
                  <Link to={`/chat/${agent.id}`}>
                    <Button variant="warm" size="sm" className="gap-2">Rozmawiaj <ArrowRight className="h-3.5 w-3.5" /></Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: agents.length * 0.1 }}>
            <Link to="/create" className="block">
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="mt-3 font-display font-semibold text-foreground">Stwórz nowego agenta</p>
                <p className="mt-1 text-sm text-muted-foreground">Wybierz typ i opisz go słowami</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
