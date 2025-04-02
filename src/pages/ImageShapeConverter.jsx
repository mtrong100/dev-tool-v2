import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiDownload, FiRefreshCw } from "react-icons/fi";

const ImageShapeConverter = () => {
  const [image, setImage] = useState(null);
  const [borderRadius, setBorderRadius] = useState(0);
  const [shape, setShape] = useState("square");
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create clipping path based on shape
    ctx.beginPath();

    if (shape === "circle") {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 2;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    } else if (shape === "rounded") {
      const r = borderRadius || 20; // Changed from 'radius' to 'borderRadius'
      ctx.moveTo(r, 0);
      ctx.lineTo(canvas.width - r, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
      ctx.lineTo(canvas.width, canvas.height - r);
      ctx.quadraticCurveTo(
        canvas.width,
        canvas.height,
        canvas.width - r,
        canvas.height
      );
      ctx.lineTo(r, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    } else {
      // square
      ctx.rect(0, 0, canvas.width, canvas.height);
    }

    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 0, 0);
  };

  useEffect(() => {
    processImage();
  }, [image, shape, borderRadius]);

  const handleShapeChange = (newShape) => {
    setShape(newShape);
  };

  const handleBorderRadiusChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBorderRadius(value);
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `shaped-image-${shape}.png`;
    link.href = dataURL;
    link.click();
  };

  const handleReset = () => {
    setImage(null);
    setBorderRadius(0);
    setShape("square");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Image Shape Converter
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Controls
            </h2>

            <div className="space-y-4">
              {/* Upload Button */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {image ? "Change Image" : "Upload Image"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Shape Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Shape
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShapeChange("square")}
                    className={`px-4 py-2 rounded-lg ${
                      shape === "square"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Square
                  </button>
                  <button
                    onClick={() => handleShapeChange("circle")}
                    className={`px-4 py-2 rounded-lg ${
                      shape === "circle"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => handleShapeChange("rounded")}
                    className={`px-4 py-2 rounded-lg ${
                      shape === "rounded"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    Rounded
                  </button>
                </div>
              </div>

              {/* Border Radius Slider (only shown for rounded) */}
              {shape === "rounded" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Border Radius: {borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={borderRadius}
                    onChange={handleBorderRadiusChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleDownload}
                  disabled={!image}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg bg-green-500 text-white ${
                    !image
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                >
                  <FiDownload className="mr-2" />
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <FiRefreshCw className="mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Preview
            </h2>
            <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {image ? (
                <canvas ref={canvasRef} className="max-w-full max-h-full" />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Upload an image to see the preview
                </p>
              )}
            </div>
            {image && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Original dimensions: {image.width} × {image.height}px
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageShapeConverter;
