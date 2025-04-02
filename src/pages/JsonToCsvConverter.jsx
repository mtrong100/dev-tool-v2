import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiTrash2 } from "react-icons/fi";
import { parse, unparse } from "papaparse";

const JsonToCsvConverter = () => {
  const [inputJson, setInputJson] = useState("");
  const [csvData, setCsvData] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const fileInputRef = useRef(null);

  const handleConvert = () => {
    try {
      if (!inputJson.trim()) {
        throw new Error("Please enter JSON data");
      }

      const jsonData = JSON.parse(inputJson);
      const result = unparse(jsonData, { delimiter });

      setCsvData(result);
      setError("");
      toast.success("Conversion successful!");
    } catch (err) {
      setError(err.message);
      toast.error(`Conversion failed: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const downloadCsv = () => {
    if (!csvData) {
      toast.error("No CSV data to download");
      return;
    }

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `converted-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    toast.success("CSV downloaded!");
  };

  const copyToClipboard = () => {
    if (!csvData) {
      toast.error("No CSV data to copy");
      return;
    }
    navigator.clipboard.writeText(csvData);
    toast.success("CSV copied to clipboard!");
  };

  const clearAll = () => {
    setInputJson("");
    setCsvData("");
    setError("");
    toast.success("Cleared all data");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">JSON to CSV Converter</h1>
          <p className="opacity-90">Convert your JSON data to CSV format</p>
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
                  <FiUpload /> Upload JSON
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
              placeholder='Paste your JSON here e.g. [{"name":"John","age":30},{"name":"Jane","age":25}]'
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              spellCheck="false"
            />
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delimiter
              </label>
              <select
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value=",">Comma ( , )</option>
                <option value=";">Semicolon ( ; )</option>
                <option value="\t">Tab ( \t )</option>
                <option value="|">Pipe ( | )</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleConvert}
                disabled={!inputJson.trim()}
                className={`w-full p-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition ${
                  !inputJson.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Convert to CSV
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(
                      JSON.parse(inputJson),
                      null,
                      2
                    );
                    setInputJson(formatted);
                    toast.success("JSON formatted");
                  } catch (err) {
                    console.log(err);

                    toast.error("Invalid JSON for formatting");
                  }
                }}
                disabled={!inputJson.trim()}
                className={`w-full p-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition ${
                  !inputJson.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Format JSON
              </button>
            </div>
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
                CSV Output
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!csvData}
                  className={`p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !csvData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCopy /> Copy
                </button>
                <button
                  onClick={downloadCsv}
                  disabled={!csvData}
                  className={`p-2 bg-green-100 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600 text-green-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !csvData ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>

            <textarea
              value={csvData}
              readOnly
              placeholder="CSV output will appear here"
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonToCsvConverter;
