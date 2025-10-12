export interface Exercise {
  id: string;
  day: number;
  muscleGroup: string;
  exerciseType: string;
  stimuloTecnica: string;
  incrementoSettimana: string;
}

export const MUSCLE_GROUPS = [
  { name: "FEMORALI", color: "femorali" },
  { name: "BICIPITI", color: "bicipiti" },
  { name: "DELTOIDE MEDIALE", color: "deltoide" },
  { name: "DORSO INFERIORE", color: "dorso" },
  { name: "SPALLE DORSALI", color: "spalle" },
  { name: "DELTOIDI", color: "deltoide" },
  { name: "GRAN DORSALE", color: "dorso" },
  { name: "OBLIQUI", color: "obliqui" },
];

export const STIMOLI = [
  "ACCESSORIO",
  "ANALITICO",
  "ATTIVAZIONE",
  "BASE",
  "BURNOUT",
  "CARDIO",
  "CIRCUITO",
  "COMPLEMENTARE",
  "COMPLEMENTARE CARENTE",
  "CORE",
  "DRENAGGIO",
  "FORZA TOTALE",
  "FORZA",
  "HIIT - TABATA",
  "MOBILITA'",
  "MULTIARTICOLARE",
];
