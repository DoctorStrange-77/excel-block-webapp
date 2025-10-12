import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STIMOLI, MUSCLE_GROUPS, Exercise } from "@/types/training";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StimoloDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (exercise: Omit<Exercise, "id" | "day">) => void;
}

export const StimoloDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: StimoloDialogProps) => {
  const [selectedStimolo, setSelectedStimolo] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [incremento, setIncremento] = useState("");
  const [showStimoloList, setShowStimoloList] = useState(false);

  const handleSubmit = () => {
    if (muscleGroup && exerciseType && selectedStimolo) {
      onSubmit({
        muscleGroup,
        exerciseType,
        stimuloTecnica: selectedStimolo,
        incrementoSettimana: incremento,
      });
      // Reset form
      setSelectedStimolo("");
      setMuscleGroup("");
      setExerciseType("");
      setIncremento("");
      setShowStimoloList(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nuovo Esercizio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="muscleGroup" className="text-foreground">
              Gruppo Muscolare
            </Label>
            <select
              id="muscleGroup"
              className="w-full mt-1 bg-input border border-border text-foreground rounded-sm px-3 py-2 text-sm"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="">Seleziona...</option>
              {MUSCLE_GROUPS.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="exerciseType" className="text-foreground">
              Tipo Esercizio
            </Label>
            <Input
              id="exerciseType"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              placeholder="Es: Squat, Panca..."
              className="bg-input border-border text-foreground"
            />
          </div>

          <div>
            <Label className="text-foreground">Stimolo - Tecnica Progressione</Label>
            <Button
              variant="secondary"
              className="w-full mt-1 justify-start bg-input hover:bg-secondary text-foreground"
              onClick={() => setShowStimoloList(!showStimoloList)}
            >
              {selectedStimolo || "Seleziona stimolo..."}
            </Button>

            {showStimoloList && (
              <ScrollArea className="h-64 mt-2 border border-border rounded-sm bg-popover">
                <div className="p-2">
                  {STIMOLI.map((stimolo) => (
                    <Button
                      key={stimolo}
                      variant={selectedStimolo === stimolo ? "default" : "ghost"}
                      className={`w-full justify-start mb-1 text-sm ${
                        selectedStimolo === stimolo
                          ? "bg-dorso text-background hover:bg-dorso/90"
                          : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => {
                        setSelectedStimolo(stimolo);
                        setShowStimoloList(false);
                      }}
                    >
                      {stimolo}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <div>
            <Label htmlFor="incremento" className="text-foreground">
              Incremento Settimana
            </Label>
            <Input
              id="incremento"
              value={incremento}
              onChange={(e) => setIncremento(e.target.value)}
              placeholder="Es: +2kg, +5%, +1 rep..."
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!muscleGroup || !exerciseType || !selectedStimolo}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Aggiungi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
