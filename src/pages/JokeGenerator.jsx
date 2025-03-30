import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FiCopy,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiHeart,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";

const JokeGenerator = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch joke from Dad Joke API
  const fetchJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      });
      const data = await response.json();

      if (!data.joke) throw new Error("Failed to fetch joke");

      setJoke(data.joke);
      setIsFavorite(favorites.some((fav) => fav.joke === data.joke));
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch joke: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchJoke();
  }, []);

  // Copy joke to clipboard
  const copyToClipboard = () => {
    if (!joke) return;
    navigator.clipboard.writeText(joke);
    toast.success("Joke copied to clipboard!");
  };

  // Download joke as text file
  const downloadJoke = () => {
    if (!joke) {
      toast.error("No joke to download");
      return;
    }

    const blob = new Blob([joke], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dad-joke-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    toast.success("Joke downloaded!");
  };

  // Upload favorites from file
  const uploadFavorites = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const uploadedFavorites = JSON.parse(event.target.result);
        if (Array.isArray(uploadedFavorites)) {
          setFavorites(uploadedFavorites);
          toast.success("Favorites imported successfully!");
        } else {
          throw new Error("Invalid file format");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error parsing file");
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
  };

  // Download favorites as JSON
  const downloadFavorites = () => {
    if (favorites.length === 0) {
      toast.error("No favorites to download");
      return;
    }

    const dataStr = JSON.stringify(favorites, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dad-joke-favorites-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    toast.success("Favorites exported!");
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!joke) return;

    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.joke !== joke));
      toast.success("Removed from favorites");
    } else {
      setFavorites([...favorites, { joke, date: new Date().toISOString() }]);
      toast.success("Added to favorites!");
    }
    setIsFavorite(!isFavorite);
  };

  // Share joke
  const shareJoke = () => {
    if (!joke) return;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this dad joke!",
          text: joke,
        })
        .catch((err) => toast.error("Error sharing: " + err.message));
    } else {
      copyToClipboard();
      toast.success("Joke copied to clipboard for sharing!");
    }
  };

  return (
    <div className="mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Dad Joke Generator</h1>
          <p className="opacity-90">The cringiest jokes from dads worldwide</p>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={fetchJoke}
            disabled={loading}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            {loading ? "Loading..." : "Get New Dad Joke"}
          </button>
        </div>

        {/* Joke Display */}
        <div className="p-6">
          {error ? (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              {error}
            </div>
          ) : joke ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-lg dark:text-white">{joke}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 text-blue-800 dark:text-white rounded-lg transition flex items-center gap-2"
                >
                  <FiCopy /> Copy
                </button>

                <button
                  onClick={downloadJoke}
                  className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600 text-green-800 dark:text-white rounded-lg transition flex items-center gap-2"
                >
                  <FiDownload /> Download
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-lg transition flex items-center gap-2 ${
                    isFavorite
                      ? "bg-red-100 hover:bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 text-red-800 dark:text-white"
                      : "bg-purple-100 hover:bg-purple-200 dark:bg-purple-500 dark:hover:bg-purple-600 text-purple-800 dark:text-white"
                  }`}
                >
                  <FiHeart /> {isFavorite ? "Remove" : "Favorite"}
                </button>

                <button
                  onClick={shareJoke}
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-yellow-800 dark:text-white rounded-lg transition flex items-center gap-2"
                >
                  <FiShare2 /> Share
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 dark:text-gray-400">
                {loading ? "Loading joke..." : "No joke available"}
              </p>
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white">
              Favorite Dad Jokes
            </h2>
            <div className="flex gap-2">
              <label className="cursor-pointer p-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-indigo-800 dark:text-white rounded-lg transition flex items-center gap-2">
                <FiUpload /> Import
                <input
                  type="file"
                  accept=".json"
                  onChange={uploadFavorites}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
              <button
                onClick={downloadFavorites}
                disabled={favorites.length === 0}
                className={`p-2 rounded-lg transition flex items-center gap-2 ${
                  favorites.length === 0
                    ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                    : "bg-teal-100 hover:bg-teal-200 dark:bg-teal-500 dark:hover:bg-teal-600 text-teal-800 dark:text-white"
                }`}
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {favorites.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {favorites.map((fav, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="dark:text-white">{fav.joke}</p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(fav.date).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setFavorites(favorites.filter((_, i) => i !== index));
                        if (joke === fav.joke) setIsFavorite(false);
                        toast.success("Removed from favorites");
                      }}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No favorites yet. Save your favorite dad jokes here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JokeGenerator;
