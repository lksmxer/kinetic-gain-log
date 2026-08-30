
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ className }) => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      
      // Notify user when timer completes
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest Timer Complete', {
          body: 'Time to start your next set!',
        });
      } else if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggleTimer = () => {
    if (seconds === 0) {
      resetTimer();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(duration);
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    if (!isActive) {
      setSeconds(newDuration);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const presetTimes = [30, 60, 90, 120, 180, 300];

  return (
    <div className={`font-mono p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-2 uppercase tracking-widest text-muted-foreground">Rest Timer</h3>
      
      <div className="text-6xl md:text-8xl font-bold text-center my-8 text-foreground tracking-widest">
        {formatTime(seconds)}
      </div>
      
      <div className="flex justify-center space-x-4 mb-10">
        <Button
          onClick={toggleTimer}
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-muted-foreground text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
          aria-label="Reset timer"
        >
          <RotateCcw className="h-7 w-7" />
        </Button>
      </div>
      
      <div className="mb-8 px-4 max-w-md mx-auto">
        <Slider
          value={[duration]}
          min={5}
          max={600}
          step={5}
          onValueChange={handleDurationChange}
          className="my-4"
          aria-label="Timer duration"
        />
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
        {presetTimes.map((time) => (
          <Button
            key={time}
            variant="outline"
            size="sm"
            className="border-foreground/30 hover:border-foreground rounded-full px-6 transition-colors"
            onClick={() => {
              setDuration(time);
              if (!isActive) setSeconds(time);
            }}
          >
            {formatTime(time)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Timer;
