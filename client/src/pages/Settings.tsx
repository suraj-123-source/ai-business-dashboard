// import React, { useEffect, useState } from "react";
// import {
//   Settings as SettingsIcon,
//   User,
//   Palette,
//   Database,
//   FileText,
//   Bell,
//   Server,
//   Save,
//   RotateCcw,
//   CheckCircle2,
//   Moon,
//   Sun,
//   Monitor,
// } from "lucide-react";

// interface SettingsData {
//   dashboardName: string;
//   companyName: string;
//   currency: string;
//   dateFormat: string;

//   theme: "light" | "dark" | "system";
//   layout: "comfortable" | "compact";

//   previewRows: number;
//   autoRefresh: boolean;

//   reportTitle: string;
//   preparedBy: string;
//   showCharts: boolean;
//   showAIInsights: boolean;

//   uploadNotifications: boolean;
//   reportNotifications: boolean;
//   aiNotifications: boolean;
// }

// const defaultSettings: SettingsData = {
//   dashboardName: "AI Business Analytics Dashboard",
//   companyName: "My Company",
//   currency: "INR",
//   dateFormat: "DD/MM/YYYY",

//   theme: "light",
//   layout: "comfortable",

//   previewRows: 10,
//   autoRefresh: false,

//   reportTitle: "Business Analytics Report",
//   preparedBy: "",
//   showCharts: true,
//   showAIInsights: true,

//   uploadNotifications: true,
//   reportNotifications: true,
//   aiNotifications: true,
// };

// const Settings: React.FC = () => {
//   const [settings, setSettings] = useState<SettingsData>(defaultSettings);
//   const [saved, setSaved] = useState(false);

//   const [apiStatus, setApiStatus] = useState<
//     "checking" | "online" | "offline"
//   >("checking");

//   // Load saved settings
//   useEffect(() => {
//     const savedSettings = localStorage.getItem("ai_dashboard_settings");

//     if (savedSettings) {
//       try {
//         const parsed = JSON.parse(savedSettings);
//         setSettings({
//           ...defaultSettings,
//           ...parsed,
//         });
//       } catch {
//         setSettings(defaultSettings);
//       }
//     }

//     checkBackend();
//   }, []);

//   // Check backend
//   const checkBackend = async () => {
//     setApiStatus("checking");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/docs");

//       if (response.ok) {
//         setApiStatus("online");
//       } else {
//         setApiStatus("offline");
//       }
//     } catch {
//       setApiStatus("offline");
//     }
//   };

//   const updateSetting = <K extends keyof SettingsData>(
//     key: K,
//     value: SettingsData[K]
//   ) => {
//     setSettings((prev) => ({
//       ...prev,
//       [key]: value,
//     }));

//     setSaved(false);
//   };

//   // Save settings
//   const saveSettings = () => {
//     localStorage.setItem(
//       "ai_dashboard_settings",
//       JSON.stringify(settings)
//     );

//     setSaved(true);

//     setTimeout(() => {
//       setSaved(false);
//     }, 2500);
//   };

//   // Reset settings
//   const resetSettings = () => {
//     const confirmReset = window.confirm(
//       "Are you sure you want to reset all settings to default?"
//     );

//     if (!confirmReset) return;

//     setSettings(defaultSettings);

//     localStorage.setItem(
//       "ai_dashboard_settings",
//       JSON.stringify(defaultSettings)
//     );

//     setSaved(true);

//     setTimeout(() => {
//       setSaved(false);
//     }, 2500);
//   };

//   const getStatusText = () => {
//     if (apiStatus === "checking") return "Checking...";
//     if (apiStatus === "online") return "Online";
//     return "Offline";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
//       {/* Header */}
//       <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <div className="flex items-center gap-3">
//             <div className="rounded-xl bg-indigo-100 p-3">
//               <SettingsIcon className="h-7 w-7 text-indigo-600" />
//             </div>

//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 Settings
//               </h1>

//               <p className="mt-1 text-sm text-gray-500">
//                 Manage your dashboard preferences and system configuration
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={resetSettings}
//             className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
//           >
//             <RotateCcw className="h-4 w-4" />
//             Reset
//           </button>

