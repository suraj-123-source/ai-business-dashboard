
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ScatterChart,
//   Scatter,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
// } from "recharts";

// interface DynamicChartsProps {
//   groupedAnalysis?: any[];
//   dateAnalysis?: any[];
//   categoryAnalysis?: any[];
//   numericAnalysis?: any[];
// }

// const COLORS = [
//   "#3b82f6",
//   "#22c55e",
//   "#f59e0b",
//   "#ef4444",
//   "#8b5cf6",
//   "#06b6d4",
//   "#ec4899",
//   "#84cc16",
// ];

// function ChartCard({
//   title,
//   subtitle,
//   children,
// }: {
//   title: string;
//   subtitle?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

//       <div className="mb-5">
//         <h2 className="text-lg font-bold text-white">
//           {title}
//         </h2>

//         {subtitle && (
//           <p className="text-slate-500 text-sm mt-1">
//             {subtitle}
//           </p>
//         )}
//       </div>

//       <div className="w-full h-[320px]">
//         {children}
//       </div>

//     </div>
//   );
// }


// export default function DynamicCharts({
//   groupedAnalysis = [],
//   dateAnalysis = [],
//   categoryAnalysis = [],
//   numericAnalysis = [],
// }: DynamicChartsProps) {

//   /*
//   ============================================================
//   DATE / TIME DATA
//   ============================================================
//   */

//   const validDateCharts = dateAnalysis.filter(
//     (item: any) =>
//       item?.data &&
//       item.data.length > 0
//   );


//   /*
//   ============================================================
//   GROUPED DATA
//   ============================================================
//   */

//   const validGroupedCharts = groupedAnalysis.filter(
//     (item: any) =>
//       item?.data &&
//       item.data.length > 0
//   );


//   /*
//   ============================================================
//   CATEGORY DATA
//   ============================================================
//   */

//   const validCategoryCharts = categoryAnalysis.filter(
//     (item: any) =>
//       item?.topValues &&
//       item.topValues.length > 0
//   );


//   /*
//   ============================================================
//   NUMERIC DATA
//   ============================================================
//   */

//   const validNumericCharts = numericAnalysis.filter(
//     (item: any) =>
//       item?.column
//   );


//   /*
//   ============================================================
//   DATE CHART DATA
//   ============================================================
//   */

//   const getDateData = (chart: any) => {
//     return chart.data.map((item: any) => ({
//       name: item.month,
//       value: Number(item.value) || 0,
//     }));
//   };


//   /*
//   ============================================================
//   GROUPED CHART DATA
//   ============================================================
//   */

//   const getGroupedData = (chart: any) => {
//     return chart.data.map((item: any) => ({
//       name: item.name,
//       value: Number(item.value) || 0,
//     }));
//   };


//   /*
//   ============================================================
//   CATEGORY CHART DATA
//   ============================================================
//   */

//   const getCategoryData = (chart: any) => {
//     return chart.topValues.map((item: any) => ({
//       name: item.name,
//       value: Number(item.value) || 0,
//     }));
//   };


//   /*
//   ============================================================
//   NUMERIC SUMMARY DATA
//   ============================================================
//   */

//   const numericSummary = validNumericCharts.map(
//     (item: any) => ({
//       name: item.column,
//       average: Number(item.average) || 0,
//       minimum: Number(item.minimum) || 0,
//       maximum: Number(item.maximum) || 0,
//       median: Number(item.median) || 0,
//       sum: Number(item.sum) || 0,
//     })
//   );


//   return (
//     <div className="space-y-8">

//       {/* =====================================================
//           HEADER
//       ====================================================== */}

//       <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6">

//         <div className="flex items-center gap-3">

//           <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
//             📊
//           </div>

//           <div>

//             <h2 className="text-2xl font-bold text-white">
//               Dynamic Analytics
//             </h2>

//             <p className="text-slate-400 text-sm mt-1">
//               Charts automatically generated from your uploaded dataset
//             </p>

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           DATE / TIME ANALYSIS
//       ====================================================== */}

//       {validDateCharts.length > 0 && (

//         <section>

//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-xl">📈</span>

//             <h2 className="text-xl font-bold text-white">
//               Time & Trend Analysis
//             </h2>
//           </div>


//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {validDateCharts
//               .slice(0, 4)
//               .map((chart: any, index: number) => {

//                 const chartData = getDateData(chart);

