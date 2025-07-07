"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusCircleIcon } from 'lucide-react';
import StatusBadge from "../../../components/StatusBadge";
import { Task } from "../../../types";
import { jetbrains } from "../../../constants";

export default function DashboardPage() {
  const { push } = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    priority: ""
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/tasks").then(res => res.json()).then(setTasks);
  }, []);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    pending: tasks.length - tasks.filter(t => t.status === "completed").length
  }), [tasks]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesCategory = filters.category ? task.category === filters.category : true;
    const matchesPriority = 
      filters.priority === "high" ? task.priority >= 80 :
      filters.priority === "medium" ? task.priority >= 50 && task.priority < 80 :
      filters.priority === "low" ? task.priority < 50 : true;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  }), [tasks, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" count={stats.total} />
        <StatCard title="Pending" count={stats.pending} />
        <StatCard title="Completed" count={stats.completed} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Task List</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search task..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="border px-3 py-1.5 rounded-md text-sm w-64"
          />
          {['status', 'category', 'priority'].map((filter) => (
            <select
              key={filter}
              value={filters[filter as keyof typeof filters]}
              onChange={(e) => handleFilterChange(filter as keyof typeof filters, e.target.value)}
              className="border px-2 py-1.5 rounded-md text-sm"
            >
              <option value="">All {filter.charAt(0).toUpperCase() + filter.slice(1)}</option>
              {filter === 'status' && ['pending', 'completed', 'in_progress'].map(opt => (
                <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
              ))}
              {filter === 'category' && ['Work', 'Personal', 'Urgent'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              {filter === 'priority' && ['high', 'medium', 'low'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
          <button 
            onClick={() => push("/tasks/new")}
            className={`bg-blue-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-blue-600 text-sm ${jetbrains?.className} font-bold`}
          >
            <PlusCircleIcon className="mr-1" size={16} />
            Add Task
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Title', 'Category', 'Priority', 'Deadline', 'Status'].map((header) => (
                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{task.title}</td>
                <td className="px-4 py-2 whitespace-nowrap">{task.category}</td>
                <td className="px-4 py-2 whitespace-nowrap">{task.priority}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <StatusBadge status={task.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, count }: { title: string; count: number }) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{count}</h3>
    </div>
  );
}