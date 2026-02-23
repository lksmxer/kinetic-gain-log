import { z } from "zod";

export const setSchema = z.object({
  id: z.string(),
  reps: z.number(),
  weight: z.number().optional(),
  rir: z.number().optional(),
  rpe: z.number().optional(),
  completed: z.boolean(),
});

export type Set = z.infer<typeof setSchema>;

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  sets: z.array(setSchema),
  notes: z.string().optional(),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const workoutSchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  exercises: z.array(exerciseSchema),
  notes: z.string().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;
