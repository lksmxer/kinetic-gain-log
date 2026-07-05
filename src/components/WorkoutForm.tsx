import React, { useCallback } from 'react';
import { Exercise, Workout, workoutSchema } from '@/models/workout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Upload, Download } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import ExerciseItem from './ExerciseItem';
import { downloadWorkout } from '@/utils/fileUtils';
import { useToast } from '@/components/ui/use-toast';
import { createFile, openFilePicker } from '@/lib/googleDrive';

interface WorkoutFormProps {
  workout: Workout;
  onWorkoutChange: (workout: Workout) => void;
  onImport: () => void;
  user: unknown;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ workout, onWorkoutChange, onImport, user }) => {
  const { toast } = useToast();

  const handleSaveToGoogleDrive = async () => {
    const workoutJson = JSON.stringify(workout, null, 2);
    try {
      await createFile(workoutJson, `${workout.name}.json`);
      toast({
        title: 'Workout saved to Google Drive',
        description: `${workout.name} has been saved to your Google Drive.`,
      });
    } catch (error) {
      console.error('Failed to save to Google Drive', error);
      toast({
        title: 'Error saving to Google Drive',
        description: 'An error occurred while saving the workout.',
        variant: 'destructive',
      });
    }
  };

  const handleLoadFromGoogleDrive = () => {
    openFilePicker((doc) => {
      if (doc.action === google.picker.Action.PICKED) {
        const fileId = doc.docs[0].id;
        gapi.client.drive.files
          .get({
            fileId: fileId,
            alt: 'media',
          })
          .then((res) => {
            let dataToParse;
            if (typeof res.body === 'string') {
              try {
                dataToParse = JSON.parse(res.body);
              } catch (e) {
                console.error('Error parsing JSON from body', e);
                dataToParse = null;
              }
            } else {
              dataToParse = res.result;
            }

            const parsed = workoutSchema.safeParse(dataToParse);
            if (parsed.success) {
              onWorkoutChange(parsed.data);
              toast({
                title: 'Workout loaded from Google Drive',
                description: `Workout has been loaded from Google Drive.`,
              });
            } else {
              console.error('Validation error', parsed.error);
              toast({
                title: 'Error loading from Google Drive',
                description: 'The workout data is invalid or corrupted.',
                variant: 'destructive',
              });
            }
          })
          .catch((error) => {
            console.error('Failed to load from Google Drive', error);
            toast({
              title: 'Error loading from Google Drive',
              description: 'An error occurred while loading the workout.',
              variant: 'destructive',
            });
          });
      }
    });
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: uuidv4(),
      name: '',
      sets: [],
      notes: ''
    };
    
    onWorkoutChange({
      ...workout,
      exercises: [...workout.exercises, newExercise]
    });
  };

  const updateExercise = useCallback((updatedExercise: Exercise) => {
    onWorkoutChange({
      ...workout,
      exercises: workout.exercises.map(exercise =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    });
  }, [workout, onWorkoutChange]);

  const deleteExercise = useCallback((exerciseId: string) => {
    onWorkoutChange({
      ...workout,
      exercises: workout.exercises.filter(exercise => exercise.id !== exerciseId)
    });
  }, [workout, onWorkoutChange]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWorkoutChange({ ...workout, name: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWorkoutChange({ ...workout, date: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onWorkoutChange({ ...workout, notes: e.target.value });
  };

  const handleSave = () => {
    toast({
      title: "Workout saved",
      description: `${workout.name} has been saved.`,
    });
  };

  const handleExport = () => {
    downloadWorkout(workout);
    toast({
      title: "Workout exported",
      description: "Your workout has been exported to a text file.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <Input
            value={workout.name}
            onChange={handleNameChange}
            placeholder="Workout name"
            className="text-2xl font-bold bg-transparent border-none px-0 h-auto text-primary"
          />
          <Input
            type="date"
            value={workout.date}
            onChange={handleDateChange}
            className="bg-secondary/20 border-none"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onImport} className="bg-secondary/20 border-secondary/30">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport} className="bg-secondary/20 border-secondary/30">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleSaveToGoogleDrive} disabled={!user}>
            <Save className="h-4 w-4 mr-2" />
            Save to Google Drive
          </Button>
          <Button onClick={handleLoadFromGoogleDrive} disabled={!user}>
            <Download className="h-4 w-4 mr-2" />
            Load from Google Drive
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {workout.exercises.length > 0 ? (
          <div className="space-y-4">
            {workout.exercises.map(exercise => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onUpdate={updateExercise}
                onDelete={deleteExercise}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No exercises added yet</p>
              <Button onClick={addExercise} variant="outline" className="border-dashed border-border/50">
                <Plus className="h-4 w-4 mr-2" />
                Add your first exercise
              </Button>
            </CardContent>
          </Card>
        )}
        
        {workout.exercises.length > 0 && (
          <Button
            onClick={addExercise}
            variant="outline"
            className="w-full border-dashed border-border/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        )}
        
        <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base">Workout Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={workout.notes || ''}
              onChange={handleNotesChange}
              placeholder="Add notes about this workout..."
              className="min-h-[100px] bg-background/50 border-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutForm;
