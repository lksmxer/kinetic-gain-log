
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
          <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl mb-4">
            <CardHeader>
              <CardTitle className="text-base">Strength Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
                <p>Not enough data to display progress chart.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume">
          <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl mb-4">
            <CardHeader>
              <CardTitle className="text-base">Workout Volume Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {volumeData.length > 0 ? (
                  volumeData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
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
                  <p className="text-muted-foreground">
                    Add exercises to your workout to see volume analysis.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="1rm">
          <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl mb-4">
            <CardHeader>
              <CardTitle className="text-base">Estimated One-Rep Max</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workout.exercises.length > 0 ? (
                  workout.exercises.map((exercise) => (
                    <OneRMItem key={exercise.id} exercise={exercise} />
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Add exercises with weight and reps to calculate your estimated 1RM.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTracker;