//                 return (
//                   <ChartCard
//                     key={`date-${index}`}
//                     title={`${chart.metric} Trend`}
//                     subtitle={`Based on ${chart.dateColumn}`}
//                   >

//                     <ResponsiveContainer width="100%" height="100%">

//                       {index % 2 === 0 ? (

//                         <AreaChart data={chartData}>

//                           <defs>

//                             <linearGradient
//                               id={`gradient-${index}`}
//                               x1="0"
//                               y1="0"
//                               x2="0"
//                               y2="1"
//                             >

//                               <stop
//                                 offset="5%"
//                                 stopColor="#3b82f6"
//                                 stopOpacity={0.5}
//                               />

//                               <stop
//                                 offset="95%"
//                                 stopColor="#3b82f6"
//                                 stopOpacity={0}
//                               />

//                             </linearGradient>

//                           </defs>

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             dataKey="name"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip />

//                           <Area
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#3b82f6"
//                             fill={`url(#gradient-${index})`}
//                             strokeWidth={3}
//                           />

//                         </AreaChart>

//                       ) : (

//                         <LineChart data={chartData}>

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             dataKey="name"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip />

//                           <Line
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#22c55e"
//                             strokeWidth={3}
//                             dot={{ r: 4 }}
//                             activeDot={{ r: 7 }}
//                           />

//                         </LineChart>

//                       )}

//                     </ResponsiveContainer>

//                   </ChartCard>
//                 );
//               })}

//           </div>

//         </section>
//       )}


//       {/* =====================================================
//           CATEGORY ANALYSIS
//       ====================================================== */}

//       {validCategoryCharts.length > 0 && (

//         <section>

//           <div className="flex items-center gap-2 mb-4">

//             <span className="text-xl">
//               🍩
//             </span>

//             <h2 className="text-xl font-bold text-white">
//               Category Analysis
//             </h2>

//           </div>


//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {validCategoryCharts
//               .slice(0, 4)
//               .map((chart: any, index: number) => {

//                 const chartData =
//                   getCategoryData(chart);

//                 return (
//                   <ChartCard
//                     key={`category-${index}`}
//                     title={`${chart.column} Distribution`}
//                     subtitle={`${chart.uniqueValues} unique values`}
//                   >

//                     <ResponsiveContainer
//                       width="100%"
//                       height="100%"
//                     >

//                       <PieChart>

//                         <Pie
//                           data={chartData}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={105}
//                           innerRadius={55}
//                           paddingAngle={3}
//                           label
//                         >

//                           {chartData.map(
//                             (_: any, i: number) => (
//                               <Cell
//                                 key={i}
//                                 fill={
//                                   COLORS[
//                                     i % COLORS.length
//                                   ]
//                                 }
//                               />
//                             )
//                           )}

//                         </Pie>

//                         <Tooltip />

//                         <Legend />

//                       </PieChart>

//                     </ResponsiveContainer>

//                   </ChartCard>
//                 );
//               })}

//           </div>

//         </section>
//       )}


//       {/* =====================================================
//           GROUPED ANALYSIS
//       ====================================================== */}

//       {validGroupedCharts.length > 0 && (

//         <section>

//           <div className="flex items-center gap-2 mb-4">

//             <span className="text-xl">
//               📊
//             </span>

//             <h2 className="text-xl font-bold text-white">
//               Category Comparison
//             </h2>

//           </div>


//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//             {validGroupedCharts
//               .slice(0, 6)
//               .map((chart: any, index: number) => {

//                 const chartData =
//                   getGroupedData(chart);

//                 return (
//                   <ChartCard
//                     key={`group-${index}`}
//                     title={`${chart.metric} by ${chart.category}`}
//                     subtitle="Top values"
//                   >

//                     <ResponsiveContainer
//                       width="100%"
//                       height="100%"
//                     >

//                       {index % 3 === 0 ? (

//                         <BarChart data={chartData}>

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             dataKey="name"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip />

//                           <Bar
//                             dataKey="value"
//                             fill="#8b5cf6"
//                             radius={[8, 8, 0, 0]}
//                           />

//                         </BarChart>

//                       ) : index % 3 === 1 ? (

//                         <LineChart data={chartData}>

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             dataKey="name"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip />

//                           <Line
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#f59e0b"
//                             strokeWidth={3}
//                             dot={{ r: 5 }}
//                           />

