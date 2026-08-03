import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Volume2, ThumbsUp, ThumbsDown, Plus, MessageCircle, Bot, Loader2, Mic, MicOff } from "lucide-react";
import ChatMarkdown from "@/components/ChatMarkdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Agent = Tables<"agents">;
type Conversation = Tables<"conversations">;
type DbMessage = Tables<"messages">;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;

// Self-contained input — does NOT cause parent re-renders on typing
const ChatInput = memo(({ isStreaming, isListening, onSend, onToggleListen, inputRef }: {
  isStreaming: boolean;
  isListening: boolean;
  onSend: (text: string) => void;
  onToggleListen: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const [localInput, setLocalInput] = useState("");

  // Sync from external writes (e.g. voice recognition)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const observer = new MutationObserver(() => {
      if (el.dataset.externalValue !== undefined) {
        setLocalInput(el.dataset.externalValue);
        delete el.dataset.externalValue;
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ["data-external-value"] });
    return () => observer.disconnect();
  }, [inputRef]);

  const handleSend = () => {
    if (!localInput.trim() || isStreaming) return;
    onSend(localInput);
    setLocalInput("");
  };

  return (
    <div className="border-t border-border bg-card/50 p-4">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          onClick={onToggleListen}
          disabled={isStreaming}
          className="h-12 w-12 rounded-xl shrink-0"
          title={isListening ? "Zatrzymaj nasłuchiwanie" : "Mów do agenta"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <input
          ref={inputRef}
          value={localInput}
          onChange={(e) => setLocalInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={isListening ? "Mówię... 🎙️" : "Napisz wiadomość..."}
          disabled={isStreaming}
          className="flex-1 rounded-xl border-2 border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
        />
        <Button variant="default" size="icon" onClick={handleSend} disabled={!localInput.trim() || isStreaming} className="h-12 w-12 rounded-xl shrink-0">
          {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
});
ChatInput.displayName = "ChatInput";

const Chat = () => {
  const { agentId } = useParams();
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Speech recognition (voice input)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: "destructive", title: "Twoja przeglądarka nie wspiera rozpoznawania mowy" });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    const langMap: Record<string, string> = { pl: "pl-PL", en: "en-US", de: "de-DE", es: "es-ES", fr: "fr-FR" };
    recognition.lang = langMap[selectedAgent?.language || "pl"] || "pl-PL";

    let finalTranscript = inputRef.current?.value || "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim = transcript;
        }
      }
      if (inputRef.current) {
        const newVal = finalTranscript + (interim ? " " + interim : "");
        inputRef.current.dataset.externalValue = newVal;
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        toast({ variant: "destructive", title: "Brak dostępu do mikrofonu", description: "Zezwól na dostęp w ustawieniach przeglądarki." });
      }
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  // Voice playback
  const playVoice = (messageId: string, text: string) => {
    if (playingVoice) return;
    if (!('speechSynthesis' in window)) {
      toast({ variant: "destructive", title: "Twoja przeglądarka nie wspiera syntezy mowy" });
      return;
    }
    setPlayingVoice(messageId);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = { pl: "pl-PL", en: "en-US", de: "de-DE", es: "es-ES", fr: "fr-FR" };
    utterance.lang = langMap[selectedAgent?.language || "pl"] || "pl-PL";
    utterance.rate = 1;
    utterance.onend = () => setPlayingVoice(null);
    utterance.onerror = () => { setPlayingVoice(null); toast({ variant: "destructive", title: "Błąd odtwarzania" }); };
    window.speechSynthesis.speak(utterance);
  };

  // Load agents
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("agents").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) {
        setAgents(data);
        const target = agentId ? data.find(a => a.id === agentId) : data[0];
        if (target) setSelectedAgent(target);
      }
    };
    load();
  }, [user, agentId]);

  // Load conversations
  useEffect(() => {
    if (!user || !selectedAgent) return;
    const load = async () => {
      const { data } = await supabase.from("conversations").select("*").eq("agent_id", selectedAgent.id).order("updated_at", { ascending: false });
      if (data) {
        setConversations(data);
        if (data.length > 0) setActiveConversation(data[0]);
        else setActiveConversation(null);
      }
    };
    load();
  }, [user, selectedAgent]);

  // Load messages
  useEffect(() => {
    if (!activeConversation) { setMessages([]); return; }
    const load = async () => {
      const { data } = await supabase.from("messages").select("*").eq("conversation_id", activeConversation.id).order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    load();
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createNewConversation = async () => {
    if (!user || !selectedAgent) return;
    const { data } = await supabase.from("conversations").insert({
      user_id: user.id, agent_id: selectedAgent.id, title: "Nowa rozmowa",
    }).select().single();
    if (data) {
      setConversations(prev => [data, ...prev]);
      setActiveConversation(data);
      setMessages([]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !activeConversation || !selectedAgent || isStreaming) return;
    const content = text;
    setIsStreaming(true);

    // Save user message to DB
    const { data: userMsg } = await supabase.from("messages").insert({
      conversation_id: activeConversation.id, role: "user", content,
    }).select().single();
    if (userMsg) setMessages(prev => [...prev, userMsg]);

    // Update title on first message
    if (messages.length === 0) {
      await supabase.from("conversations").update({ title: content.slice(0, 50) }).eq("id", activeConversation.id);
      setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, title: content.slice(0, 50) } : c));
    }

    // Build message history for AI
    const chatHistory = [...messages, ...(userMsg ? [userMsg] : [])].map(m => ({
      role: m.role === "user" ? "user" as const : "assistant" as const,
      content: m.content,
    }));

    // Stream AI response
    let assistantContent = "";
    const tempId = `temp-${Date.now()}`;

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${currentSession?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatHistory,
          agentName: selectedAgent.name,
          agentType: selectedAgent.type,
          agentDescription: selectedAgent.description,
          agentLanguage: selectedAgent.language,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Błąd AI" }));
        const errorMsg = err.error || `HTTP ${resp.status}`;
        if (resp.status === 402) {
          throw new Error("Kredyty AI zostały wyczerpane. Doładuj konto w ustawieniach Lovable (Settings → Workspace → Usage).");
        }
        if (resp.status === 429) {
          throw new Error("Zbyt wiele zapytań. Odczekaj chwilę i spróbuj ponownie.");
        }
        throw new Error(errorMsg);
      }

      if (!resp.body) throw new Error("No stream body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: tempId, conversation_id: activeConversation.id, role: "agent",
        content: "", feedback: null, created_at: new Date().toISOString(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantContent += delta;
              const currentContent = assistantContent;
              setMessages(prev => prev.map(m => m.id === tempId ? { ...m, content: currentContent } : m));
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      // Save final assistant message to DB
      if (assistantContent) {
        const { data: savedMsg } = await supabase.from("messages").insert({
          conversation_id: activeConversation.id, role: "agent", content: assistantContent,
        }).select().single();
        if (savedMsg) {
          setMessages(prev => prev.map(m => m.id === tempId ? savedMsg : m));
        }
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Błąd AI", description: e.message });
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFeedback = async (messageId: string, feedback: "up" | "down") => {
    await supabase.from("messages").update({ feedback }).eq("id", messageId);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, feedback } : m));
  };

  if (!selectedAgent && agents.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-display text-xl font-bold text-foreground">Brak agentów</h2>
          <p className="mt-2 text-muted-foreground">Stwórz swojego pierwszego agenta, żeby zacząć rozmowę.</p>
          <a href="/create"><Button variant="hero" className="mt-6">Stwórz agenta</Button></a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-72 border-r border-border bg-card overflow-y-auto hidden md:block">
        <div className="p-4">
          <Button variant="warm" className="w-full gap-2" size="sm" onClick={createNewConversation}>
            <Plus className="h-4 w-4" /> Nowa rozmowa
          </Button>
        </div>
        {agents.length > 1 && (
          <div className="px-4 pb-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Agent</p>
            {agents.map(a => (
              <button key={a.id} onClick={() => setSelectedAgent(a)} className={`w-full text-left rounded-lg px-3 py-2 text-sm transition-colors mb-1 ${selectedAgent?.id === a.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary text-foreground"}`}>
                {a.name}
              </button>
            ))}
          </div>
        )}
        <div className="px-4 pt-3 space-y-1">
          {conversations.map((conv) => (
            <button key={conv.id} onClick={() => setActiveConversation(conv)} className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${activeConversation?.id === conv.id ? "bg-secondary" : "hover:bg-secondary/50"}`}>
              <MessageCircle className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{conv.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(conv.created_at).toLocaleDateString("pl")}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="border-b border-border px-6 py-3 flex items-center gap-3 bg-card/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground text-sm">{selectedAgent?.name || "Agent"}</p>
            <p className="text-xs text-muted-foreground capitalize">{selectedAgent?.type} · {selectedAgent?.language === "pl" ? "Polski" : selectedAgent?.language}</p>
          </div>
          {isStreaming && <Loader2 className="ml-auto h-4 w-4 animate-spin text-primary" />}
        </div>

        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Rozpocznij nową rozmowę</p>
              <Button variant="warm" className="mt-4 gap-2" onClick={createNewConversation}>
                <Plus className="h-4 w-4" /> Nowa rozmowa
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 md:px-8">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <p className="text-2xl mb-2">👋</p>
                    <p className="text-muted-foreground">Napisz coś, żeby zacząć rozmowę z <span className="font-semibold text-foreground">{selectedAgent?.name}</span></p>
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"}`}>
                    <div className="leading-relaxed text-sm">
                      {msg.role === "agent" ? <ChatMarkdown content={msg.content} /> : <p className="whitespace-pre-wrap">{msg.content}</p>}
                    </div>
                    {msg.role === "agent" && msg.content && (
                      <div className="mt-3 flex items-center gap-2 border-t border-border/30 pt-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-primary" onClick={() => playVoice(msg.id, msg.content)} disabled={playingVoice !== null}>
                          {playingVoice === msg.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </Button>
                        <Button variant="ghost" size="sm" className={`h-7 w-7 p-0 ${msg.feedback === "up" ? "text-primary" : "text-muted-foreground hover:text-primary"}`} onClick={() => handleFeedback(msg.id, "up")}><ThumbsUp className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className={`h-7 w-7 p-0 ${msg.feedback === "down" ? "text-accent" : "text-muted-foreground hover:text-accent"}`} onClick={() => handleFeedback(msg.id, "down")}><ThumbsDown className="h-3.5 w-3.5" /></Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              isStreaming={isStreaming}
              isListening={isListening}
              onSend={handleSend}
              onToggleListen={startListening}
              inputRef={inputRef}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
