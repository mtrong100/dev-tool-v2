import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiLock,
  FiUnlock,
} from "react-icons/fi";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [excludeChars, setExcludeChars] = useState("");

  const characterSets = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const calculateStrength = useCallback((pass) => {
    let score = 0;
    if (!pass) return 0;

    // Length contributes up to 50% of score
    score += Math.min(pass.length / 2, 5);

    // Character variety
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 2;

    return Math.min(Math.floor(score), 10);
  }, []);

  const generatePassword = useCallback(() => {
    let characterSet = characterSets.lowercase;
    if (includeUppercase) characterSet += characterSets.uppercase;
    if (includeNumbers) characterSet += characterSets.numbers;
    if (includeSymbols) characterSet += characterSets.symbols;

    // Filter out excluded characters
    if (excludeChars) {
      characterSet = characterSet
        .split("")
        .filter((c) => !excludeChars.includes(c))
        .join("");
    }

    if (!characterSet.length) {
      toast.error("No character sets selected!");
      return;
    }

    let generatedPassword = "";
    const crypto = window.crypto || window.msCrypto;
    const values = new Uint32Array(length);

    if (crypto) {
      crypto.getRandomValues(values);
      for (let i = 0; i < length; i++) {
        generatedPassword += characterSet[values[i] % characterSet.length];
      }
    } else {
      // Fallback for browsers without crypto support
      for (let i = 0; i < length; i++) {
        generatedPassword +=
          characterSet[Math.floor(Math.random() * characterSet.length)];
      }
    }

    setPassword(generatedPassword);
    setStrength(calculateStrength(generatedPassword));
    toast.success("Password generated!");
  }, [
    length,
    includeUppercase,
    includeNumbers,
    includeSymbols,
    excludeChars,
    characterSets,
    calculateStrength,
  ]);

  const copyToClipboard = () => {
    if (!password) return toast.error("No password to copy!");
    navigator.clipboard.writeText(password);
    toast.success("Password copied!");
  };

  const downloadPassword = () => {
    if (!password) return toast.error("No password to download!");
    const element = document.createElement("a");
    const file = new Blob([password], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "secure-password.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Password downloaded!");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10000) {
      return toast.error("File too large (max 10KB)");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPassword(event.target.result);
      setStrength(calculateStrength(event.target.result));
      toast.success("Password file loaded!");
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  };

  const getStrengthColor = () => {
    if (strength < 4) return "bg-red-500";
    if (strength < 7) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Password Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Create strong, secure passwords with ease
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Password Length: <span className="font-bold">{length}</span>
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {length < 8 ? "Weak" : length < 12 ? "Good" : "Strong"}
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Uppercase Letters (A-Z)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Numbers (0-9)
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Symbols (!@#$%)
              </span>
            </label>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>

          {showAdvanced && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exclude Characters
              </label>
              <input
                type="text"
                value={excludeChars}
                onChange={(e) => setExcludeChars(e.target.value)}
                placeholder="e.g., 1lIO0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Characters you want to exclude from the password
              </p>
            </div>
          )}

          <button
            onClick={generatePassword}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg shadow-md transition flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" />
            Generate Password
          </button>
        </div>

        {password && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Your Secure Password
              </h2>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2 text-gray-500 dark:text-gray-400">
                  Strength: {strength}/10
                </span>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()}`}
                    style={{ width: `${strength * 10}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-4">
              <div className="font-mono text-lg break-all dark:text-white">
                {password}
              </div>
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 bg-blue-100 dark:bg-gray-600 hover:bg-blue-200 dark:hover:bg-gray-500 rounded-lg transition"
                title="Copy to clipboard"
              >
                <FiCopy className="text-blue-600 dark:text-blue-400" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition flex items-center justify-center"
              >
                <FiCopy className="mr-2" />
                Copy
              </button>
              <button
                onClick={downloadPassword}
                className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition flex items-center justify-center"
              >
                <FiDownload className="mr-2" />
                Download
              </button>
              <label className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition flex items-center justify-center cursor-pointer">
                <FiUpload className="mr-2" />
                Upload
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