//                         </LineChart>

//                       ) : (

//                         <AreaChart data={chartData}>

//                           <CartesianGrid
//                             strokeDasharray="3 3"
//                             stroke="#334155"
//                           />

//                           <XAxis
//                             dataKey="name"
//                             stroke="#94a3b8"
//                           />

//                           <YAxis
//                             stroke="#94a3b8"
//                           />

//                           <Tooltip />

//                           <Area
//                             type="monotone"
//                             dataKey="value"
//                             stroke="#06b6d4"
//                             fill="#06b6d4"
//                             fillOpacity={0.25}
//                             strokeWidth={3}
//                           />

//                         </AreaChart>

//                       )}

//                     </ResponsiveContainer>

//                   </ChartCard>
//                 );
//               })}

//           </div>

//         </section>
//       )}


//       {/* =====================================================
//           NUMERIC ANALYSIS
//       ====================================================== */}

//       {numericSummary.length > 0 && (

//         <section>

//           <div className="flex items-center gap-2 mb-4">

//             <span className="text-xl">
//               📐
//             </span>

//             <h2 className="text-xl font-bold text-white">
//               Numeric Data Analysis
//             </h2>

//           </div>


//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


//             {/* Multi Numeric Comparison */}

//             <ChartCard
//               title="Numeric Comparison"
//               subtitle="Average, minimum and maximum"
//             >

//               <ResponsiveContainer
//                 width="100%"
//                 height="100%"
//               >

//                 <BarChart
//                   data={numericSummary.slice(0, 8)}
//                 >

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="#334155"
//                   />

//                   <XAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                     angle={-25}
//                     textAnchor="end"
//                     height={70}
//                   />

//                   <YAxis
//                     stroke="#94a3b8"
//                   />

//                   <Tooltip />

//                   <Legend />

//                   <Bar
//                     dataKey="average"
//                     name="Average"
//                     fill="#3b82f6"
//                     radius={[6, 6, 0, 0]}
//                   />

//                   <Bar
//                     dataKey="maximum"
//                     name="Maximum"
//                     fill="#22c55e"
//                     radius={[6, 6, 0, 0]}
//                   />

//                 </BarChart>

//               </ResponsiveContainer>

//             </ChartCard>


//             {/* Radar */}

//             <ChartCard
//               title="Numeric Profile"
//               subtitle="Comparison of dataset metrics"
//             >

//               <ResponsiveContainer
//                 width="100%"
//                 height="100%"
//               >

//                 <RadarChart
//                   data={numericSummary.slice(0, 8)}
//                 >

//                   <PolarGrid />

//                   <PolarAngleAxis
//                     dataKey="name"
//                   />

//                   <PolarRadiusAxis />

//                   <Radar
//                     name="Average"
//                     dataKey="average"
//                     stroke="#8b5cf6"
//                     fill="#8b5cf6"
//                     fillOpacity={0.35}
//                   />

//                   <Tooltip />

//                 </RadarChart>

//               </ResponsiveContainer>

//             </ChartCard>


//             {/* Minimum / Maximum */}

//             <ChartCard
//               title="Minimum vs Maximum"
//               subtitle="Range of numeric columns"
//             >

//               <ResponsiveContainer
//                 width="100%"
//                 height="100%"
//               >

//                 <BarChart
//                   data={numericSummary.slice(0, 8)}
//                 >

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="#334155"
//                   />

//                   <XAxis
//                     dataKey="name"
//                     stroke="#94a3b8"
//                     angle={-25}
//                     textAnchor="end"
//                     height={70}
//                   />

//                   <YAxis
//                     stroke="#94a3b8"
//                   />

//                   <Tooltip />

//                   <Legend />

//                   <Bar
//                     dataKey="minimum"
//                     name="Minimum"
//                     fill="#ef4444"
//                     radius={[6, 6, 0, 0]}
//                   />

//                   <Bar
//                     dataKey="maximum"
//                     name="Maximum"
//                     fill="#f59e0b"
//                     radius={[6, 6, 0, 0]}
//                   />

//                 </BarChart>

//               </ResponsiveContainer>

//             </ChartCard>


//             {/* Scatter-style relationship */}

//             {numericSummary.length >= 2 && (

//               <ChartCard
//                 title="Numeric Relationship"
//                 subtitle="Comparison between numeric metrics"
//               >

