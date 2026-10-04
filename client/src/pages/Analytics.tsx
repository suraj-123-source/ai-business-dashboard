
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ComposedChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// interface AnalyticsProps {
//   data: any;
// }

// function Analytics({ data }: AnalyticsProps) {

//   // ============================================================
//   // SAFETY
//   // ============================================================

//   const hasData = data && data.rows > 0;

//   const numericAnalysis = data?.numericAnalysis || [];
//   const categoryAnalysis = data?.categoryAnalysis || [];
//   const groupedAnalysis = data?.groupedAnalysis || [];
//   const dateAnalysis = data?.dateAnalysis || [];
//   const kpis = data?.kpis || [];

//   const detectedColumns = data?.detectedColumns || {
//     numeric: [],
//     categorical: [],
//     text: [],
//     id: [],
//     date: [],
//   };

//   // ============================================================
//   // HELPERS
//   // ============================================================

//   const formatNumber = (value: any) => {

//     const number = Number(value);

//     if (!Number.isFinite(number)) {
//       return "0";
//     }

//     return number.toLocaleString(undefined, {
//       maximumFractionDigits: 2,
//     });
//   };


//   const chartColors = [
//     "#6366f1",
//     "#22c55e",
//     "#f59e0b",
//     "#ef4444",
//     "#06b6d4",
//     "#a855f7",
//     "#ec4899",
//     "#14b8a6",
//   ];


//   // ============================================================
//   // NO DATA
//   // ============================================================

//   if (!hasData) {

//     return (
//       <div className="w-full p-8">

//         <div className="mb-8">

//           <h1 className="text-3xl font-bold text-white">
//             Analytics Dashboard
//           </h1>

//           <p className="text-slate-400 mt-2">
//             Upload a CSV or Excel file to generate automatic analytics.
//           </p>

//         </div>

//         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

//           <div className="text-5xl mb-4">
//             📊
//           </div>

//           <h2 className="text-xl font-bold text-white">
//             No Dataset Available
//           </h2>

//           <p className="text-slate-400 mt-2">
//             Upload your Excel or CSV file first.
//           </p>

//         </div>

//       </div>
//     );
//   }


//   // ============================================================
//   // DATASET SUMMARY
//   // ============================================================

//   const totalRecords = data?.rows || 0;

//   const numericCount =
//     detectedColumns.numeric?.length || 0;

//   const categoryCount =
//     detectedColumns.categorical?.length || 0;

//   const dateCount =
//     detectedColumns.date?.length || 0;

//   const textCount =
//     detectedColumns.text?.length || 0;


//   // ============================================================
//   // MAIN
//   // ============================================================

//   return (

//     <div className="w-full p-8">

//       {/* ======================================================
//           HEADER
//       ======================================================= */}

//       <div className="mb-8">

//         <div className="flex items-center justify-between">

//           <div>

//             <h1 className="text-3xl font-bold text-white">
//               Analytics Dashboard
//             </h1>

//             <p className="text-slate-400 mt-2">
//               Automatic analysis of your uploaded dataset.
//             </p>

//           </div>

//           <div className="hidden md:block">

//             <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">

//               <span className="text-blue-400 text-sm">
//                 📁 {data?.filename || "Uploaded Dataset"}
//               </span>

//             </div>

//           </div>

//         </div>

//         <div className="mt-4 flex flex-wrap gap-3">

//           <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
//             {numericCount} Numeric
//           </span>

//           <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs">
//             {categoryCount} Categories
//           </span>

//           <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs">
//             {dateCount} Dates
//           </span>

//           <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-400 text-xs">
//             {textCount} Text
//           </span>

//         </div>

//       </div>


//       {/* ======================================================
//           SUMMARY CARDS
//       ======================================================= */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

//         <SummaryCard
//           title="Total Records"
//           value={formatNumber(totalRecords)}
//           subtitle="Uploaded rows"
//           icon="📋"
//         />

//         <SummaryCard
//           title="Numeric Columns"
//           value={formatNumber(numericCount)}
//           subtitle="Detected automatically"
//           icon="🔢"
//         />

//         <SummaryCard
//           title="Category Columns"
//           value={formatNumber(categoryCount)}
//           subtitle="Categories detected"
//           icon="🏷️"
//         />

//         <SummaryCard
//           title="Date Columns"
//           value={formatNumber(dateCount)}
//           subtitle="Time fields detected"
//           icon="📅"
//         />

//       </div>


//       {/* ======================================================
//           DYNAMIC KPI CARDS
//       ======================================================= */}

//       {kpis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="⚡"
//             title="Dynamic KPIs"
//             subtitle="Automatically generated from your dataset"
//           />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

//             {kpis.slice(0, 8).map(
//               (kpi: any, index: number) => (

//                 <div
//                   key={index}
//                   className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition"
//                 >

//                   <p className="text-slate-400 text-sm">
//                     {kpi.name}
//                   </p>

//                   <h3 className="text-2xl font-bold text-white mt-3">
//                     {formatNumber(kpi.value)}
//                   </h3>

