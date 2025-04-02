import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaEyeDropper } from "react-icons/fa";
import { FiCopy, FiDownload, FiUpload, FiRefreshCw } from "react-icons/fi";
import tinycolor from "tinycolor2";

const ColorConverter = () => {
  const [inputColor, setInputColor] = useState("#3b82f6");
  const [colorFormat, setColorFormat] = useState("hex");
  const [convertedColors, setConvertedColors] = useState({});
  const [colorHistory, setColorHistory] = useState([]);
  const fileInputRef = useRef(null);

  // Convert color on input or format change
  useEffect(() => {
    convertColor();
  }, [inputColor, colorFormat]);

  const convertColor = () => {
    try {
      const color = tinycolor(inputColor);
      if (!color.isValid()) throw new Error("Invalid color");

      const newConvertedColors = {
        hex: color.toHexString(),
        hex8: color.toHex8String(),
        rgb: color.toRgbString(),
        rgba: color.toRgbString(),
        hsl: color.toHslString(),
        hsla: color.toHslString(),
        hsv: color.toHsvString(),
        hsva: color.toHsvString(),
        name: color.toName() || "Unnamed color",
      };

      setConvertedColors(newConvertedColors);

      // Add to history if not already there
      if (!colorHistory.some((c) => c.hex === newConvertedColors.hex)) {
        setColorHistory((prev) => [
          { ...newConvertedColors, timestamp: new Date().toISOString() },
          ...prev.slice(0, 9), // Keep only last 10 colors
        ]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid color format");
    }
  };

  // NEW: Generate random color
  const generateRandomColor = () => {
    const randomColor = tinycolor.random().toHexString();
    setInputColor(randomColor);
    toast.success("Random color generated!");
  };

  const handleColorPicker = () => {
    if (!window.EyeDropper) {
      toast.error("Color picker not supported in your browser");
      return;
    }

    const eyeDropper = new window.EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        setInputColor(result.sRGBHex);
        toast.success("Color picked!");
      })
      .catch(() => toast.error("Color picker cancelled"));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result.trim();
        if (tinycolor(content).isValid()) {
          setInputColor(content);
          toast.success("Color loaded from file!");
        } else {
          throw new Error("Invalid color in file");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error reading color file");
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
  };

  const downloadColor = () => {
    const blob = new Blob([JSON.stringify(convertedColors, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `color-${convertedColors.hex.replace("#", "")}.json`;
    link.click();
    toast.success("Color data downloaded!");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const clearHistory = () => {
    setColorHistory([]);
    toast.success("History cleared");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Color Converter</h1>
          <p className="opacity-90">Convert between color formats with ease</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Color Input Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Input
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputColor}
                    onChange={(e) => setInputColor(e.target.value)}
                    placeholder="Enter color (hex, rgb, hsl, etc.)"
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="color"
                    value={convertedColors.hex || "#000000"}
                    onChange={(e) => setInputColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format
                </label>
                <select
                  value={colorFormat}
                  onChange={(e) => setColorFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="hex">HEX</option>
                  <option value="hex8">HEX8</option>
                  <option value="rgb">RGB</option>
                  <option value="rgba">RGBA</option>
                  <option value="hsl">HSL</option>
                  <option value="hsla">HSLA</option>
                  <option value="hsv">HSV</option>
                  <option value="hsva">HSVA</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* NEW: Random Color Button */}
              <button
                onClick={generateRandomColor}
                className="p-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-500 dark:hover:bg-pink-600 text-pink-800 dark:text-white rounded-lg transition flex items-center gap-2"
              >
                <FiRefreshCw /> Random
              </button>

              <button
                onClick={handleColorPicker}
                className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2"
              >
                <FaEyeDropper /> Pick Color
              </button>

              <label className="cursor-pointer p-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-500 dark:hover:bg-purple-600 text-purple-800 dark:text-white rounded-lg transition flex items-center gap-2">
                <FiUpload /> Upload
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>

              <button
                onClick={downloadColor}
                disabled={!convertedColors.hex}
                className={`p-2 bg-green-100 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600 text-green-800 dark:text-white rounded-lg transition flex items-center gap-2 ${
                  !convertedColors.hex ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {/* Color Preview */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div
                className="w-full h-32 rounded-lg shadow-md transition-colors duration-300"
                style={{ backgroundColor: convertedColors.hex || "#000000" }}
              />
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                {convertedColors.name || "Color preview"}
              </p>
            </div>

            {/* Color Values */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3 dark:text-white">
                Color Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(convertedColors).map(([format, value]) => (
                  <div key={format} className="flex items-center">
                    <span className="w-20 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {format.toUpperCase()}:
                    </span>
                    <div className="flex-1 flex items-center">
                      <span className="font-mono text-sm dark:text-white">
                        {value}
                      </span>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Copy"
                      >
                        <FiCopy size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Color History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Recent Colors
              </h2>
              <button
                onClick={clearHistory}
                disabled={colorHistory.length === 0}
                className={`p-2 text-sm ${
                  colorHistory.length === 0
                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                }`}
              >
                Clear History
              </button>
            </div>

            {colorHistory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {colorHistory.map((color, index) => (
                  <div
                    key={index}
                    className="cursor-pointer group"
                    onClick={() => setInputColor(color.hex)}
                  >
                    <div
                      className="w-full h-12 rounded-lg shadow-md transition-colors duration-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">
                      {color.hex}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No color history yet. Convert colors to see them here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