//                 <ResponsiveContainer
//                   width="100%"
//                   height="100%"
//                 >

//                   <ScatterChart>

//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       stroke="#334155"
//                     />

//                     <XAxis
//                       type="number"
//                       dataKey="average"
//                       name={numericSummary[0]?.name}
//                       stroke="#94a3b8"
//                     />

//                     <YAxis
//                       type="number"
//                       dataKey="maximum"
//                       name={numericSummary[1]?.name}
//                       stroke="#94a3b8"
//                     />

//                     <Tooltip cursor={{ strokeDasharray: "3 3" }} />

//                     <Scatter
//                       name="Metrics"
//                       data={numericSummary}
//                       fill="#ec4899"
//                     />

//                   </ScatterChart>

//                 </ResponsiveContainer>

//               </ChartCard>

//             )}

//           </div>

//         </section>

//       )}


//       {/* =====================================================
//           NO DATA
//       ====================================================== */}

//       {validDateCharts.length === 0 &&
//         validGroupedCharts.length === 0 &&
//         validCategoryCharts.length === 0 &&
//         numericSummary.length === 0 && (

//           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

//             <div className="text-5xl mb-4">
//               📊
//             </div>

//             <h2 className="text-xl font-bold text-white">
//               No chartable data found
//             </h2>

//             <p className="text-slate-400 mt-2">
//               Upload a CSV or Excel file containing
//               numeric, categorical, or date columns.
//             </p>

//           </div>

//         )}

//     </div>
//   );
// }



import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import { useSettings } from "../context/SettingsContext";

interface DynamicChartsProps {
  groupedAnalysis?: any[];
  dateAnalysis?: any[];
  categoryAnalysis?: any[];
  numericAnalysis?: any[];
}

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

/*
============================================================
DATE FORMATTER
============================================================
*/

function formatDateLabel(
  value: any,
  dateFormat: string
): string {
  if (!value) return "-";

  const text = String(value).trim();

  /*
    Backend commonly sends monthly values such as:

    2026-01
    2026-02
    2026-03

    We convert these according to Settings.
  */

  const monthMatch = text.match(
    /^(\d{4})[-/](\d{1,2})$/
  );

  if (monthMatch) {
    const year = monthMatch[1];
    const month = monthMatch[2].padStart(2, "0");

    switch (dateFormat) {
      case "DD/MM/YYYY":
        return `01/${month}/${year}`;

      case "MM/DD/YYYY":
        return `${month}/01/${year}`;

      case "YYYY-MM-DD":
        return `${year}-${month}-01`;

      default:
        return `${year}-${month}`;
    }
  }

  /*
    Full date support
  */

  const dateMatch = text.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
  );

  if (dateMatch) {
    const year = dateMatch[1];
    const month = dateMatch[2].padStart(2, "0");
    const day = dateMatch[3].padStart(2, "0");

    switch (dateFormat) {
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;

      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;

      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;

      default:
        return `${day}/${month}/${year}`;
    }
  }

  /*
    If the backend sends something already formatted,
    keep it unchanged instead of breaking the chart.
  */

  return text;
}


function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

      <div className="mb-5">
        <h2 className="text-lg font-bold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="text-slate-500 text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="w-full h-[320px]">
        {children}
      </div>

    </div>
  );
}


