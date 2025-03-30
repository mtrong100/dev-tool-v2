import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiImage,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";

const LetterProfileGenerator = () => {
  const [name, setName] = useState("");
  const [profileLetter, setProfileLetter] = useState("");
  const [bgColor, setBgColor] = useState("#3B82F6");
  const [imageSize, setImageSize] = useState(200);
  const [fontSize, setFontSize] = useState(72);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProfileLetter = useCallback(() => {
    if (!name.trim()) {
      toast.error("Please enter a name first.");
      return;
    }

    setIsGenerating(true);
    try {
      const firstLetter = name.trim().charAt(0).toUpperCase();
      setProfileLetter(firstLetter);
      toast.success("Profile letter generated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate profile letter");
    } finally {
      setIsGenerating(false);
    }
  }, [name]);

  const handleCopy = useCallback(() => {
    if (!profileLetter) {
      toast.error("No profile letter to copy!");
      return;
    }
    navigator.clipboard.writeText(profileLetter);
    toast.success("Copied to clipboard!");
  }, [profileLetter]);

  const handleUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10000) {
      toast.error("File too large (max 10KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setName(event.target.result.trim());
      toast.success("Name loaded from file!");
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const handleDownload = useCallback(() => {
    if (!profileLetter) {
      toast.error("No profile letter to download!");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = imageSize;
    canvas.height = imageSize;
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw letter
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(profileLetter, canvas.width / 2, canvas.height / 2);

    // Download as PNG
    const link = document.createElement("a");
    link.download = "profile-letter.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Image downloaded!");
  }, [profileLetter, bgColor, imageSize, fontSize]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Letter Profile Generator
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create beautiful profile images from names
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="John Doe"
              />
            </div>
          </div>

          <button
            onClick={generateProfileLetter}
            disabled={isGenerating || !name.trim()}
            className={`w-full py-3 px-4 mb-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-medium rounded-lg shadow-md transition flex items-center justify-center ${
              isGenerating || !name.trim()
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isGenerating ? "Generating..." : "Generate Profile Letter"}
          </button>

          <div className="flex justify-center mb-6">
            <div
              className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              style={{
                backgroundColor: bgColor,
                width: `${imageSize}px`,
                height: `${imageSize}px`,
                fontSize: `${fontSize}px`,
              }}
            >
              {profileLetter || "?"}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 cursor-pointer"
                />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  {bgColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Size: {imageSize}px
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="144"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition">
                <FiUpload />
                Upload Names
              </div>
              <input
                type="file"
                accept=".txt"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={handleDownload}
              disabled={!profileLetter}
              className={`flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition ${
                !profileLetter ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiDownload />
              Download Image
            </button>
            <button
              onClick={handleCopy}
              disabled={!profileLetter}
              className={`flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition ${
                !profileLetter ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCopy />
              Copy Letter
            </button>
            <button
              onClick={() => {
                setName("");
                setProfileLetter("");
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded-lg transition"
            >
              <FiRefreshCw />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterProfileGenerator;
