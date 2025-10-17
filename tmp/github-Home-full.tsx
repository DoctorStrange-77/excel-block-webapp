import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Dumbbell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    title: "Gestisci Atleti",
    description: "Visualizza e gestisci i tuoi atleti",
    icon: Users,
    href: "/atleti",
    gradient: "from-primary to-secondary",
  },
  {
    title: "Crea Scheda",
    description: "Genera nuove schede di allenamento",
    icon: ClipboardList,
    href: "/schede",
    gradient: "from-secondary to-primary",
  },
  {
    title: "Database Esercizi",
    description: "Esplora il database completo",
    icon: Dumbbell,
    href: "/esercizi",
    gradient: "from-primary via-secondary to-primary",
  },
  {
    title: "Progressioni",
    description: "Gestisci le progressioni di allenamento",
    icon: TrendingUp,
    href: "/progressioni",
    gradient: "from-secondary via-primary to-secondary",
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Benvenuto in{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            The Builder Web
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          La tua piattaforma professionale per la gestione delle schede di allenamento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.href}>
              <Card className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer h-full">
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-2">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="border-border bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <CardTitle className="text-2xl">Inizia subito</CardTitle>
          <CardDescription className="text-base">
            Seleziona un'azione dal menu per iniziare a gestire i tuoi atleti e le loro schede di allenamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Database completo di esercizi</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>Progressioni personalizzabili</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>Gestione atleti intuitiva</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
