import React, { useState, useCallback } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiRefreshCw } from "react-icons/fi";

const TextFormatter = () => {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateCounts = useCallback((input) => {
    setCharCount(input.length);
    setWordCount(input.trim() ? input.trim().split(/\s+/).length : 0);
    setLineCount(input ? input.split("\n").length : 0);
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    setText(input);
    updateCounts(input);
  };

  const formatText = useCallback(
    (formatFn) => {
      if (!text) return toast.error("No text to format!");
      setIsProcessing(true);
      try {
        const formatted = formatFn(text);
        setText(formatted);
        updateCounts(formatted);
        toast.success("Text formatted!");
      } catch (error) {
        console.log(error);
        toast.error("Formatting failed!");
      } finally {
        setIsProcessing(false);
      }
    },
    [text, updateCounts]
  );

  const formatActions = {
    uppercase: (t) => t.toUpperCase(),
    lowercase: (t) => t.toLowerCase(),
    titleCase: (t) =>
      t
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    sentenceCase: (t) =>
      t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    removeSpaces: (t) => t.replace(/\s+/g, " ").trim(),
    removeLineBreaks: (t) => t.replace(/(\r\n|\n|\r)/gm, " "),
    reverseText: (t) => t.split("").reverse().join(""),
    removeDuplicates: (t) => [...new Set(t.split(" "))].join(" "),
    camelCase: (t) =>
      t
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()),
    slugify: (t) =>
      t
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    trimLines: (t) =>
      t
        .split("\n")
        .map((line) => line.trim())
        .join("\n"),
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      return toast.error("File too large (max 100KB)");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
      updateCounts(event.target.result);
      toast.success("File uploaded!");
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDownload = () => {
    if (!text) return toast.error("No text to download!");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "formatted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded!");
  };

  const handleCopy = () => {
    if (!text) return toast.error("No text to copy!");
    navigator.clipboard.writeText(text);
    toast.success("Text copied!");
  };

  const handleClear = () => {
    setText("");
    updateCounts("");
    toast("Text cleared!", { icon: "🗑️" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{ className: "dark:bg-gray-800 dark:text-white" }}
        />

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Advanced Text Formatter
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Transform and optimize your text with powerful formatting tools
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <textarea
            value={text}
            onChange={handleChange}
            rows={10}
            className="w-full p-4 text-lg mb-6 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Enter your text here and let the magic happen ✨"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {Object.entries({
              uppercase: "UPPERCASE",
              lowercase: "lowercase",
              titleCase: "Title Case",
              sentenceCase: "Sentence Case",
              removeSpaces: "Remove Spaces",
              removeLineBreaks: "Remove Breaks",
              reverseText: "Reverse Text",
              removeDuplicates: "Remove Duplicates",
              camelCase: "camelCase",
              slugify: "slugify",
              trimLines: "Trim Lines",
            }).map(([key, label]) => (
              <button
                key={key}
                onClick={() => formatText(formatActions[key])}
                disabled={isProcessing || !text}
                className={`p-3 rounded-lg font-medium transition ${
                  isProcessing || !text
                    ? "opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition">
                <FiUpload className="text-lg" />
                Upload
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
              disabled={!text}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiDownload className="text-lg" />
              Download
            </button>
            <button
              onClick={handleCopy}
              disabled={!text}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCopy className="text-lg" />
              Copy
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiRefreshCw className="text-lg" />
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Characters
              </p>
              <p className="text-2xl font-bold dark:text-white">{charCount}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Words</p>
              <p className="text-2xl font-bold dark:text-white">{wordCount}</p>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Lines</p>
              <p className="text-2xl font-bold dark:text-white">{lineCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextFormatter;
