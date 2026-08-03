import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Heart, GraduationCap, Briefcase, Sparkles, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type AgentType = "przyjaciel" | "mentor" | "asystent" | "coach" | "własny";

const agentTypes = [
  { type: "przyjaciel" as AgentType, label: "Przyjaciel", description: "Ciepły, empatyczny towarzysz do rozmów o wszystkim", icon: Heart, emoji: "💛" },
  { type: "mentor" as AgentType, label: "Mentor", description: "Mądry przewodnik, który pomoże Ci się rozwijać", icon: GraduationCap, emoji: "🧠" },
  { type: "asystent" as AgentType, label: "Asystent", description: "Skuteczny pomocnik w codziennych zadaniach", icon: Briefcase, emoji: "⚡" },
  { type: "coach" as AgentType, label: "Coach", description: "Motywator, który pomoże Ci osiągnąć cele", icon: Sparkles, emoji: "🔥" },
  { type: "własny" as AgentType, label: "Własny", description: "Stwórz coś zupełnie nowego", icon: PenLine, emoji: "✨" },
];

const languages = [
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "en", label: "Angielski", flag: "🇬🇧" },
  { code: "de", label: "Niemiecki", flag: "🇩🇪" },
  { code: "es", label: "Hiszpański", flag: "🇪🇸" },
  { code: "fr", label: "Francuski", flag: "🇫🇷" },
];

const CreateAgent = () => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AgentType | null>(null);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("pl");
  const [agentName, setAgentName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const totalSteps = 4;

  const canProceed = () => {
    if (step === 1) return selectedType !== null;
    if (step === 2) return description.trim().length > 10;
    if (step === 3) return language !== "";
    return true;
  };

  const handleCreate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("agents")
        .insert({
          user_id: user.id,
          name: agentName || selectedType || "Agent",
          type: selectedType || "własny",
          description,
          language,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Agent utworzony! 🎉", description: `${data.name} jest gotowy do rozmowy.` });
      navigate(`/chat/${data.id}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Błąd", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-primary" : "bg-border"}`} />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-8">Krok {step} z {totalSteps}</p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold text-foreground">Kim ma być Twój agent?</h2>
              <p className="mt-2 text-muted-foreground">Wybierz typ, który najlepiej pasuje</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {agentTypes.map((agent) => (
                  <button
                    key={agent.type}
                    onClick={() => setSelectedType(agent.type)}
                    className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200 ${selectedType === agent.type ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/30 bg-card"}`}
                  >
                    <span className="text-2xl">{agent.emoji}</span>
                    <div>
                      <p className="font-display font-semibold text-foreground">{agent.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold text-foreground">Opisz swojego agenta</h2>
              <p className="mt-2 text-muted-foreground">Powiedz mu, jaki ma być. Im więcej napiszesz, tym lepiej Cię zrozumie.</p>
              <div className="mt-8 space-y-4">
                <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} placeholder="Nadaj mu imię (np. Max, Ewa, Atlas...)" className="w-full rounded-xl border-2 border-border bg-card px-5 py-3 font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Np. Niech będzie ciepły, zabawny, ale nie nachalny. Lubi cytować filmy." rows={6} className="w-full rounded-xl border-2 border-border bg-card px-5 py-4 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none resize-none transition-colors leading-relaxed" />
                <p className="text-xs text-muted-foreground">{description.length} znaków · minimum 10</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold text-foreground">Wybierz język głosu</h2>
              <p className="mt-2 text-muted-foreground">W jakim języku ma mówić Twój agent?</p>
              <div className="mt-8 grid gap-3">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200 ${language === lang.code ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/30 bg-card"}`}>
                    <span className="text-2xl">{lang.flag}</span>
                    <p className="font-display font-semibold text-foreground">{lang.label}</p>
                    {language === lang.code && <Check className="ml-auto h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="font-display text-3xl font-bold text-foreground">Twój agent jest gotowy! 🎉</h2>
              <p className="mt-2 text-muted-foreground">Sprawdź szczegóły i stwórz go</p>
              <div className="mt-8 rounded-2xl border-2 border-border bg-card p-8 space-y-5">
                <div><p className="text-sm font-medium text-muted-foreground">Imię</p><p className="mt-1 font-display text-lg font-semibold text-foreground">{agentName || "Bez imienia"}</p></div>
                <div><p className="text-sm font-medium text-muted-foreground">Typ</p><p className="mt-1 font-semibold text-foreground capitalize">{selectedType}</p></div>
                <div><p className="text-sm font-medium text-muted-foreground">Opis</p><p className="mt-1 text-foreground leading-relaxed">{description}</p></div>
                <div><p className="text-sm font-medium text-muted-foreground">Język</p><p className="mt-1 text-foreground">{languages.find((l) => l.code === language)?.flag} {languages.find((l) => l.code === language)?.label}</p></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Wstecz
          </Button>
          {step < totalSteps ? (
            <Button variant="default" size="lg" onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} className="gap-2">
              Dalej <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="hero" size="lg" onClick={handleCreate} disabled={loading} className="gap-2">
              {loading ? "Tworzenie..." : "Stwórz agenta"} <Sparkles className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
