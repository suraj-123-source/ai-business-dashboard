
// import { useState } from "react";
// import { FileDown } from "lucide-react";

// import Navbar from "../components/Navbar";
// import UploadCard from "../components/Upload/UploadCard";
// import AIInsights from "../components/AI/AIInsights";

// import DynamicKPIs from "../components/DynamicKPIs";
// import DynamicCharts from "../components/DynamicCharts";

// interface DashboardProps {
//   dashboardData: any;
//   setDashboardData: (data: any) => void;
// }

// export default function Dashboard({
//   dashboardData,
//   setDashboardData,
// }: DashboardProps) {
//   const [search, setSearch] = useState("");

//   const [notification, setNotification] = useState({
//     show: false,
//     message: "",
//     type: "info" as "success" | "error" | "info",
//   });

//   return (
//     <>
//       <style>{`
//         @media print {
//           body {
//             background: white !important;
//           }

//           nav,
//           aside,
//           button,
//           input,
//           .no-print {
//             display: none !important;
//           }

//           main {
//             overflow: visible !important;
//             padding: 24px !important;
//             width: 100% !important;
//           }

//           .print-card {
//             break-inside: avoid;
//           }
//         }
//       `}</style>

//       <div className="flex-1 flex flex-col">

//       {/* =====================================================
//           NAVBAR
//       ===================================================== */}

//       <Navbar
//         search={search}
//         setSearch={setSearch}
//         onSearch={() => {
//           if (!search.trim()) {
//             setNotification({
//               show: true,
//               message: "Please enter something to search.",
//               type: "info",
//             });

//             setTimeout(() => {
//               setNotification((prev) => ({
//                 ...prev,
//                 show: false,
//               }));
//             }, 3000);

//             return;
//           }

//           /*
//            * Universal search:
//            * Search through all detected columns instead of
//            * only searching Product.
//            */

//           const preview = dashboardData?.preview || [];

//           const results = preview.filter((row: any) =>
//             Object.values(row).some((value: any) =>
//               String(value ?? "")
//                 .toLowerCase()
//                 .includes(search.toLowerCase())
//             )
//           );

//           setNotification({
//             show: true,
//             message:
//               results.length > 0
//                 ? `🔍 Found ${results.length} matching record(s) for "${search}"`
//                 : `❌ No records found for "${search}"`,
//             type: results.length > 0 ? "success" : "error",
//           });

//           setTimeout(() => {
//             setNotification((prev) => ({
//               ...prev,
//               show: false,
//             }));
//           }, 3000);
//         }}
//       />

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <main className="flex-1 overflow-auto p-8">

//         {/* =====================================================
//             NOTIFICATION
//         ===================================================== */}

//         {notification.show && (
//           <div
//             className={`mb-6 p-4 rounded-xl border ${
//               notification.type === "success"
//                 ? "bg-green-900/20 border-green-600 text-green-400"
//                 : notification.type === "error"
//                 ? "bg-red-900/20 border-red-600 text-red-400"
//                 : "bg-blue-900/20 border-blue-600 text-blue-400"
//             }`}
//           >
//             {notification.message}
//           </div>
//         )}

//         {/* =====================================================
//             HEADER
//         ===================================================== */}

//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

//           <div>
//             <h1 className="text-3xl font-bold text-white">
//               AI Business Analytics
//             </h1>

//             <p className="text-slate-400 mt-2">
//               Automatically analyze any CSV or Excel dataset.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => {
//                 if (!dashboardData) {
//                   setNotification({
//                     show: true,
//                     message: "Please upload a dataset before exporting the report.",
//                     type: "info",
//                   });

//                   setTimeout(() => {
//                     setNotification((prev) => ({
//                       ...prev,
//                       show: false,
//                     }));
//                   }, 3000);

//                   return;
//                 }

//                 window.print();
//               }}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-600/20"
//             >
//               <FileDown size={18} />
//               Export Report
//             </button>

//             <p className="text-slate-400">
//               Welcome back 👋
//             </p>
//           </div>

//         </div>


//         {/* =====================================================
//             UPLOAD
//         ===================================================== */}