//           <button
//             onClick={saveSettings}
//             className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
//           >
//             <Save className="h-4 w-4" />
//             Save Settings
//           </button>
//         </div>
//       </div>

//       {/* Save notification */}
//       {saved && (
//         <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//           <CheckCircle2 className="h-5 w-5" />
//           Settings saved successfully.
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//         {/* Main settings */}
//         <div className="space-y-6 xl:col-span-2">
//           {/* General Settings */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-blue-100 p-2.5">
//                 <User className="h-5 w-5 text-blue-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   General Settings
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Basic dashboard information
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Dashboard Name
//                 </label>

//                 <input
//                   type="text"
//                   value={settings.dashboardName}
//                   onChange={(e) =>
//                     updateSetting("dashboardName", e.target.value)
//                   }
//                   className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   placeholder="Enter dashboard name"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Company Name
//                 </label>

//                 <input
//                   type="text"
//                   value={settings.companyName}
//                   onChange={(e) =>
//                     updateSetting("companyName", e.target.value)
//                   }
//                   className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   placeholder="Enter company name"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Currency
//                 </label>

//                 <select
//                   value={settings.currency}
//                   onChange={(e) =>
//                     updateSetting("currency", e.target.value)
//                   }
//                   className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                 >
//                   <option value="INR">INR - Indian Rupee</option>
//                   <option value="USD">USD - US Dollar</option>
//                   <option value="EUR">EUR - Euro</option>
//                   <option value="GBP">GBP - British Pound</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Date Format
//                 </label>

//                 <select
//                   value={settings.dateFormat}
//                   onChange={(e) =>
//                     updateSetting("dateFormat", e.target.value)
//                   }
//                   className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                 >
//                   <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//                   <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//                   <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//                 </select>
//               </div>
//             </div>
//           </section>

//           {/* Appearance */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-purple-100 p-2.5">
//                 <Palette className="h-5 w-5 text-purple-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   Appearance
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Customize the dashboard appearance
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-6 p-6">
//               <div>
//                 <label className="mb-3 block text-sm font-medium text-gray-700">
//                   Theme
//                 </label>

//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
//                   {[
//                     {
//                       value: "light",
//                       label: "Light",
//                       icon: Sun,
//                     },
//                     {
//                       value: "dark",
//                       label: "Dark",
//                       icon: Moon,
//                     },
//                     {
//                       value: "system",
//                       label: "System",
//                       icon: Monitor,
//                     },
//                   ].map((item) => {
//                     const Icon = item.icon;
//                     const selected = settings.theme === item.value;

//                     return (
//                       <button
//                         key={item.value}
//                         onClick={() =>
//                           updateSetting(
//                             "theme",
//                             item.value as SettingsData["theme"]
//                           )
//                         }
//                         className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
//                           selected
//                             ? "border-indigo-500 bg-indigo-50 text-indigo-700"
//                             : "border-gray-200 bg-white hover:border-gray-300"
//                         }`}
//                       >
//                         <Icon className="h-5 w-5" />

//                         <span className="font-medium">
//                           {item.label}
//                         </span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div>
//                 <label className="mb-3 block text-sm font-medium text-gray-700">
//                   Dashboard Layout
//                 </label>

//                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
//                   <button
//                     onClick={() =>
//                       updateSetting("layout", "comfortable")
//                     }
//                     className={`rounded-xl border p-4 text-left ${
//                       settings.layout === "comfortable"
//                         ? "border-indigo-500 bg-indigo-50"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <p className="font-semibold">Comfortable</p>
//                     <p className="mt-1 text-sm text-gray-500">
//                       More spacing between dashboard elements
//                     </p>
//                   </button>

