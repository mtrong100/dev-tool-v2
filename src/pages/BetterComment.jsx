import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiUpload, FiX, FiThumbsUp } from "react-icons/fi";

const BetterComment = () => {
  const [comment, setComment] = useState("");
  const [improvedComment, setImprovedComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setComment(e.target.value);

  const improveComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment to improve");
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
                    text: `Improve this comment by fixing grammar, making it more polite and engaging, and adding relevant emojis. Keep the original meaning but enhance the tone. Return only the improved comment:\n\n"${comment}"`,
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
        setImprovedComment(result);
        toast.success("Comment improved successfully!");
      } else {
        throw new Error("No valid response from API");
      }
    } catch (error) {
      console.error("Error improving comment:", error);
      toast.error("Failed to improve comment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!improvedComment) return toast.error("No comment to copy!");
    navigator.clipboard.writeText(improvedComment);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!improvedComment) return toast.error("No comment to download!");
    const element = document.createElement("a");
    const file = new Blob([improvedComment], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "improved-comment.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Comment downloaded!");
  };

  const handleClearText = () => {
    setComment("");
    setImprovedComment("");
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
      setComment(event.target.result);
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
            Better Comment
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Original Comment</h2>
            <textarea
              value={comment}
              onChange={handleChange}
              rows={8}
              placeholder="Enter your comment here to improve it..."
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="flex flex-wrap gap-3 mt-4">
              <label className="cursor-pointer flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                <FiUpload size={18} />
                Upload Comment
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleClearText}
                disabled={!comment}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white ${
                  !comment ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiX size={18} />
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Improved Comment</h2>
            <div className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-h-[200px]">
              {improvedComment || (
                <p className="text-gray-500 dark:text-gray-400">
                  Your enhanced comment will appear here...
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={improveComment}
                disabled={!comment || isLoading}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white ${
                  !comment || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiThumbsUp size={18} />
                {isLoading ? "Improving..." : "Improve Comment"}
              </button>
              <button
                onClick={handleCopyText}
                disabled={!improvedComment}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white ${
                  !improvedComment ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiCopy size={18} />
                Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!improvedComment}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white ${
                  !improvedComment ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiDownload size={18} />
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl p-6 bg-white shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Original:</h3>
              <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                "this product sucks! waste of money dont buy"
              </p>
              <h3 className="font-medium mt-3 mb-2">Improved:</h3>
              <p className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                "I was disappointed with this product 😔. It didn't meet my
                expectations and I feel it wasn't worth the money 💸. I wouldn't
                recommend purchasing it."
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Original:</h3>
              <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                "i love it works great"
              </p>
              <h3 className="font-medium mt-3 mb-2">Improved:</h3>
              <p className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                "I absolutely love this product! ❤️ It works amazingly well and
                exceeded my expectations. Highly recommend! 👍"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetterComment;
