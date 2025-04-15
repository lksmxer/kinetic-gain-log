import React, { useState } from 'react';
import { Exercise, Set } from '@/models/workout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash2, Plus, Minus, ChevronDown, ChevronUp, Thermometer, Calculator } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { generateWarmupSets } from "@/utils/workoutCalculations";

interface ExerciseItemProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(true);
  const [showWarmupSets, setShowWarmupSets] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...exercise, name: e.target.value });
  };

  const addSet = () => {
    const newSet: Set = {
      id: uuidv4(),
      reps: 0,
      weight: 0,
      rir: 2,
      rpe: 7,
      completed: false
    };
    
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  const updateSet = (updatedSet: Set) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.map(set => set.id === updatedSet.id ? updatedSet : set)
    });
  };

  const deleteSet = (setId: string) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.filter(set => set.id !== setId)
    });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getHeaviestWeight = (): number => {
    if (!exercise.sets || exercise.sets.length === 0) return 0;
    
    return exercise.sets.reduce((max, set) => {
      return (set.weight && set.weight > max) ? set.weight : max;
    }, 0);
  };

  const warmupSets = generateWarmupSets(getHeaviestWeight());

  return (
    <Card className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Input
            value={exercise.name}
            onChange={handleNameChange}
            placeholder="Exercise name"
            className="font-medium text-lg bg-background/50 border-none"
          />
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="hover:bg-secondary/50"
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(exercise.id)}
              className="text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent>
          {getHeaviestWeight() > 0 && (
            <Collapsible className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowWarmupSets(!showWarmupSets)}
                    className="bg-secondary/20 border-secondary/30 w-full"
                  >
                    <Thermometer className="h-4 w-4 mr-2" />
                    {showWarmupSets ? "Hide Warm-up Sets" : "Show Warm-up Sets"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="space-y-3 my-3 p-3 bg-secondary/10 rounded-lg">
                  <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground px-1">
                    <div className="col-span-2">Warm-up</div>
                    <div className="col-span-5">Weight</div>
                    <div className="col-span-5">Reps</div>
                  </div>
                  
                  {warmupSets.map((set, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center text-sm">
                      <div className="col-span-2">Set {index + 1}</div>
                      <div className="col-span-5">{set.weight} kg</div>
                      <div className="col-span-5">{set.reps} reps</div>
                    </div>
                  ))}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Based on your working weight of {getHeaviestWeight()} kg
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {exercise.sets.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground px-1">
                <div className="col-span-1">#</div>
                <div className="col-span-2">Weight</div>
                <div className="col-span-2">Reps</div>
                <div className="col-span-3">RIR</div>
                <div className="col-span-3">RPE</div>
                <div className="col-span-1"></div>
              </div>
              
              {exercise.sets.map((set, index) => (
                <SetRow
                  key={set.id}
                  set={set}
                  index={index}
                  onChange={updateSet}
                  onDelete={deleteSet}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No sets added yet
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={addSet}
            className="w-full mt-4 border-dashed border-border/50 bg-secondary/20 hover:bg-secondary/40"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Set
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

interface SetRowProps {
  set: Set;
  index: number;
  onChange: (set: Set) => void;
  onDelete: (id: string) => void;
}

const SetRow: React.FC<SetRowProps> = ({ set, index, onChange, onDelete }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'weight' | 'reps') => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...set, [field]: value });
  };

  const handleRirChange = (values: number[]) => {
    const rir = values[0];
    // Update RPE based on RIR (RPE = 10 - RIR)
    const rpe = 10 - rir;
    onChange({ ...set, rir, rpe });
  };

  const handleRpeChange = (values: number[]) => {
    const rpe = values[0];
    // Update RIR based on RPE (RIR = 10 - RPE)
    const rir = 10 - rpe;
    onChange({ ...set, rpe, rir });
  };

  const handleComplete = () => {
    onChange({ ...set, completed: !set.completed });
  };

  return (
    <div className={cn(
      "grid grid-cols-12 gap-2 items-center py-2 px-1 rounded-lg",
      set.completed ? "bg-primary/10" : "bg-secondary/20"
    )}>
      <div className="col-span-1 text-sm font-medium">{index + 1}</div>
      
      <div className="col-span-2">
        <Input
          type="number"
          value={set.weight || ''}
          onChange={(e) => handleInputChange(e, 'weight')}
          className="h-8 text-center bg-background/50 border-none"
          placeholder="kg"
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          value={set.reps || ''}
          onChange={(e) => handleInputChange(e, 'reps')}
          className="h-8 text-center bg-background/50 border-none"
          placeholder="#"
        />
      </div>
      
      <div className="col-span-3">
        <div className="flex flex-col items-center">
          <Slider
            value={[set.rir || 2]}
            min={0}
            max={5}
            step={0.5}
            onValueChange={handleRirChange}
          />
          <span className="text-xs mt-1">{set.rir}</span>
        </div>
      </div>
      
      <div className="col-span-3">
        <div className="flex flex-col items-center">
          <Slider
            value={[set.rpe || 8]}
            min={5}
            max={10}
            step={0.5}
            onValueChange={handleRpeChange}
          />
          <span className="text-xs mt-1">{set.rpe}</span>
        </div>
      </div>
      
      <div className="col-span-1 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(set.id)}
          className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default ExerciseItem;
