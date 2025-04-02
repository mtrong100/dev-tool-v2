import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiRefreshCw } from "react-icons/fi";

const LoremGenerator = () => {
  const [output, setOutput] = useState("");
  const [unit, setUnit] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [options, setOptions] = useState({
    startWithLorem: true,
    htmlTags: false,
  });
  const [refreshKey, setRefreshKey] = useState(0); // Add this line
  const outputRef = useRef(null);

  // Sample lorem ipsum data
  const loremData = {
    words: [
      "lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet",
      "consectetur",
      "adipiscing",
      "elit",
      "sed",
      "do",
      "eiusmod",
      "tempor",
      "incididunt",
      "ut",
      "labore",
      "et",
      "dolore",
      "magna",
      "aliqua",
    ],
    sentences: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
    paragraphs: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  };

  const generateLorem = () => {
    let result = [];

    if (unit === "words") {
      const words = [...loremData.words];
      if (!options.startWithLorem) {
        words.shift(); // Remove "lorem"
        words.shift(); // Remove "ipsum"
      }
      // Shuffle and take the requested count
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        result.push(words[randomIndex]);
      }
      result = result.join(" ");
    } else if (unit === "sentences") {
      const sentences = [...loremData.sentences];
      if (!options.startWithLorem) {
        sentences[0] = sentences[0].replace("Lorem ipsum ", "");
      }
      // Shuffle and take the requested count
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * sentences.length);
        result.push(sentences[randomIndex]);
      }
      result = result.join(" ");
    } else {
      // paragraphs
      const paragraphs = [...loremData.paragraphs];
      if (!options.startWithLorem) {
        paragraphs[0] = paragraphs[0].replace("Lorem ipsum ", "");
      }
      // Shuffle and take the requested count
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        result.push(paragraphs[randomIndex]);
      }

      if (options.htmlTags) {
        result = result.map((p) => `<p>${p}</p>`).join("\n");
      } else {
        result = result.join("\n\n");
      }
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    if (!output) {
      toast.error("No content to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const downloadText = () => {
    if (!output) {
      toast.error("No content to download");
      return;
    }
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lorem-ipsum-${unit}-${count}.txt`;
    link.click();
    toast.success("Download started!");
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value);
    // Set reasonable limits
    if (unit === "words") setCount(Math.min(1000, Math.max(1, value)));
    else if (unit === "sentences") setCount(Math.min(50, Math.max(1, value)));
    else setCount(Math.min(20, Math.max(1, value)));
  };

  // Regenerate when parameters change or refreshKey changes
  useEffect(() => {
    generateLorem();
  }, [unit, count, options, refreshKey]); // Add refreshKey to dependencies

  const handleRegenerate = () => {
    setRefreshKey((prev) => prev + 1); // This will trigger the useEffect
    toast.success("Content regenerated!");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Lorem Ipsum Generator</h1>
          <p className="opacity-90">
            Generate placeholder text for your projects
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit Type
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count (
                {unit === "words"
                  ? "1-1000"
                  : unit === "sentences"
                  ? "1-50"
                  : "1-20"}
                )
              </label>
              <input
                type="number"
                value={count}
                onChange={handleCountChange}
                min="1"
                max={unit === "words" ? 1000 : unit === "sentences" ? 50 : 20}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="startWithLorem"
                    checked={options.startWithLorem}
                    onChange={() =>
                      setOptions({
                        ...options,
                        startWithLorem: !options.startWithLorem,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor="startWithLorem"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Start with "Lorem ipsum"
                  </label>
                </div>
                {unit === "paragraphs" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="htmlTags"
                      checked={options.htmlTags}
                      onChange={() =>
                        setOptions({ ...options, htmlTags: !options.htmlTags })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                    />
                    <label
                      htmlFor="htmlTags"
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      Include HTML tags
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRegenerate} // Changed from generateLorem to handleRegenerate
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2"
            >
              <FiRefreshCw /> Regenerate
            </button>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition flex items-center gap-2 ${
                !output ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCopy /> Copy Text
            </button>
            <button
              onClick={downloadText}
              disabled={!output}
              className={`px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2 ${
                !output ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiDownload /> Download
            </button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {unit === "words"
                  ? `${count} word${count !== 1 ? "s" : ""}`
                  : unit === "sentences"
                  ? `${count} sentence${count !== 1 ? "s" : ""}`
                  : `${count} paragraph${count !== 1 ? "s" : ""}`}
              </span>
            </div>
            <div
              ref={outputRef}
              className={`w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-40 max-h-96 overflow-y-auto whitespace-pre-wrap ${
                options.htmlTags ? "font-mono text-sm" : ""
              }`}
            >
              {output || "Generated lorem ipsum will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoremGenerator;
