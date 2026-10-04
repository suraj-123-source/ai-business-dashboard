import { CheckCircle, AlertCircle, Info } from "lucide-react";

interface Props {
  message: string;
  type?: "success" | "error" | "info";
}

export default function Notification({
  message,
  type = "info",
}: Props) {
  const styles = {
    success: {
      bg: "bg-green-600",
      icon: <CheckCircle size={20} />,
    },
    error: {
      bg: "bg-red-600",
      icon: <AlertCircle size={20} />,
    },
    info: {
      bg: "bg-blue-600",
      icon: <Info size={20} />,
    },
  };

  return (
    <div
      className={`${styles[type].bg} text-white rounded-xl shadow-xl px-5 py-4 flex items-center gap-3 animate-pulse`}
    >
      {styles[type].icon}

      <span className="font-medium">
        {message}
      </span>
    </div>
  );
}