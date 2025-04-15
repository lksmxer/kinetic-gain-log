
export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight?: number;
  rir?: number; // Reps In Reserve
  rpe?: number; // Rate of Perceived Exertion
  completed: boolean;
}

export interface Workout {
  id: string;
  date: string;
  name: string;
  exercises: Exercise[];
  notes?: string;
}
