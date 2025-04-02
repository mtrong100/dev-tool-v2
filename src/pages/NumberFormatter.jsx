import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiTrash2 } from "react-icons/fi";

const NumberFormatter = () => {
  const [inputValue, setInputValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [formatType, setFormatType] = useState("comma");
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const fileInputRef = useRef(null);

  const formatNumber = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a number");
      return;
    }

    try {
      const number = parseFloat(inputValue);
      if (isNaN(number)) throw new Error("Invalid number");

      let result;
      switch (formatType) {
        case "comma":
          result = number.toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          });
          break;
        case "indian":
          result = new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(number);
          break;
        case "scientific":
          result = number.toExponential(decimalPlaces);
          break;
        case "currency":
          result = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(number);
          break;
        default:
          result = number.toString();
      }

      setFormattedValue(result);
      toast.success("Number formatted successfully!");
    } catch (err) {
      toast.error(`Formatting failed: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const numbers = content
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);
        if (numbers.length > 0) {
          setInputValue(numbers.join("\n"));
          toast.success(`${numbers.length} numbers loaded from file`);
        } else {
          throw new Error("No valid numbers found");
        }
      } catch (err) {
        toast.error("Error reading file: " + err.message);
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
  };

  const downloadResults = () => {
    if (!formattedValue) {
      toast.error("No formatted value to download");
      return;
    }

    const blob = new Blob([formattedValue], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formatted-number-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
    toast.success("Formatted number downloaded!");
  };

  const copyToClipboard = () => {
    if (!formattedValue) {
      toast.error("No formatted value to copy");
      return;
    }
    navigator.clipboard.writeText(formattedValue);
    toast.success("Copied to clipboard!");
  };

  const clearAll = () => {
    setInputValue("");
    setFormattedValue("");
    toast.success("Cleared all data");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Number Formatter</h1>
          <p className="opacity-90">Format numbers in various styles</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Input Number
              </h2>
              <div className="flex gap-2">
                <label className="cursor-pointer p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2">
                  <FiUpload /> Upload
                  <input
                    type="file"
                    accept=".txt,.csv"
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter numbers to format (one per line or comma separated)"
              className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              spellCheck="false"
            />
          </div>

          {/* Format Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format Type
              </label>
              <select
                value={formatType}
                onChange={(e) => setFormatType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="comma">Comma Separated (1,000.00)</option>
                <option value="indian">Indian System (10,00,000.00)</option>
                <option value="scientific">
                  Scientific Notation (1.00e+3)
                </option>
                <option value="currency">Currency ($1,000.00)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Decimal Places
              </label>
              <select
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} decimal places
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={formatNumber}
            disabled={!inputValue.trim()}
            className={`w-full p-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition ${
              !inputValue.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Format Number
          </button>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Formatted Result
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!formattedValue}
                  className={`p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !formattedValue ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCopy /> Copy
                </button>
                <button
                  onClick={downloadResults}
                  disabled={!formattedValue}
                  className={`p-2 bg-green-100 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600 text-green-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                    !formattedValue ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-20">
              {formattedValue ? (
                <p className="text-lg dark:text-white break-all">
                  {formattedValue}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Formatted result will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberFormatter;
