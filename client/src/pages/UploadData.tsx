import { useState } from "react";
import UploadCard from "../components/Upload/UploadCard";

interface UploadDataProps {
  setDashboardData: (data: any) => void;
}

export default function UploadData({
  setDashboardData,
}: UploadDataProps) {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Upload Business Data
        </h1>

        <p className="text-slate-400 mt-2">
          Upload your Excel or CSV file to analyze your business data.
        </p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`mb-6 rounded-xl border p-4 ${
            notification.type === "success"
              ? "bg-green-900/30 border-green-600 text-green-300"
              : notification.type === "error"
              ? "bg-red-900/30 border-red-600 text-red-300"
              : "bg-blue-900/30 border-blue-600 text-blue-300"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Upload Card */}
      <div className="max-w-4xl">
        <UploadCard
          onUploadSuccess={setDashboardData}
          showNotification={showNotification}
        />
      </div>

      {/* Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-3xl mb-3">📊</div>

          <h2 className="font-semibold text-lg">
            Excel Files
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Upload .xlsx or .xls business datasets.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-3xl mb-3">📄</div>

          <h2 className="font-semibold text-lg">
            CSV Files
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            CSV datasets are also supported.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="text-3xl mb-3">🤖</div>

          <h2 className="font-semibold text-lg">
            Automatic Analysis
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Your data is processed for dashboards, analytics,
            AI insights and reports.
          </p>
        </div>

      </div>

    </div>
  );
}