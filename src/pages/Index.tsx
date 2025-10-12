import { useState } from "react";
import { Exercise } from "@/types/training";
import { VolumeBar } from "@/components/VolumeBar";
import { TrainingGrid } from "@/components/TrainingGrid";
import { toast } from "sonner";

const Index = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const volumeData = exercises.reduce((acc, exercise) => {
    acc[exercise.muscleGroup] = (acc[exercise.muscleGroup] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddExercise = (exercise: Omit<Exercise, "id">) => {
    const newExercise: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}-${Math.random()}`,
    };
    setExercises([...exercises, newExercise]);
    toast.success("Esercizio aggiunto con successo!");
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
    toast.success("Esercizio eliminato");
  };

  const handleReset = () => {
    if (confirm("Sei sicuro di voler resettare tutti gli esercizi?")) {
      setExercises([]);
      toast.success("Blocco resettato");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Intestazione in alto */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">BLOCCO ALLENAMENTO</h1>
        <p className="text-muted-foreground text-sm">
          Sistema di programmazione settimanale
        </p>
      </div>

      {/* Contenuto principale */}
      <div className="flex flex-col gap-4">
        <TrainingGrid
          exercises={exercises}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onReset={handleReset}
        />

        {/* Grafico volume in basso - mostra solo gruppi muscolari usati */}
        {Object.keys(volumeData).length > 0 && (
          <VolumeBar data={volumeData} />
        )}
      </div>
    </div>
  );
};

export default Index;
