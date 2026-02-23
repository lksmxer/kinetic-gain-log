
import { expect, test, describe } from "bun:test";
import { calculateOneRepMax, calculateVolumeByExercise, generateWarmupSets } from "./workoutCalculations";
import { Exercise } from "@/models/workout";

describe("calculateOneRepMax", () => {
  test("should return null for exercise with no sets", () => {
    const exercise: any = { id: "1", name: "Bench Press", sets: undefined };
    expect(calculateOneRepMax(exercise)).toBeNull();
  });

  test("should return null for exercise with empty sets", () => {
    const exercise: Exercise = { id: "1", name: "Bench Press", sets: [] };
    expect(calculateOneRepMax(exercise)).toBeNull();
  });

  test("should skip sets with missing weight or reps", () => {
    const exercise: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [
        { id: "s1", reps: 10, completed: true }, // missing weight
        { id: "s2", weight: 100, reps: 0, completed: true }, // zero reps
        { id: "s3", weight: 0, reps: 10, completed: true }, // zero weight
      ]
    };
    expect(calculateOneRepMax(exercise)).toBeNull();
  });

  test("should find the best set based on weight * reps", () => {
    const exercise: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [
        { id: "s1", weight: 100, reps: 1, completed: true }, // 100 * 1 = 100
        { id: "s2", weight: 80, reps: 5, completed: true },  // 80 * 5 = 400 (Best)
        { id: "s3", weight: 50, reps: 5, completed: true },  // 50 * 5 = 250
      ]
    };
    // 1RM = 80 * (36 / (37 - 5)) = 80 * (36 / 32) = 80 * 1.125 = 90
    expect(calculateOneRepMax(exercise)).toBe(90);
  });

  test("should handle 1 rep correctly (1RM = weight)", () => {
    const exercise: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [{ id: "s1", weight: 100, reps: 1, completed: true }]
    };
    expect(calculateOneRepMax(exercise)).toBe(100);
  });

  test("should handle large number of reps (capped at 36)", () => {
    const exercise36: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [{ id: "s1", weight: 100, reps: 36, completed: true }]
    };
    // 100 * (36 / (37 - 36)) = 3600
    expect(calculateOneRepMax(exercise36)).toBe(3600);

    const exercise40: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [{ id: "s1", weight: 100, reps: 40, completed: true }]
    };
    // Should still be 3600 because of Math.min(reps, 36)
    expect(calculateOneRepMax(exercise40)).toBe(3600);
  });

  test("should handle floating point weights", () => {
    const exercise: Exercise = {
      id: "1",
      name: "Bench Press",
      sets: [{ id: "s1", weight: 62.5, reps: 5, completed: true }]
    };
    // 62.5 * (36 / 32) = 62.5 * 1.125 = 70.3125
    expect(calculateOneRepMax(exercise)).toBe(70.3125);
  });
});

describe("calculateVolumeByExercise", () => {
  test("should calculate volume correctly for multiple exercises", () => {
    const workout = {
      id: "w1",
      date: "2023-01-01",
      name: "Upper Body",
      exercises: [
        {
          id: "e1",
          name: "Bench Press",
          sets: [
            { id: "s1", weight: 100, reps: 5, completed: true },
            { id: "s2", weight: 100, reps: 5, completed: true },
          ]
        },
        {
          id: "e2",
          name: "Rows",
          sets: [
            { id: "s3", weight: 80, reps: 10, completed: true },
          ]
        }
      ]
    } as any;

    const volumeData = calculateVolumeByExercise(workout);

    expect(volumeData).toHaveLength(2);
    expect(volumeData[0]).toEqual({
      exerciseName: "Bench Press",
      totalVolume: 1000,
      setCount: 2,
      totalReps: 10
    });
    expect(volumeData[1]).toEqual({
      exerciseName: "Rows",
      totalVolume: 800,
      setCount: 1,
      totalReps: 10
    });
  });

  test("should use default name for unnamed exercise", () => {
    const workout = {
      id: "w1",
      exercises: [{ id: "e1", sets: [] }]
    } as any;
    const volumeData = calculateVolumeByExercise(workout);
    expect(volumeData[0].exerciseName).toBe("Unnamed Exercise");
  });
});

describe("generateWarmupSets", () => {
  test("should generate correct warmup sets based on percentages", () => {
    const warmupSets = generateWarmupSets(100);

    // Percentages: 0.4, 0.6, 0.8, 0.9
    // Expected weights: 40, 60, 80, 90 (rounded to nearest 5)
    expect(warmupSets).toHaveLength(4);
    expect(warmupSets[0].weight).toBe(40);
    expect(warmupSets[1].weight).toBe(60);
    expect(warmupSets[2].weight).toBe(80);
    expect(warmupSets[3].weight).toBe(90);
  });

  test("should round weights to the nearest 5", () => {
    const warmupSets = generateWarmupSets(112);

    // 112 * 0.4 = 44.8 -> 45
    // 112 * 0.6 = 67.2 -> 65
    // 112 * 0.8 = 89.6 -> 90
    // 112 * 0.9 = 100.8 -> 100
    expect(warmupSets[0].weight).toBe(45);
    expect(warmupSets[1].weight).toBe(65);
    expect(warmupSets[2].weight).toBe(90);
    expect(warmupSets[3].weight).toBe(100);
  });
});
