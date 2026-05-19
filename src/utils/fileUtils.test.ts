
import { expect, test, describe, spyOn, afterEach } from "bun:test";
import { exportWorkoutToText, importWorkoutFromText } from "./fileUtils";
import { Workout } from "@/models/workout";

const mockWorkout: Workout = {
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

describe("fileUtils", () => {
  afterEach(() => {
    // Restore console.error if it was mocked/spied
    // @ts-ignore
    if (console.error.mockRestore) {
      // @ts-ignore
      console.error.mockRestore();
    }
  });

  describe("exportWorkoutToText", () => {
    test("should correctly serialize a workout to JSON string", () => {
      const result = exportWorkoutToText(mockWorkout);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual(mockWorkout);
      expect(result).toContain('"name": "Morning Push"');
    });
  });

  describe("importWorkoutFromText", () => {
    test("should correctly parse a valid workout JSON string", () => {
      const jsonString = JSON.stringify(mockWorkout);
      const result = importWorkoutFromText(jsonString);
      expect(result).toEqual(mockWorkout);
    });

    test("should return null and log error for invalid JSON", () => {
      const consoleSpy = spyOn(console, "error");
      const invalidJson = "{ invalid json }";

      const result = importWorkoutFromText(invalidJson);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      const lastCall = consoleSpy.mock.calls[0];
      expect(lastCall[0]).toContain("Failed to parse workout file:");
    });

    test("should return null and log error for JSON that fails schema validation", () => {
      const consoleSpy = spyOn(console, "error");
      const invalidWorkout = {
        __fail: true,
        id: "w1",
        name: "Morning Push",
        exercises: []
      };
      const jsonString = JSON.stringify(invalidWorkout);

      const result = importWorkoutFromText(jsonString);

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      const lastCall = consoleSpy.mock.calls[0];
      expect(lastCall[0]).toContain("Failed to validate workout data:");
    });
  });
});
