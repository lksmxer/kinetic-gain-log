
import { describe, test } from "bun:test";
import { calculateVolumeByExercise } from "./workoutCalculations";
import { Workout, Exercise, Set } from "@/models/workout";

describe("workoutCalculations benchmarks", () => {
  test("calculateVolumeByExercise performance", () => {
    // Create a large workout
    const exercises: Exercise[] = [];
    for (let i = 0; i < 100; i++) {
      const sets: Set[] = [];
      for (let j = 0; j < 10; j++) {
        sets.push({
          id: `s-${i}-${j}`,
          reps: 10,
          weight: 100,
          completed: true,
        });
      }
      exercises.push({
        id: `e-${i}`,
        name: `Exercise ${i}`,
        sets,
      });
    }

    const workout: Workout = {
      id: "w1",
      date: "2023-01-01",
      name: "Huge Workout",
      exercises,
    };

    const start = performance.now();
    const iterations = 1000;
    for (let i = 0; i < iterations; i++) {
      calculateVolumeByExercise(workout);
    }
    const end = performance.now();
    console.log(`calculateVolumeByExercise took average ${((end - start) / iterations).toFixed(4)}ms per call`);
  });
});
