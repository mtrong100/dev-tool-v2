import React, { useState, useRef, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiUpload,
  FiDownload,
  FiCrop,
  FiRotateCw,
  FiZoomIn,
  FiZoomOut,
  FiCopy,
} from "react-icons/fi";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// Aspect ratio presets
const ASPECT_RATIOS = [
  { label: "Freeform", value: null },
  { label: "Original", value: 0 },
  { label: "Square (1:1)", value: 1 },
  { label: "Landscape (16:9)", value: 16 / 9 },
  { label: "Portrait (9:16)", value: 9 / 16 },
  { label: "Widescreen (21:9)", value: 21 / 9 },
  { label: "Standard (4:3)", value: 4 / 3 },
  { label: "Classic (3:2)", value: 3 / 2 },
  { label: "Mobile (9:18)", value: 9 / 18 },
  { label: "Instagram Story (9:16)", value: 9 / 16 },
  { label: "Facebook Cover (16:9)", value: 16 / 9 },
];

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const originalAspectRef = useRef(null);

  // Handle file upload
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imageUrl = reader.result.toString();
        setImgSrc(imageUrl);

        // Load image to get original dimensions
        const img = new Image();
        img.onload = () => {
          originalAspectRef.current = img.width / img.height;
        };
        img.src = imageUrl;
      });
      reader.readAsDataURL(e.target.files[0]);
      toast.success("Image uploaded!");
    }
  };

  // Handle image load
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    originalAspectRef.current = width / height;

    if (aspect === 0) {
      // Original aspect ratio
      setCrop(centerAspectCrop(width, height, originalAspectRef.current));
    } else if (aspect) {
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  // Handle aspect ratio change
  const handleAspectChange = (newAspect, ratioLabel) => {
    setAspect(newAspect);
    setSelectedRatio(ratioLabel);

    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      const { width, height } = imgRef.current;
      const actualAspect =
        newAspect === 0 ? originalAspectRef.current : newAspect;
      if (actualAspect) {
        const newCrop = centerAspectCrop(width, height, actualAspect);
        setCrop(newCrop);
      }
    }
  };

  // Generate cropped image
  const generateCroppedImage = useCallback(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      toast.error("No crop area selected");
      return null;
    }

    const canvas = previewCanvasRef.current;
    const image = imgRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.9);
  }, [completedCrop, rotate]);

  // Download cropped image
  const handleDownload = () => {
    const croppedImageUrl = generateCroppedImage();
    if (!croppedImageUrl) return;

    const link = document.createElement("a");
    link.download = `cropped-${selectedRatio.replace(
      /[:\/]/g,
      "-"
    )}-${Date.now()}.jpg`;
    link.href = croppedImageUrl;
    link.click();
    toast.success("Image downloaded!");
  };

  // Copy cropped image to clipboard
  const handleCopyToClipboard = async () => {
    const croppedImageUrl = generateCroppedImage();
    if (!croppedImageUrl) return;

    try {
      const blob = await fetch(croppedImageUrl).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      toast.success("Image copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy image");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Advanced Image Cropper
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Crop and edit your images with precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image
                </label>
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition">
                    <FiUpload /> Select Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Crop Controls */}
              {imgSrc && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Crop Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <button
                          key={ratio.label}
                          onClick={() =>
                            handleAspectChange(ratio.value, ratio.label)
                          }
                          className={`py-2 px-3 text-sm rounded-lg ${
                            ratio.value === aspect ||
                            (ratio.value === 0 &&
                              aspect === originalAspectRef.current) ||
                            (ratio.value === null && aspect === null)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Zoom Controls */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Zoom: {scale.toFixed(1)}x
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                        disabled={scale <= 0.5}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        <FiZoomOut />
                      </button>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => setScale(Math.min(3, scale + 0.1))}
                        disabled={scale >= 3}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        <FiZoomIn />
                      </button>
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rotation: {rotate}°
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setRotate(Math.max(-180, rotate - 15))}
                        disabled={rotate <= -180}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        ↶
                      </button>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rotate}
                        onChange={(e) => setRotate(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <button
                        onClick={() => setRotate(Math.min(180, rotate + 15))}
                        disabled={rotate >= 180}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                      >
                        ↷
                      </button>
                      <button
                        onClick={() => setRotate(0)}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        <FiRotateCw />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleDownload}
                      disabled={!completedCrop}
                      className={`flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition ${
                        !completedCrop ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiDownload /> Download
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      disabled={!completedCrop}
                      className={`flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition ${
                        !completedCrop ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FiCopy /> Copy Image
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {imgSrc ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-h-[400px] overflow-hidden mb-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect === 0 ? originalAspectRef.current : aspect}
                    className="max-w-full max-h-[400px]"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imgSrc}
                      style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        maxWidth: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </div>

                {/* Preview Canvas (hidden) */}
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    display: "none",
                    border: "1px solid black",
                    objectFit: "contain",
                    width: completedCrop?.width,
                    height: completedCrop?.height,
                  }}
                />

                {/* Preview Info */}
                {completedCrop && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    <p>
                      Crop dimensions: {Math.round(completedCrop.width)} ×{" "}
                      {Math.round(completedCrop.height)} px
                    </p>
                    <p className="mt-1">
                      Aspect ratio: {selectedRatio || "Freeform"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <FiUpload className="text-5xl text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Upload an image to start cropping
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
