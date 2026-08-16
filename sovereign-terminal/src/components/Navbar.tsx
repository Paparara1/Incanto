import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, MessageCircle, Home, LogOut, LogIn, Bot, Cpu, Zap, Brain, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const links = user
    ? [
        { to: "/", label: "Terminal", icon: Home },
        { to: "/dashboard", label: "Agents", icon: Bot },
        { to: "/chat", label: "Comms", icon: MessageCircle },
        { to: "/fleet", label: "Fleet", icon: Shield },
        { to: "/create", label: "Forge", icon: Cpu },
        { to: "/neuro", label: "Neuro", icon: Brain },
      ]
    : [{ to: "/", label: "Terminal", icon: Home }];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: "linear-gradient(135deg, #00e5ff, #b026ff)" }}>
            <Zap className="h-4 w-4 text-black" />
          </div>
          <span className="text-sm font-bold tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00e5ff" }}>
            SIT<span style={{ color: "#FFD700" }}>.</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href="https://donatr.ee/ojjja?utm_source=copy&utm_medium=share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-pink-400 border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-300"
            >
              <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
              <span className="hidden sm:inline">Donate</span>
            </Button>
          </a>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-1.5 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Button>
              </Link>
            );
          })}
          {user ? (
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="gap-1.5 text-xs">
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Access</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
