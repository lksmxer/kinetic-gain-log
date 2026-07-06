
import { Workout, workoutSchema } from "@/models/workout";
import sjson from 'secure-json-parse';

// Format for export: JSON with custom formatting
export const exportWorkoutToText = (workout: Workout): string => {
  return JSON.stringify(workout, null, 2);
};

export const downloadWorkout = (workout: Workout) => {
  const sanitizedName = workout.name.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
  const sanitizedDate = workout.date.replace(/[^a-zA-Z0-9_\-]/g, '');
  const filename = `workout_${sanitizedName}_${sanitizedDate}.txt`;
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
    const parsed = sjson.parse(text, { protoAction: 'remove', constructorAction: 'remove' });
    const result = workoutSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    } else {
      console.error("Failed to validate workout data:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Failed to parse workout file:", error);
    return null;
  }
};
