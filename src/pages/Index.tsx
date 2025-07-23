
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkoutForm from '@/components/WorkoutForm';
import Timer from '@/components/Timer';
import ImportDialog from '@/components/ImportDialog';
import { Workout } from '@/models/workout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import ProgressTracker from '@/components/ProgressTracker';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [workout, setWorkout] = useState<Workout>({
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    name: 'New Workout',
    exercises: [],
    notes: ''
  });
  const { theme, setTheme } = useTheme();

  const handleImportWorkout = (importedWorkout: Workout) => {
    setWorkout(importedWorkout);
  };

  return (
    <Layout>
      {(user) => (
        <>
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="bg-secondary/20 border-secondary/30"
            >
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
          </div>

          <Tabs defaultValue="workout" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="mt-4">
              <WorkoutForm
                workout={workout}
                onWorkoutChange={setWorkout}
                onImport={() => setImportDialogOpen(true)}
                user={user}
              />
            </TabsContent>

            <TabsContent value="timer" className="mt-4">
              <Timer />
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <ProgressTracker workout={workout} />
            </TabsContent>
          </Tabs>

          <ImportDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            onImport={handleImportWorkout}
          />
        </>
      )}
    </Layout>
  );
};

export default Index;
