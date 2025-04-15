
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
    <div className={`bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-2">Rest Timer</h3>
      
      <div className="text-4xl font-bold text-center my-4 text-primary">
        {formatTime(seconds)}
      </div>
      
      <div className="flex justify-center space-x-2 mb-6">
        <Button
          onClick={toggleTimer}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20"
        >
          {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={resetTimer}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-secondary/20 border-secondary/20 hover:bg-secondary/30"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-6">
        <Slider
          value={[duration]}
          min={5}
          max={600}
          step={5}
          onValueChange={handleDurationChange}
          className="my-4"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {presetTimes.map((time) => (
          <Button
            key={time}
            variant="outline"
            size="sm"
            className="bg-secondary/20 border-secondary/20 hover:bg-secondary/30"
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
