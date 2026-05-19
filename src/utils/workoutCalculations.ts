
import { Exercise, Set, Workout } from "@/models/workout";

export const calculateOneRepMax = (exercise: Exercise): number | null => {
  if (!exercise.sets || exercise.sets.length === 0) return null;
  
  // Find the set with the highest weight × reps value
  const bestSet = exercise.sets.reduce((best, current) => {
    // Skip sets with no weight or reps data
    if (!current.weight || !current.reps) return best;
    
    const currentValue = current.weight * current.reps;
    const bestValue = best ? (best.weight || 0) * (best.reps || 0) : 0;
    
    return currentValue > bestValue ? current : best;
  }, null as Set | null);
  
  if (!bestSet || !bestSet.weight || !bestSet.reps) return null;
  
  // Brzycki formula: 1RM = weight × (36 / (37 - reps))
  return bestSet.weight * (36 / (37 - Math.min(bestSet.reps, 36)));
};

export interface VolumeData {
  exerciseName: string;
  totalVolume: number;
  setCount: number;
  totalReps: number;
}

export const calculateVolumeByExercise = (workout: Workout): VolumeData[] => {
  const exercises = workout.exercises;
  const numExercises = exercises.length;
  const result = new Array(numExercises);

  for (let i = 0; i < numExercises; i++) {
    const exercise = exercises[i];
    let totalVolume = 0;
    let totalReps = 0;
    let setCount = 0;
    
    const sets = exercise.sets;
    if (sets) {
      const numSets = sets.length;
      for (let j = 0; j < numSets; j++) {
        const set = sets[j];
        const weight = set.weight;
        const reps = set.reps;

        if (weight && reps) {
          totalVolume += weight * reps;
          totalReps += reps;
          setCount++;
        }
      }
    }
    
    result[i] = {
      exerciseName: exercise.name || 'Unnamed Exercise',
      totalVolume,
      setCount,
      totalReps
    };
  }

  return result;
};

export const generateWarmupSets = (workingWeight: number): { weight: number, reps: number }[] => {
  // Common warm-up protocol: 
  // - 40% × 10 reps
  // - 60% × 8 reps
  // - 80% × 5 reps
  // - 90% × 3 reps
  // - 100% × working reps
  
  const warmupSets = [
    { percentage: 0.4, reps: 10 },
    { percentage: 0.6, reps: 8 },
    { percentage: 0.8, reps: 5 },
    { percentage: 0.9, reps: 3 },
  ];
  
  return warmupSets.map(set => ({
    weight: Math.round(workingWeight * set.percentage / 5) * 5, // Round to nearest 5
    reps: set.reps
  }));
};
