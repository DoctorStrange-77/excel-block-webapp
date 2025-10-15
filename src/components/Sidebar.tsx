import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, TrendingUp, Dumbbell, Target, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/atleti", label: "Atleti", icon: Users },
  { path: "/schede", label: "Schede", icon: FileText },
  { path: "/progressioni", label: "Progressioni", icon: TrendingUp },
  { path: "/esercizi", label: "Esercizi", icon: Dumbbell },
  { path: "/distretti", label: "Distretti", icon: Target },
  { path: "/dieta", label: "Dieta", icon: Apple },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Dumbbell className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-black text-primary">THE BUILDER WEB</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
