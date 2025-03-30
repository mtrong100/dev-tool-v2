import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiPlay,
  FiPause,
  FiRotateCw,
  FiFlag,
  FiClock,
  FiSave,
  FiCopy,
  FiStopCircle,
} from "react-icons/fi";

const OnlineStopwatchTimer = () => {
  // State for stopwatch
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // State for timer
  const [timerMode, setTimerMode] = useState("stopwatch"); // 'stopwatch' or 'timer'
  const [timerInput, setTimerInput] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timerTime, setTimerTime] = useState(0);
  const [timerEndTime, setTimerEndTime] = useState(null);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Format time for display
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      milliseconds: ms.toString().padStart(2, "0"),
    };
  };

  // Handle stopwatch start
  const startStopwatch = () => {
    if (!isRunning) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
      setIsRunning(true);
    }
  };

  // Handle stopwatch pause
  const pauseStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  // Handle stopwatch reset
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  // Record lap time
  const recordLap = () => {
    if (isRunning) {
      setLaps((prevLaps) => [time, ...prevLaps]);
      toast.success("Lap recorded!");
    }
  };

  // Handle timer input change
  const handleTimerInputChange = (e) => {
    const { name, value } = e.target;
    setTimerInput((prev) => ({
      ...prev,
      [name]: Math.max(0, parseInt(value) || 0),
    }));
  };

  // Start timer
  const startTimer = () => {
    const totalSeconds =
      timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    if (totalSeconds <= 0) {
      toast.error("Please set a valid time");
      return;
    }

    const endTime = Date.now() + totalSeconds * 1000;
    setTimerEndTime(endTime);
    setTimerTime(totalSeconds * 1000);

    intervalRef.current = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setTimerTime(0);
        setIsRunning(false);
        toast.success("Timer finished!");
        if (audioRef.current) {
          audioRef.current
            .play()
            .catch((e) => console.log("Audio play failed:", e));
        }
        return;
      }
      setTimerTime(remaining);
    }, 10);

    setIsRunning(true);
  };

  // Stop timer
  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerTime(0);
    setIsRunning(false);
    setTimerEndTime(null);
    setTimerInput({ hours: 0, minutes: 0, seconds: 0 });
  };

  // Copy current time to clipboard
  const copyTime = () => {
    const formatted =
      timerMode === "stopwatch" ? formatTime(time) : formatTime(timerTime);

    const timeString = `${formatted.hours}:${formatted.minutes}:${formatted.seconds}.${formatted.milliseconds}`;
    navigator.clipboard.writeText(timeString);
    toast.success("Time copied to clipboard!");
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Toggle between stopwatch and timer
  const toggleMode = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
    setTimerMode((prev) => (prev === "stopwatch" ? "timer" : "stopwatch"));
  };

  // Current time display
  const currentTime =
    timerMode === "stopwatch" ? formatTime(time) : formatTime(timerTime);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        {/* Hidden audio element for timer alarm */}
        <audio
          ref={audioRef}
          src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
          preload="auto"
        />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {timerMode === "stopwatch" ? "Online Stopwatch" : "Countdown Timer"}
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            {timerMode === "stopwatch"
              ? "Track time with precision"
              : "Set your countdown timer"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Mode Toggle */}
              <div className="flex justify-center">
                <button
                  onClick={toggleMode}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition ${
                    timerMode === "stopwatch"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <FiClock />
                  Stopwatch
                </button>
                <button
                  onClick={toggleMode}
                  className={`flex items-center gap-2 py-2 px-4 rounded-lg transition ${
                    timerMode === "timer"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <FiClock />
                  Timer
                </button>
              </div>

              {timerMode === "timer" ? (
                <>
                  {/* Timer Input */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Set Timer
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hours
                        </label>
                        <input
                          type="number"
                          name="hours"
                          value={timerInput.hours}
                          onChange={handleTimerInputChange}
                          min="0"
                          max="99"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={isRunning}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Minutes
                        </label>
                        <input
                          type="number"
                          name="minutes"
                          value={timerInput.minutes}
                          onChange={handleTimerInputChange}
                          min="0"
                          max="59"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={isRunning}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Seconds
                        </label>
                        <input
                          type="number"
                          name="seconds"
                          value={timerInput.seconds}
                          onChange={handleTimerInputChange}
                          min="0"
                          max="59"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="grid grid-cols-3 gap-3">
                    {!isRunning ? (
                      <button
                        onClick={startTimer}
                        className="col-span-3 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <FiPlay /> Start Timer
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={stopTimer}
                          className="py-3 px-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiPause /> Pause
                        </button>
                        <button
                          onClick={resetTimer}
                          className="py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition flex items-center justify-center gap-2 col-span-2"
                        >
                          <FiStopCircle /> Reset
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Stopwatch Controls */}
                  <div className="grid grid-cols-4 gap-3">
                    {!isRunning ? (
                      <button
                        onClick={startStopwatch}
                        className="col-span-3 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <FiPlay /> Start
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={pauseStopwatch}
                          className="py-3 px-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiPause /> Pause
                        </button>
                        <button
                          onClick={recordLap}
                          className="py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiFlag /> Lap
                        </button>
                      </>
                    )}
                    <button
                      onClick={resetStopwatch}
                      className={`py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition flex items-center justify-center gap-2 ${
                        isRunning ? "col-span-2" : ""
                      }`}
                    >
                      <FiRotateCw /> Reset
                    </button>
                  </div>

                  {/* Lap Times */}
                  {laps.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lap Times
                      </h3>
                      <div className="max-h-48 overflow-y-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Lap
                              </th>
                              <th className="text-right py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Time
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {laps.map((lap, index) => {
                              const formatted = formatTime(lap);
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-gray-100 dark:border-gray-800"
                                >
                                  <td className="py-2 text-sm text-gray-700 dark:text-gray-300">
                                    Lap {laps.length - index}
                                  </td>
                                  <td className="py-2 text-sm text-gray-700 dark:text-gray-300 text-right font-mono">
                                    {formatted.hours}:{formatted.minutes}:
                                    {formatted.seconds}.{formatted.milliseconds}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Common Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyTime}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg transition"
                >
                  <FiCopy /> Copy Time
                </button>
                <button
                  onClick={() =>
                    toast("Save feature would be implemented in a real app", {
                      icon: "ℹ️",
                    })
                  }
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition"
                >
                  <FiSave /> Save Session
                </button>
              </div>
            </div>
          </div>

          {/* Display Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center h-full">
              {/* Time Display */}
              <div className="text-center mb-8">
                <div className="text-6xl font-bold tabular-nums text-gray-800 dark:text-white mb-2">
                  {currentTime.hours}:{currentTime.minutes}:
                  {currentTime.seconds}
                </div>
                <div className="text-2xl font-mono text-gray-500 dark:text-gray-400">
                  .{currentTime.milliseconds}
                </div>
              </div>

              {/* Mode Info */}
              <div className="text-center">
                <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {timerMode === "stopwatch" ? "Stopwatch Mode" : "Timer Mode"}
                </div>
                {timerMode === "timer" && timerEndTime && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {timerTime > 0
                      ? "Ends at: " +
                        new Date(timerEndTime).toLocaleTimeString()
                      : "Timer complete!"}
                  </p>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
                <p>
                  {timerMode === "stopwatch"
                    ? "Click Start to begin timing, Lap to record splits"
                    : "Set your desired time and click Start Timer"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineStopwatchTimer;
