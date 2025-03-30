import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiSave,
  FiFilter,
  FiDownload,
  FiUpload,
  FiChevronUp,
} from "react-icons/fi";

const TodoListManager = () => {
  // State management
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [categories, setCategories] = useState([
    "Work",
    "Personal",
    "Shopping",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const inputRef = useRef(null);

  // Add new todo
  const addTodo = () => {
    if (inputValue.trim() === "") {
      toast.error("Please enter a task");
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      category: selectedCategory || "Uncategorized",
      createdAt: new Date().toISOString(),
      priority: "medium", // 'low', 'medium', 'high'
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    setSelectedCategory("");
    toast.success("Task added!");
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Task deleted");
  };

  // Start editing todo
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
    inputRef.current?.focus();
  };

  // Save edited todo
  const saveEdit = (id) => {
    if (editValue.trim() === "") {
      toast.error("Task cannot be empty");
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editValue.trim() } : todo
      )
    );
    setEditingId(null);
    toast.success("Task updated!");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Add new category
  const addCategory = () => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setCategories([...categories, selectedCategory]);
      toast.success("Category added!");
    }
  };

  // Download todos as JSON
  const downloadTodos = () => {
    if (todos.length === 0) {
      toast.error("No tasks to download");
      return;
    }

    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todo-list-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Tasks downloaded!");
  };

  // Upload todos from file
  const uploadTodos = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100000) {
      toast.error("File too large (max 100KB)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const uploadedTodos = JSON.parse(event.target.result);
        if (Array.isArray(uploadedTodos)) {
          setTodos(uploadedTodos);
          // Extract categories from uploaded todos
          const newCategories = [
            ...new Set(uploadedTodos.map((todo) => todo.category)),
          ];
          setCategories((prev) => [...new Set([...prev, ...newCategories])]);
          toast.success("Tasks uploaded successfully!");
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        toast.error("Error parsing file");
        console.error(error);
      }
    };
    reader.onerror = () => toast.error("Error reading file");
    reader.readAsText(file);
    e.target.value = "";
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    toast.success("Completed tasks cleared!");
  };

  // Set priority
  const setPriority = (id, priority) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
            To-Do List Manager
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Organize your tasks efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              {/* Add Task */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add New Task
                </label>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTodo()}
                    placeholder="What needs to be done?"
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={addTodo}
                    className="p-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {selectedCategory &&
                    !categories.includes(selectedCategory) && (
                      <button
                        onClick={addCategory}
                        className="p-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition"
                        title="Add new category"
                      >
                        <FiPlus />
                      </button>
                    )}
                </div>
              </div>

              {/* Filter Controls */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter Tasks
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <FiFilter /> All
                  </button>
                  <button
                    onClick={() => setFilter("active")}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 ${
                      filter === "active"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <FiFilter /> Active
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 ${
                      filter === "completed"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <FiFilter /> Completed
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clearCompleted}
                  disabled={!todos.some((todo) => todo.completed)}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white transition ${
                    !todos.some((todo) => todo.completed)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <FiTrash2 /> Clear Completed
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <label className="cursor-pointer">
                    <div className="py-2 px-3 rounded-lg flex items-center justify-center gap-1 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white transition">
                      <FiUpload /> Import
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={uploadTodos}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={downloadTodos}
                    disabled={todos.length === 0}
                    className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white transition ${
                      todos.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiDownload /> Export
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total
                    </p>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {todos.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Active
                    </p>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {todos.filter((todo) => !todo.completed).length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="font-bold text-gray-800 dark:text-white">
                      {todos.filter((todo) => todo.completed).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Todo List Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {filter === "all"
                ? "All Tasks"
                : filter === "active"
                ? "Active Tasks"
                : "Completed Tasks"}
            </h2>

            {filteredTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === "all"
                    ? "No tasks yet. Add one above!"
                    : filter === "active"
                    ? "No active tasks"
                    : "No completed tasks"}
                </p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredTodos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`p-3 rounded-lg border transition ${
                      todo.completed
                        ? "border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          ref={inputRef}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) =>
                            e.key === "Enter" && saveEdit(todo.id)
                          }
                        />
                        <button
                          onClick={() => saveEdit(todo.id)}
                          className="p-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded transition"
                        >
                          <FiSave />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white rounded transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`mt-1 flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {todo.completed && <FiCheck size={14} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`break-words ${
                              todo.completed
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {todo.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {todo.category}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                todo.priority === "high"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : todo.priority === "medium"
                                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              }`}
                            >
                              {todo.priority} priority
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const currentPriority = todo.priority;
                              let newPriority = "medium";
                              if (currentPriority === "low")
                                newPriority = "medium";
                              if (currentPriority === "medium")
                                newPriority = "high";
                              if (currentPriority === "high")
                                newPriority = "low";
                              setPriority(todo.id, newPriority);
                            }}
                            className="p-1.5 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition"
                            title="Change Priority"
                          >
                            <FiChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoListManager;
