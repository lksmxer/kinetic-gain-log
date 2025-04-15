
import { Workout } from "@/models/workout";

// Format for export: JSON with custom formatting
export const exportWorkoutToText = (workout: Workout): string => {
  return JSON.stringify(workout, null, 2);
};

export const downloadWorkout = (workout: Workout) => {
  const filename = `workout_${workout.name.replace(/\s+/g, '_')}_${workout.date}.txt`;
  const text = exportWorkoutToText(workout);
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const importWorkoutFromText = (text: string): Workout | null => {
  try {
    return JSON.parse(text) as Workout;
  } catch (error) {
    console.error("Failed to parse workout file:", error);
    return null;
  }
};
