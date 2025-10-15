import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Users, FileText, TrendingUp, MapPin, Utensils } from "lucide-react";

const Home = () => {
  const features = [
    {
      title: "Split",
      description: "Gestisci le tue split di allenamento settimanali",
      icon: Dumbbell,
      link: "/split",
      color: "text-primary",
    },
    {
      title: "Atleti",
      description: "Gestisci i tuoi atleti e le loro informazioni",
      icon: Users,
      link: "/atleti",
      color: "text-blue-500",
    },
    {
      title: "Schede",
      description: "Crea e organizza schede di allenamento",
      icon: FileText,
      link: "/schede",
      color: "text-green-500",
    },
    {
      title: "Progressioni",
      description: "Monitora le progressioni degli atleti",
      icon: TrendingUp,
      link: "/progressioni",
      color: "text-purple-500",
    },
    {
      title: "Esercizi",
      description: "Database completo degli esercizi",
      icon: Dumbbell,
      link: "/esercizi",
      color: "text-red-500",
    },
    {
      title: "Distretti",
      description: "Visualizza e gestisci i distretti muscolari",
      icon: MapPin,
      link: "/distretti",
      color: "text-cyan-500",
    },
    {
      title: "Dieta",
      description: "Pianifica e gestisci i piani alimentari",
      icon: Utensils,
      link: "/dieta",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl font-black text-primary mb-4 tracking-tight">
            THE BUILDER WEB
          </h1>
          <p className="text-xl text-muted-foreground">
            La tua piattaforma completa per la gestione dell'allenamento e della nutrizione
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-primary font-bold hover:underline">
                      Vai alla sezione →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
