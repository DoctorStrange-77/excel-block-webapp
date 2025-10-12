import { useState, useEffect, useRef, useLayoutEffect } from "react";
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
  initialData?: Exercise;
  submitLabel?: string;
  // optional placeholders to show previous values when form inputs are intentionally empty
  placeholderData?: Partial<Omit<Exercise, "id" | "day">>;
}

export const StimoloDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  submitLabel,
  placeholderData,
}: StimoloDialogProps) => {
  const [selectedStimolo, setSelectedStimolo] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [showStimoloList, setShowStimoloList] = useState(false);
  const [showRoleList, setShowRoleList] = useState(false);
  const [roleQuery, setRoleQuery] = useState("");
  const [showMuscleList, setShowMuscleList] = useState(false);
  const [muscleQuery, setMuscleQuery] = useState("");
  const [stimoloQuery, setStimoloQuery] = useState("");
  const [roleFocusedIndex, setRoleFocusedIndex] = useState(0);
  const [muscleFocusedIndex, setMuscleFocusedIndex] = useState(0);
  const [stimoloFocusedIndex, setStimoloFocusedIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const muscleWrapperRef = useRef<HTMLDivElement | null>(null);
  const roleWrapperRef = useRef<HTMLDivElement | null>(null);
  const stimoloWrapperRef = useRef<HTMLDivElement | null>(null);

  const highlight = (text: string, q: string) => {
    if (!q) return <>{text}</>;
    const lower = text.toLowerCase();
    const pos = lower.indexOf(q.toLowerCase());
    if (pos === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, pos)}
        <span className="bg-yellow-400 text-black px-1">{text.slice(pos, pos + q.length)}</span>
        {text.slice(pos + q.length)}
      </>
    );
  };

  const ROLES = [
    "Accessorio",
    "Attivazione / Prehab",
    "Cardio (HIIT/LISS/MISS/Tempo/Sled)",
    "Complementare",
    "Core (anti-*)",
    "Fondamentale / Competition lift",
    "Isolamento / Analitico",
    "Metabolico / Pump / Finisher / Burnout",
    "Multiarticolare",
    "Tecnico / Skill",
    "Variante / Assistenza",
  ];

  // initialize fields when editing
  useEffect(() => {
    if (initialData) {
      setSelectedStimolo(initialData.stimuloTecnica || "");
      setMuscleGroup(initialData.muscleGroup || "");
      setExerciseType(initialData.exerciseType || "");
    } else {
      setSelectedStimolo("");
      setMuscleGroup("");
      setExerciseType("");
    }
  }, [initialData, open]);

  // ensure search states are cleared when dialog opens for new item
  useEffect(() => {
    if (!initialData && open) {
      setRoleQuery("");
      setShowRoleList(false);
      setSelectedStimolo("");
      setMuscleQuery("");
      setShowMuscleList(false);
      setStimoloQuery("");
      setShowStimoloList(false);
      setRoleFocusedIndex(0);
      setMuscleFocusedIndex(0);
      setStimoloFocusedIndex(0);
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    // Require at least the muscleGroup (distretto) to create an exercise; other fields optional
    if (muscleGroup) {
      onSubmit({
        muscleGroup,
        exerciseType: exerciseType || "",
        stimuloTecnica: selectedStimolo || "",
      });
      // Reset form
      setSelectedStimolo("");
      setMuscleGroup("");
      setExerciseType("");
      setShowStimoloList(false);
    }
  };

  // adjust dropdown widths to match the dialog right edge so they align to the red line
  const adjustDropdownWidths = () => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;
    const dialogRect = dialogEl.getBoundingClientRect();

    const adjust = (wrapper: HTMLDivElement | null) => {
      if (!wrapper) return;
      const parentRect = wrapper.parentElement?.getBoundingClientRect();
      if (!parentRect) return;
      const desired = Math.max(0, dialogRect.right - parentRect.left);
      wrapper.style.width = `${desired}px`;
    };

    adjust(muscleWrapperRef.current);
    adjust(roleWrapperRef.current);
    adjust(stimoloWrapperRef.current);
  };

  useLayoutEffect(() => {
    if (showMuscleList || showRoleList || showStimoloList) adjustDropdownWidths();
    const onResize = () => adjustDropdownWidths();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [showMuscleList, showRoleList, showStimoloList]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent ref={dialogRef} className="bg-popover border-border max-w-4xl w-[min(880px,90vw)]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nuovo Esercizio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="muscleGroup" className="text-foreground">
              DISTRETTO MUSCOLARE - PATTERN MOTORIO - PREHAB/MOBILITÀ
            </Label>
            <Input
              id="muscleGroup"
              value={muscleGroup}
              onChange={(e) => { setMuscleGroup(e.target.value); setMuscleQuery(e.target.value); setShowMuscleList(true); }}
              onFocus={() => setShowMuscleList(true)}
              placeholder={muscleGroup ? "" : (placeholderData?.muscleGroup ?? "Cerca o seleziona distretto...")}
              className="bg-input border-border text-foreground"
              onKeyDown={(e) => {
                const filtered = MUSCLE_GROUPS.filter((g) => g.name.toLowerCase().includes(muscleQuery.toLowerCase()));
                if (e.key === "Escape") {
                  setShowMuscleList(false);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setMuscleFocusedIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setMuscleFocusedIndex((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filtered[muscleFocusedIndex] || filtered[0];
                  if (pick) {
                    setMuscleGroup(pick.name);
                    setMuscleQuery(pick.name);
                    setShowMuscleList(false);
                  }
                }
              }}
            />

            {showMuscleList && (
              <div ref={muscleWrapperRef} className="mt-2 w-full max-w-full">
                <ScrollArea className="h-40 border border-border rounded-sm bg-popover w-full box-border overflow-hidden">
                  <div className="py-1 px-0">
                    {MUSCLE_GROUPS.filter((g) => g.name.toLowerCase().includes(muscleQuery.toLowerCase())).map((group, idx) => (
                      <Button
                        key={group.name}
                        variant={muscleGroup === group.name ? "default" : "ghost"}
                        className={`w-full justify-start mb-1 text-sm truncate text-left pl-4 pr-4 ${muscleGroup === group.name ? "bg-dorso text-background hover:bg-dorso/90" : "text-foreground hover:bg-muted"} ${idx === muscleFocusedIndex ? "ring-2 ring-primary" : ""}`}
                        onMouseEnter={() => setMuscleFocusedIndex(idx)}
                        onClick={() => { setMuscleGroup(group.name); setMuscleQuery(group.name); setShowMuscleList(false); }}
                      >
                        {highlight(group.name, muscleQuery)}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="relative">
            <Label htmlFor="exerciseType" className="text-foreground">
              RUOLO ESERCIZIO
            </Label>
            <Input
              id="exerciseType"
              value={exerciseType}
              onChange={(e) => {
                setExerciseType(e.target.value);
                setRoleQuery(e.target.value);
                setShowRoleList(true);
              }}
              onFocus={() => setShowRoleList(true)}
              placeholder={exerciseType ? "" : (placeholderData?.exerciseType ?? "Cerca o seleziona ruolo...")}
              className="bg-input border-border text-foreground"
              onKeyDown={(e) => {
                const filtered = ROLES.filter((r) => r.toLowerCase().includes(roleQuery.toLowerCase()));
                if (e.key === "Escape") {
                  setShowRoleList(false);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setRoleFocusedIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setRoleFocusedIndex((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filtered[roleFocusedIndex] || filtered[0];
                  if (pick) {
                    setExerciseType(pick);
                    setRoleQuery(pick);
                    setShowRoleList(false);
                  }
                }
              }}
            />

            {showRoleList && (
              <div ref={roleWrapperRef} className="mt-2 w-full max-w-full">
                <ScrollArea className="h-40 border border-border rounded-sm bg-popover w-full box-border overflow-hidden">
                  <div className="py-1 px-0">
                    {ROLES.filter((r) => r.toLowerCase().includes(roleQuery.toLowerCase())).map((role, idx) => (
                      <Button
                        key={role}
                        variant={exerciseType === role ? "default" : "ghost"}
                        className={`w-full justify-start mb-1 text-sm truncate text-left pl-4 pr-4 ${exerciseType === role ? "bg-dorso text-background hover:bg-dorso/90" : "text-foreground hover:bg-muted"} ${idx === roleFocusedIndex ? "ring-2 ring-primary" : ""}`}
                        onMouseEnter={() => setRoleFocusedIndex(idx)}
                        onClick={() => {
                          setExerciseType(role);
                          setRoleQuery(role);
                          setShowRoleList(false);
                        }}
                      >
                        {highlight(role, roleQuery)}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="relative">
            <Label className="text-foreground">STIMOLO - TECNICA PROGRESSIONE</Label>
            <Input
              value={selectedStimolo}
              onChange={(e) => { setSelectedStimolo(e.target.value); setStimoloQuery(e.target.value); setShowStimoloList(true); }}
              onFocus={() => setShowStimoloList(true)}
              placeholder={selectedStimolo ? "" : (placeholderData?.stimuloTecnica ?? "Cerca o seleziona stimolo...")}
              className="bg-input border-border text-foreground"
              onKeyDown={(e) => {
                const filtered = STIMOLI.filter((s) => s.toLowerCase().includes(stimoloQuery.toLowerCase()));
                if (e.key === "Escape") {
                  setShowStimoloList(false);
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setStimoloFocusedIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setStimoloFocusedIndex((i) => Math.max(0, i - 1));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const pick = filtered[stimoloFocusedIndex] || filtered[0];
                  if (pick) { setSelectedStimolo(pick); setShowStimoloList(false); }
                }
              }}
            />

            {showStimoloList && (
              <div ref={stimoloWrapperRef} className="mt-2 w-full max-w-full">
                <ScrollArea className="h-64 border border-border rounded-sm bg-popover w-full box-border overflow-hidden">
                  <div className="py-1 px-0">
                    {STIMOLI.filter((s) => s.toLowerCase().includes(stimoloQuery.toLowerCase())).map((stimolo, idx) => (
                      <Button
                        key={stimolo}
                        variant={selectedStimolo === stimolo ? "default" : "ghost"}
                        className={`w-full justify-start mb-1 text-sm truncate text-left pl-4 pr-4 ${selectedStimolo === stimolo ? "bg-dorso text-background hover:bg-dorso/90" : "text-foreground hover:bg-muted"} ${idx === stimoloFocusedIndex ? "ring-2 ring-primary" : ""}`}
                        onMouseEnter={() => setStimoloFocusedIndex(idx)}
                        onClick={() => { setSelectedStimolo(stimolo); setShowStimoloList(false); }}
                      >
                        {highlight(stimolo, stimoloQuery)}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* removed Incremento Settimana per richiesta */}

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
              disabled={!muscleGroup}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitLabel || "Aggiungi"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
