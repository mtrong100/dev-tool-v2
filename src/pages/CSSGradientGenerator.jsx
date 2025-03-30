import React, { useState, useCallback, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const CSSGradientGenerator = () => {
  // State for gradient configuration
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ]);
  const [cssCode, setCssCode] = useState("");
  const [gradientPreview, setGradientPreview] = useState("");
  const [recentGradients, setRecentGradients] = useState([]);

  // Generate CSS code
  const generateCSSCode = useCallback(() => {
    let gradientValue;
    if (gradientType === "linear") {
      gradientValue = `linear-gradient(${angle}deg, ${colorStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    } else {
      gradientValue = `radial-gradient(circle, ${colorStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    }

    const code = `background: ${gradientValue};`;
    setCssCode(code);
    setGradientPreview(gradientValue);

    // Add to recent gradients
    setRecentGradients((prev) => {
      const newGradients = [{ gradientValue, code }, ...prev];
      return newGradients.slice(0, 5);
    });

    return code;
  }, [gradientType, angle, colorStops]);

  // Update CSS when configuration changes
  useEffect(() => {
    generateCSSCode();
  }, [generateCSSCode]);

  // Add new color stop
  const addColorStop = () => {
    if (colorStops.length >= 8) {
      toast.error("Maximum 8 color stops allowed");
      return;
    }
    const newPosition = Math.min(
      colorStops[colorStops.length - 1].position + 10,
      100
    );
    setColorStops([...colorStops, { color: "#ffffff", position: newPosition }]);
  };

  // Remove color stop
  const removeColorStop = (index) => {
    if (colorStops.length <= 2) {
      toast.error("Minimum 2 color stops required");
      return;
    }
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  // Update color stop
  const updateColorStop = (index, property, value) => {
    const updated = [...colorStops];
    updated[index][property] = value;
    setColorStops(updated);
  };

  // Copy CSS to clipboard
  const copyToClipboard = () => {
    if (!cssCode) {
      toast.error("No CSS to copy");
      return;
    }
    navigator.clipboard.writeText(cssCode);
    toast.success("CSS copied to clipboard!");
  };

  // Download CSS as file
  const downloadCSS = () => {
    if (!cssCode) {
      toast.error("No CSS to download");
      return;
    }
    const blob = new Blob([cssCode], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gradient.css";
    link.click();
    toast.success("CSS downloaded!");
  };

  // Upload gradient config
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000) {
      toast.error("File too large (max 5KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        if (config.gradientType && config.colorStops) {
          setGradientType(config.gradientType);
          setAngle(config.angle || 90);
          setColorStops(config.colorStops);
          toast.success("Gradient loaded!");
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error loading gradient config");
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  };

  // Export gradient config
  const exportConfig = () => {
    const config = {
      gradientType,
      angle,
      colorStops,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gradient-config.json";
    link.click();
    toast.success("Config exported!");
  };

  // Apply recent gradient
  const applyRecentGradient = (gradient) => {
    setGradientPreview(gradient.gradientValue);
    setCssCode(gradient.code);
    toast.success("Gradient applied!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            CSS Gradient Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Create beautiful CSS gradients with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Gradient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gradient Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGradientType("linear")}
                    className={`py-2 px-4 rounded-lg ${
                      gradientType === "linear"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Linear
                  </button>
                  <button
                    onClick={() => setGradientType("radial")}
                    className={`py-2 px-4 rounded-lg ${
                      gradientType === "radial"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {/* Angle (for linear gradient) */}
              {gradientType === "linear" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Angle: {angle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {/* Color Stops */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Stops
                </label>
                <div className="space-y-3">
                  {colorStops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) =>
                          updateColorStop(index, "color", e.target.value)
                        }
                        className="w-10 h-10 cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          updateColorStop(
                            index,
                            "position",
                            parseInt(e.target.value)
                          )
                        }
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="w-12 text-center text-gray-700 dark:text-gray-300">
                        {stop.position}%
                      </span>
                      <button
                        onClick={() => removeColorStop(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-full"
                        title="Remove color stop"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addColorStop}
                  className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <FiPlus /> Add Color Stop
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition"
                >
                  <FiCopy /> Copy CSS
                </button>
                <button
                  onClick={downloadCSS}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition"
                >
                  <FiDownload /> Download CSS
                </button>
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg transition">
                    <FiUpload /> Import Config
                  </div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={exportConfig}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition"
                >
                  <FiDownload /> Export Config
                </button>
              </div>
            </div>

            {/* Recent Gradients */}
            {recentGradients.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recent Gradients
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recentGradients.map((gradient, index) => (
                    <div
                      key={index}
                      onClick={() => applyRecentGradient(gradient)}
                      className="h-16 rounded-lg cursor-pointer hover:opacity-90 transition"
                      style={{ background: gradient.gradientValue }}
                      title="Click to apply"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div
              className="h-64 mb-6 rounded-lg overflow-hidden shadow-inner"
              style={{
                background:
                  gradientPreview ||
                  "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            ></div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CSS Code
              </label>
              <pre className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {cssCode ||
                    "background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"}
                </code>
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition"
              >
                <FiCopy /> Copy Code
              </button>
              <button
                onClick={downloadCSS}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition"
              >
                <FiDownload /> Download CSS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSGradientGenerator;
