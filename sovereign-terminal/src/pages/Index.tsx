import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, GraduationCap, Briefcase, Sparkles, Volume2, MessageCircle, ThumbsUp } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const agentCards = [
  {
    title: "Przyjaciel",
    emoji: "💛",
    description: "Ciepły towarzysz, który wysłucha i zrozumie. Zawsze gotowy do rozmowy.",
    icon: Heart,
    gradient: "from-primary/10 to-accent/10",
  },
  {
    title: "Mentor",
    emoji: "🧠",
    description: "Mądry przewodnik na drodze rozwoju. Dzieli się wiedzą i doświadczeniem.",
    icon: GraduationCap,
    gradient: "from-accent/10 to-primary/10",
  },
  {
    title: "Asystent",
    emoji: "⚡",
    description: "Skuteczny pomocnik w codziennych zadaniach. Organizuje i przypomina.",
    icon: Briefcase,
    gradient: "from-primary/10 to-secondary",
  },
];

const features = [
  {
    icon: Volume2,
    title: "Głos AI",
    description: "Twój agent mówi naturalnym głosem w wybranym języku",
  },
  {
    icon: MessageCircle,
    title: "Rozmowy",
    description: "Czatuj tekstowo lub słuchaj odpowiedzi głosowych",
  },
  {
    icon: ThumbsUp,
    title: "Uczenie się",
    description: "Agent uczy się z każdej rozmowy i staje się lepszy",
  },
  {
    icon: Sparkles,
    title: "Personalizacja",
    description: "Opisz agenta słowami, a on stanie się tym",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-12 md:pt-20">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground md:text-6xl">
                AI BE MY
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">...</span>
                <br />
                <span className="text-3xl md:text-4xl font-medium text-muted-foreground">
                  stwórz swojego agenta
                </span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
                Wybierz, kim ma być. Opisz go słowami. A on stanie się tym.
                Twój osobisty AI z głosem, który uczy się z każdej rozmowy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/create">
                  <Button variant="hero" size="xl">
                    Stwórz swojego agenta
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="warm" size="lg">
                    Zobacz moich agentów
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
                <img
                  src={heroImage}
                  alt="AI BE MY - stwórz swojego spersonalizowanego agenta AI"
                  className="relative w-full max-w-lg rounded-3xl shadow-soft animate-float"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agent Cards */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Kim ma być Twój agent?
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Wybierz typ i spersonalizuj go pod siebie
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {agentCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to="/create" className="block group">
                  <div className={`rounded-2xl border border-border/50 bg-gradient-to-br ${card.gradient} p-8 transition-all duration-300 hover:shadow-soft hover:-translate-y-1`}>
                    <span className="text-4xl">{card.emoji}</span>
                    <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Stwórz <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-secondary/30 py-20">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50 p-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">
              Gotowy na swojego agenta?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Stwórz go w 4 prostych krokach. Za darmo.
            </p>
            <Link to="/create">
              <Button variant="hero" size="xl" className="mt-8">
                Zacznij teraz
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
