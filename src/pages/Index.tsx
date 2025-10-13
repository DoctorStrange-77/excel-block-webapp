import { useState } from "react";
import { Exercise } from "@/types/training";
import { VolumeBar } from "@/components/VolumeBar";
import { TrainingGrid } from "@/components/TrainingGrid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SplitDialog from "@/components/SplitDialog";
import SaveSplitDialog from "@/components/SaveSplitDialog";
import ResetConfirmDialog from "@/components/ResetConfirmDialog";
import CenteredAlertDialog from "@/components/CenteredAlertDialog";
import DeleteSplitConfirmDialog from "@/components/DeleteSplitConfirmDialog";
import ConfirmOverwriteDialog from "@/components/ConfirmOverwriteDialog";

const Index = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSplitDialogOpen, setIsSplitDialogOpen] = useState(false);
  const [numDays, setNumDays] = useState<number>(7);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [currentSplitName, setCurrentSplitName] = useState<string>("");

  // build volume data but exclude 'ATTIVAZIONE' exercises from the chart
  const volumeData = exercises.reduce((acc, exercise) => {
    if ((exercise.muscleGroup || '').toUpperCase() === 'ATTIVAZIONE') return acc;
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

  const handleUpdateExercise = (exercise: Exercise) => {
    setExercises((prev) => prev.map((ex) => (ex.id === exercise.id ? exercise : ex)));
    toast.success("Esercizio aggiornato");
  };

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleReset = () => {
    setIsResetDialogOpen(true);
  };

  const handleDoReset = () => {
    setExercises([]);
    setNotes({});
    setCurrentSplitName("");
    setNumDays(7);
    setIsResetDialogOpen(false);
    toast.success("Blocco resettato");
  };

  const handleSaveSplit = () => {
    // open the styled save dialog instead
    setIsSaveDialogOpen(true);
  };

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleDoSave = (name: string) => {
    const key = name.trim() || `split-${new Date().toISOString()}`;
    try {
      const stored = JSON.parse(localStorage.getItem("savedSplits" ) || "{}");
      if (stored[key]) {
        // show centered dialog instead of toast
        setAlertMessage("Nome split già presente. Inserisci un nome diverso.");
        setIsAlertOpen(true);
        return false;
      }
      stored[key] = { savedAt: Date.now(), exercises, notes, numDays };
      localStorage.setItem("savedSplits", JSON.stringify(stored));
      toast.success(`Split salvato come: ${key}`);
      setCurrentSplitName(key);
      return true;
    } catch (e) {
      console.error(e);
      toast.error("Impossibile salvare lo split");
      return false;
    }
  };

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleOpenSplitDialog = () => {
    setIsSplitDialogOpen(true);
  };

  const handleDeleteCurrentSplit = () => {
    const key = currentSplitName.trim();
    if (!key) {
      toast.error("Nessun split selezionato");
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem("savedSplits") || "{}");
      if (!stored[key]) {
        toast.error("Split non trovato");
        return;
      }
      delete stored[key];
      localStorage.setItem("savedSplits", JSON.stringify(stored));
      toast.success(`Split cancellato: ${key}`);
      setCurrentSplitName("");
      // if dialog open, refresh/close
      setIsSplitDialogOpen(false);
      setIsDeleteDialogOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Impossibile cancellare lo split");
    }
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isOverwriteConfirmOpen, setIsOverwriteConfirmOpen] = useState(false);

  const handleRestoreSplit = (payload: { name?: string; exercises: Exercise[]; notes?: Record<number,string>; numDays?: number; }) => {
    setExercises(payload.exercises || []);
    if (payload.notes) setNotes(payload.notes);
    if (payload.numDays) setNumDays(payload.numDays);
    if (payload.name) setCurrentSplitName(payload.name);
    toast.success("Split caricato");
  };

  const handleConfirmOverwrite = () => {
    const key = currentSplitName.trim();
    if (!key) return;
    try {
      const stored = JSON.parse(localStorage.getItem("savedSplits") || "{}");
      stored[key] = { savedAt: Date.now(), exercises, notes, numDays };
      localStorage.setItem("savedSplits", JSON.stringify(stored));
      toast.success(`Split aggiornato: ${key}`);
    } catch (e) {
      console.error(e);
      toast.error("Impossibile salvare le modifiche allo split");
    }
  };

  // Calculate dynamic width for aligned elements
  const gapSize = 8; // 0.5rem = 8px
  const alignedWidth = numDays * 300 + (numDays - 1) * gapSize;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header professionale */}
      <div className="mb-8">
        {/* Sezione superiore: titolo, dropdown e pulsanti */}
        <div className="flex items-center gap-6 mb-4">
          <h1 className="text-5xl font-black text-primary tracking-tight">SPLIT</h1>
          <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-md border border-border">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">W.O. Settimanali</label>
            <select
              aria-label="W.O. Settimanali"
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
              className="bg-card text-primary font-bold text-lg px-3 py-1.5 rounded-md border border-primary/30 hover:border-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Pulsanti azioni */}
        <div className="flex gap-2 mb-4">
          <Button 
            size="sm" 
            onClick={handleReset} 
            className="h-9 px-4 bg-primary/90 hover:bg-primary text-primary-foreground font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            RESET
          </Button>
          <Button 
            size="sm" 
            onClick={handleOpenSplitDialog} 
            className="h-9 px-4 bg-primary/90 hover:bg-primary text-primary-foreground font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            APRI SPLIT
          </Button>
          <Button
            size="sm"
            className="h-9 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold shadow-md transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => {
              const key = currentSplitName.trim();
              if (!key) {
                toast.error("Nessuno split aperto da salvare. Apri uno split o usa 'SALVA SPLIT'");
                return;
              }
              setIsOverwriteConfirmOpen(true);
            }}
            disabled={!currentSplitName}
            aria-disabled={!currentSplitName}
          >
            SALVA MODIFICA
          </Button>
          <Button 
            size="sm" 
            onClick={handleSaveSplit} 
            className="h-9 px-4 bg-primary/90 hover:bg-primary text-primary-foreground font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
          >
            SALVA SPLIT
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            className="h-9 px-4 font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            CANCELLA SPLIT
          </Button>
        </div>

        {/* Campo nome split allineato dinamicamente con i giorni */}
        <div className="mb-4">
          <input
            value={currentSplitName}
            onChange={(e) => setCurrentSplitName(e.target.value)}
            placeholder="NOME SPLIT CORRENTE"
            style={{ width: `${alignedWidth}px` }}
            className="bg-card/50 backdrop-blur-sm placeholder:text-muted-foreground text-primary px-4 py-2.5 rounded-md border-2 border-primary/40 hover:border-primary/60 focus:border-primary text-center font-bold uppercase text-xl tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Nome split corrente"
          />
        </div>
      </div>

      <SplitDialog
        open={isSplitDialogOpen}
        onOpenChange={setIsSplitDialogOpen}
        onRestore={handleRestoreSplit}
        currentExercises={exercises}
        currentNotes={notes}
        currentNumDays={numDays}
      />

      <SaveSplitDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen} onSave={handleDoSave} />
  <ResetConfirmDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen} onConfirm={handleDoReset} />
        <CenteredAlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen} message={alertMessage} />
  <DeleteSplitConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteCurrentSplit} />
  <ConfirmOverwriteDialog open={isOverwriteConfirmOpen} onOpenChange={setIsOverwriteConfirmOpen} onConfirm={handleConfirmOverwrite} splitName={currentSplitName} />

      {/* Contenuto principale: shared scroll container so VolumeBar and TrainingGrid align */}
      <div className="flex flex-col gap-4">
        <div className="mt-6 overflow-x-auto">
          <div className="inline-block min-w-full">
            {Object.keys(volumeData).length > 0 && (
              <div className="mb-6">
                <VolumeBar data={volumeData} numDays={numDays} />
              </div>
            )}

            <TrainingGrid
              exercises={exercises}
              onAddExercise={handleAddExercise}
              onDeleteExercise={handleDeleteExercise}
              onUpdateExercise={handleUpdateExercise}
              onReset={handleReset}
              numDays={numDays}
              notes={notes}
              onNoteChange={(day, text) => setNotes((prev) => ({ ...prev, [day]: text }))}
              noScrollContainer
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
