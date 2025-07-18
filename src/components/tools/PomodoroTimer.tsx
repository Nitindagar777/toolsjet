import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Bell, Settings, X } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  // Timer states
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cycles, setCycles] = useState<number>(0);
  
  // Settings states
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [pomodoroTime, setPomodoroTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [longBreakTime, setLongBreakTime] = useState<number>(15);
  const [autoStartBreaks, setAutoStartBreaks] = useState<boolean>(false);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState<boolean>(false);
  const [longBreakInterval, setLongBreakInterval] = useState<number>(4);

  // Audio ref for timer completion sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audioRef.current.volume = 0.5;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (audioRef.current) {
        audioRef.current.play();
      }
      
      // Handle cycle completion
      if (mode === 'pomodoro') {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        
        // Determine if it's time for a long break
        if (newCycles % longBreakInterval === 0) {
          setMode('longBreak');
          setTimeLeft(longBreakTime * 60);
          if (autoStartBreaks) setIsActive(true);
          else setIsActive(false);
        } else {
          setMode('shortBreak');
          setTimeLeft(shortBreakTime * 60);
          if (autoStartBreaks) setIsActive(true);
          else setIsActive(false);
        }
      } else {
        // Break completed, back to pomodoro
        setMode('pomodoro');
        setTimeLeft(pomodoroTime * 60);
        if (autoStartPomodoros) setIsActive(true);
        else setIsActive(false);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, cycles, pomodoroTime, shortBreakTime, longBreakTime, longBreakInterval, autoStartBreaks, autoStartPomodoros]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    
    // Reset to current mode's default time
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };

  // Change timer mode
  const changeMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    
    // Set time based on mode
    if (newMode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
  };

  // Apply settings
  const applySettings = () => {
    // Update current timer based on mode
    if (mode === 'pomodoro') {
      setTimeLeft(pomodoroTime * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakTime * 60);
    } else {
      setTimeLeft(longBreakTime * 60);
    }
    
    setShowSettings(false);
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    let totalTime = 0;
    
    if (mode === 'pomodoro') {
      totalTime = pomodoroTime * 60;
    } else if (mode === 'shortBreak') {
      totalTime = shortBreakTime * 60;
    } else {
      totalTime = longBreakTime * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Pomodoro Timer</h2>
        <p className="text-slate-300">Boost productivity with timed work sessions</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg overflow-hidden">
            <button
              onClick={() => changeMode('pomodoro')}
              className={`px-4 py-2 ${
                mode === 'pomodoro'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Pomodoro
            </button>
            <button
              onClick={() => changeMode('shortBreak')}
              className={`px-4 py-2 ${
                mode === 'shortBreak'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Short Break
            </button>
            <button
              onClick={() => changeMode('longBreak')}
              className={`px-4 py-2 ${
                mode === 'longBreak'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Long Break
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* Progress Circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-slate-700 stroke-current"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
            />
            <circle
              className={`${
                mode === 'pomodoro'
                  ? 'text-red-500'
                  : mode === 'shortBreak'
                  ? 'text-green-500'
                  : 'text-blue-500'
              } stroke-current`}
              strokeWidth="4"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * calculateProgress()) / 100}
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          {/* Timer Text */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-white mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-slate-300 capitalize">
              {mode === 'pomodoro' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggleTimer}
            className={`p-3 rounded-full ${
              isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            title={isActive ? 'Pause' : 'Start'}
          >
            {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300"
            title="Reset"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center">
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
            <Timer className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">
              Completed: <span className="text-white font-medium">{cycles}</span> cycles
            </span>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Timer Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Time Settings */}
                <div>
                  <label className="block text-slate-300 text-sm mb-2">
                    Pomodoro (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={pomodoroTime}
                    onChange={(e) => setPomodoroTime(parseInt(e.target.value) || 25)}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">
                    Short Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakTime}
                    onChange={(e) => setShortBreakTime(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">
                    Long Break (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakTime}
                    onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm mb-2">
                    Long Break Interval (pomodoros)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={longBreakInterval}
                    onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 4)}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                {/* Auto-start Settings */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoStartBreaks"
                    checked={autoStartBreaks}
                    onChange={() => setAutoStartBreaks(!autoStartBreaks)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="autoStartBreaks"
                    className="flex items-center cursor-pointer"
                  >
                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${autoStartBreaks ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${autoStartBreaks ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="ml-3 text-slate-300">Auto-start Breaks</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoStartPomodoros"
                    checked={autoStartPomodoros}
                    onChange={() => setAutoStartPomodoros(!autoStartPomodoros)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="autoStartPomodoros"
                    className="flex items-center cursor-pointer"
                  >
                    <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${autoStartPomodoros ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${autoStartPomodoros ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="ml-3 text-slate-300">Auto-start Pomodoros</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={applySettings}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pomodoro Technique Info */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-white font-medium mb-3">About the Pomodoro Technique</h3>
        <p className="text-slate-300 mb-3">
          The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="bg-red-500/20 p-1 rounded">
              <Bell className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-sm text-slate-300">
              <span className="text-white font-medium">Focus Time:</span> Work on a task for 25 minutes
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-green-500/20 p-1 rounded">
              <Bell className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-sm text-slate-300">
              <span className="text-white font-medium">Short Break:</span> Take a 5-minute break
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-blue-500/20 p-1 rounded">
              <Bell className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-sm text-slate-300">
              <span className="text-white font-medium">Long Break:</span> After 4 pomodoros, take a 15-minute break
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer; 