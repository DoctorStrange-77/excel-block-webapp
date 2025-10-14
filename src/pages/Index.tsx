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
    <div className="min-h-screen bg-background p-8">
      {/* Header Principale */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Gestione Schede</h1>
        <p className="text-muted-foreground text-sm mb-6">Crea e gestisci le schede di allenamento personalizzate</p>
        
        {/* Pulsanti azioni principali */}
        <div className="flex gap-3 mb-8">
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
          >
            📊 Calcola volume
          </Button>
          <Button 
            variant="outline"
            className="font-semibold px-6 border-2"
          >
            🖨️ Stampa
          </Button>
          <Button 
            variant="outline"
            onClick={handleOpenSplitDialog}
            className="font-semibold px-6 border-2"
          >
            GESTIONE SPLIT
          </Button>
        </div>
      </header>

      {/* Sezione Informazioni Cliente */}
      <section className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Informazioni Cliente</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Riga 1 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cognome</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder=""
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Inizio</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="gg/mm/aaaa"
            />
          </div>

          {/* Riga 2 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Workout settimanali</label>
            <select
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
              className="w-full bg-background border border-primary rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer"
            >
              {Array.from({ length: 7 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} Workout</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Durata programmazione</label>
            <select
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer"
            >
              <option>4 settimane</option>
              <option>6 settimane</option>
              <option>8 settimane</option>
              <option>12 settimane</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Blocco programmazione</label>
            <input
              type="text"
              value={currentSplitName}
              onChange={(e) => setCurrentSplitName(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder=""
            />
          </div>

          {/* Riga 3 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Data Fine</label>
            <input
              type="text"
              className="w-full bg-background border border-border rounded-md px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="gg/mm/aaaa"
            />
          </div>
        </div>
      </section>

      {/* Sezione Workout */}
      <section className="bg-card border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Workout A</h2>
          <Button 
            variant="outline"
            className="font-semibold border-2"
          >
            Aggiungi esercizio
          </Button>
        </div>

        {/* Grafico Volume - compatto */}
        {Object.keys(volumeData).length > 0 && (
          <div className="mb-6">
            <VolumeBar data={volumeData} numDays={numDays} />
          </div>
        )}

        {/* Grid Allenamenti */}
        <div className="overflow-x-auto">
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
      </section>

      {/* Dialogs */}
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
    </div>
  );
};

export default Index;
