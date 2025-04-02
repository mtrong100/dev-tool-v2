import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiX } from "react-icons/fi";
import { GiFairyWand } from "react-icons/gi";

const GrammarFixer = () => {
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setText(e.target.value);

  const fixGrammar = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to fix");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Fix the grammar and improve this English text while keeping its original meaning:\n\n"${text}"\n\nReturn only the corrected text without any additional commentary or explanations.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (result) {
        setCorrectedText(result);
        toast.success("Grammar fixed successfully!");
      } else {
        throw new Error("No valid response from API");
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      toast.error("Failed to fix grammar. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!correctedText) return toast.error("No text to copy!");
    navigator.clipboard.writeText(correctedText);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!correctedText) return toast.error("No text to download!");
    const element = document.createElement("a");
    const file = new Blob([correctedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "corrected-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File downloaded!");
  };

  const handleClearText = () => {
    setText("");
    setCorrectedText("");
    toast("Text cleared!", { icon: "🗑️" });
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            English Grammar Fixer
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Original Text</h2>
            <textarea
              value={text}
              onChange={handleChange}
              rows={12}
              placeholder="Enter text with grammar mistakes here..."
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="flex flex-wrap gap-3 mt-4">
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

          {/* Output Section */}
          <div className="rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Corrected Text</h2>
            <div className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[200px]">
              {correctedText || (
                <p className="text-gray-500 dark:text-gray-400">
                  Corrected text will appear here...
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={fixGrammar}
                disabled={!text || isLoading}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white ${
                  !text || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <GiFairyWand size={18} />
                {isLoading ? "Fixing..." : "Fix Grammar"}
              </button>
              <button
                onClick={handleCopyText}
                disabled={!correctedText}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white ${
                  !correctedText ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiCopy size={18} />
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!correctedText}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white ${
                  !correctedText ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiDownload size={18} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarFixer;