//                   <button
//                     onClick={() =>
//                       updateSetting("layout", "compact")
//                     }
//                     className={`rounded-xl border p-4 text-left ${
//                       settings.layout === "compact"
//                         ? "border-indigo-500 bg-indigo-50"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <p className="font-semibold">Compact</p>
//                     <p className="mt-1 text-sm text-gray-500">
//                       More information in less space
//                     </p>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Data Settings */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-green-100 p-2.5">
//                 <Database className="h-5 w-5 text-green-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   Data & Upload
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Configure dataset behavior
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-5 p-6">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Preview Rows
//                 </label>

//                 <select
//                   value={settings.previewRows}
//                   onChange={(e) =>
//                     updateSetting(
//                       "previewRows",
//                       Number(e.target.value)
//                     )
//                   }
//                   className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 md:w-1/2"
//                 >
//                   <option value={5}>5 rows</option>
//                   <option value={10}>10 rows</option>
//                   <option value={20}>20 rows</option>
//                   <option value={50}>50 rows</option>
//                 </select>
//               </div>

//               <ToggleRow
//                 title="Automatically refresh dashboard"
//                 description="Refresh dashboard information after data updates"
//                 enabled={settings.autoRefresh}
//                 onChange={(value) =>
//                   updateSetting("autoRefresh", value)
//                 }
//               />
//             </div>
//           </section>

//           {/* Report Settings */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-orange-100 p-2.5">
//                 <FileText className="h-5 w-5 text-orange-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   Report Settings
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Configure generated business reports
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-5 p-6">
//               <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">
//                     Report Title
//                   </label>

//                   <input
//                     type="text"
//                     value={settings.reportTitle}
//                     onChange={(e) =>
//                       updateSetting("reportTitle", e.target.value)
//                     }
//                     className="w-full rounded-xl border border-gray-300 px-4 py-3"
//                   />
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-gray-700">
//                     Prepared By
//                   </label>

//                   <input
//                     type="text"
//                     value={settings.preparedBy}
//                     onChange={(e) =>
//                       updateSetting("preparedBy", e.target.value)
//                     }
//                     className="w-full rounded-xl border border-gray-300 px-4 py-3"
//                     placeholder="Enter your name"
//                   />
//                 </div>
//               </div>

//               <ToggleRow
//                 title="Show charts in reports"
//                 description="Include charts and visual analytics in generated reports"
//                 enabled={settings.showCharts}
//                 onChange={(value) =>
//                   updateSetting("showCharts", value)
//                 }
//               />

//               <ToggleRow
//                 title="Show AI insights"
//                 description="Include AI-generated business insights in reports"
//                 enabled={settings.showAIInsights}
//                 onChange={(value) =>
//                   updateSetting("showAIInsights", value)
//                 }
//               />
//             </div>
//           </section>

//           {/* Notifications */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-pink-100 p-2.5">
//                 <Bell className="h-5 w-5 text-pink-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   Notifications
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Control dashboard notifications
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-5 p-6">
//               <ToggleRow
//                 title="Upload notifications"
//                 description="Notify when a dataset has been uploaded"
//                 enabled={settings.uploadNotifications}
//                 onChange={(value) =>
//                   updateSetting("uploadNotifications", value)
//                 }
//               />

//               <ToggleRow
//                 title="Report notifications"
//                 description="Notify when a report is generated"
//                 enabled={settings.reportNotifications}
//                 onChange={(value) =>
//                   updateSetting("reportNotifications", value)
//                 }
//               />

//               <ToggleRow
//                 title="AI insight notifications"
//                 description="Notify when new AI insights are available"
//                 enabled={settings.aiNotifications}
//                 onChange={(value) =>
//                   updateSetting("aiNotifications", value)
//                 }
//               />
//             </div>
//           </section>
//         </div>

//         {/* Right side */}
//         <div className="space-y-6">
//           {/* System Status */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center gap-3 border-b border-gray-100 p-6">
//               <div className="rounded-xl bg-cyan-100 p-2.5">
//                 <Server className="h-5 w-5 text-cyan-600" />
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold">
//                   System Status
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   Application health
//                 </p>
//               </div>
//             </div>

//             <div className="space-y-4 p-6">
//               <StatusRow
//                 title="Frontend"
//                 status="Online"
//               />

