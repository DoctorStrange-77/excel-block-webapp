import { useState } from "react";
import { Exercise } from "@/types/training";
import { ExerciseCell } from "./ExerciseCell";
import { Button } from "@/components/ui/button";

interface TrainingGridProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Omit<Exercise, "id">) => void;
  onDeleteExercise: (id: string) => void;
  onUpdateExercise?: (exercise: Exercise) => void;
  onReset: () => void;
  numDays?: number;
  notes?: Record<number, string>;
  onNoteChange?: (day: number, text: string) => void;
  noScrollContainer?: boolean;
}

export const TrainingGrid = ({
  exercises,
  onAddExercise,
  onDeleteExercise,
  onUpdateExercise,
  onReset,
  numDays = 7,
  notes = {},
  onNoteChange,
  noScrollContainer = false,
}: TrainingGridProps) => {
  const DAYS = numDays;
  if (noScrollContainer) {
    return (
      <>
        <div className="mb-4 flex gap-2" />
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[repeat(7,minmax(300px,1fr))] gap-2">
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
                  onUpdateExercise={onUpdateExercise}
                  note={notes[dayIndex + 1]}
                  onNoteChange={(text: string) => onNoteChange?.(dayIndex + 1, text)}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <div className="mb-4 flex gap-2" />

      <div className="inline-block min-w-full">
        <div className="grid grid-cols-[repeat(7,minmax(300px,1fr))] gap-2">
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
                onUpdateExercise={onUpdateExercise}
                note={notes[dayIndex + 1]}
                onNoteChange={(text: string) => onNoteChange?.(dayIndex + 1, text)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