export default function DynamicCharts({
  groupedAnalysis = [],
  dateAnalysis = [],
  categoryAnalysis = [],
  numericAnalysis = [],
}: DynamicChartsProps) {

  /*
  ============================================================
  SETTINGS
  ============================================================
  */

  const { settings } = useSettings();

  const dateFormat =
    settings.dateFormat || "DD/MM/YYYY";


  /*
  ============================================================
  DATE / TIME DATA
  ============================================================
  */

  const validDateCharts = dateAnalysis.filter(
    (item: any) =>
      item?.data &&
      item.data.length > 0
  );


  /*
  ============================================================
  GROUPED DATA
  ============================================================
  */

  const validGroupedCharts = groupedAnalysis.filter(
    (item: any) =>
      item?.data &&
      item.data.length > 0
  );


  /*
  ============================================================
  CATEGORY DATA
  ============================================================
  */

  const validCategoryCharts = categoryAnalysis.filter(
    (item: any) =>
      item?.topValues &&
      item.topValues.length > 0
  );


  /*
  ============================================================
  NUMERIC DATA
  ============================================================
  */

  const validNumericCharts = numericAnalysis.filter(
    (item: any) =>
      item?.column
  );


  /*
  ============================================================
  DATE CHART DATA
  ============================================================
  */

  const getDateData = (chart: any) => {
    return chart.data.map((item: any) => ({
      name: formatDateLabel(
        item.month,
        dateFormat
      ),

      value: Number(item.value) || 0,
    }));
  };


  /*
  ============================================================
  GROUPED CHART DATA
  ============================================================
  */

  const getGroupedData = (chart: any) => {
    return chart.data.map((item: any) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }));
  };


  /*
  ============================================================
  CATEGORY CHART DATA
  ============================================================
  */

  const getCategoryData = (chart: any) => {
    return chart.topValues.map((item: any) => ({
      name: item.name,
      value: Number(item.value) || 0,
    }));
  };


  /*
  ============================================================
  NUMERIC SUMMARY DATA
  ============================================================
  */

  const numericSummary = validNumericCharts.map(
    (item: any) => ({
      name: item.column,
      average: Number(item.average) || 0,
      minimum: Number(item.minimum) || 0,
      maximum: Number(item.maximum) || 0,
      median: Number(item.median) || 0,
      sum: Number(item.sum) || 0,
    })
  );


  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
            📊
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Dynamic Analytics
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Charts automatically generated from your uploaded dataset
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          DATE / TIME ANALYSIS
      ====================================================== */}

      {validDateCharts.length > 0 && (

        <section>

          <div className="flex items-center gap-2 mb-4">

            <span className="text-xl">
              📈
            </span>

            <h2 className="text-xl font-bold text-white">
              Time & Trend Analysis
            </h2>

          </div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {validDateCharts
              .slice(0, 4)
              .map((chart: any, index: number) => {

                const chartData =
                  getDateData(chart);

                return (
                  <ChartCard
                    key={`date-${index}`}
                    title={`${chart.metric} Trend`}
                    subtitle={`Based on ${chart.dateColumn} • Format: ${dateFormat}`}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      {index % 2 === 0 ? (

                        <AreaChart data={chartData}>

                          <defs>

                            <linearGradient
                              id={`gradient-${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >

                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.5}
                              />

                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />

                            </linearGradient>

                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                          />

                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                          />

                          <YAxis
                            stroke="#94a3b8"
                          />

                          <Tooltip />

                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            fill={`url(#gradient-${index})`}
                            strokeWidth={3}
                          />

                        </AreaChart>

                      ) : (

                        <LineChart data={chartData}>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                          />

                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                          />

                          <YAxis
                            stroke="#94a3b8"
                          />

                          <Tooltip />

                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 7 }}
                          />

                        </LineChart>

                      )}

                    </ResponsiveContainer>

                  </ChartCard>
                );
              })}

          </div>

        </section>
      )}


      {/* =====================================================
          CATEGORY ANALYSIS
      ====================================================== */}

      {validCategoryCharts.length > 0 && (

        <section>

          <div className="flex items-center gap-2 mb-4">

            <span className="text-xl">
              🍩
            </span>

            <h2 className="text-xl font-bold text-white">
              Category Analysis
            </h2>

          </div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {validCategoryCharts
              .slice(0, 4)
              .map((chart: any, index: number) => {

                const chartData =
                  getCategoryData(chart);

                return (
                  <ChartCard
                    key={`category-${index}`}
                    title={`${chart.column} Distribution`}
                    subtitle={`${chart.uniqueValues} unique values`}
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={105}
                          innerRadius={55}
                          paddingAngle={3}
                          label
                        >

                          {chartData.map(
                            (_: any, i: number) => (
                              <Cell
                                key={i}
                                fill={
                                  COLORS[
                                    i % COLORS.length
                                  ]
                                }
                              />
                            )
                          )}

                        </Pie>

                        <Tooltip />

                        <Legend />

                      </PieChart>

                    </ResponsiveContainer>

                  </ChartCard>
                );
              })}

          </div>

        </section>
      )}


      {/* =====================================================
          GROUPED ANALYSIS
      ====================================================== */}

      {validGroupedCharts.length > 0 && (

        <section>

          <div className="flex items-center gap-2 mb-4">

            <span className="text-xl">
              📊
            </span>

            <h2 className="text-xl font-bold text-white">
              Category Comparison
            </h2>

          </div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {validGroupedCharts
              .slice(0, 6)
              .map((chart: any, index: number) => {

                const chartData =
                  getGroupedData(chart);

                return (
                  <ChartCard
                    key={`group-${index}`}
                    title={`${chart.metric} by ${chart.category}`}
                    subtitle="Top values"
                  >

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      {index % 3 === 0 ? (

                        <BarChart data={chartData}>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                          />

                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                          />

                          <YAxis
                            stroke="#94a3b8"
                          />

                          <Tooltip />

                          <Bar
                            dataKey="value"
                            fill="#8b5cf6"
                            radius={[8, 8, 0, 0]}
                          />

                        </BarChart>

                      ) : index % 3 === 1 ? (

                        <LineChart data={chartData}>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                          />

                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                          />

                          <YAxis
                            stroke="#94a3b8"
                          />

                          <Tooltip />

                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            dot={{ r: 5 }}
                          />

                        </LineChart>

                      ) : (

                        <AreaChart data={chartData}>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                            />

                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                          />

                          <YAxis
                            stroke="#94a3b8"
                          />

                          <Tooltip />

                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.25}
                            strokeWidth={3}
                          />

                        </AreaChart>

                      )}

                    </ResponsiveContainer>

                  </ChartCard>
                );
              })}

          </div>

        </section>
      )}


      {/* =====================================================
          NUMERIC ANALYSIS
      ====================================================== */}

      {numericSummary.length > 0 && (

        <section>

          <div className="flex items-center gap-2 mb-4">

            <span className="text-xl">
              📐
            </span>

            <h2 className="text-xl font-bold text-white">
              Numeric Data Analysis
            </h2>

          </div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Multi Numeric Comparison */}

            <ChartCard
              title="Numeric Comparison"
              subtitle="Average, minimum and maximum"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={numericSummary.slice(0, 8)}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    angle={-25}
                    textAnchor="end"
                    height={70}
                  />

                  <YAxis
                    stroke="#94a3b8"
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="average"
                    name="Average"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="maximum"
                    name="Maximum"
                    fill="#22c55e"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </ChartCard>


            {/* Radar */}

            <ChartCard
              title="Numeric Profile"
              subtitle="Comparison of dataset metrics"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <RadarChart
                  data={numericSummary.slice(0, 8)}
                >

                  <PolarGrid />

                  <PolarAngleAxis
                    dataKey="name"
                  />

                  <PolarRadiusAxis />

                  <Radar
                    name="Average"
                    dataKey="average"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.35}
                  />

                  <Tooltip />

                </RadarChart>

              </ResponsiveContainer>

            </ChartCard>


            {/* Minimum / Maximum */}

            <ChartCard
              title="Minimum vs Maximum"
              subtitle="Range of numeric columns"
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={numericSummary.slice(0, 8)}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    angle={-25}
                    textAnchor="end"
                    height={70}
                  />

                  <YAxis
                    stroke="#94a3b8"
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="minimum"
                    name="Minimum"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="maximum"
                    name="Maximum"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </ChartCard>


            {/* Scatter-style relationship */}

            {numericSummary.length >= 2 && (

              <ChartCard
                title="Numeric Relationship"
                subtitle="Comparison between numeric metrics"
              >

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <ScatterChart>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      type="number"
                      dataKey="average"
                      name={numericSummary[0]?.name}
                      stroke="#94a3b8"
                    />

                    <YAxis
                      type="number"
                      dataKey="maximum"
                      name={numericSummary[1]?.name}
                      stroke="#94a3b8"
                    />

                    <Tooltip
                      cursor={{
                        strokeDasharray: "3 3",
                      }}
                    />

                    <Scatter
                      name="Metrics"
                      data={numericSummary}
                      fill="#ec4899"
                    />

                  </ScatterChart>

                </ResponsiveContainer>

              </ChartCard>

            )}

          </div>

        </section>

      )}


      {/* =====================================================
          NO DATA
      ====================================================== */}

      {validDateCharts.length === 0 &&
        validGroupedCharts.length === 0 &&
        validCategoryCharts.length === 0 &&
        numericSummary.length === 0 && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              📊
            </div>

            <h2 className="text-xl font-bold text-white">
              No chartable data found
            </h2>

            <p className="text-slate-400 mt-2">
              Upload a CSV or Excel file containing
              numeric, categorical, or date columns.
            </p>

          </div>

        )}

    </div>
  );
}