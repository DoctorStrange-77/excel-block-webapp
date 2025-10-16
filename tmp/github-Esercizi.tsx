import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Dumbbell, Play } from "lucide-react";
import exercisesData from "@/data/exercises.json";
import type { Exercise } from "@/types";

const exercises = exercisesData as Exercise[];

export default function Esercizi() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const muscleGroups = useMemo(() => {
    const groups = new Set(exercises.map((ex) => ex.group));
    return Array.from(groups).sort();
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === "all" || exercise.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  const getGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      "Gambe": "bg-primary/20 text-primary border-primary/30",
      "Petto": "bg-secondary/20 text-secondary border-secondary/30",
      "Schiena": "bg-primary/20 text-primary border-primary/30",
      "Dorso": "bg-secondary/20 text-secondary border-secondary/30",
      "Braccia": "bg-primary/20 text-primary border-primary/30",
      "Spalle": "bg-secondary/20 text-secondary border-secondary/30",
      "Tricipiti": "bg-primary/20 text-primary border-primary/30",
    };
    return colors[group] || "bg-muted/20 text-muted-foreground border-muted/30";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Esercizi</h1>
        <p className="text-muted-foreground mt-1">
          Esplora il database completo di {exercises.length} esercizi
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca esercizi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtra per gruppo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i gruppi</SelectItem>
            {muscleGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filteredExercises.map((exercise, index) => (
          <Card
            key={index}
            className="group hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors mt-1">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base group-hover:text-primary transition-colors break-words">
                      {exercise.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getGroupColor(exercise.group)}>
                        {exercise.group}
                      </Badge>
                      {exercise.video && (
                        <a
                          href={exercise.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:text-secondary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Play className="h-3 w-3" />
                          Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessun esercizio trovato</h3>
            <p className="text-muted-foreground text-center">
              Prova a modificare i criteri di ricerca
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