//         <UploadCard
//           onUploadSuccess={setDashboardData}
//           showNotification={(message, type) => {
//             setNotification({
//               show: true,
//               message,
//               type,
//             });

//             setTimeout(() => {
//               setNotification((prev) => ({
//                 ...prev,
//                 show: false,
//               }));
//             }, 3000);
//           }}
//         />


//         {/* =====================================================
//             DATASET INFORMATION
//         ===================================================== */}

//         {dashboardData && (
//           <div className="mt-6 p-6 rounded-xl bg-green-900/20 border border-green-600">

//             <h2 className="text-xl font-bold text-green-400">
//               Dataset Analyzed Successfully ✅
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

//               <div>
//                 <p className="text-slate-400 text-sm">
//                   File
//                 </p>

//                 <p className="text-white font-semibold">
//                   {dashboardData.filename}
//                 </p>
//               </div>


//               <div>
//                 <p className="text-slate-400 text-sm">
//                   Records
//                 </p>

//                 <p className="text-white font-semibold">
//                   {dashboardData.rows?.toLocaleString() ?? 0}
//                 </p>
//               </div>


//               <div>
//                 <p className="text-slate-400 text-sm">
//                   Columns
//                 </p>

//                 <p className="text-white font-semibold">
//                   {dashboardData.columns?.length ?? 0}
//                 </p>
//               </div>

//             </div>

//           </div>
//         )}


//         {/* =====================================================
//             DYNAMIC KPI CARDS
//         ===================================================== */}

//         {dashboardData && (
//           <div className="mt-8">

//             <div className="mb-4">

//               <h2 className="text-2xl font-bold text-white">
//                 Key Metrics
//               </h2>

//               <p className="text-slate-400 mt-1">
//                 Metrics automatically detected from your dataset.
//               </p>

//             </div>

//             <DynamicKPIs
//               kpis={dashboardData.kpis || []}
//             />

//           </div>
//         )}


//         {/* =====================================================
//             DETECTED COLUMNS
//         ===================================================== */}

//         {dashboardData?.detectedColumns && (
//           <div className="mt-8">

//             <h2 className="text-2xl font-bold text-white mb-4">
//               Detected Data Types
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

//               {/* Numeric */}

//               <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

//                 <h3 className="text-blue-400 font-semibold">
//                   🔢 Numeric
//                 </h3>

//                 <div className="mt-3 space-y-1">

//                   {dashboardData.detectedColumns.numeric?.length > 0 ? (
//                     dashboardData.detectedColumns.numeric.map(
//                       (column: string) => (
//                         <p
//                           key={column}
//                           className="text-slate-300 text-sm"
//                         >
//                           • {column}
//                         </p>
//                       )
//                     )
//                   ) : (
//                     <p className="text-slate-500 text-sm">
//                       None detected
//                     </p>
//                   )}

//                 </div>

//               </div>


//               {/* Categorical */}

//               <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

//                 <h3 className="text-purple-400 font-semibold">
//                   🏷️ Categories
//                 </h3>

//                 <div className="mt-3 space-y-1">

//                   {dashboardData.detectedColumns.categorical?.length > 0 ? (
//                     dashboardData.detectedColumns.categorical.map(
//                       (column: string) => (
//                         <p
//                           key={column}
//                           className="text-slate-300 text-sm"
//                         >
//                           • {column}
//                         </p>
//                       )
//                     )
//                   ) : (
//                     <p className="text-slate-500 text-sm">
//                       None detected
//                     </p>
//                   )}

//                 </div>

//               </div>


//               {/* Text */}

//               <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

//                 <h3 className="text-yellow-400 font-semibold">
//                   📝 Text
//                 </h3>

//                 <div className="mt-3 space-y-1">

//                   {dashboardData.detectedColumns.text?.length > 0 ? (
//                     dashboardData.detectedColumns.text.map(
//                       (column: string) => (
//                         <p
//                           key={column}
//                           className="text-slate-300 text-sm"
//                         >
//                           • {column}
//                         </p>
//                       )
//                     )
//                   ) : (
//                     <p className="text-slate-500 text-sm">
//                       None detected
//                     </p>
//                   )}