//               <StatusRow
//                 title="Backend API"
//                 status={getStatusText()}
//               />

//               <StatusRow
//                 title="Settings Storage"
//                 status="Local"
//               />
//             </div>

//             <div className="border-t border-gray-100 p-6">
//               <button
//                 onClick={checkBackend}
//                 className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50"
//               >
//                 Check Backend Connection
//               </button>
//             </div>
//           </section>

//           {/* Current Configuration */}
//           <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="border-b border-gray-100 p-6">
//               <h2 className="text-lg font-semibold">
//                 Current Configuration
//               </h2>

//               <p className="mt-1 text-sm text-gray-500">
//                 Quick overview of your settings
//               </p>
//             </div>

//             <div className="space-y-4 p-6">
//               <InfoRow
//                 label="Dashboard"
//                 value={settings.dashboardName}
//               />

//               <InfoRow
//                 label="Currency"
//                 value={settings.currency}
//               />

//               <InfoRow
//                 label="Date Format"
//                 value={settings.dateFormat}
//               />

//               <InfoRow
//                 label="Theme"
//                 value={
//                   settings.theme.charAt(0).toUpperCase() +
//                   settings.theme.slice(1)
//                 }
//               />

//               <InfoRow
//                 label="Layout"
//                 value={
//                   settings.layout.charAt(0).toUpperCase() +
//                   settings.layout.slice(1)
//                 }
//               />

//               <InfoRow
//                 label="Preview Rows"
//                 value={`${settings.previewRows}`}
//               />
//             </div>
//           </section>

//           {/* About */}
//           <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
//             <SettingsIcon className="mb-4 h-8 w-8" />

//             <h2 className="text-xl font-bold">
//               AI Business Analytics
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-indigo-100">
//               Configure your analytics dashboard, reports,
//               notifications and data preferences from one place.
//             </p>

//             <div className="mt-5 rounded-xl bg-white/10 p-4">
//               <p className="text-xs text-indigo-200">
//                 Application
//               </p>

//               <p className="mt-1 font-semibold">
//                 AI Business Analytics Dashboard
//               </p>

//               <p className="mt-3 text-xs text-indigo-200">
//                 Version 1.0.0
//               </p>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------
//    Toggle Component
// ---------------------------------- */

// interface ToggleRowProps {
//   title: string;
//   description: string;
//   enabled: boolean;
//   onChange: (value: boolean) => void;
// }

// const ToggleRow: React.FC<ToggleRowProps> = ({
//   title,
//   description,
//   enabled,
//   onChange,
// }) => {
//   return (
//     <div className="flex items-center justify-between gap-5 rounded-xl border border-gray-200 p-4">
//       <div>
//         <p className="font-medium text-gray-800">
//           {title}
//         </p>

//         <p className="mt-1 text-sm text-gray-500">
//           {description}
//         </p>
//       </div>

//       <button
//         type="button"
//         onClick={() => onChange(!enabled)}
//         className={`relative h-6 w-11 shrink-0 rounded-full transition ${
//           enabled ? "bg-indigo-600" : "bg-gray-300"
//         }`}
//       >
//         <span
//           className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
//             enabled ? "left-6" : "left-1"
//           }`}
//         />
//       </button>
//     </div>
//   );
// };

// /* ---------------------------------
//    Status Component
// ---------------------------------- */

// interface StatusRowProps {
//   title: string;
//   status: string;
// }

// const StatusRow: React.FC<StatusRowProps> = ({
//   title,
//   status,
// }) => {
//   const isOffline = status === "Offline";
//   const isChecking = status === "Checking...";

//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-sm font-medium text-gray-700">
//         {title}
//       </span>

//       <div className="flex items-center gap-2">
//         <span
//           className={`h-2.5 w-2.5 rounded-full ${
//             isOffline
//               ? "bg-red-500"
//               : isChecking
//               ? "bg-yellow-500"
//               : "bg-green-500"
//           }`}
//         />

