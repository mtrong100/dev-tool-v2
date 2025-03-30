import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiX } from "react-icons/fi";

const CaseConverter = () => {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setLineCount(text.trim() ? text.split("\n").length : 0);
  }, [text]);

  const handleChange = (e) => setText(e.target.value);

  const convertCase = (type) => {
    let convertedText = "";
    switch (type) {
      case "upper":
        convertedText = text.toUpperCase();
        toast.success("Converted to UPPERCASE!");
        break;
      case "lower":
        convertedText = text.toLowerCase();
        toast.success("Converted to lowercase!");
        break;
      case "title":
        convertedText = text
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        toast.success("Converted to Title Case!");
        break;
      case "sentence":
        convertedText = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        toast.success("Converted to Sentence Case!");
        break;
      case "reverse":
        convertedText = text.split("").reverse().join("");
        toast.success("Text Reversed!");
        break;
      case "alternating":
        convertedText = text
          .split("")
          .map((char, i) =>
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join("");
        toast.success("Converted to AlTeRnAtInG cAsE!");
        break;
      case "inverse":
        convertedText = text
          .split("")
          .map((char) =>
            char === char.toUpperCase()
              ? char.toLowerCase()
              : char.toUpperCase()
          )
          .join("");
        toast.success("Converted to iNVERSE cASE!");
        break;
      default:
        return text;
    }
    setText(convertedText);
  };

  const handleClearText = () => {
    setText("");
    toast("Text cleared!", { icon: "🗑️" });
  };

  const handleCopyText = () => {
    if (!text) return toast.error("No text to copy!");
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!text) return toast.error("No text to download!");
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "converted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded!");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      return toast.error("File size should be less than 100KB");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setText(event.target.result);
      toast.success("File uploaded successfully!");
    };
    reader.onerror = () => toast.error("Error reading file!");
    reader.readAsText(file);
    e.target.value = "";
  };

  const textStats = [
    { label: "Characters", value: charCount },
    { label: "Words", value: wordCount },
    { label: "Lines", value: lineCount },
  ];

  const caseButtons = [
    { label: "UPPERCASE", action: () => convertCase("upper") },
    { label: "lowercase", action: () => convertCase("lower") },
    { label: "Title Case", action: () => convertCase("title") },
    { label: "Sentence case", action: () => convertCase("sentence") },
    { label: "Reverse text", action: () => convertCase("reverse") },
    { label: "AlTeRnAtInG", action: () => convertCase("alternating") },
    { label: "iNVERSE cASE", action: () => convertCase("inverse") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="container mx-auto ">
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "bg-white text-gray-800 dark:bg-gray-800 dark:text-white",
            iconTheme: {
              primary: "#3B82F6",
              secondary: "#F9FAFB",
            },
          }}
        />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Text Case Converter
          </h1>
        </div>

        <div className="rounded-xl p-6 mb-6 bg-white shadow-md dark:bg-gray-800">
          <textarea
            value={text}
            onChange={handleChange}
            rows={8}
            placeholder="Enter your text here..."
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
            {textStats.map((stat, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <p className="text-sm font-medium opacity-80">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6 mb-6 bg-white shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Convert Case</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {caseButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                disabled={!text}
                className={`py-2 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  !text ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
          <div className="flex flex-wrap gap-3 justify-between">
            <label className="cursor-pointer flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              <FiUpload size={18} />
              Upload Text
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
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiDownload size={18} />
              Download
            </button>

            <button
              onClick={handleCopyText}
              disabled={!text}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCopy size={18} />
              Copy Text
            </button>

            <button
              onClick={handleClearText}
              disabled={!text}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white ${
                !text ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiX size={18} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