//                   {kpi.column && (
//                     <p className="text-slate-500 text-xs mt-2">
//                       Column: {kpi.column}
//                     </p>
//                   )}

//                 </div>

//               )
//             )}

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           NUMERIC OVERVIEW
//       ======================================================= */}

//       {numericAnalysis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="🔢"
//             title="Numeric Overview"
//             subtitle="Statistics for detected numeric columns"
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

//             {numericAnalysis.slice(0, 6).map(
//               (item: any, index: number) => (

//                 <div
//                   key={index}
//                   className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
//                 >

//                   <div className="flex items-center justify-between mb-5">

//                     <h3 className="text-blue-400 font-semibold">
//                       {item.column}
//                     </h3>

//                     <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">
//                       Numeric
//                     </span>

//                   </div>

//                   <div className="grid grid-cols-2 gap-4">

//                     <Stat
//                       label="Total"
//                       value={formatNumber(item.sum)}
//                     />

//                     <Stat
//                       label="Average"
//                       value={formatNumber(item.average)}
//                     />

//                     <Stat
//                       label="Minimum"
//                       value={formatNumber(item.minimum)}
//                     />

//                     <Stat
//                       label="Maximum"
//                       value={formatNumber(item.maximum)}
//                     />

//                     <Stat
//                       label="Median"
//                       value={formatNumber(item.median)}
//                     />

//                     <Stat
//                       label="Records"
//                       value={formatNumber(item.count)}
//                     />

//                   </div>

//                 </div>

//               )
//             )}

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           NUMERIC VISUAL ANALYSIS
//       ======================================================= */}

//       {numericAnalysis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="📊"
//             title="Numeric Visual Analysis"
//             subtitle="Different visualizations for your numeric data"
//           />


//           {/* ROW 1 */}

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

//             {/* BAR */}

//             <ChartCard
//               title="📊 Numeric Comparison"
//               subtitle="Minimum, average, median and maximum"
//             >

//               <ResponsiveContainer width="100%" height="100%">

//                 <BarChart
//                   data={numericAnalysis.slice(0, 6).map(
//                     (item: any) => ({
//                       name: item.column,
//                       Average: Number(item.average) || 0,
//                       Maximum: Number(item.maximum) || 0,
//                     })
//                   )}
//                 >

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="#334155"
//                   />

//                   <XAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                   />

//                   <YAxis
//                     stroke="#94a3b8"
//                   />

//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#0f172a",
//                       border: "1px solid #334155",
//                       borderRadius: "10px",
//                     }}
//                   />

//                   <Legend />

//                   <Bar
//                     dataKey="Average"
//                     fill="#6366f1"
//                     radius={[6, 6, 0, 0]}
//                   />

//                   <Bar
//                     dataKey="Maximum"
//                     fill="#22c55e"
//                     radius={[6, 6, 0, 0]}
//                   />

//                 </BarChart>

//               </ResponsiveContainer>

//             </ChartCard>


//             {/* LINE */}

//             <ChartCard
//               title="📈 Average vs Maximum"
//               subtitle="Compare numeric column statistics"
//             >

//               <ResponsiveContainer width="100%" height="100%">

//                 <LineChart
//                   data={numericAnalysis.slice(0, 8).map(
//                     (item: any) => ({
//                       name: item.column,
//                       Average: Number(item.average) || 0,
//                       Maximum: Number(item.maximum) || 0,
//                     })
//                   )}
//                 >

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="#334155"
//                   />

//                   <XAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                   />

//                   <YAxis
//                     stroke="#94a3b8"
//                   />

//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#0f172a",
//                       border: "1px solid #334155",
//                       borderRadius: "10px",
//                     }}
//                   />

//                   <Legend />

//                   <Line
//                     type="monotone"
//                     dataKey="Average"
//                     stroke="#6366f1"
//                     strokeWidth={3}
//                     dot={{ r: 4 }}
//                   />

//                   <Line
//                     type="monotone"
//                     dataKey="Maximum"
//                     stroke="#f59e0b"
//                     strokeWidth={3}
//                     dot={{ r: 4 }}
//                   />

//                 </LineChart>

//               </ResponsiveContainer>

//             </ChartCard>

//           </div>


//           {/* ROW 2 */}

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {/* AREA */}

//             <ChartCard
//               title="🌊 Numeric Range"
//               subtitle="Minimum to maximum range"
//             >

//               <ResponsiveContainer width="100%" height="100%">

//                 <AreaChart
//                   data={numericAnalysis.slice(0, 8).map(
//                     (item: any) => ({
//                       name: item.column,
//                       Minimum: Number(item.minimum) || 0,
//                       Average: Number(item.average) || 0,
//                       Maximum: Number(item.maximum) || 0,
//                     })
//                   )}
//                 >

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="#334155"
//                   />

//                   <XAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                   />

//                   <YAxis
//                     stroke="#94a3b8"
//                   />

//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#0f172a",
//                       border: "1px solid #334155",
//                       borderRadius: "10px",
//                     }}
//                   />

//                   <Legend />

