"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority_score: 0,
    deadline: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority_score" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await fetch("http://localhost:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
      router.push("/tasks");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Work)"
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          step="0.1"
          name="priority_score"
          placeholder="Priority Score"
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={formData.priority_score}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="deadline"
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          value={formData.deadline}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-3 rounded-md border border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-md transition-colors duration-200"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}
