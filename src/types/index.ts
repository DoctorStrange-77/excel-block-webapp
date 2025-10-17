export interface Exercise {
  name: string;
  group: string;
  video: string;
}

export interface ProgressionWeek {
  set: string | null;
  reps: string | null;
  info: string | null;
}

export interface Progression {
  name: string;
  weeks: ProgressionWeek[];
  rest: string;
  note: string | null;
}

export interface Athlete {
  firstname: string;
  lastname: string;
  email: string;
  dob: string;
  id?: string;
}

export interface WorkoutDay {
  exercises: Exercise[];
  progression?: Progression;
}

export interface WorkoutPlan {
  athleteId: string;
  name: string;
  days: WorkoutDay[];
  createdAt: string;
}
