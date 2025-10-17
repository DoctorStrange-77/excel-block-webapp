import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Printer } from "lucide-react";
import progressionsData from "@/data/progressions.json";
import exercisesData from "@/data/exercises.json";
import { Progression, Exercise } from "@/types";

const progressions: Progression[] = progressionsData as Progression[];
const exercises: Exercise[] = exercisesData as Exercise[];


const EXERCISE_TYPES = ["FONDAMENTALE", "COMPLEMENTARE", "ACCESSORIO"];

// Configurazione tipi di esercizio con esercizi figli
const EXERCISE_GROUP_CONFIG: Record<string, { childCount: number; badge: string; label: string; bg: string; border: string }> = {
  "Single set": { childCount: 0, badge: "", label: "Single set", bg: "", border: "" },
  "Superset": { childCount: 1, badge: "SS", label: "Superset", bg: "hsl(142, 76%, 49%, 0.1)", border: "hsl(142, 76%, 49%)" },
  "Triset": { childCount: 2, badge: "TS", label: "Triset", bg: "hsl(271, 46%, 53%, 0.1)", border: "hsl(271, 46%, 53%)" },
  "Giant set": { childCount: 3, badge: "GS", label: "Giant set", bg: "hsl(204, 70%, 53%, 0.1)", border: "hsl(204, 70%, 53%)" },
  "Compound set": { childCount: 1, badge: "CP", label: "Compound set", bg: "hsl(48, 89%, 50%, 0.1)", border: "hsl(48, 89%, 50%)" },
};

const ADVANCED_EXERCISE_TYPES = Object.keys(EXERCISE_GROUP_CONFIG);

interface WorkoutExercise {
  type: string;
  progression: string;
  muscle: string;
  exercise: string;
  technique: string;
  weeks: Array<{ set: string; reps: string; info: string }>;
  rest: string;
  note: string;
  // Campi per gestire i gruppi (Superset, Triset, ecc.)
  groupType?: string; // tipo del gruppo (Superset, Triset, ecc.)
  isGroupHead?: boolean; // se è il capo gruppo
  isGroupChild?: boolean; // se è un figlio del gruppo
  groupId?: string; // ID univoco del gruppo
  childIndex?: number; // indice del figlio (0, 1, 2...)
}

