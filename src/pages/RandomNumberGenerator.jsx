import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiHash,
} from "react-icons/fi";

const RandomNumberGenerator = () => {
  // State management
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);

  // Generate random numbers
  const generateNumbers = useCallback(() => {
    setIsGenerating(true);
    try {
      const newResults = [];
      for (let i = 0; i < quantity; i++) {
        const randomNum =
          Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        newResults.push(randomNum);
      }
      setResults(newResults);
      setHistory((prev) => [newResults, ...prev.slice(0, 4)]);
      toast.success(
        `${quantity} random number${quantity > 1 ? "s" : ""} generated!`
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate numbers");
    } finally {
      setIsGenerating(false);
    }
  }, [minValue, maxValue, quantity]);

  // Copy results to clipboard
  const copyResults = useCallback(() => {
    if (results.length === 0) {
      toast.error("No results to copy");
      return;
    }
    navigator.clipboard.writeText(results.join(", "));
    toast.success("Results copied to clipboard!");
  }, [results]);

  // Download results as text file
  const downloadResults = useCallback(() => {
    if (results.length === 0) {
      toast.error("No results to download");
      return;
    }
    const blob = new Blob([results.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "random_numbers.txt";
    link.click();
    toast.success("Results downloaded!");
  }, [results]);

  // Handle file upload for settings
  const handleUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1000) {
      toast.error("File too large (max 1KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const [min, max, qty] = content.split(",").map(Number);
        if (!isNaN(min) && !isNaN(max) && !isNaN(qty)) {
          setMinValue(min);
          setMaxValue(max);
          setQuantity(qty);
          toast.success("Settings loaded from file!");
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error parsing settings file");
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  // Validate inputs
  const validateInputs = useCallback(() => {
    if (minValue >= maxValue) {
      toast.error("Max value must be greater than min value");
      return false;
    }
    if (quantity < 1 || quantity > 1000) {
      toast.error("Quantity must be between 1 and 1000");
      return false;
    }
    return true;
  }, [minValue, maxValue, quantity]);

  // Handle generate with validation
  const handleGenerate = useCallback(() => {
    if (validateInputs()) {
      generateNumbers();
    }
  }, [validateInputs, generateNumbers]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Random Number Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Generate random numbers within your specified range
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Value
                </label>
                <input
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="-1000000"
                  max="1000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Value
                </label>
                <input
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="-1000000"
                  max="1000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity (1-1000)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(Number(e.target.value), 1000))
                  }
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="1000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition ${
                    isGenerating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiRefreshCw className={isGenerating ? "animate-spin" : ""} />
                  {isGenerating ? "Generating..." : "Generate Numbers"}
                </button>

                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg transition">
                    <FiUpload />
                    Import Settings
                  </div>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Generation History
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {history.map((nums, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded dark:text-white text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => setResults(nums)}
                    >
                      {nums.slice(0, 5).join(", ")}
                      {nums.length > 5 && `... (${nums.length} total)`}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Results
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyResults}
                  disabled={results.length === 0}
                  className={`p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
                    results.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Copy results"
                >
                  <FiCopy className="text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={downloadResults}
                  disabled={results.length === 0}
                  className={`p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
                    results.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title="Download results"
                >
                  <FiDownload className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg h-96 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.map((num, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow text-center font-mono"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FiHash className="text-5xl text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Your random numbers will appear here
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Generated {results.length} number
                  {results.length > 1 ? "s" : ""} between {minValue} and{" "}
                  {maxValue}
                </p>
                {results.length > 1 && (
                  <p className="mt-1">
                    Min: {Math.min(...results)}, Max: {Math.max(...results)},
                    Avg:{" "}
                    {(
                      results.reduce((a, b) => a + b, 0) / results.length
                    ).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