//         <span
//           className={`text-sm ${
//             isOffline
//               ? "text-red-600"
//               : isChecking
//               ? "text-yellow-600"
//               : "text-green-600"
//           }`}
//         >
//           {status}
//         </span>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------
//    Info Component
// ---------------------------------- */

// interface InfoRowProps {
//   label: string;
//   value: string;
// }

// const InfoRow: React.FC<InfoRowProps> = ({
//   label,
//   value,
// }) => {
//   return (
//     <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
//       <span className="text-sm text-gray-500">
//         {label}
//       </span>

//       <span className="max-w-[60%] text-right text-sm font-medium text-gray-800">
//         {value}
//       </span>
//     </div>
//   );
// };

// // export default Settings;


import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Palette,
  Database,
  FileText,
  Bell,
  Server,
  Save,
  RotateCcw,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

import {
  useSettings,
} from "../context/SettingsContext";

const Settings: React.FC = () => {
  const {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
  } = useSettings();

  const [saved, setSaved] = useState(false);

  const [apiStatus, setApiStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setApiStatus("checking");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/docs"
      );

      if (response.ok) {
        setApiStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch {
      setApiStatus("offline");
    }
  };

  const handleSave = () => {
    saveSettings();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings to default?"
    );

    if (!confirmed) return;

    resetSettings();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        settings.theme === "dark"
          ? "bg-slate-950 text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3">
            <SettingsIcon className="h-7 w-7 text-indigo-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Settings
            </h1>

            <p
              className={`mt-1 text-sm ${
                settings.theme === "dark"
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              Manage your dashboard preferences and system
              configuration
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          Settings saved successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">

          {/* GENERAL */}
          <SettingsCard
            icon={<User className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-100"
            title="General Settings"
            description="Basic dashboard information"
            dark={settings.theme === "dark"}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Dashboard Name"
                value={settings.dashboardName}
                onChange={(value) =>
                  updateSetting("dashboardName", value)
                }
                dark={settings.theme === "dark"}
              />

              <InputField
                label="Company Name"
                value={settings.companyName}
                onChange={(value) =>
                  updateSetting("companyName", value)
                }
                dark={settings.theme === "dark"}
              />

              <SelectField
                label="Currency"
                value={settings.currency}
                onChange={(value) =>
                  updateSetting("currency", value)
                }
                options={[
                  ["INR", "INR - Indian Rupee"],
                  ["USD", "USD - US Dollar"],
                  ["EUR", "EUR - Euro"],
                  ["GBP", "GBP - British Pound"],
                ]}
                dark={settings.theme === "dark"}
              />

              <SelectField
                label="Date Format"
                value={settings.dateFormat}
                onChange={(value) =>
                  updateSetting("dateFormat", value)
                }
                options={[
                  ["DD/MM/YYYY", "DD/MM/YYYY"],
                  ["MM/DD/YYYY", "MM/DD/YYYY"],
                  ["YYYY-MM-DD", "YYYY-MM-DD"],
                ]}
                dark={settings.theme === "dark"}
              />
            </div>
          </SettingsCard>

          {/* APPEARANCE */}
          <SettingsCard
            icon={<Palette className="h-5 w-5 text-purple-600" />}
            iconBg="bg-purple-100"
            title="Appearance"
            description="Customize the dashboard appearance"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Theme
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <ThemeButton
                    label="Light"
                    icon={<Sun className="h-5 w-5" />}
                    selected={settings.theme === "light"}
                    onClick={() =>
                      updateSetting("theme", "light")
                    }
                  />

                  <ThemeButton
                    label="Dark"
                    icon={<Moon className="h-5 w-5" />}
                    selected={settings.theme === "dark"}
                    onClick={() =>
                      updateSetting("theme", "dark")
                    }
                  />

                  <ThemeButton
                    label="System"
                    icon={<Monitor className="h-5 w-5" />}
                    selected={settings.theme === "system"}
                    onClick={() =>
                      updateSetting("theme", "system")
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Dashboard Layout
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <LayoutButton
                    title="Comfortable"
                    description="More spacing between dashboard elements"
                    selected={
                      settings.layout === "comfortable"
                    }
                    onClick={() =>
                      updateSetting(
                        "layout",
                        "comfortable"
                      )
                    }
                  />

                  <LayoutButton
                    title="Compact"
                    description="More information in less space"
                    selected={
                      settings.layout === "compact"
                    }
                    onClick={() =>
                      updateSetting(
                        "layout",
                        "compact"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* DATA */}
          <SettingsCard
            icon={<Database className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
            title="Data & Upload"
            description="Configure dataset behavior"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-5">
              <SelectField
                label="Preview Rows"
                value={String(settings.previewRows)}
                onChange={(value) =>
                  updateSetting(
                    "previewRows",
                    Number(value)
                  )
                }
                options={[
                  ["5", "5 rows"],
                  ["10", "10 rows"],
                  ["20", "20 rows"],
                  ["50", "50 rows"],
                ]}
                dark={settings.theme === "dark"}
              />

              <ToggleRow
                title="Automatically refresh dashboard"
                description="Refresh dashboard information after data updates"
                enabled={settings.autoRefresh}
                onChange={(value) =>
                  updateSetting("autoRefresh", value)
                }
              />
            </div>
          </SettingsCard>

          {/* REPORT */}
          <SettingsCard
            icon={<FileText className="h-5 w-5 text-orange-600" />}
            iconBg="bg-orange-100"
            title="Report Settings"
            description="Configure generated business reports"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField
                  label="Report Title"
                  value={settings.reportTitle}
                  onChange={(value) =>
                    updateSetting("reportTitle", value)
                  }
                  dark={settings.theme === "dark"}
                />

                <InputField
                  label="Prepared By"
                  value={settings.preparedBy}
                  onChange={(value) =>
                    updateSetting("preparedBy", value)
                  }
                  placeholder="Enter your name"
                  dark={settings.theme === "dark"}
                />
              </div>

              <ToggleRow
                title="Show charts in reports"
                description="Include charts and visual analytics"
                enabled={settings.showCharts}
                onChange={(value) =>
                  updateSetting("showCharts", value)
                }
              />

              <ToggleRow
                title="Show AI insights"
                description="Include AI-generated business insights"
                enabled={settings.showAIInsights}
                onChange={(value) =>
                  updateSetting("showAIInsights", value)
                }
              />
            </div>
          </SettingsCard>

          {/* NOTIFICATIONS */}
          <SettingsCard
            icon={<Bell className="h-5 w-5 text-pink-600" />}
            iconBg="bg-pink-100"
            title="Notifications"
            description="Control dashboard notifications"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-5">
              <ToggleRow
                title="Upload notifications"
                description="Notify when a dataset has been uploaded"
                enabled={settings.uploadNotifications}
                onChange={(value) =>
                  updateSetting(
                    "uploadNotifications",
                    value
                  )
                }
              />

              <ToggleRow
                title="Report notifications"
                description="Notify when a report is generated"
                enabled={settings.reportNotifications}
                onChange={(value) =>
                  updateSetting(
                    "reportNotifications",
                    value
                  )
                }
              />

              <ToggleRow
                title="AI insight notifications"
                description="Notify when new AI insights are available"
                enabled={settings.aiNotifications}
                onChange={(value) =>
                  updateSetting(
                    "aiNotifications",
                    value
                  )
                }
              />
            </div>
          </SettingsCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* SYSTEM STATUS */}
          <SettingsCard
            icon={<Server className="h-5 w-5 text-cyan-600" />}
            iconBg="bg-cyan-100"
            title="System Status"
            description="Application health"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-4">
              <StatusRow
                title="Frontend"
                status="Online"
              />

              <StatusRow
                title="Backend API"
                status={
                  apiStatus === "checking"
                    ? "Checking..."
                    : apiStatus === "online"
                    ? "Online"
                    : "Offline"
                }
              />

              <StatusRow
                title="Settings Storage"
                status="Local"
              />

              <button
                onClick={checkBackend}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50"
              >
                Check Backend Connection
              </button>
            </div>
          </SettingsCard>

          {/* CURRENT CONFIG */}
          <SettingsCard
            title="Current Configuration"
            description="Quick overview of your settings"
            dark={settings.theme === "dark"}
          >
            <div className="space-y-4">
              <InfoRow
                label="Dashboard"
                value={settings.dashboardName}
              />

              <InfoRow
                label="Company"
                value={settings.companyName}
              />

              <InfoRow
                label="Currency"
                value={settings.currency}
              />

              <InfoRow
                label="Date Format"
                value={settings.dateFormat}
              />

              <InfoRow
                label="Theme"
                value={settings.theme}
              />

              <InfoRow
                label="Layout"
                value={settings.layout}
              />

              <InfoRow
                label="Preview Rows"
                value={String(settings.previewRows)}
              />
            </div>
          </SettingsCard>

          {/* ABOUT */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white shadow-lg">
            <SettingsIcon className="mb-4 h-8 w-8" />

            <h2 className="text-xl font-bold">
              {settings.dashboardName}
            </h2>

            <p className="mt-2 text-sm leading-6 text-indigo-100">
              Configure your analytics dashboard, reports,
              notifications and data preferences from one place.
            </p>

            <div className="mt-5 rounded-xl bg-white/10 p-4">
              <p className="text-xs text-indigo-200">
                Company
              </p>

              <p className="mt-1 font-semibold">
                {settings.companyName}
              </p>

              <p className="mt-3 text-xs text-indigo-200">
                Version 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================
   SETTINGS CARD
========================================= */

interface SettingsCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconBg?: string;
  dark: boolean;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  children,
  title,
  description,
  icon,
  iconBg = "bg-gray-100",
  dark,
}) => {
  return (
    <section
      className={`rounded-2xl border shadow-sm ${
        dark
          ? "border-slate-700 bg-slate-900"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`flex items-center gap-3 border-b p-6 ${
          dark ? "border-slate-700" : "border-gray-100"
        }`}
      >
        {icon && (
          <div className={`rounded-xl p-2.5 ${iconBg}`}>
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <p
            className={`text-sm ${
              dark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">{children}</div>
    </section>
  );
};

/* =========================================
   INPUT
========================================= */

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dark: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  dark,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
          dark
            ? "border-slate-600 bg-slate-800 text-white"
            : "border-gray-300 bg-white text-gray-900"
        }`}
      />
    </div>
  );
};

/* =========================================
   SELECT
========================================= */

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  dark: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  dark,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border px-4 py-3 outline-none ${
          dark
            ? "border-slate-600 bg-slate-800 text-white"
            : "border-gray-300 bg-white text-gray-900"
        }`}
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================
   THEME BUTTON
========================================= */

interface ThemeButtonProps {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  label,
  icon,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
          : "border-gray-300 hover:border-indigo-300"
      }`}
    >
      {icon}

      <span className="font-medium">
        {label}
      </span>

      {selected && (
        <CheckCircle2 className="ml-auto h-5 w-5" />
      )}
    </button>
  );
};

/* =========================================
   LAYOUT BUTTON
========================================= */

interface LayoutButtonProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const LayoutButton: React.FC<LayoutButtonProps> = ({
  title,
  description,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-left transition ${
        selected
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-300 hover:border-indigo-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-semibold">{title}</p>

        {selected && (
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </button>
  );
};

/* =========================================
   TOGGLE
========================================= */

interface ToggleRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  title,
  description,
  enabled,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-gray-200 p-4">
      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-indigo-600"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

/* =========================================
   STATUS
========================================= */

interface StatusRowProps {
  title: string;
  status: string;
}

const StatusRow: React.FC<StatusRowProps> = ({
  title,
  status,
}) => {
  const offline = status === "Offline";
  const checking = status === "Checking...";

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">
        {title}
      </span>

      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            offline
              ? "bg-red-500"
              : checking
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />

        <span
          className={`text-sm ${
            offline
              ? "text-red-600"
              : checking
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

/* =========================================
   INFO
========================================= */

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-medium">
        {value || "Not set"}
      </span>
    </div>
  );
};

export default Settings;