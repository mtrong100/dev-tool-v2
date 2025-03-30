import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaIndent } from "react-icons/fa";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiMinus,
} from "react-icons/fi";

const JsonFormatter = () => {
  const [inputJson, setInputJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [indentation, setIndentation] = useState(2);
  const [compactMode, setCompactMode] = useState(false);
  const fileInputRef = useRef(null);

  const formatJson = () => {
    try {
      if (!inputJson.trim()) {
        throw new Error("Please enter JSON data");
      }

      const parsed = JSON.parse(inputJson);
      const formatted = compactMode
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indentation);

      setFormattedJson(formatted);
      setError("");
      toast.success("JSON formatted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(`Formatting failed: ${err.message}`);
    }
  };

  const minifyJson = () => {
    try {
      if (!inputJson.trim()) {
        throw new Error("Please enter JSON data");
      }

      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);

      setFormattedJson(minified);
      setError("");
      toast.success("JSON minified successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(`Minification failed: ${err.message}`);
    }
  };

  const validateJson = () => {
    try {
      if (!inputJson.trim()) {
        throw new Error("Please enter JSON data");
      }

      JSON.parse(inputJson);
      toast.success("JSON is valid!");
    } catch (err) {
      toast.error(`Invalid JSON: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      // 100KB limit
      toast.error("File too large (max 100KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        JSON.parse(content); // Validate JSON
        setInputJson(content);
        toast.success("File uploaded successfully!");
      } catch (err) {
        console.log(err);
        toast.error("Invalid JSON file");
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
  };

  const downloadJson = () => {
    if (!formattedJson) {
      toast.error("No formatted JSON to download");
      return;
    }

    const blob = new Blob([formattedJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formatted-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("JSON downloaded!");
  };

  const copyToClipboard = () => {
    if (!formattedJson) {
      toast.error("No formatted JSON to copy");
      return;
    }
    navigator.clipboard.writeText(formattedJson);
    toast.success("Copied to clipboard!");
  };

  const clearAll = () => {
    setInputJson("");
    setFormattedJson("");
    setError("");
    toast.success("Cleared all data");
  };

  // Auto-format when indentation or compact mode changes
  useEffect(() => {
    if (inputJson && formattedJson) {
      formatJson();
    }
  }, [indentation, compactMode]);

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">JSON Formatter</h1>
          <p className="opacity-90">Format, validate, and minify JSON data</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                JSON Input
              </h2>
              <div className="flex gap-2">
                <label className="cursor-pointer p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2">
                  <FiUpload /> Upload
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={clearAll}
                  className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 text-red-800 dark:text-white rounded-lg transition flex items-center gap-2"
                >
                  <FiTrash2 /> Clear
                </button>
              </div>
            </div>

            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder='Paste your JSON here e.g. {"name":"John","age":30}'
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              spellCheck="false"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Indentation
              </label>
              <select
                value={indentation}
                onChange={(e) => setIndentation(parseInt(e.target.value))}
                disabled={compactMode}
                className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  compactMode ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 space</option>
                <option value={0}>No indentation</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={formatJson}
                disabled={!inputJson.trim()}
                className={`w-full p-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition flex items-center justify-center gap-2 ${
                  !inputJson.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaIndent /> Format
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={minifyJson}
                disabled={!inputJson.trim()}
                className={`w-full p-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition flex items-center justify-center gap-2 ${
                  !inputJson.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiMinus /> Minify
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={validateJson}
                disabled={!inputJson.trim()}
                className={`w-full p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center gap-2 ${
                  !inputJson.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Validate
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="compactMode"
              checked={compactMode}
              onChange={(e) => setCompactMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
            />
            <label
              htmlFor="compactMode"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Compact mode (single line)
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Formatted JSON
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!formattedJson}
                  className={`p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !formattedJson ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCopy /> Copy
                </button>
                <button
                  onClick={downloadJson}
                  disabled={!formattedJson}
                  className={`p-2 bg-green-100 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600 text-green-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !formattedJson ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>

            <textarea
              value={formattedJson}
              readOnly
              placeholder="Formatted JSON will appear here"
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
