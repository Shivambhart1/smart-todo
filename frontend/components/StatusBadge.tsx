import { jetbrains } from "../constants";

interface Props {
  status: "pending" | "completed";
}

const statusClasses: Record<Props["status"], string> = {
  completed: "text-white bg-green-600",
  pending: "text-white bg-yellow-500",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`uppercase px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]} ${jetbrains?.className} leading-6 tracking-wider`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
