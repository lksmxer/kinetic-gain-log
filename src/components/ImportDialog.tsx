
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { importWorkoutFromText } from '@/utils/fileUtils';
import { Workout } from '@/models/workout';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (workout: Workout) => void;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ open, onOpenChange, onImport }) => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleImportText = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter workout data to import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const workout = importWorkoutFromText(text);
      if (workout) {
        onImport(workout);
        onOpenChange(false);
        setText('');
        toast({
          title: "Import successful",
          description: `${workout.name} has been imported.`,
        });
      } else {
        throw new Error("Invalid workout data");
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "The workout data is invalid or corrupted.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      setText(fileContent);
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-secondary/95 backdrop-blur-sm border border-white/5 rounded-xl">
        <DialogHeader>
          <DialogTitle>Import Workout</DialogTitle>
          <DialogDescription>
            Paste your workout data or upload a workout file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your workout data here..."
            className="min-h-[200px] bg-background/50"
          />

          <div className="flex justify-between">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.json"
                className="hidden"
              />
              <Button variant="outline" onClick={triggerFileUpload} className="bg-secondary/20 border-secondary/30">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            <Button onClick={handleImportText}>Import</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