//                   <Area
//                     type="monotone"
//                     dataKey="Maximum"
//                     stroke="#22c55e"
//                     fill="#22c55e"
//                     fillOpacity={0.15}
//                   />

//                   <Area
//                     type="monotone"
//                     dataKey="Average"
//                     stroke="#6366f1"
//                     fill="#6366f1"
//                     fillOpacity={0.15}
//                   />

//                 </AreaChart>

//               </ResponsiveContainer>

//             </ChartCard>


//             {/* RADAR */}

//             <ChartCard
//               title="🎯 Numeric Profile"
//               subtitle="Overall comparison of numeric fields"
//             >

//               <ResponsiveContainer width="100%" height="100%">

//                 <RadarChart
//                   data={numericAnalysis.slice(0, 8).map(
//                     (item: any) => ({
//                       name: item.column,
//                       value: Number(item.average) || 0,
//                     })
//                   )}
//                 >

//                   <PolarGrid stroke="#334155" />

//                   <PolarAngleAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                   />

//                   <PolarRadiusAxis
//                     stroke="#64748b"
//                   />

//                   <Radar
//                     name="Average"
//                     dataKey="value"
//                     stroke="#a855f7"
//                     fill="#a855f7"
//                     fillOpacity={0.35}
//                   />

//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "#0f172a",
//                       border: "1px solid #334155",
//                       borderRadius: "10px",
//                     }}
//                   />

//                 </RadarChart>

//               </ResponsiveContainer>

//             </ChartCard>

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           DATE ANALYSIS
//       ======================================================= */}

