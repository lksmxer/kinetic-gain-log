
import React, { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout, Exercise } from '@/models/workout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateOneRepMax, calculateVolumeByExercise } from '@/utils/workoutCalculations';

interface ProgressTrackerProps {
  workout: Workout;
}

const OneRMItem = memo(({ exercise }: { exercise: Exercise }) => {
  const oneRM = useMemo(() => calculateOneRepMax(exercise), [exercise]);

  if (!oneRM) return null;

  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{exercise.name}</span>
      <div className="space-y-1">
        <div className="text-lg font-bold">{oneRM.toFixed(1)} kg</div>
        <div className="text-xs text-muted-foreground">
          Based on your heaviest set
        </div>
      </div>
    </div>
  );
});

OneRMItem.displayName = 'OneRMItem';

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ workout }) => {
  const volumeData = useMemo(() => calculateVolumeByExercise(workout), [workout]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="strength">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="strength">Strength Progress</TabsTrigger>
          <TabsTrigger value="volume">Volume Analysis</TabsTrigger>
          <TabsTrigger value="1rm">One-Rep Max</TabsTrigger>
        </TabsList>
        
        <TabsContent value="strength">
          <div className="mb-8 mt-6">
            <h3 className="text-lg font-medium mb-6 text-foreground">Strength Progress Over Time</h3>
            <div className="h-80 w-full flex items-center justify-center text-muted-foreground bg-secondary/10 rounded-3xl">
              <p>Not enough data to display progress chart.</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="volume">
          <div className="mb-8 mt-6">
            <h3 className="text-lg font-medium mb-6 text-foreground">Workout Volume Analysis</h3>
            <div className="space-y-4 bg-secondary/5 rounded-3xl p-6">
              {volumeData.length > 0 ? (
                volumeData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center pb-4 border-b border-border/40 last:border-0 last:pb-0">
                    <span className="font-medium">{item.exerciseName}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold">{item.totalVolume} kg</span>
                      <span className="text-xs text-muted-foreground">
                        {item.setCount} sets × {item.totalReps} reps
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Add exercises to your workout to see volume analysis.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="1rm">
          <div className="mb-8 mt-6">
            <h3 className="text-lg font-medium mb-6 text-foreground">Estimated One-Rep Max</h3>
            <div className="space-y-4 bg-secondary/5 rounded-3xl p-6">
              {workout.exercises.length > 0 ? (
                workout.exercises.map((exercise) => (
                  <div key={exercise.id} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                    <OneRMItem exercise={exercise} />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Add exercises with weight and reps to calculate your estimated 1RM.
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;
