import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiCopy, FiDownload, FiRefreshCw } from "react-icons/fi";
import { v4 as uuidv4, v1 as uuidv1, v5 as uuidv5 } from "uuid";

const UuidGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState("v4");
  const [namespace, setNamespace] = useState("");
  const [name, setName] = useState("");
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);

  // Generate UUIDs based on current settings
  const generateUuids = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid;
      switch (version) {
        case "v1":
          uuid = uuidv1();
          break;
        case "v4":
          uuid = uuidv4();
          break;
        case "v5":
          if (!namespace || !name) {
            toast.error("Namespace and name are required for v5 UUIDs");
            return;
          }
          try {
            uuid = uuidv5(name, namespace);
          } catch (err) {
            console.log(err);
            toast.error("Invalid namespace for v5 UUID");
            return;
          }
          break;
        default:
          uuid = uuidv4();
      }

      // Apply formatting options
      if (!hyphens) uuid = uuid.replace(/-/g, "");
      if (uppercase) uuid = uuid.toUpperCase();

      newUuids.push(uuid);
    }
    setUuids(newUuids);
  };

  // Generate on mount and when settings change
  useEffect(() => {
    generateUuids();
  }, [count, version, namespace, name, hyphens, uppercase]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const copyAllToClipboard = () => {
    if (uuids.length === 0) {
      toast.error("No UUIDs to copy");
      return;
    }
    navigator.clipboard.writeText(uuids.join("\n"));
    toast.success("All UUIDs copied!");
  };

  const downloadUuids = () => {
    if (uuids.length === 0) {
      toast.error("No UUIDs to download");
      return;
    }
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `uuids-${version}-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
    toast.success("UUIDs downloaded!");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">UUID Generator</h1>
          <p className="opacity-90">Generate universally unique identifiers</p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                UUID Version
              </label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="v1">Version 1 (time-based)</option>
                <option value="v4">Version 4 (random)</option>
                <option value="v5">Version 5 (namespace)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Count (1-100)
              </label>
              <input
                type="number"
                value={count}
                onChange={(e) =>
                  setCount(
                    Math.min(100, Math.max(1, parseInt(e.target.value) || 1))
                  )
                }
                min="1"
                max="100"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Version-specific options */}
          {version === "v5" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Namespace (UUID)
                </label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  placeholder="e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., example.com"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Formatting options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hyphens"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="hyphens"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Include hyphens
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
              />
              <label
                htmlFor="uppercase"
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Uppercase letters
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateUuids}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2"
            >
              <FiRefreshCw /> Regenerate
            </button>
            <button
              onClick={copyAllToClipboard}
              disabled={uuids.length === 0}
              className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition flex items-center gap-2 ${
                uuids.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCopy /> Copy All
            </button>
            <button
              onClick={downloadUuids}
              disabled={uuids.length === 0}
              className={`px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2 ${
                uuids.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiDownload /> Download
            </button>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated UUIDs
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {uuids.length} {uuids.length === 1 ? "UUID" : "UUIDs"}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              {uuids.length > 0 ? (
                <ul className="space-y-2">
                  {uuids.map((uuid, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      <span className="font-mono text-sm dark:text-white">
                        {uuid}
                      </span>
                      <button
                        onClick={() => copyToClipboard(uuid)}
                        className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="Copy"
                      >
                        <FiCopy size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No UUIDs generated yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UuidGenerator;
