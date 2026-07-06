import { expect, test, describe } from "bun:test";
import { workoutSchema } from "./workout";

describe("workoutSchema", () => {
  test("should parse a valid workout", () => {
    const validWorkout = {
      id: "w1",
      date: "2023-10-27",
      name: "Morning Push",
      exercises: [
        {
          id: "e1",
          name: "Bench Press",
          sets: [
            { id: "s1", reps: 10, weight: 60, completed: true },
            { id: "s2", reps: 8, weight: 70, completed: true },
          ],
          notes: "Felt strong"
        }
      ],
      notes: "Good workout"
    };

    const result = workoutSchema.safeParse(validWorkout);
    expect(result.success).toBe(true);
  });

  test("should fail on invalid workout structure (missing exercises array)", () => {
    const invalidWorkout = {
      id: "w1",
      date: "2023-10-27",
      name: "Morning Push",
    };

    const result = workoutSchema.safeParse(invalidWorkout);
    expect(result.success).toBe(false);
  });

  test("should fail if set is missing required fields", () => {
    const invalidWorkout = {
      id: "w1",
      date: "2023-10-27",
      name: "Morning Push",
      exercises: [
        {
          id: "e1",
          name: "Bench Press",
          sets: [
            { id: "s1", weight: 60, completed: true }, // missing reps
          ]
        }
      ]
    };

    const result = workoutSchema.safeParse(invalidWorkout);
    expect(result.success).toBe(false);
  });
});
