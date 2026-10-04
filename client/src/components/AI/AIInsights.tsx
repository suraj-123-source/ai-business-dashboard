
// interface AIInsightsProps {
//   insights?: any;

//   revenue?: number;
//   profit?: number;
//   revenueGrowth?: number;
//   bestMonth?: string;
//   worstMonth?: string;
//   highestGrowthMonth?: string;
// }

// export default function AIInsights({
//   insights,
//   revenue = 0,
//   profit = 0,
//   revenueGrowth = 0,
//   bestMonth = "N/A",
//   worstMonth = "N/A",
//   highestGrowthMonth = "N/A",
// }: AIInsightsProps) {

//   const safeRevenue = Number(revenue) || 0;
//   const safeProfit = Number(profit) || 0;
//   const safeGrowth = Number(revenueGrowth) || 0;

//   const profitMargin =
//     safeRevenue > 0
//       ? (safeProfit / safeRevenue) * 100
//       : 0;

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

//       {/* Header */}

//       <div className="flex items-center gap-3 mb-6">

//         <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
//           🤖
//         </div>

//         <div>
//           <h2 className="text-xl font-bold text-white">
//             AI Business Insights
//           </h2>

//           <p className="text-slate-400 text-sm">
//             Automated analysis of your business performance
//           </p>
//         </div>

//       </div>


//       {/* Existing backend AI insights */}

//       {insights && (
//         <div className="mb-6 bg-slate-800/50 rounded-xl p-5">

//           <p className="text-blue-400 font-semibold mb-2">
//             💡 Business Insight
//           </p>

//           <p className="text-slate-300 text-sm leading-6">
//             {typeof insights === "string"
//               ? insights
//               : JSON.stringify(insights)}
//           </p>

//         </div>
//       )}


//       {/* Analytics insights */}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {/* Revenue */}

//         <div className="bg-slate-800/50 rounded-xl p-5">

//           <p className="text-blue-400 font-semibold mb-2">
//             📈 Revenue Analysis
//           </p>

//           <p className="text-slate-300 text-sm leading-6">

//             Your total revenue is{" "}

//             <span className="text-white font-semibold">
//               ₹{safeRevenue.toLocaleString()}
//             </span>

//             {" "}with month-over-month growth of{" "}

//             <span className="text-white font-semibold">
//               {safeGrowth >= 0 ? "+" : ""}
//               {safeGrowth.toFixed(1)}%
//             </span>.

//           </p>

//         </div>


//         {/* Profit */}

//         <div className="bg-slate-800/50 rounded-xl p-5">

//           <p className="text-green-400 font-semibold mb-2">
//             💰 Profit Analysis
//           </p>

//           <p className="text-slate-300 text-sm leading-6">

//             Your current profit is{" "}

//             <span className="text-white font-semibold">
//               ₹{safeProfit.toLocaleString()}
//             </span>

//             {" "}with an estimated profit margin of{" "}

//             <span className="text-white font-semibold">
//               {profitMargin.toFixed(1)}%
//             </span>.

//           </p>

//         </div>


//         {/* Best Month */}

//         <div className="bg-slate-800/50 rounded-xl p-5">

//           <p className="text-yellow-400 font-semibold mb-2">
//             🏆 Best Performance
//           </p>

//           <p className="text-slate-300 text-sm leading-6">

//             <span className="text-white font-semibold">
//               {bestMonth}
//             </span>

//             {" "}was your strongest revenue month.

//             Highest growth was recorded in{" "}

//             <span className="text-white font-semibold">
//               {highestGrowthMonth}
//             </span>.

//           </p>

//         </div>


//         {/* Warning */}

//         <div className="bg-slate-800/50 rounded-xl p-5">

//           <p className="text-orange-400 font-semibold mb-2">
//             ⚠️ Performance Alert
//           </p>

//           <p className="text-slate-300 text-sm leading-6">

//             <span className="text-white font-semibold">
//               {worstMonth}
//             </span>

//             {" "}recorded the lowest revenue.

//             Consider reviewing sales activity during this period.

//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

