import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, TrendingUp, Dumbbell, Target, Apple } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Atleti",
    description: "Gestisci i tuoi atleti",
    icon: Users,
    href: "/atleti",
    color: "text-blue-500",
  },
  {
    title: "Schede",
    description: "Crea schede di allenamento",
    icon: ClipboardList,
    href: "/schede",
    color: "text-green-500",
  },
  {
    title: "Progressioni",
    description: "Monitora le progressioni",
    icon: TrendingUp,
    href: "/progressioni",
    color: "text-purple-500",
  },
  {
    title: "Esercizi",
    description: "Database esercizi",
    icon: Dumbbell,
    href: "/esercizi",
    color: "text-primary",
  },
  {
    title: "Distretti",
    description: "Distretti muscolari",
    icon: Target,
    href: "/distretti",
    color: "text-red-500",
  },
  {
    title: "Dieta",
    description: "Piani alimentari",
    icon: Apple,
    href: "/dieta",
    color: "text-secondary",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          THE BUILDER WEB
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          La tua piattaforma completa per la gestione degli allenamenti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} to={feature.href}>
              <Card className="hover:bg-card/80 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
