
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WorkoutForm from '@/components/WorkoutForm';
import Timer from '@/components/Timer';
import ImportDialog from '@/components/ImportDialog';
import { Workout } from '@/models/workout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [workout, setWorkout] = useState<Workout>({
    id: uuidv4(),
    date: new Date().toISOString().split('T')[0],
    name: 'New Workout',
    exercises: [],
    notes: ''
  });

  const handleImportWorkout = (importedWorkout: Workout) => {
    setWorkout(importedWorkout);
  };

  return (
    <Layout>
      <Tabs defaultValue="workout" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workout" className="mt-4">
          <WorkoutForm 
            workout={workout}
            onWorkoutChange={setWorkout}
            onImport={() => setImportDialogOpen(true)}
          />
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
