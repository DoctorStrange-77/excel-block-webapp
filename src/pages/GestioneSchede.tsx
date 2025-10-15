import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Printer, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GestioneSchede = () => {
  const navigate = useNavigate();
  const [cognome, setCognome] = useState("");
  const [nome, setNome] = useState("");
  const [dataInizio, setDataInizio] = useState("");
  const [workoutSettimanali, setWorkoutSettimanali] = useState("");
  const [durataProgrammazione, setDurataProgrammazione] = useState("");
  const [bloccoProgrammazione, setBloccoProgrammazione] = useState("");
  const [dataFine, setDataFine] = useState("");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-primary mb-2">Gestione Schede</h1>
        <p className="text-muted-foreground mb-8">Crea e gestisci le schede di allenamento personalizzate</p>

        {/* Pulsanti azione */}
        <div className="flex gap-3 mb-8">
          <Button
            variant="outline"
            className="gap-2"
          >
            <Calculator className="h-4 w-4" />
            Calcola volume
          </Button>
          <Button
            variant="outline"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Stampa
          </Button>
          <Button
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => navigate("/split")}
          >
            <FileText className="h-4 w-4" />
            TEMPLATE SPLIT
          </Button>
        </div>

        {/* Informazioni Cliente */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Informazioni Cliente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cognome">Cognome</Label>
              <Input
                id="cognome"
                value={cognome}
                onChange={(e) => setCognome(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInizio">Data Inizio</Label>
              <Input
                id="dataInizio"
                type="text"
                placeholder="gg/mm/aaaa"
                value={dataInizio}
                onChange={(e) => setDataInizio(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workoutSettimanali">Workout settimanali</Label>
              <Select value={workoutSettimanali} onValueChange={setWorkoutSettimanali}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Seleziona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durataProgrammazione">Durata programmazione</Label>
              <Select value={durataProgrammazione} onValueChange={setDurataProgrammazione}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="4 settimane" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 settimane</SelectItem>
                  <SelectItem value="8">8 settimane</SelectItem>
                  <SelectItem value="12">12 settimane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloccoProgrammazione">Blocco programmazione</Label>
              <Input
                id="bloccoProgrammazione"
                value={bloccoProgrammazione}
                onChange={(e) => setBloccoProgrammazione(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFine">Data Fine</Label>
              <Input
                id="dataFine"
                type="text"
                placeholder="gg/mm/aaaa"
                value={dataFine}
                onChange={(e) => setDataFine(e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestioneSchede;