interface AIInsightsProps {
  insights?: any;
  dashboardData?: any;

  revenue?: number;
  profit?: number;
  revenueGrowth?: number;
  bestMonth?: string;
  worstMonth?: string;
  highestGrowthMonth?: string;
}

export default function AIInsights({
  insights,
  dashboardData,
  revenue,
  profit,
  revenueGrowth,
  bestMonth,
  worstMonth,
  highestGrowthMonth,
}: AIInsightsProps) {

  // --------------------------------------------------
  // Helper: convert value to number
  // --------------------------------------------------

  const toNumber = (value: any): number => {
    if (typeof value === "number") return value;

    if (typeof value === "string") {
      const cleaned = value
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .replace(/%/g, "")
        .trim();

      const number = Number(cleaned);

      return Number.isFinite(number) ? number : 0;
    }

    return 0;
  };


  // --------------------------------------------------
  // Dataset information
  // --------------------------------------------------

  const rows = dashboardData?.preview || [];

  const columns = dashboardData?.columns || [];


  // --------------------------------------------------
  // Find columns automatically
  // --------------------------------------------------

  const findColumn = (keywords: string[]) => {

    const lowerColumns = columns.map((column: string) => ({
      original: column,
      lower: column.toLowerCase().replace(/[^a-z0-9]/g, ""),
    }));

    for (const keyword of keywords) {

      const cleanKeyword = keyword
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      const found = lowerColumns.find((column: any) =>
        column.lower.includes(cleanKeyword)
      );

      if (found) {
        return found.original;
      }
    }

    return null;
  };


  // --------------------------------------------------
  // Automatically detect important columns
  // --------------------------------------------------

  const revenueColumn = findColumn([
    "revenue",
    "sales",
    "sale",
    "amount",
    "turnover",
    "income",
    "earning",
    "value",
  ]);

  const profitColumn = findColumn([
    "profit",
    "netprofit",
    "grossprofit",
    "income",
    "margin",
  ]);

  const monthColumn = findColumn([
    "month",
    "date",
    "year",
    "period",
  ]);


  // --------------------------------------------------
  // Calculate revenue
  // --------------------------------------------------

  let calculatedRevenue = toNumber(revenue);

  if (!calculatedRevenue && revenueColumn && rows.length > 0) {

    calculatedRevenue = rows.reduce(
      (total: number, row: any) =>
        total + toNumber(row[revenueColumn]),
      0
    );
  }


  // --------------------------------------------------
  // Calculate profit
  // --------------------------------------------------

  let calculatedProfit = toNumber(profit);

  if (!calculatedProfit && profitColumn && rows.length > 0) {

    calculatedProfit = rows.reduce(
      (total: number, row: any) =>
        total + toNumber(row[profitColumn]),
      0
    );
  }


  // --------------------------------------------------
  // If backend KPI exists, use it
  // --------------------------------------------------

  if (
    dashboardData?.kpis?.revenue &&
    Number(dashboardData.kpis.revenue) > 0
  ) {
    calculatedRevenue = Number(dashboardData.kpis.revenue);
  }

  if (
    dashboardData?.kpis?.profit &&
    Number(dashboardData.kpis.profit) > 0
  ) {
    calculatedProfit = Number(dashboardData.kpis.profit);
  }


  // --------------------------------------------------
  // Profit margin
  // --------------------------------------------------

  const profitMargin =
    calculatedRevenue > 0
      ? (calculatedProfit / calculatedRevenue) * 100
      : 0;


  // --------------------------------------------------
  // Monthly / Date analysis
  // --------------------------------------------------

  let calculatedBestMonth = bestMonth || "";
  let calculatedWorstMonth = worstMonth || "";
  let calculatedHighestGrowthMonth =
    highestGrowthMonth || "";

  let calculatedGrowth = toNumber(revenueGrowth);


  if (
    revenueColumn &&
    monthColumn &&
    rows.length > 0
  ) {

    const grouped: Record<string, number> = {};

    rows.forEach((row: any) => {

      const period = String(
        row[monthColumn] ?? "Unknown"
      );

      const value = toNumber(
        row[revenueColumn]
      );

      if (!grouped[period]) {
        grouped[period] = 0;
      }

      grouped[period] += value;
    });


    const entries = Object.entries(grouped);

    if (entries.length > 0) {

      const sorted = [...entries].sort(
        (a, b) => b[1] - a[1]
      );

      if (!calculatedBestMonth) {
        calculatedBestMonth = sorted[0][0];
      }

      if (!calculatedWorstMonth) {
        calculatedWorstMonth =
          sorted[sorted.length - 1][0];
      }


      // Growth calculation

      if (entries.length >= 2) {

        const first = entries[0][1];
        const last = entries[entries.length - 1][1];

        if (first !== 0) {

          calculatedGrowth =
            ((last - first) / Math.abs(first)) * 100;
        }


        let highestGrowth = -Infinity;
        let growthPeriod = entries[1][0];

        for (let i = 1; i < entries.length; i++) {

          const previous = entries[i - 1][1];
          const current = entries[i][1];

          if (previous !== 0) {

            const growth =
              ((current - previous) /
                Math.abs(previous)) *
              100;

            if (growth > highestGrowth) {

              highestGrowth = growth;
              growthPeriod = entries[i][0];

            }
          }
        }

        if (!calculatedHighestGrowthMonth) {
          calculatedHighestGrowthMonth =
            growthPeriod;
        }
      }
    }
  }


  // --------------------------------------------------
  // Generic analysis for files without Revenue/Profit
  // --------------------------------------------------

  let genericColumn = "";

  if (!revenueColumn && columns.length > 0) {

    const numericColumns = columns.filter(
      (column: string) => {

        const values = rows
          .map((row: any) =>
            toNumber(row[column])
          )
          .filter((value: number) => value !== 0);

        return values.length >= 2;
      }
    );

    if (numericColumns.length > 0) {
      genericColumn = numericColumns[0];
    }
  }


  // --------------------------------------------------
  // Generic best/worst performance
  // --------------------------------------------------

  let genericBest = 0;
  let genericWorst = 0;

  if (genericColumn) {

    const values = rows
      .map((row: any) =>
        toNumber(row[genericColumn])
      )
      .filter((value: number) =>
        Number.isFinite(value)
      );

    if (values.length > 0) {

      genericBest = Math.max(...values);
      genericWorst = Math.min(...values);
    }
  }


  // --------------------------------------------------
  // Final safe values
  // --------------------------------------------------

  const safeRevenue =
    Number(calculatedRevenue) || 0;

  const safeProfit =
    Number(calculatedProfit) || 0;

  const safeGrowth =
    Number(calculatedGrowth) || 0;


  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (

    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
          🤖
        </div>

        <div>

          <h2 className="text-xl font-bold text-white">
            AI Business Insights
          </h2>

          <p className="text-slate-400 text-sm">
            Automated analysis of your business performance
          </p>

        </div>

      </div>


      {/* Backend Insights */}

      {insights && (

        <div className="mb-6 bg-slate-800/50 rounded-xl p-5">

          <p className="text-blue-400 font-semibold mb-2">
            💡 Business Insight
          </p>

          <div className="text-slate-300 text-sm leading-6 space-y-1">

            {Array.isArray(insights) ? (

              insights.map(
                (item: any, index: number) => (
                  <p key={index}>
                    {item}
                  </p>
                )
              )

            ) : (

              <p>
                {typeof insights === "string"
                  ? insights
                  : JSON.stringify(insights)}
              </p>

            )}

          </div>

        </div>

      )}


      {/* Analytics */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        {/* Revenue */}

        <div className="bg-slate-800/50 rounded-xl p-5">

          <p className="text-blue-400 font-semibold mb-2">
            📈 Revenue Analysis
          </p>

          {safeRevenue > 0 ? (

            <p className="text-slate-300 text-sm leading-6">

              Your total{" "}
              <span className="text-white font-semibold">
                {revenueColumn || "sales"}
              </span>{" "}
              value is{" "}

              <span className="text-white font-semibold">
                ₹{safeRevenue.toLocaleString()}
              </span>

              {" "}with an estimated growth of{" "}

              <span className="text-white font-semibold">
                {safeGrowth >= 0 ? "+" : ""}
                {safeGrowth.toFixed(1)}%
              </span>.

            </p>

          ) : genericColumn ? (

            <p className="text-slate-300 text-sm leading-6">

              The dataset does not contain a standard
              revenue column. The main numeric metric{" "}

              <span className="text-white font-semibold">
                {genericColumn}
              </span>{" "}
              has a highest value of{" "}

              <span className="text-white font-semibold">
                {genericBest.toLocaleString()}
              </span>.

            </p>

          ) : (

            <p className="text-slate-400 text-sm">
              No suitable numeric business metric was found
              in the uploaded dataset.
            </p>

          )}

        </div>


        {/* Profit */}

        <div className="bg-slate-800/50 rounded-xl p-5">

          <p className="text-green-400 font-semibold mb-2">
            💰 Profit Analysis
          </p>

          {safeProfit > 0 ? (

            <p className="text-slate-300 text-sm leading-6">

              Your current profit is{" "}

              <span className="text-white font-semibold">
                ₹{safeProfit.toLocaleString()}
              </span>

              {" "}with an estimated profit margin of{" "}

              <span className="text-white font-semibold">
                {profitMargin.toFixed(1)}%
              </span>.

            </p>

          ) : (

            <p className="text-slate-300 text-sm leading-6">

              A standard profit column was not found.

              {profitColumn ? (
                <>
                  {" "}Detected metric:{" "}
                  <span className="text-white font-semibold">
                    {profitColumn}
                  </span>.
                </>
              ) : (
                <>
                  {" "}Profit analysis will be shown when
                  the dataset contains a profit-related
                  numeric column.
                </>
              )}

            </p>

          )}

        </div>


        {/* Best Performance */}

        <div className="bg-slate-800/50 rounded-xl p-5">

          <p className="text-yellow-400 font-semibold mb-2">
            🏆 Best Performance
          </p>

          {calculatedBestMonth ? (

            <p className="text-slate-300 text-sm leading-6">

              <span className="text-white font-semibold">
                {calculatedBestMonth}
              </span>{" "}
              recorded the highest{" "}
              <span className="text-white font-semibold">
                {revenueColumn || "performance"}
              </span>{" "}
              value.

              {calculatedHighestGrowthMonth && (
                <>
                  {" "}Highest growth was recorded in{" "}
                  <span className="text-white font-semibold">
                    {calculatedHighestGrowthMonth}
                  </span>.
                </>
              )}

            </p>

          ) : genericColumn ? (

            <p className="text-slate-300 text-sm leading-6">

              Best value for{" "}

              <span className="text-white font-semibold">
                {genericColumn}
              </span>{" "}

              is{" "}

              <span className="text-white font-semibold">
                {genericBest.toLocaleString()}
              </span>.

            </p>

          ) : (

            <p className="text-slate-400 text-sm">
              Best performance information is not available
              from this dataset.
            </p>

          )}

        </div>


        {/* Performance Alert */}

        <div className="bg-slate-800/50 rounded-xl p-5">

          <p className="text-orange-400 font-semibold mb-2">
            ⚠️ Performance Alert
          </p>

          {calculatedWorstMonth ? (

            <p className="text-slate-300 text-sm leading-6">

              <span className="text-white font-semibold">
                {calculatedWorstMonth}
              </span>{" "}
              recorded the lowest{" "}
              <span className="text-white font-semibold">
                {revenueColumn || "performance"}
              </span>{" "}
              value.

            </p>

          ) : genericColumn ? (

            <p className="text-slate-300 text-sm leading-6">

              Lowest value for{" "}

              <span className="text-white font-semibold">
                {genericColumn}
              </span>{" "}

              is{" "}

              <span className="text-white font-semibold">
                {genericWorst.toLocaleString()}
              </span>.

            </p>

          ) : (

            <p className="text-slate-400 text-sm">
              No significant performance alert is currently
              available from the uploaded data.
            </p>

          )}

        </div>

      </div>

    </div>

  );
}