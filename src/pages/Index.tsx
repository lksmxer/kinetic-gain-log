
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkoutForm from '@/components/WorkoutForm';
import Timer from '@/components/Timer';
import ImportDialog from '@/components/ImportDialog';
import { Workout } from '@/models/workout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  const handleImportWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
  };

  return (
    <Layout>
      <Tabs defaultValue="workout" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workout" className="mt-4">
          <WorkoutForm onImport={() => setImportDialogOpen(true)} />
        </TabsContent>
        
        <TabsContent value="timer" className="mt-4">
          <Timer />
        </TabsContent>
      </Tabs>
      
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportWorkout}
      />
    </Layout>
  );
};

export default Index;