//                 </div>

//               </div>


//               {/* Dates */}

//               <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

//                 <h3 className="text-green-400 font-semibold">
//                   📅 Dates
//                 </h3>

//                 <div className="mt-3 space-y-1">

//                   {dashboardData.detectedColumns.date?.length > 0 ? (
//                     dashboardData.detectedColumns.date.map(
//                       (column: string) => (
//                         <p
//                           key={column}
//                           className="text-slate-300 text-sm"
//                         >
//                           • {column}
//                         </p>
//                       )
//                     )
//                   ) : (
//                     <p className="text-slate-500 text-sm">
//                       None detected
//                     </p>
//                   )}

//                 </div>

//               </div>

//             </div>

//           </div>
//         )}


//         {/* =====================================================
//             DYNAMIC CHARTS
//         ===================================================== */}

//         {dashboardData && (
//           <div className="mt-8">

//             <h2 className="text-2xl font-bold text-white mb-4">
//               Automatic Data Analysis
//             </h2>

//             <p className="text-slate-400 mb-6">
//               Charts are generated automatically based on the
//               columns detected in your file.
//             </p>

//             <DynamicCharts
//               groupedAnalysis={
//                 dashboardData.groupedAnalysis || []
//               }

//               dateAnalysis={
//                 dashboardData.dateAnalysis || []
//               }

//               categoryAnalysis={
//                 dashboardData.categoryAnalysis || []
//               }
//             />

//           </div>
//         )}


//         {/* =====================================================
//             AI INSIGHTS
//         ===================================================== */}

//         {dashboardData && (
//           <div className="mt-8">

//             {/* <AIInsights
//               insights={dashboardData.aiInsights || []}
//             /> */}

//             <AIInsights
//              insights={dashboardData?.aiInsights}
//              dashboardData={dashboardData}
//             />

//           </div>
//         )}


//         {/* =====================================================
//             DATA PREVIEW
//         ===================================================== */}

//         {dashboardData?.preview?.length > 0 && (
//           <div className="mt-8">

//             <h2 className="text-2xl font-bold text-white mb-4">
//               Data Preview
//             </h2>

//             <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-auto">

//               <table className="w-full text-sm">

//                 <thead className="bg-slate-800">

//                   <tr>

//                     {dashboardData.columns.map(
//                       (column: string) => (
//                         <th
//                           key={column}
//                           className="text-left px-4 py-3 text-slate-300 whitespace-nowrap"
//                         >
//                           {column}
//                         </th>
//                       )
//                     )}

//                   </tr>

//                 </thead>


//                 <tbody>

//                   {dashboardData.preview.map(
//                     (row: any, rowIndex: number) => (

//                       <tr
//                         key={rowIndex}
//                         className="border-t border-slate-800"
//                       >

//                         {dashboardData.columns.map(
//                           (column: string) => (

//                             <td
//                               key={column}
//                               className="px-4 py-3 text-slate-400 whitespace-nowrap"
//                             >
//                               {row[column] ?? "-"}
//                             </td>

//                           )
//                         )}

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>
//         )}

//       </main>

//       </div>
//     </>
//   );
// }


import { useState } from "react";
import { FileDown, Building2, Coins, CalendarDays } from "lucide-react";

import Navbar from "../components/Navbar";
import UploadCard from "../components/Upload/UploadCard";
import AIInsights from "../components/AI/AIInsights";

import DynamicKPIs from "../components/DynamicKPIs";
import DynamicCharts from "../components/DynamicCharts";

import { useSettings } from "../context/SettingsContext";

interface DashboardProps {
  dashboardData: any;
  setDashboardData: (data: any) => void;
}

