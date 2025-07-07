export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number,
  deadline: string,
  status: "pending" | "completed";
  created_at: string,
  updated_at: string
}