//       {dateAnalysis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="📅"
//             title="Time Series Analysis"
//             subtitle="Automatic analysis using detected date columns"
//           />

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {dateAnalysis.slice(0, 4).map(
//               (item: any, index: number) => (

//                 <ChartCard
//                   key={index}
//                   title={`📈 ${item.metric}`}
//                   subtitle={`Grouped by ${item.dateColumn}`}
//                 >

//                   <ResponsiveContainer
//                     width="100%"
//                     height="100%"
//                   >

//                     <ComposedChart data={item.data}>

//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         stroke="#334155"
//                       />

//                       <XAxis
//                         dataKey="month"
//                         stroke="#94a3b8"
//                       />

//                       <YAxis
//                         stroke="#94a3b8"
//                       />

//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#0f172a",
//                           border: "1px solid #334155",
//                           borderRadius: "10px",
//                         }}
//                       />

//                       <Area
//                         type="monotone"
//                         dataKey="value"
//                         fill="#6366f1"
//                         stroke="#6366f1"
//                         fillOpacity={0.12}
//                       />

//                       <Line
//                         type="monotone"
//                         dataKey="value"
//                         stroke="#22c55e"
//                         strokeWidth={3}
//                         dot={{ r: 3 }}
//                       />

//                     </ComposedChart>

//                   </ResponsiveContainer>

//                 </ChartCard>

//               )
//             )}

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           CATEGORY ANALYSIS
//       ======================================================= */}

//       {categoryAnalysis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="🏷️"
//             title="Category Analysis"
//             subtitle="Distribution of categorical columns"
//           />

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {categoryAnalysis.slice(0, 4).map(
//               (item: any, index: number) => (

//                 <div
//                   key={index}
//                   className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
//                 >

//                   <div className="mb-4">

//                     <h3 className="text-lg font-semibold text-white">
//                       {item.column}
//                     </h3>

//                     <p className="text-slate-500 text-sm">
//                       Top {item.topValues?.length || 0} values
//                     </p>

//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                     {/* BAR */}

//                     <div className="h-64">

//                       <ResponsiveContainer
//                         width="100%"
//                         height="100%"
//                       >

//                         <BarChart
//                           data={item.topValues || []}
//                           layout="vertical"
//                           margin={{
//                             left: 20,
//                             right: 20,
//                           }}
//                         >

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             type="number"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             type="category"
//                             dataKey="name"
//                             width={80}
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#0f172a",
//                               border: "1px solid #334155",
//                               borderRadius: "10px",
//                             }}
//                           />

//                           <Bar
//                             dataKey="value"
//                             fill="#6366f1"
//                             radius={[0, 6, 6, 0]}
//                           />

//                         </BarChart>

//                       </ResponsiveContainer>

//                     </div>


//                     {/* DONUT */}

//                     <div className="h-64">

//                       <ResponsiveContainer
//                         width="100%"
//                         height="100%"
//                       >

//                         <PieChart>

//                           <Pie
//                             data={item.topValues || []}
//                             dataKey="value"
//                             nameKey="name"
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={50}
//                             outerRadius={85}
//                             paddingAngle={3}
//                           >

//                             {(item.topValues || []).map(
//                               (_: any, colorIndex: number) => (

//                                 <Cell
//                                   key={colorIndex}
//                                   fill={
//                                     chartColors[
//                                       colorIndex %
//                                       chartColors.length
//                                     ]
//                                   }
//                                 />

//                               )
//                             )}

//                           </Pie>

//                           <Tooltip
//                             contentStyle={{
//                               backgroundColor: "#0f172a",
//                               border: "1px solid #334155",
//                               borderRadius: "10px",
//                             }}
//                           />

//                           <Legend />

//                         </PieChart>

//                       </ResponsiveContainer>

//                     </div>

//                   </div>

//                 </div>

//               )
//             )}

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           CATEGORY VS NUMERIC
//       ======================================================= */}

//       {groupedAnalysis.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="🔗"
//             title="Category vs Numeric Analysis"
//             subtitle="Compare numeric values across categories"
//           />

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {groupedAnalysis.slice(0, 6).map(
//               (item: any, index: number) => (

//                 <ChartCard
//                   key={index}
//                   title={`${item.metric} by ${item.category}`}
//                   subtitle="Top category values"
//                 >

//                   <ResponsiveContainer
//                     width="100%"
//                     height="100%"
//                   >

//                     <BarChart data={item.data || []}>

//                       <CartesianGrid
//                         strokeDasharray="3 3"
//                         stroke="#334155"
//                       />

//                       <XAxis
//                         dataKey="name"
//                         stroke="#94a3b8"
//                       />

//                       <YAxis
//                         stroke="#94a3b8"
//                       />

//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "#0f172a",
//                           border: "1px solid #334155",
//                           borderRadius: "10px",
//                         }}
//                       />

//                       <Bar
//                         dataKey="value"
//                         fill={
//                           chartColors[
//                             index % chartColors.length
//                           ]
//                         }
//                         radius={[6, 6, 0, 0]}
//                       />

//                     </BarChart>

//                   </ResponsiveContainer>

//                 </ChartCard>

//               )
//             )}

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           COLUMN INFORMATION
//       ======================================================= */}

//       {data?.columnInformation?.length > 0 && (

//         <section className="mb-10">

//           <SectionTitle
//             icon="📋"
//             title="Dataset Structure"
//             subtitle="Detected column information"
//           />

//           <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

//             <div className="overflow-x-auto">

//               <table className="w-full">

//                 <thead>

//                   <tr className="border-b border-slate-800">

//                     <th className="text-left p-4 text-slate-400 text-sm">
//                       Column
//                     </th>

//                     <th className="text-left p-4 text-slate-400 text-sm">
//                       Type
//                     </th>

//                     <th className="text-left p-4 text-slate-400 text-sm">
//                       Unique
//                     </th>

//                     <th className="text-left p-4 text-slate-400 text-sm">
//                       Missing
//                     </th>

//                     <th className="text-left p-4 text-slate-400 text-sm">
//                       Missing %
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody>

//                   {data.columnInformation.map(
//                     (column: any, index: number) => (

//                       <tr
//                         key={index}
//                         className="border-b border-slate-800 hover:bg-slate-800/40"
//                       >

//                         <td className="p-4 text-white font-medium">
//                           {column.name}
//                         </td>

//                         <td className="p-4">

//                           <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
//                             {column.type}
//                           </span>

//                         </td>

//                         <td className="p-4 text-slate-300">
//                           {formatNumber(column.unique)}
//                         </td>

//                         <td className="p-4 text-slate-300">
//                           {formatNumber(column.missing)}
//                         </td>

//                         <td className="p-4 text-slate-300">
//                           {formatNumber(column.missingPercentage)}%
//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </section>

//       )}


//       {/* ======================================================
//           FOOTER
//       ======================================================= */}

//       <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">

//         <div className="flex items-start gap-4">

//           <div className="text-3xl">
//             🤖
//           </div>

//           <div>

//             <h3 className="text-lg font-bold text-white">
//               Automatic Analytics
//             </h3>

//             <p className="text-slate-400 text-sm mt-1">
//               This dashboard automatically adapts its KPIs and
//               visualizations to the columns detected in your
//               uploaded dataset.
//             </p>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


// // ============================================================
// // SUMMARY CARD
// // ============================================================

// function SummaryCard({
//   title,
//   value,
//   subtitle,
//   icon,
// }: {
//   title: string;
//   value: string;
//   subtitle: string;
//   icon: string;
// }) {

//   return (

//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">

//       <div className="flex items-center justify-between">

//         <p className="text-slate-400 text-sm">
//           {title}
//         </p>

//         <span className="text-xl">
//           {icon}
//         </span>

//       </div>

//       <h2 className="text-3xl font-bold text-white mt-3">
//         {value}
//       </h2>

//       <p className="text-slate-500 text-xs mt-2">
//         {subtitle}
//       </p>

//     </div>
//   );
// }


// // ============================================================
// // SECTION TITLE
// // ============================================================

// function SectionTitle({
//   icon,
//   title,
//   subtitle,
// }: {
//   icon: string;
//   title: string;
//   subtitle: string;
// }) {

//   return (

//     <div className="mb-5">

//       <div className="flex items-center gap-2">

//         <span className="text-xl">
//           {icon}
//         </span>

//         <h2 className="text-xl font-bold text-white">
//           {title}
//         </h2>

//       </div>

//       <p className="text-slate-500 text-sm mt-1">
//         {subtitle}
//       </p>

//     </div>
//   );
// }


// // ============================================================
// // STAT
// // ============================================================

// function Stat({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {

//   return (

//     <div>

//       <p className="text-slate-500 text-xs">
//         {label}
//       </p>

//       <p className="text-white font-semibold mt-1">
//         {value}
//       </p>

//     </div>
//   );
// }


// // ============================================================
// // CHART CARD
// // ============================================================

// function ChartCard({
//   title,
//   subtitle,
//   children,
// }: {
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// }) {

//   return (

//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

//       <div className="mb-5">

//         <h3 className="text-lg font-semibold text-white">
//           {title}
//         </h3>

//         <p className="text-slate-500 text-sm mt-1">
//           {subtitle}
//         </p>

//       </div>

//       <div className="h-80">
//         {children}
//       </div>

//     </div>
//   );
// }


// export default Analytics;




import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsProps {
  data: any;
}

// ============================================================
// COLORS
// ============================================================

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#06b6d4",
  "#f59e0b",
  "#ec4899",
  "#a855f7",
  "#14b8a6",
  "#ef4444",
];

// ============================================================
// MAIN ANALYTICS
// ============================================================

function Analytics({ data }: AnalyticsProps) {

  // ==========================================================
  // SAFETY
  // ==========================================================

  const hasData = data && Number(data.rows) > 0;

  if (!hasData) {
    return (
      <div className="w-full p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Analytics Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Upload an Excel or CSV file to automatically generate
            analytics.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

          <div className="text-6xl mb-5">
            📊
          </div>

          <h2 className="text-2xl font-bold text-white">
            No Dataset Available
          </h2>

          <p className="text-slate-400 mt-3">
            Upload your Excel or CSV file from the Upload Data section.
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // DATA
  // ==========================================================

  const numericAnalysis = data?.numericAnalysis || [];
  const categoryAnalysis = data?.categoryAnalysis || [];
  const groupedAnalysis = data?.groupedAnalysis || [];
  const dateAnalysis = data?.dateAnalysis || [];
  const kpis = data?.kpis || [];
  const columnInformation = data?.columnInformation || [];

  const detectedColumns = data?.detectedColumns || {
    numeric: [],
    categorical: [],
    text: [],
    id: [],
    date: [],
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatNumber = (value: any) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
  };

  const numericCount =
    detectedColumns.numeric?.length || 0;

  const categoryCount =
    detectedColumns.categorical?.length || 0;

  const dateCount =
    detectedColumns.date?.length || 0;

  const textCount =
    detectedColumns.text?.length || 0;

  const idCount =
    detectedColumns.id?.length || 0;

  const totalRecords =
    Number(data?.rows) || 0;

  // ==========================================================
  // TOP NUMERIC COLUMN
  // ==========================================================

  const primaryNumeric =
    numericAnalysis?.[0];

  const primaryNumericTotal =
    Number(primaryNumeric?.sum) || 0;

  const primaryNumericAverage =
    Number(primaryNumeric?.average) || 0;

  // ==========================================================
  // DATA QUALITY
  // ==========================================================

  const totalColumns =
    data?.columns?.length || 0;

  const totalMissing =
    columnInformation.reduce(
      (sum: number, column: any) =>
        sum + Number(column?.missing || 0),
      0
    );

  const totalCells =
    totalRecords * totalColumns;

  const dataQuality =
    totalCells > 0
      ? Math.max(
          0,
          100 -
            (totalMissing / totalCells) * 100
        )
      : 100;

  // ==========================================================
  // NUMERIC COMPARISON DATA
  // ==========================================================

  const numericComparison =
    numericAnalysis
      .slice(0, 8)
      .map((item: any) => ({
        name: item.column,
        Average: Number(item.average) || 0,
        Median: Number(item.median) || 0,
        Minimum: Number(item.minimum) || 0,
        Maximum: Number(item.maximum) || 0,
      }));

  // ==========================================================
  // NUMERIC RANGE DATA
  // ==========================================================

  const numericRange =
    numericAnalysis
      .slice(0, 8)
      .map((item: any) => ({
        name: item.column,
        Minimum: Number(item.minimum) || 0,
        Average: Number(item.average) || 0,
        Maximum: Number(item.maximum) || 0,
      }));

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (

    <div className="w-full p-8">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                📊
              </div>

              <div>

                <h1 className="text-3xl font-bold text-white">
                  Analytics
                </h1>

                <p className="text-slate-400 mt-1">
                  Intelligent analysis generated from your dataset
                </p>

              </div>

            </div>

          </div>

          <div className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800">

            <p className="text-xs text-slate-500">
              DATASET
            </p>

            <p className="text-sm text-blue-400 font-medium mt-1">
              📁 {data?.filename || "Uploaded Dataset"}
            </p>

          </div>

        </div>


        {/* COLUMN BADGES */}

        <div className="flex flex-wrap gap-2 mt-6">

          <Badge
            label={`${numericCount} Numeric`}
            color="blue"
          />

          <Badge
            label={`${categoryCount} Categories`}
            color="purple"
          />

          <Badge
            label={`${dateCount} Dates`}
            color="green"
          />

          <Badge
            label={`${textCount} Text`}
            color="orange"
          />

          <Badge
            label={`${idCount} ID`}
            color="pink"
          />

        </div>

      </div>


      {/* ======================================================
          TOP KPI CARDS
      ======================================================= */}

      <section className="mb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <ModernKPI
            title="Total Records"
            value={formatNumber(totalRecords)}
            subtitle="Rows in dataset"
            icon="📋"
          />

          <ModernKPI
            title="Numeric Fields"
            value={formatNumber(numericCount)}
            subtitle="Automatically detected"
            icon="🔢"
          />

          <ModernKPI
            title="Category Fields"
            value={formatNumber(categoryCount)}
            subtitle="Categorical columns"
            icon="🏷️"
          />

          <ModernKPI
            title="Data Quality"
            value={`${dataQuality.toFixed(1)}%`}
            subtitle="Completeness score"
            icon="✨"
          />

        </div>

      </section>


      {/* ======================================================
          PRIMARY DATA KPI
      ======================================================= */}

      {primaryNumeric && (

        <section className="mb-10">

          <SectionTitle
            icon="⚡"
            title="Primary Metric"
            subtitle={`Automatic summary of ${primaryNumeric.column}`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <MetricCard
              title={`Total ${primaryNumeric.column}`}
              value={formatNumber(primaryNumericTotal)}
              icon="Σ"
            />

            <MetricCard
              title={`Average ${primaryNumeric.column}`}
              value={formatNumber(primaryNumericAverage)}
              icon="≈"
            />

            <MetricCard
              title={`Maximum ${primaryNumeric.column}`}
              value={formatNumber(primaryNumeric.maximum)}
              icon="↑"
            />

          </div>

        </section>

      )}


      {/* ======================================================
          DYNAMIC KPIs
      ======================================================= */}

      {kpis.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="🚀"
            title="Dynamic KPIs"
            subtitle="Automatically generated from detected columns"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {kpis.slice(0, 8).map(
              (kpi: any, index: number) => (

                <div
                  key={index}
                  className="
                    group
                    bg-slate-900
                    border border-slate-800
                    rounded-2xl
                    p-5
                    hover:border-blue-500/40
                    hover:bg-slate-900/80
                    transition-all
                    duration-300
                  "
                >

                  <div className="flex items-center justify-between">

                    <p className="text-slate-400 text-sm">
                      {kpi.name}
                    </p>

                    <span className="text-blue-400">
                      {kpi.type === "count"
                        ? "📋"
                        : kpi.type === "average"
                        ? "≈"
                        : kpi.type === "unique"
                        ? "🔹"
                        : "Σ"}
                    </span>

                  </div>

                  <h3 className="text-2xl font-bold text-white mt-3">
                    {formatNumber(kpi.value)}
                  </h3>

                  {kpi.column && (
                    <p className="text-slate-500 text-xs mt-2">
                      {kpi.column}
                    </p>
                  )}

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* ======================================================
          NUMERIC ANALYTICS
      ======================================================= */}

      {numericAnalysis.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="🔢"
            title="Numeric Analytics"
            subtitle="Multiple visualizations automatically generated for numeric fields"
          />


          {/* ==================================================
              BAR + LINE
          ================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

            {/* BAR */}

            <ChartCard
              title="📊 Numeric Comparison"
              subtitle="Average vs median vs maximum"
            >

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={numericComparison}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend />

                  <Bar
                    dataKey="Average"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="Median"
                    fill="#06b6d4"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="Maximum"
                    fill="#22c55e"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </ChartCard>


            {/* LINE */}

            <ChartCard
              title="📈 Numeric Trend Profile"
              subtitle="Different statistical lines for every numeric field"
            >

              <ResponsiveContainer width="100%" height="100%">

                <LineChart data={numericComparison}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="Average"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Median"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Maximum"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </ChartCard>

          </div>


          {/* ==================================================
              AREA + COMBINED
          ================================================== */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* AREA */}

            <ChartCard
              title="🌊 Numeric Range"
              subtitle="Minimum, average and maximum range"
            >

              <ResponsiveContainer width="100%" height="100%">

                <AreaChart data={numericRange}>

                  <defs>

                    <linearGradient
                      id="maxGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#22c55e"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#22c55e"
                        stopOpacity={0}
                      />

                    </linearGradient>

                    <linearGradient
                      id="avgGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor="#6366f1"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#64748b"
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend />

                  <Area
                    type="monotone"
                    dataKey="Maximum"
                    stroke="#22c55e"
                    fill="url(#maxGradient)"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="Average"
                    stroke="#6366f1"
                    fill="url(#avgGradient)"
                    strokeWidth={3}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </ChartCard>


            {/* COMPOSED */}

            <ChartCard
              title="📊 Combined Numeric View"
              subtitle="Bars and lines combined"
            >

              <ResponsiveContainer width="100%" height="100%">

                <ComposedChart data={numericComparison}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    stroke="#64748b"
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend />

                  <Bar
                    dataKey="Average"
                    fill="#6366f1"
                    radius={[5, 5, 0, 0]}
                  />

                  <Line
                    type="monotone"
                    dataKey="Maximum"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />

                  <Line
                    type="monotone"
                    dataKey="Minimum"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />

                </ComposedChart>

              </ResponsiveContainer>

            </ChartCard>

          </div>

        </section>

      )}


      {/* ======================================================
          TIME SERIES
      ======================================================= */}

      {dateAnalysis.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="📅"
            title="Time Series Analytics"
            subtitle="Automatic trends detected from date columns"
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {dateAnalysis.slice(0, 4).map(
              (item: any, index: number) => (

                <ChartCard
                  key={index}
                  title={`📈 ${item.metric}`}
                  subtitle={`Trend by ${item.dateColumn}`}
                >

                  <ResponsiveContainer width="100%" height="100%">

                    <ComposedChart
                      data={item.data || []}
                    >

                      <defs>

                        <linearGradient
                          id={`trend-${index}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >

                          <stop
                            offset="5%"
                            stopColor={COLORS[index % COLORS.length]}
                            stopOpacity={0.35}
                          />

                          <stop
                            offset="95%"
                            stopColor={COLORS[index % COLORS.length]}
                            stopOpacity={0}
                          />

                        </linearGradient>

                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#64748b"
                      />

                      <YAxis
                        stroke="#64748b"
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                      />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={COLORS[index % COLORS.length]}
                        fill={`url(#trend-${index})`}
                        strokeWidth={2}
                      />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />

                    </ComposedChart>

                  </ResponsiveContainer>

                </ChartCard>

              )
            )}

          </div>

        </section>

      )}


      {/* ======================================================
          CATEGORY ANALYTICS
      ======================================================= */}

      {categoryAnalysis.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="🏷️"
            title="Category Analytics"
            subtitle="Distribution and comparison of categorical fields"
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {categoryAnalysis.slice(0, 6).map(
              (item: any, index: number) => (

                <div
                  key={index}
                  className="
                    bg-slate-900
                    border border-slate-800
                    rounded-2xl
                    p-6
                  "
                >

                  <div className="mb-5">

                    <h3 className="text-lg font-semibold text-white">
                      {item.column}
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      Top {item.topValues?.length || 0} values
                    </p>

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* BAR */}

                    <div className="h-72">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <BarChart
                          data={item.topValues || []}
                          layout="vertical"
                          margin={{
                            left: 15,
                            right: 15,
                          }}
                        >

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                          />

                          <XAxis
                            type="number"
                            stroke="#64748b"
                          />

                          <YAxis
                            type="category"
                            dataKey="name"
                            width={90}
                            stroke="#64748b"
                            tick={{ fontSize: 11 }}
                          />

                          <Tooltip
                            contentStyle={tooltipStyle}
                          />

                          <Bar
                            dataKey="value"
                            radius={[0, 8, 8, 0]}
                          >

                            {(item.topValues || []).map(
                              (_: any, colorIndex: number) => (

                                <Cell
                                  key={colorIndex}
                                  fill={
                                    COLORS[
                                      colorIndex %
                                      COLORS.length
                                    ]
                                  }
                                />

                              )
                            )}

                          </Bar>

                        </BarChart>

                      </ResponsiveContainer>

                    </div>


                    {/* DONUT */}

                    <div className="h-72">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <PieChart>

                          <Pie
                            data={item.topValues || []}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={90}
                            paddingAngle={4}
                          >

                            {(item.topValues || []).map(
                              (_: any, colorIndex: number) => (

                                <Cell
                                  key={colorIndex}
                                  fill={
                                    COLORS[
                                      colorIndex %
                                      COLORS.length
                                    ]
                                  }
                                />

                              )
                            )}

                          </Pie>

                          <Tooltip
                            contentStyle={tooltipStyle}
                          />

                          <Legend />

                        </PieChart>

                      </ResponsiveContainer>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* ======================================================
          CATEGORY VS NUMERIC
      ======================================================= */}

      {groupedAnalysis.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="🔗"
            title="Category vs Numeric"
            subtitle="Compare numeric measurements across categories"
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {groupedAnalysis.slice(0, 6).map(
              (item: any, index: number) => (

                <ChartCard
                  key={index}
                  title={`${item.metric} by ${item.category}`}
                  subtitle="Top category performance"
                >

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <BarChart
                      data={item.data || []}
                      layout="vertical"
                      margin={{
                        left: 20,
                        right: 20,
                      }}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#1e293b"
                      />

                      <XAxis
                        type="number"
                        stroke="#64748b"
                      />

                      <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                        stroke="#64748b"
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                        contentStyle={tooltipStyle}
                      />

                      <Bar
                        dataKey="value"
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                        radius={[0, 8, 8, 0]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </ChartCard>

              )
            )}

          </div>

        </section>

      )}


      {/* ======================================================
          DATASET STRUCTURE
      ======================================================= */}

      {columnInformation.length > 0 && (

        <section className="mb-10">

          <SectionTitle
            icon="🧬"
            title="Dataset Structure"
            subtitle="Automatic understanding of your uploaded file"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-800">

                    <th className="text-left p-4 text-slate-400 text-sm">
                      Column
                    </th>

                    <th className="text-left p-4 text-slate-400 text-sm">
                      Type
                    </th>

                    <th className="text-left p-4 text-slate-400 text-sm">
                      Unique
                    </th>

                    <th className="text-left p-4 text-slate-400 text-sm">
                      Missing
                    </th>

                    <th className="text-left p-4 text-slate-400 text-sm">
                      Missing %
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {columnInformation.map(
                    (column: any, index: number) => (

                      <tr
                        key={index}
                        className="
                          border-b border-slate-800
                          hover:bg-slate-800/40
                          transition
                        "
                      >

                        <td className="p-4 text-white font-medium">
                          {column.name}
                        </td>

                        <td className="p-4">

                          <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
                            {column.type}
                          </span>

                        </td>

                        <td className="p-4 text-slate-300">
                          {formatNumber(column.unique)}
                        </td>

                        <td className="p-4 text-slate-300">
                          {formatNumber(column.missing)}
                        </td>

                        <td className="p-4 text-slate-300">
                          {formatNumber(column.missingPercentage)}%
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </section>

      )}


      {/* ======================================================
          NO VISUAL DATA
      ======================================================= */}

      {numericAnalysis.length === 0 &&
        categoryAnalysis.length === 0 &&
        dateAnalysis.length === 0 &&
        groupedAnalysis.length === 0 && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">

            <div className="flex items-start gap-4">

              <div className="text-4xl">
                ℹ️
              </div>

              <div>

                <h3 className="text-lg font-bold text-white">
                  Dataset analyzed successfully
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  Your file was uploaded, but there are not enough
                  numeric, categorical, or date fields to create
                  visualizations.
                </p>

              </div>

            </div>

          </div>

        )}


      {/* ======================================================
          FOOTER
      ======================================================= */}

      <div className="
        bg-gradient-to-r
        from-blue-500/10
        via-purple-500/10
        to-cyan-500/10
        border border-blue-500/20
        rounded-2xl
        p-6
      ">

        <div className="flex items-start gap-4">

          <div className="text-3xl">
            🤖
          </div>

          <div>

            <h3 className="text-lg font-bold text-white">
              Intelligent Analytics Engine
            </h3>

            <p className="text-slate-400 text-sm mt-1">
              The dashboard automatically detects numeric,
              categorical, date, text and ID columns and generates
              suitable KPIs and visualizations for the uploaded dataset.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// MODERN KPI
// ============================================================

function ModernKPI({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-2xl
      p-6
      hover:border-blue-500/30
      hover:-translate-y-1
      transition-all
      duration-300
    ">

      <div className="flex items-center justify-between">

        <p className="text-slate-400 text-sm">
          {title}
        </p>

        <div className="
          w-10
          h-10
          rounded-xl
          bg-blue-500/10
          border border-blue-500/20
          flex
          items-center
          justify-center
        ">
          {icon}
        </div>

      </div>

      <h2 className="text-3xl font-bold text-white mt-4">
        {value}
      </h2>

      <p className="text-slate-500 text-xs mt-2">
        {subtitle}
      </p>

    </div>
  );
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-2xl
      p-5
      hover:border-purple-500/30
      transition
    ">

      <div className="flex items-center gap-3">

        <div className="
          w-10
          h-10
          rounded-xl
          bg-purple-500/10
          text-purple-400
          flex
          items-center
          justify-center
          font-bold
        ">
          {icon}
        </div>

        <p className="text-slate-400 text-sm">
          {title}
        </p>

      </div>

      <p className="text-2xl font-bold text-white mt-4">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// BADGE
// ============================================================

function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {

  const styles: any = {

    blue:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    purple:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",

    green:
      "bg-green-500/10 text-green-400 border-green-500/20",

    orange:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    pink:
      "bg-pink-500/10 text-pink-400 border-pink-500/20",

  };

  return (

    <span
      className={`
        px-3
        py-1.5
        rounded-lg
        border
        text-xs
        font-medium
        ${styles[color]}
      `}
    >
      {label}
    </span>

  );
}


// ============================================================
// SECTION TITLE
// ============================================================

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {

  return (

    <div className="mb-5">

      <div className="flex items-center gap-3">

        <span className="text-xl">
          {icon}
        </span>

        <h2 className="text-xl font-bold text-white">
          {title}
        </h2>

      </div>

      <p className="text-slate-500 text-sm mt-1 ml-8">
        {subtitle}
      </p>

    </div>
  );
}


// ============================================================
// CHART CARD
// ============================================================

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-2xl
      p-6
      hover:border-slate-700
      transition
    ">

      <div className="mb-5">

        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="text-slate-500 text-sm mt-1">
          {subtitle}
        </p>

      </div>

      <div className="h-80">
        {children}
      </div>

    </div>
  );
}


// ============================================================
// TOOLTIP
// ============================================================

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #334155",
  borderRadius: "12px",
  color: "#ffffff",
};


// ============================================================
// EXPORT
// ============================================================

export default Analytics;