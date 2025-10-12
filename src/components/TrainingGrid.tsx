import { useState } from "react";
import { Exercise } from "@/types/training";
import { ExerciseCell } from "./ExerciseCell";
import { Button } from "@/components/ui/button";

interface TrainingGridProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Omit<Exercise, "id">) => void;
  onDeleteExercise: (id: string) => void;
  onReset: () => void;
}

export const TrainingGrid = ({
  exercises,
  onAddExercise,
  onDeleteExercise,
  onReset,
}: TrainingGridProps) => {
  const DAYS = 7;

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="mb-4 flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onReset}
        >
          RESET
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          APRI MASCHERE
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          INALAZIONE
        </Button>
      </div>

      <div className="inline-block min-w-full">
        <div className="grid grid-cols-[repeat(7,minmax(300px,1fr))] gap-1">
          {/* Headers */}
          {Array.from({ length: DAYS }, (_, i) => (
            <div
              key={`header-${i}`}
              className="bg-primary text-primary-foreground font-bold text-center py-3 text-sm"
            >
              DAY - {i + 1}
            </div>
          ))}

          {/* Subheaders */}
          {Array.from({ length: DAYS }, (_, i) => (
            <div
              key={`subheader-${i}`}
              className="grid grid-cols-3 gap-px bg-border"
            >
              <div className="bg-card text-foreground text-[10px] font-semibold p-2 text-center">
                TIPO ESERCIZIO
              </div>
              <div className="bg-card text-foreground text-[10px] font-semibold p-2 text-center">
                STIMOLO - TECNICA PROGRESSIONE
              </div>
              <div className="bg-card text-foreground text-[10px] font-semibold p-2 text-center">
                INCREMENTO SETTIMANA
              </div>
            </div>
          ))}

          {/* Exercise cells */}
          {Array.from({ length: DAYS }, (_, dayIndex) => {
            const dayExercises = exercises.filter((ex) => ex.day === dayIndex + 1);
            return (
              <ExerciseCell
                key={`day-${dayIndex}`}
                day={dayIndex + 1}
                exercises={dayExercises}
                onAddExercise={onAddExercise}
                onDeleteExercise={onDeleteExercise}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
