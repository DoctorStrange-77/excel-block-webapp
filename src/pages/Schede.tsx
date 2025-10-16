import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Printer } from "lucide-react";

export default function Schede() {
  const [numWorkouts, setNumWorkouts] = useState<number>(0);
  const [duration, setDuration] = useState<number>(4);
  const [clientInfo, setClientInfo] = useState({
    lastname: "",
    firstname: "",
    startDate: "",
    endDate: "",
    block: "",
  });

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

      {numWorkouts > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Configurazione workout in sviluppo
        </div>
      )}
    </div>
  );
}