export default function Dashboard({
  dashboardData,
  setDashboardData,
}: DashboardProps) {
  const [search, setSearch] = useState("");

  const { settings } = useSettings();

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
    <>
      <style>{`
        @media print {
          body {
            background: white !important;
          }

          nav,
          aside,
          button,
          input,
          .no-print {
            display: none !important;
          }

          main {
            overflow: visible !important;
            padding: 24px !important;
            width: 100% !important;
          }

          .print-card {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex-1 flex flex-col">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <Navbar
          search={search}
          setSearch={setSearch}
          onSearch={() => {
            if (!search.trim()) {
              showNotification(
                "Please enter something to search.",
                "info"
              );

              return;
            }

            /*
             * Universal search:
             * Search through all detected columns.
             */

            const preview = dashboardData?.preview || [];

            const results = preview.filter((row: any) =>
              Object.values(row).some((value: any) =>
                String(value ?? "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
            );

            showNotification(
              results.length > 0
                ? `🔍 Found ${results.length} matching record(s) for "${search}"`
                : `❌ No records found for "${search}"`,
              results.length > 0 ? "success" : "error"
            );
          }}
        />

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="flex-1 overflow-auto p-8">

          {/* =====================================================
              NOTIFICATION
          ===================================================== */}

          {notification.show && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                notification.type === "success"
                  ? "bg-green-900/20 border-green-600 text-green-400"
                  : notification.type === "error"
                  ? "bg-red-900/20 border-red-600 text-red-400"
                  : "bg-blue-900/20 border-blue-600 text-blue-400"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* =====================================================
              HEADER
          ===================================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

            <div>
              <h1 className="text-3xl font-bold text-white">
                {settings.dashboardName}
              </h1>

              <p className="text-slate-400 mt-2">
                Automatically analyze any CSV or Excel dataset.
              </p>

              {/* General Settings Information */}
              <div className="flex flex-wrap items-center gap-3 mt-4">

                {/* Company */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <Building2
                    size={15}
                    className="text-blue-400"
                  />

                  <span className="text-sm text-slate-300">
                    {settings.companyName || "My Company"}
                  </span>
                </div>

                {/* Currency */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <Coins
                    size={15}
                    className="text-green-400"
                  />

                  <span className="text-sm text-slate-300">
                    {settings.currency}
                  </span>
                </div>

                {/* Date Format */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <CalendarDays
                    size={15}
                    className="text-purple-400"
                  />

                  <span className="text-sm text-slate-300">
                    {settings.dateFormat}
                  </span>
                </div>

              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">

              <button
                type="button"
                onClick={() => {
                  if (!dashboardData) {
                    showNotification(
                      "Please upload a dataset before exporting the report.",
                      "info"
                    );

                    return;
                  }

                  window.print();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg shadow-blue-600/20"
              >
                <FileDown size={18} />
                Export Report
              </button>

              <p className="text-slate-400">
                Welcome back 👋
              </p>

            </div>

          </div>

          {/* =====================================================
              UPLOAD
          ===================================================== */}

          <UploadCard
            onUploadSuccess={setDashboardData}
            showNotification={(message, type) => {
              showNotification(message, type);
            }}
          />

          {/* =====================================================
              DATASET INFORMATION
          ===================================================== */}

          {dashboardData && (
            <div className="mt-6 p-6 rounded-xl bg-green-900/20 border border-green-600">

              <h2 className="text-xl font-bold text-green-400">
                Dataset Analyzed Successfully ✅
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                <div>
                  <p className="text-slate-400 text-sm">
                    File
                  </p>

                  <p className="text-white font-semibold">
                    {dashboardData.filename}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Records
                  </p>

                  <p className="text-white font-semibold">
                    {dashboardData.rows?.toLocaleString() ?? 0}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">
                    Columns
                  </p>

                  <p className="text-white font-semibold">
                    {dashboardData.columns?.length ?? 0}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* =====================================================
              DYNAMIC KPI CARDS
          ===================================================== */}

          {dashboardData && (
            <div className="mt-8">

              <div className="mb-4">

                <h2 className="text-2xl font-bold text-white">
                  Key Metrics
                </h2>

                <p className="text-slate-400 mt-1">
                  Metrics automatically detected from your dataset.
                </p>

              </div>

              <DynamicKPIs
                kpis={dashboardData.kpis || []}
              />

            </div>
          )}

          {/* =====================================================
              DETECTED COLUMNS
          ===================================================== */}

          {dashboardData?.detectedColumns && (
            <div className="mt-8">

              <h2 className="text-2xl font-bold text-white mb-4">
                Detected Data Types
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Numeric */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                  <h3 className="text-blue-400 font-semibold">
                    🔢 Numeric
                  </h3>

                  <div className="mt-3 space-y-1">

                    {dashboardData.detectedColumns.numeric?.length > 0 ? (
                      dashboardData.detectedColumns.numeric.map(
                        (column: string) => (
                          <p
                            key={column}
                            className="text-slate-300 text-sm"
                          >
                            • {column}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-slate-500 text-sm">
                        None detected
                      </p>
                    )}

                  </div>

                </div>

                {/* Categorical */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                  <h3 className="text-purple-400 font-semibold">
                    🏷️ Categories
                  </h3>

                  <div className="mt-3 space-y-1">

                    {dashboardData.detectedColumns.categorical?.length > 0 ? (
                      dashboardData.detectedColumns.categorical.map(
                        (column: string) => (
                          <p
                            key={column}
                            className="text-slate-300 text-sm"
                          >
                            • {column}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-slate-500 text-sm">
                        None detected
                      </p>
                    )}

                  </div>

                </div>

                {/* Text */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                  <h3 className="text-yellow-400 font-semibold">
                    📝 Text
                  </h3>

                  <div className="mt-3 space-y-1">

                    {dashboardData.detectedColumns.text?.length > 0 ? (
                      dashboardData.detectedColumns.text.map(
                        (column: string) => (
                          <p
                            key={column}
                            className="text-slate-300 text-sm"
                          >
                            • {column}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-slate-500 text-sm">
                        None detected
                      </p>
                    )}

                  </div>

                </div>

                {/* Dates */}

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                  <h3 className="text-green-400 font-semibold">
                    📅 Dates
                  </h3>

                  <div className="mt-3 space-y-1">

                    {dashboardData.detectedColumns.date?.length > 0 ? (
                      dashboardData.detectedColumns.date.map(
                        (column: string) => (
                          <p
                            key={column}
                            className="text-slate-300 text-sm"
                          >
                            • {column}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-slate-500 text-sm">
                        None detected
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =====================================================
              DYNAMIC CHARTS
          ===================================================== */}

          {dashboardData && (
            <div className="mt-8">

              <h2 className="text-2xl font-bold text-white mb-4">
                Automatic Data Analysis
              </h2>

              <p className="text-slate-400 mb-6">
                Charts are generated automatically based on the
                columns detected in your file.
              </p>

              <DynamicCharts
                groupedAnalysis={
                  dashboardData.groupedAnalysis || []
                }

                dateAnalysis={
                  dashboardData.dateAnalysis || []
                }

                categoryAnalysis={
                  dashboardData.categoryAnalysis || []
                }
              />

            </div>
          )}

          {/* =====================================================
              AI INSIGHTS
          ===================================================== */}

          {dashboardData && (
            <div className="mt-8">

              <AIInsights
                insights={dashboardData?.aiInsights}
                dashboardData={dashboardData}
              />

            </div>
          )}

          {/* =====================================================
              DATA PREVIEW
          ===================================================== */}

          {dashboardData?.preview?.length > 0 && (
            <div className="mt-8">

              <h2 className="text-2xl font-bold text-white mb-4">
                Data Preview
              </h2>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-800">

                    <tr>

                      {dashboardData.columns.map(
                        (column: string) => (
                          <th
                            key={column}
                            className="text-left px-4 py-3 text-slate-300 whitespace-nowrap"
                          >
                            {column}
                          </th>
                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    {dashboardData.preview.map(
                      (row: any, rowIndex: number) => (

                        <tr
                          key={rowIndex}
                          className="border-t border-slate-800"
                        >

                          {dashboardData.columns.map(
                            (column: string) => (

                              <td
                                key={column}
                                className="px-4 py-3 text-slate-400 whitespace-nowrap"
                              >
                                {row[column] ?? "-"}
                              </td>

                            )
                          )}

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </main>

      </div>
    </>
  );
}