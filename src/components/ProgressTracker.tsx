
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workout } from '@/models/workout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateOneRepMax, calculateVolumeByExercise } from '@/utils/workoutCalculations';

interface ProgressTrackerProps {
  workout: Workout;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ workout }) => {
  // Mock data for demonstration
  const progressData = [
    { date: '2025-04-10', squat: 225, bench: 185, deadlift: 315 },
    { date: '2025-04-12', squat: 230, bench: 190, deadlift: 325 },
    { date: '2025-04-14', squat: 235, bench: 190, deadlift: 335 },
    { date: '2025-04-15', squat: 240, bench: 195, deadlift: 345 },
  ];

  const volumeData = calculateVolumeByExercise(workout);

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
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="squat" stroke="#8884d8" name="Squat" />
                    <Line type="monotone" dataKey="bench" stroke="#82ca9d" name="Bench Press" />
                    <Line type="monotone" dataKey="deadlift" stroke="#ffc658" name="Deadlift" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Track your strength progress across key lifts over time.
              </p>
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
                  workout.exercises.map((exercise) => {
                    const oneRM = calculateOneRepMax(exercise);
                    return oneRM ? (
                      <div key={exercise.id} className="flex justify-between items-center">
                        <span className="font-medium">{exercise.name}</span>
                        <div className="space-y-1">
                          <div className="text-lg font-bold">{oneRM.toFixed(1)} kg</div>
                          <div className="text-xs text-muted-foreground">
                            Based on your heaviest set
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })
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
