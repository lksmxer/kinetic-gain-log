import React, { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import WorkoutForm from '@/components/WorkoutForm';
import Timer from '@/components/Timer';
import ImportDialog from '@/components/ImportDialog';
import { Workout } from '@/models/workout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import ProgressTracker from '@/components/ProgressTracker';
import { MoonIcon, SunIcon, Zap } from 'lucide-react';
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

  // Dynamic base URL for GitHub Pages compatibility
  const zoneUrl = `${import.meta.env.BASE_URL}zone-os.html`;

  const handleImportWorkout = useCallback((importedWorkout: Workout) => {
    setWorkout(importedWorkout);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const handleOpenImportDialog = useCallback(() => {
    setImportDialogOpen(true);
  }, []);

  return (
    <Layout>
      {(user) => (
        <>
          <div className="flex justify-between items-center mb-4">
            <a href={zoneUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-secondary/20 border-secondary/30 hover:bg-secondary/40 font-semibold text-xs"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                ZONE_OS Calculator
              </Button>
            </a>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-secondary/20 border-secondary/30"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </Button>
          </div>

          <Tabs defaultValue="workout" className="mb-6">
            <TabsList className="flex w-full overflow-x-auto">
              <TabsTrigger value="workout" className="flex-1 min-w-fit">Workout</TabsTrigger>
              <TabsTrigger value="timer" className="flex-1 min-w-fit">Timer</TabsTrigger>
              <TabsTrigger value="progress" className="flex-1 min-w-fit">Progress</TabsTrigger>
              <TabsTrigger value="zone" className="flex-1 min-w-fit">ZONE_OS</TabsTrigger>
            </TabsList>

            <TabsContent value="workout" className="mt-4">
              <WorkoutForm
                workout={workout}
                onWorkoutChange={setWorkout}
                onImport={handleOpenImportDialog}
                user={user}
              />
            </TabsContent>

            <TabsContent value="timer" className="mt-4">
              <Timer />
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              <ProgressTracker workout={workout} />
            </TabsContent>

            <TabsContent value="zone" className="mt-4">
              <div className="w-full h-[85vh] rounded-xl overflow-hidden border border-border">
                <iframe
                  src={zoneUrl}
                  className="w-full h-full border-0"
                  title="ZONE_OS Flow State System"
                />
              </div>
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
