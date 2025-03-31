/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiRefreshCw } from "react-icons/fi";
import QRCode from "qrcode";

const QRCodeGenerator = () => {
  // State management
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [size, setSize] = useState(200);
  const [margin, setMargin] = useState(1);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  // Error correction levels
  const errorCorrectionLevels = [
    { value: "L", label: "Low (7%)" },
    { value: "M", label: "Medium (15%)" },
    { value: "Q", label: "Quartile (25%)" },
    { value: "H", label: "High (30%)" },
  ];

  // Generate QR code
  const generateQRCode = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Please enter text or URL first");
      return;
    }

    setIsGenerating(true);
    try {
      const options = {
        width: size,
        margin: margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorCorrection,
      };

      const dataUrl = await QRCode.toDataURL(text, options);
      setQrCode(dataUrl);
      //   toast.success("QR Code generated!");
    } catch (error) {
      toast.error("Failed to generate QR Code");
      console.error("QR Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [text, size, margin, darkColor, lightColor, errorCorrection]);

  // Handle file upload
  const handleUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10000) {
      toast.error("File too large (max 10KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result.trim());
      toast.success("Text loaded from file!");
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  // Download QR code as PNG
  const handleDownload = useCallback(() => {
    if (!qrCode) {
      toast.error("No QR Code to download");
      return;
    }

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrCode;
    link.click();
    toast.success("QR Code downloaded!");
  }, [qrCode]);

  // Copy text to clipboard
  const handleCopy = useCallback(() => {
    if (!text) {
      toast.error("No text to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  }, [text]);

  // Generate QR code when dependencies change
  useEffect(() => {
    if (text) {
      generateQRCode();
    }
  }, [text, generateQRCode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Convert text or URLs into QR codes instantly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter text or URL to encode..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size: {size}px
                </label>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Margin: {margin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {darkColor}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Light Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-10 h-10 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {lightColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Correction
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {errorCorrectionLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition">
                  <FiUpload />
                  Upload Text
                </div>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleCopy}
                disabled={!text}
                className={`flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition ${
                  !text ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiCopy />
                Copy Text
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center h-full">
              {qrCode ? (
                <>
                  <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <img
                      src={qrCode}
                      alt="Generated QR Code"
                      className="mx-auto"
                    />
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={!qrCode}
                    className={`flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition ${
                      !qrCode ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiDownload />
                    Download QR Code
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 w-full bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <qrCode className="text-5xl text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your QR code will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
