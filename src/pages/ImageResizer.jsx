import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  FiUpload,
  FiDownload,
  FiCopy,
  FiRotateCw,
  FiTrash2,
  FiImage,
} from "react-icons/fi";

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState("jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage({
          file,
          url: event.target.result,
          originalWidth: img.width,
          originalHeight: img.height,
        });
        setWidth(img.width);
        setHeight(img.height);
        toast.success("Image loaded successfully!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const resizeImage = () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Using timeout to simulate processing (remove in production)
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio if needed
        let newWidth = width;
        let newHeight = height;

        if (maintainAspectRatio) {
          const ratio =
            originalImage.originalWidth / originalImage.originalHeight;
          if (width / height > ratio) {
            newWidth = height * ratio;
          } else {
            newHeight = width / ratio;
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const resizedUrl = canvas.toDataURL(`image/${format}`, quality / 100);
        setResizedImage({
          url: resizedUrl,
          width: newWidth,
          height: newHeight,
          size: Math.round((resizedUrl.length * 0.75) / 1024), // Approximate KB
        });

        setIsProcessing(false);
        toast.success("Image resized successfully!");
      };

      img.src = originalImage.url;
    }, 500);
  };

  const downloadImage = () => {
    if (!resizedImage) {
      toast.error("No resized image to download");
      return;
    }

    const link = document.createElement("a");
    link.href = resizedImage.url;
    link.download = `resized-image-${width}x${height}.${format}`;
    link.click();
    toast.success("Image downloaded!");
  };

  const copyImageToClipboard = async () => {
    if (!resizedImage) {
      toast.error("No resized image to copy");
      return;
    }

    try {
      const blob = await fetch(resizedImage.url).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      toast.success("Image copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy image to clipboard");
    }
  };

  const resetAll = () => {
    setOriginalImage(null);
    setResizedImage(null);
    setWidth(800);
    setHeight(600);
    toast.success("Reset complete");
  };

  useEffect(() => {
    if (originalImage && maintainAspectRatio) {
      const ratio = originalImage.originalWidth / originalImage.originalHeight;
      setHeight(Math.round(width / ratio));
    }
  }, [width, maintainAspectRatio, originalImage]);

  useEffect(() => {
    if (originalImage && maintainAspectRatio) {
      const ratio = originalImage.originalWidth / originalImage.originalHeight;
      setWidth(Math.round(height * ratio));
    }
  }, [height, maintainAspectRatio, originalImage]);

  return (
    <div className="mx-auto ">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Image Resizer</h1>
          <p className="opacity-90">Resize and optimize your images</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold dark:text-white">
                Upload Image
              </h2>
              {originalImage && (
                <button
                  onClick={resetAll}
                  className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 text-red-800 dark:text-white rounded-lg transition flex items-center gap-2"
                >
                  <FiTrash2 /> Reset
                </button>
              )}
            </div>

            {!originalImage ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiImage className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </label>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Original Image
                  </h3>
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={originalImage.url}
                      alt="Original"
                      className="w-full h-auto max-h-80 object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                      {originalImage.originalWidth} ×{" "}
                      {originalImage.originalHeight} px •{" "}
                      {Math.round(originalImage.file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Resized Image
                  </h3>
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {resizedImage ? (
                      <>
                        <img
                          src={resizedImage.url}
                          alt="Resized"
                          className="w-full h-auto max-h-80 object-contain"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
                          {resizedImage.width} × {resizedImage.height} px •{" "}
                          {resizedImage.size} KB
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-80 text-gray-400 dark:text-gray-500">
                        <p>Resized image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          {originalImage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dimensions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Dimensions
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Width (px)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) =>
                          setWidth(parseInt(e.target.value) || 0)
                        }
                        min="1"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Height (px)
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) =>
                          setHeight(parseInt(e.target.value) || 0)
                        }
                        min="1"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintainRatio"
                        checked={maintainAspectRatio}
                        onChange={(e) =>
                          setMaintainAspectRatio(e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="maintainRatio"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Maintain aspect ratio
                      </label>
                    </div>
                  </div>
                </div>

                {/* Output Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Output Settings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quality ({quality}%)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={resizeImage}
                  disabled={isProcessing}
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2 ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <FiRotateCw className="animate-spin" /> Processing...
                    </>
                  ) : (
                    "Resize Image"
                  )}
                </button>

                {resizedImage && (
                  <>
                    <button
                      onClick={downloadImage}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2"
                    >
                      <FiDownload /> Download
                    </button>

                    <button
                      onClick={copyImageToClipboard}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition flex items-center gap-2"
                    >
                      <FiCopy /> Copy
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer;
