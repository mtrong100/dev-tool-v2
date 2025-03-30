/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiPlay,
  FiPause,
  FiDownload,
  FiUpload,
  FiCopy,
  FiVolume2,
  FiStopCircle,
} from "react-icons/fi";

const TextToSpeech = () => {
  // State management
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [audioBlob, setAudioBlob] = useState(null);
  const utteranceRef = useRef(null);

  // Initialize voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !voice) {
        setVoice(availableVoices.find((v) => v.default) || availableVoices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [voice]);

  // When F5 stop voice speech
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handle speech
  const handleSpeech = useCallback(
    (action) => {
      if (!text.trim()) {
        toast.error("Please enter some text first");
        return;
      }

      const synth = window.speechSynthesis;

      if (action === "play") {
        if (isPaused) {
          synth.resume();
          setIsPlaying(true);
          setIsPaused(false);
          return;
        }

        // Cancel any current speech
        synth.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        utterance.onpause = () => {
          setIsPlaying(false);
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
        setIsPlaying(true);

        // For browsers that support audio capture (limited support)
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const mediaStreamDestination =
            audioContext.createMediaStreamDestination();
          // Note: Actual capture of speech synthesis audio is not directly supported
          // This is a placeholder for future implementations
        } catch (e) {
          console.log("Audio capture not supported", e);
        }
      } else if (action === "pause") {
        synth.pause();
        setIsPlaying(false);
        setIsPaused(true);
      } else if (action === "stop") {
        synth.cancel();
        setIsPlaying(false);
        setIsPaused(false);
      }
    },
    [text, voice, rate, pitch, volume, isPaused]
  );

  // Copy text to clipboard
  const copyText = useCallback(() => {
    if (!text.trim()) {
      toast.error("No text to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  }, [text]);

  // Download audio (simulated since direct capture isn't possible)
  const downloadAudio = useCallback(() => {
    if (!text.trim()) {
      toast.error("No text to convert");
      return;
    }
    toast("Audio download is simulated in this demo", { icon: "ℹ️" });
  }, [text]);

  // Handle file upload
  const handleUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      toast.error("File too large (max 100KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
      toast.success("Text loaded from file!");
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Text to Speech
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Convert your text into natural sounding speech
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text to Speak
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the text you want to convert to speech..."
                />
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice
                </label>
                <select
                  value={voice ? voice.voiceURI : ""}
                  onChange={(e) => {
                    const selectedVoice = voices.find(
                      (v) => v.voiceURI === e.target.value
                    );
                    setVoice(selectedVoice);
                  }}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={voices.length === 0}
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.default && "— Default"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speech Controls */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSpeech("play")}
                  disabled={isPlaying}
                  className={`flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition ${
                    isPlaying ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiPlay /> Play
                </button>
                <button
                  onClick={() => handleSpeech("pause")}
                  disabled={!isPlaying}
                  className={`flex items-center justify-center gap-2 py-3 px-4 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg transition ${
                    !isPlaying ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiPause /> Pause
                </button>
                <button
                  onClick={() => handleSpeech("stop")}
                  disabled={!isPlaying && !isPaused}
                  className={`flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition ${
                    !isPlaying && !isPaused
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <FiStopCircle /> Stop
                </button>
              </div>

              {/* Speech Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Speed: {rate.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pitch: {pitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Volume: {volume.toFixed(1)}
                  </label>
                  <div className="flex items-center gap-3">
                    <FiVolume2 className="text-gray-500 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={copyText}
                  disabled={!text.trim()}
                  className={`flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition ${
                    !text.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCopy /> Copy Text
                </button>
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg transition">
                    <FiUpload /> Upload Text
                  </div>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={downloadAudio}
                  disabled={!text.trim()}
                  className={`flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition ${
                    !text.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiDownload /> Download Audio
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-full mb-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Settings
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Voice:{" "}
                    {voice ? `${voice.name} (${voice.lang})` : "Loading..."}
                  </p>
                  <p>Speed: {rate.toFixed(1)}x</p>
                  <p>Pitch: {pitch.toFixed(1)}</p>
                  <p>Volume: {volume.toFixed(1)}</p>
                </div>
              </div>

              <div className="w-full p-6 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Text Preview
                </h3>
                <div className="h-40 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded text-gray-800 dark:text-gray-200">
                  {text || "Enter text to see preview..."}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Note: Audio download is simulated as browser APIs don't
                  directly support capturing speech synthesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
