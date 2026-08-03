import { Heart, GraduationCap, Briefcase, Sparkles } from "lucide-react";

export type AgentType = "przyjaciel" | "mentor" | "asystent" | "coach" | "własny";

interface AgentTypeInfo {
  type: AgentType;
  label: string;
  description: string;
  icon: React.ElementType;
  emoji: string;
}

export const agentTypes: AgentTypeInfo[] = [
  {
    type: "przyjaciel",
    label: "Przyjaciel",
    description: "Ciepły, empatyczny towarzysz do rozmów o wszystkim",
    icon: Heart,
    emoji: "💛",
  },
  {
    type: "mentor",
    label: "Mentor",
    description: "Mądry przewodnik, który pomoże Ci się rozwijać",
    icon: GraduationCap,
    emoji: "🧠",
  },
  {
    type: "asystent",
    label: "Asystent",
    description: "Skuteczny pomocnik w codziennych zadaniach",
    icon: Briefcase,
    emoji: "⚡",
  },
  {
    type: "coach",
    label: "Coach",
    description: "Motywator, który pomoże Ci osiągnąć cele",
    icon: Sparkles,
    emoji: "🔥",
  },
];

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  language: string;
  createdAt: Date;
  conversations: number;
}
