"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [selectedContext, setSelectedContext] = useState<ContextEntry | null>(null);
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState("notes");
  const [contextEntries, setContextEntries] = useState<ContextEntry[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  type ContextEntry = {
    id: number;
    content: string;
    source_type: string;
    timestamp: string;
    processed_insight?: string;
  };

  type Suggestions = {
    enhanced_description?: string;
    suggested_category?: string;
    priority_score?: string | number;
    suggested_deadline?: string;
  };

  useEffect(() => {
    fetchContextEntries();
  }, []);

  const fetchContextEntries = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetch("http://localhost:8000/api/context/");
      if (!res.ok) throw new Error("Failed to fetch context entries");
      const data = await res.json();
      setContextEntries(data);
    } catch (error) {
      console.error("Error fetching context entries:", error);
      toast.error("Failed to load context history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleContextSubmit = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty.");
      return;
    }

    try {
      setIsAddingContext(true);
      const res = await fetch("http://localhost:8000/api/context/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          source_type: sourceType,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add context entry");
      }

      toast.success("Context entry added successfully!");
      setContent("");
      fetchContextEntries();
    } catch (error) {
      console.error("Error adding context entry:", error);
      toast.error("Failed to add context entry.");
    } finally {
      setIsAddingContext(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!taskTitle.trim()) {
      toast.error("Task title cannot be empty.");
      return;
    }

    if (!selectedContext) {
      toast.error("Please select a context entry.");
      return;
    }

    const context = selectedContext.content;

    try {
      setIsFetchingSuggestions(true);
      const res = await fetch("http://localhost:8000/api/ai-suggest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskTitle,
          context: context,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch AI suggestions");

      const data = await res.json();
      setSuggestions(data);
      toast.success("AI suggestions fetched!");
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast.error("Failed to fetch suggestions.");
    } finally {
      setIsFetchingSuggestions(false);
    }
  };

  const getSourceColor = (sourceType: string) => {
    switch (sourceType) {
      case "notes":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "email":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "whatsapp":
        return "bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const getBorderColor = (sourceType: string) => {
    switch (sourceType) {
      case "notes":
        return "border-l-green-400";
      case "email":
        return "border-l-blue-400";
      case "whatsapp":
        return "border-l-emerald-400";
      default:
        return "border-l-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            Daily Context Input
          </h1>
          <p className="text-gray-600">
            Capture and organize your daily interactions with AI-powered
            insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Add New Context
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="sourceType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Source Type
                  </label>
                  <select
                    id="sourceType"
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  >
                    <option value="notes">📝 Notes</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="email">✉️ Email</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                    placeholder="Enter your message, email, or note..."
                  />
                </div>

                <button
                  onClick={handleContextSubmit}
                  disabled={isAddingContext}
                  className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium transition-colors ${
                    isAddingContext ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isAddingContext ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Add Context Entry"
                  )}
                </button>
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                AI Task Suggestions
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="taskTitle"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Task Title
                  </label>
                  <input
                    id="taskTitle"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter task title..."
                  />
                </div>

                <button
                  onClick={fetchSuggestions}
                  disabled={isFetchingSuggestions}
                  className={`w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium transition-colors ${
                    isFetchingSuggestions ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isFetchingSuggestions ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Get AI Suggestions"
                  )}
                </button>

                {suggestions && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex flex-col flex-wrap">
                    <h3 className="text-lg font-medium text-green-900 mb-3 flex items-center">
                      <span className="mr-2">🤖</span>
                      AI Suggestions
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-800">
                          Enhanced Description:
                        </span>
                        <span className="text-green-700 mt-1">
                          {suggestions.enhanced_description || "N/A"}
                        </span>
                      </div>
                      <div className="flex gap-4 flex-wrap">
                        <div>
                          <span className="font-semibold text-green-800">
                            Category:
                          </span>
                          <span className="text-green-700 ml-2">
                            {suggestions.suggested_category || "General"}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-green-800">
                            Priority:
                          </span>
                          <span className="text-green-700 ml-2">
                            {suggestions.priority_score || "0.5"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-green-800">
                          Suggested Deadline:
                        </span>
                        <span className="text-green-700 ml-2">
                          {suggestions.suggested_deadline
                            ? new Date(
                                suggestions.suggested_deadline
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Context History
              </h2>

              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <svg className="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-purple-600">Loading history...</span>
                </div>
              ) : contextEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No context entries found.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {contextEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${getSourceColor(
                        entry.source_type
                      )} ${
                        selectedContext?.id === entry.id
                          ? "ring-2 ring-purple-500"
                          : ""
                      }`}
                      onClick={() => setSelectedContext(entry)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            entry.source_type === "notes"
                              ? "bg-green-100 text-green-800"
                              : entry.source_type === "email"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {entry.source_type === "notes"
                            ? "📝"
                            : entry.source_type === "email"
                            ? "✉️"
                            : "💬"}{" "}
                          {entry.source_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2 line-clamp-3">
                        {entry.content}
                      </p>
                      {entry.processed_insight && (
                        <div className={`mt-2 p-2 rounded border-l-4 ${getBorderColor(
                          entry.source_type
                        )}`}>
                          <p className="text-xs text-gray-700">
                            <span className="font-medium">💡 AI Insight:</span>{" "}
                            {entry.processed_insight}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}