export default function Schede() {
  const [numWorkouts, setNumWorkouts] = useState<number>(0);
  const [duration, setDuration] = useState<number>(4);
  const [workouts, setWorkouts] = useState<WorkoutExercise[][]>([]);
  const [clientInfo, setClientInfo] = useState({
    lastname: "",
    firstname: "",
    startDate: "",
    endDate: "",
    block: "",
  });

  useEffect(() => {
    if (numWorkouts === 0) {
      setWorkouts([]);
      return;
    }
    const initialWorkouts = Array.from({ length: numWorkouts }, () => [
      createEmptyExercise(),
    ]);
    setWorkouts(initialWorkouts);
  }, [numWorkouts]);

  // Aggiorna il numero di settimane quando cambia la durata
  useEffect(() => {
    if (workouts.length === 0) return;
    
    const newWorkouts = workouts.map(workout =>
      workout.map(exercise => ({
        ...exercise,
        weeks: Array.from({ length: duration }, (_, i) => 
          exercise.weeks[i] || { set: "", reps: "", info: "" }
        ),
      }))
    );
    setWorkouts(newWorkouts);
  }, [duration]);

  const createEmptyExercise = (): WorkoutExercise => ({
    type: "",
    progression: "",
    muscle: "",
    exercise: "",
    technique: "",
    weeks: Array.from({ length: duration }, () => ({ set: "", reps: "", info: "" })),
    rest: "",
    note: "",
    groupType: undefined,
    isGroupHead: false,
    isGroupChild: false,
    groupId: undefined,
    childIndex: undefined,
  });

  const addExercise = (workoutIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].push(createEmptyExercise());
    setWorkouts(newWorkouts);
  };

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex].splice(exerciseIndex, 1);
    setWorkouts(newWorkouts);
  };

  const updateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof WorkoutExercise,
    value: any
  ) => {
    const newWorkouts = [...workouts];
    newWorkouts[workoutIndex][exerciseIndex] = {
      ...newWorkouts[workoutIndex][exerciseIndex],
      [field]: value,
    };
    setWorkouts(newWorkouts);
  };

  const applyProgression = (workoutIndex: number, exerciseIndex: number, progressionName: string) => {
    const progression = progressions.find(p => p.name === progressionName);
    if (!progression) return;

    const newWorkouts = [...workouts];
    const exercise = newWorkouts[workoutIndex][exerciseIndex];
    
    exercise.progression = progressionName;
    exercise.weeks = progression.weeks.slice(0, duration).map(w => ({
      set: w.set || "",
      reps: w.reps || "",
      info: w.info || "",
    }));
    exercise.rest = progression.rest || "";
    exercise.note = progression.note || "";
    
    // Propaga i set ai figli se è un capo gruppo
    if (exercise.isGroupHead) {
      propagateSetsToChildren(workoutIndex, exerciseIndex);
    }
    
    setWorkouts(newWorkouts);
  };

  // Gestisce la selezione del tipo di esercizio avanzato (Superset, Triset, ecc.)
  const handleAdvancedTypeChange = (workoutIndex: number, exerciseIndex: number, advancedType: string) => {
    const config = EXERCISE_GROUP_CONFIG[advancedType] || EXERCISE_GROUP_CONFIG["Single set"];
    const newWorkouts = [...workouts];
    const exercise = newWorkouts[workoutIndex][exerciseIndex];

    // Se è Single set o nessun tipo, rimuovi il gruppo
    if (config.childCount === 0) {
      // Rimuovi tutti i figli del gruppo se esistono
      if (exercise.groupId) {
        newWorkouts[workoutIndex] = newWorkouts[workoutIndex].filter(
          (ex) => ex.groupId !== exercise.groupId || ex === exercise
        );
      }
      exercise.groupType = undefined;
      exercise.isGroupHead = false;
      exercise.groupId = undefined;
      setWorkouts(newWorkouts);
      return;
    }

    // Crea o aggiorna il gruppo
    const groupId = exercise.groupId || `group-${Date.now()}-${Math.random()}`;
    exercise.groupType = advancedType;
    exercise.isGroupHead = true;
    exercise.groupId = groupId;

    // Trova gli esercizi figli esistenti
    const existingChildren = newWorkouts[workoutIndex].filter(
      (ex) => ex.groupId === groupId && ex.isGroupChild
    );

    const diff = config.childCount - existingChildren.length;

    if (diff > 0) {
      // Aggiungi nuovi figli
      const insertIndex = exerciseIndex + 1 + existingChildren.length;
      for (let i = 0; i < diff; i++) {
        const childExercise = createEmptyExercise();
        childExercise.groupType = advancedType;
        childExercise.isGroupChild = true;
        childExercise.groupId = groupId;
        childExercise.childIndex = existingChildren.length + i;
        newWorkouts[workoutIndex].splice(insertIndex + i, 0, childExercise);
      }
    } else if (diff < 0) {
      // Rimuovi figli in eccesso
      const childrenToRemove = existingChildren.slice(config.childCount);
      newWorkouts[workoutIndex] = newWorkouts[workoutIndex].filter(
        (ex) => !childrenToRemove.includes(ex)
      );
    }

    // Aggiorna gli indici dei figli rimanenti
    newWorkouts[workoutIndex]
      .filter((ex) => ex.groupId === groupId && ex.isGroupChild)
      .forEach((child, idx) => {
        child.childIndex = idx;
      });

    setWorkouts(newWorkouts);
  };

  // Propaga i valori dei set dal capo gruppo ai figli
  const propagateSetsToChildren = (workoutIndex: number, exerciseIndex: number) => {
    const newWorkouts = [...workouts];
    const headExercise = newWorkouts[workoutIndex][exerciseIndex];

    if (!headExercise.isGroupHead || !headExercise.groupId) return;

    const children = newWorkouts[workoutIndex].filter(
      (ex) => ex.groupId === headExercise.groupId && ex.isGroupChild
    );

    children.forEach((child) => {
      child.weeks = child.weeks.map((week, weekIndex) => ({
        ...week,
        set: week.set || headExercise.weeks[weekIndex]?.set || "",
      }));
    });

    setWorkouts(newWorkouts);
  };

  // Funzione helper per ottenere la lettera dell'esercizio nel gruppo
  const getExerciseLetter = (exercise: WorkoutExercise): string => {
    if (exercise.isGroupHead) return "A";
    if (exercise.isGroupChild && exercise.childIndex !== undefined) {
      return String.fromCharCode(66 + exercise.childIndex); // B, C, D, ...
    }
    return "";
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestione Schede</h1>
        <p className="text-muted-foreground mt-1">
          Crea e gestisci le schede di allenamento personalizzate
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Calcola volume
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Stampa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informazioni Cliente</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lastname">Cognome</Label>
            <Input
              id="lastname"
              value={clientInfo.lastname}
              onChange={(e) => setClientInfo({ ...clientInfo, lastname: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstname">Nome</Label>
            <Input
              id="firstname"
              value={clientInfo.firstname}
              onChange={(e) => setClientInfo({ ...clientInfo, firstname: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inizio</Label>
            <Input
              id="startDate"
              type="date"
              value={clientInfo.startDate}
              onChange={(e) => setClientInfo({ ...clientInfo, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workouts">Workout settimanali</Label>
            <Select value={numWorkouts === 0 ? "" : numWorkouts.toString()} onValueChange={(v) => setNumWorkouts(parseInt(v))}>
              <SelectTrigger id="workouts">
                <SelectValue placeholder="Seleziona" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} Workout
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Durata programmazione</Label>
            <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} settiman{n === 1 ? "a" : "e"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="block">Blocco programmazione</Label>
            <Input
              id="block"
              value={clientInfo.block}
              onChange={(e) => setClientInfo({ ...clientInfo, block: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Fine</Label>
            <Input
              id="endDate"
              type="date"
              value={clientInfo.endDate}
              onChange={(e) => setClientInfo({ ...clientInfo, endDate: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {numWorkouts > 0 && workouts.map((workout, workoutIndex) => (
        <Card key={workoutIndex}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Workout {String.fromCharCode(65 + workoutIndex)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addExercise(workoutIndex)}
              >
                Aggiungi esercizio
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {workout.map((exercise, exerciseIndex) => {
              const config = exercise.groupType ? EXERCISE_GROUP_CONFIG[exercise.groupType] : null;
              const exerciseLetter = getExerciseLetter(exercise);
              const isPartOfGroup = exercise.isGroupHead || exercise.isGroupChild;

              return (
                <div key={exerciseIndex}>
                  {/* Titolo del gruppo (solo per il capo gruppo) */}
                  {exercise.isGroupHead && config && (
                    <div
                      className="p-2 font-semibold text-sm rounded-t-lg border-l-4"
                      style={{
                        backgroundColor: config.bg,
                        borderLeftColor: config.border,
                      }}
                    >
                      {config.label} A-{String.fromCharCode(65 + config.childCount)}
                    </div>
                  )}

                  <div
                    className="space-y-3 p-4 border rounded-lg"
                    style={
                      isPartOfGroup && config
                        ? {
                            backgroundColor: config.bg,
                            borderLeft: `4px solid ${config.border}`,
                          }
                        : {}
                    }
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {config && (
                          <span
                            className="px-2 py-1 text-xs font-bold rounded"
                            style={{
                              backgroundColor: config.border,
                              color: "white",
                            }}
                          >
                            {config.badge}
                          </span>
                        )}
                        <div>
                          <h4 className="font-semibold text-sm">
                            Esercizio {exerciseIndex + 1}
                            {exerciseLetter && ` (${exerciseLetter})`}
                          </h4>
                          {exercise.isGroupHead && (
                            <p className="text-xs text-muted-foreground">capo gruppo</p>
                          )}
                          {exercise.isGroupChild && (
                            <p className="text-xs text-muted-foreground">con esercizio sopra</p>
                          )}
                        </div>
                      </div>
                      {workout.length > 1 && !exercise.isGroupChild && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExercise(workoutIndex, exerciseIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      )}
                    </div>

                    {/* Prima riga: Tipo esercizio, Ruolo esercizio, Progressione */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* Solo per il capo gruppo: tipo esercizio (Superset, Triset, ecc.) */}
                      {!exercise.isGroupChild && (
                        <div className="space-y-2">
                          <Label>Tipo esercizio</Label>
                          <Select
                            value={exercise.groupType || "Single set"}
                            onValueChange={(v) => handleAdvancedTypeChange(workoutIndex, exerciseIndex, v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Single set" />
                            </SelectTrigger>
                            <SelectContent>
                              {ADVANCED_EXERCISE_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Ruolo esercizio</Label>
                        <Select
                          value={exercise.type}
                          onValueChange={(v) => updateExercise(workoutIndex, exerciseIndex, "type", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXERCISE_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Progressione</Label>
                        <Select
                          value={exercise.progression}
                          onValueChange={(v) => applyProgression(workoutIndex, exerciseIndex, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {progressions.map((prog) => (
                              <SelectItem key={prog.name} value={prog.name}>
                                {prog.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Seconda riga: Distretto, Esercizio, Tecnica esecutiva */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Distretto</Label>
                        <Input
                          value={exercise.muscle}
                          onChange={(e) => updateExercise(workoutIndex, exerciseIndex, "muscle", e.target.value)}
                          placeholder="Es: Petto"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Esercizio</Label>
                        <Select
                          value={exercise.exercise}
                          onValueChange={(v) => updateExercise(workoutIndex, exerciseIndex, "exercise", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={exerciseLetter ? `Esercizio (${exerciseLetter})` : "Seleziona"} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {exercises.map((ex) => (
                              <SelectItem key={ex.name} value={ex.name}>
                                {ex.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tecnica esecutiva</Label>
                        <Input
                          value={exercise.technique}
                          onChange={(e) => updateExercise(workoutIndex, exerciseIndex, "technique", e.target.value)}
                          placeholder="Es: Lenta"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h5 className="font-semibold text-sm">Settimane</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {exercise.weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium text-xs text-muted-foreground">
                              Week {weekIndex + 1}
                            </div>
                            <div className="space-y-2">
                               <Input
                                placeholder="Set"
                                value={week.set}
                                onChange={(e) => {
                                  const newWeeks = [...exercise.weeks];
                                  newWeeks[weekIndex].set = e.target.value;
                                  updateExercise(workoutIndex, exerciseIndex, "weeks", newWeeks);
                                  // Propaga i set ai figli se è capo gruppo
                                  if (exercise.isGroupHead) {
                                    propagateSetsToChildren(workoutIndex, exerciseIndex);
                                  }
                                }}
                                className="h-8 text-xs w-16"
                                maxLength={2}
                                disabled={exercise.isGroupChild}
                              />
                              <Input
                                placeholder="Reps"
                                value={week.reps}
                                onChange={(e) => {
                                  const newWeeks = [...exercise.weeks];
                                  newWeeks[weekIndex].reps = e.target.value;
                                  updateExercise(workoutIndex, exerciseIndex, "weeks", newWeeks);
                                }}
                                className="h-8 text-xs"
                              />
                              <Input
                                placeholder="Info"
                                value={week.info}
                                onChange={(e) => {
                                  const newWeeks = [...exercise.weeks];
                                  newWeeks[weekIndex].info = e.target.value;
                                  updateExercise(workoutIndex, exerciseIndex, "weeks", newWeeks);
                                }}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <Label>Rest</Label>
                        <Input
                          value={exercise.rest}
                          onChange={(e) => updateExercise(workoutIndex, exerciseIndex, "rest", e.target.value)}
                          placeholder="Es: 90-120 sec"
                          className="w-32"
                          maxLength={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Note</Label>
                        <Textarea
                          value={exercise.note}
                          onChange={(e) => updateExercise(workoutIndex, exerciseIndex, "note", e.target.value)}
                          placeholder="Note aggiuntive"
                          rows={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
