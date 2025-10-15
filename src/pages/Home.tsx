import { Dumbbell } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Dumbbell className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-black text-primary">THE BUILDER WEB</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Benvenuto nella piattaforma di gestione allenamenti
        </p>
      </div>
    </div>
  );
};

export default Home;
