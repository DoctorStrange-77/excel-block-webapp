import { useState } from "react";
import { Exercise, MUSCLE_GROUPS } from "@/types/training";
import { Button } from "@/components/ui/button";
import { StimoloDialog } from "./StimoloDialog";
import { Plus, Trash2 } from "lucide-react";

interface ExerciseCellProps {
  day: number;
  exercises: Exercise[];
  onAddExercise: (exercise: Omit<Exercise, "id">) => void;
  onDeleteExercise: (id: string) => void;
}

export const ExerciseCell = ({
  day,
  exercises,
  onAddExercise,
  onDeleteExercise,
}: ExerciseCellProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const handleAddExercise = (data: Omit<Exercise, "id" | "day">) => {
    onAddExercise({ ...data, day });
    setIsDialogOpen(false);
  };

  const getMuscleColor = (muscleGroup: string) => {
    const group = MUSCLE_GROUPS.find((g) => g.name === muscleGroup);
    return group?.color || "muted";
  };

  return (
    <div className="bg-card border border-border rounded-sm min-h-[300px] p-3 space-y-2">
      {/* Header del giorno */}
      <div className="bg-primary text-primary-foreground font-bold text-center py-2 px-3 rounded-sm mb-3 -mx-3 -mt-3">
        DAY - {day}
      </div>
      
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="p-3 rounded-sm relative group"
          style={{
            backgroundColor: `hsl(var(--${getMuscleColor(exercise.muscleGroup)}))`
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive"
            onClick={() => onDeleteExercise(exercise.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <div className="text-xs font-bold text-background">{exercise.muscleGroup}</div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-background/90">
            <div className="truncate">{exercise.exerciseType}</div>
            <div className="truncate">{exercise.stimuloTecnica}</div>
            <div className="truncate">{exercise.incrementoSettimana}</div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        className="w-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-muted"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Aggiungi Esercizio
      </Button>

      <StimoloDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleAddExercise}
      />
    </div>
  );
};
