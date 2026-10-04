// import type { ReactNode } from "react";

interface AIInsightsProps {
  data: any;
}


// ============================================================
// HELPERS
// ============================================================

function formatNumber(value: any): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return number.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}


function titleCase(value: any): string {
  return String(value ?? "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function safeArray(value: any): any[] {
  return Array.isArray(value) ? value : [];
}


// ============================================================
// MAIN
// ============================================================

export default function AIInsights({
  data,
}: AIInsightsProps) {

  // ==========================================================
  // NO DATA
  // ==========================================================

  if (!data) {
    return (
      <div className="w-full min-h-screen p-6 lg:p-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">🤖</div>

          <h1 className="text-2xl font-bold text-white">
            AI Insights
          </h1>

          <p className="text-slate-400 mt-2">
            Upload a dataset to generate dynamic insights.
          </p>
        </div>
      </div>
    );
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const kpis = safeArray(data?.kpis);
  const numericAnalysis = safeArray(data?.numericAnalysis);
  const categoryAnalysis = safeArray(data?.categoryAnalysis);
  const groupedAnalysis = safeArray(data?.groupedAnalysis);
  const dateAnalysis = safeArray(data?.dateAnalysis);
  const backendInsights = safeArray(data?.aiInsights);
  const columns = safeArray(data?.columns);
  const columnInformation = safeArray(
    data?.columnInformation
  );

  const detectedColumns =
    data?.detectedColumns || {};

  const numericColumns = safeArray(
    detectedColumns.numeric
  );

  const categoricalColumns = safeArray(
    detectedColumns.categorical
  );

  const dateColumns = safeArray(
    detectedColumns.date
  );

  const textColumns = safeArray(
    detectedColumns.text
  );

  const idColumns = safeArray(
    detectedColumns.id
  );


  // ==========================================================
  // BASIC DATA
  // ==========================================================

  const totalRecords =
    Number(data?.rows || 0);

  const totalColumns =
    columns.length;


  // ==========================================================
  // DATA QUALITY
  // ==========================================================

  const missingValues =
    columnInformation.reduce(
      (total: number, item: any) =>
        total +
        Number(item?.missing || 0),
      0
    );

  const totalCells =
    totalRecords * totalColumns;

  const dataQuality =
    totalCells > 0
      ? Math.max(
          0,
          100 -
            (missingValues / totalCells) *
              100
        )
      : 100;


  // ==========================================================
  // NUMERIC FINDINGS
  // ==========================================================

  const validNumeric =
    numericAnalysis.filter(
      (item: any) =>
        item && item.column
    );


  const highestNumeric =
    validNumeric.length > 0
      ? validNumeric.reduce(
          (best: any, current: any) =>
            Number(current?.maximum || 0) >
            Number(best?.maximum || 0)
              ? current
              : best
        )
      : null;


  const lowestNumeric =
    validNumeric.length > 0
      ? validNumeric.reduce(
          (worst: any, current: any) =>
            Number(current?.minimum || 0) <
            Number(worst?.minimum || 0)
              ? current
              : worst
        )
      : null;


  const largestTotal =
    validNumeric.length > 0
      ? validNumeric.reduce(
          (best: any, current: any) =>
            Number(current?.sum || 0) >
            Number(best?.sum || 0)
              ? current
              : best
        )
      : null;


  const highestAverage =
    validNumeric.length > 0
      ? validNumeric.reduce(
          (best: any, current: any) =>
            Number(current?.average || 0) >
            Number(best?.average || 0)
              ? current
              : best
        )
      : null;


  // ==========================================================
  // CATEGORY FINDINGS
  // ==========================================================

  const validCategories =
    categoryAnalysis.filter(
      (item: any) =>
        item &&
        item.column &&
        safeArray(item.topValues).length > 0
    );


  const strongestCategory =
    validCategories.length > 0
      ? validCategories.reduce(
          (best: any, current: any) => {

            const bestValue =
              Number(
                best?.topValues?.[0]?.value || 0
              );

            const currentValue =
              Number(
                current?.topValues?.[0]?.value || 0
              );

            return currentValue > bestValue
              ? current
              : best;
          }
        )
      : null;


  const strongestCategoryName =
    strongestCategory?.topValues?.[0]?.name ||
    null;


  const strongestCategoryValue =
    Number(
      strongestCategory?.topValues?.[0]?.value ||
        0
    );


  // ==========================================================
  // DATE FINDINGS
  // ==========================================================

  const validTimeSeries =
    dateAnalysis.filter(
      (item: any) =>
        item &&
        item.dateColumn &&
        safeArray(item.data).length > 0
    );


  const timeSeries =
    validTimeSeries[0] || null;


  const timeData =
    safeArray(timeSeries?.data);


  let bestPeriod: any = null;
  let worstPeriod: any = null;
  let timeGrowth = 0;


  if (timeData.length > 0) {

    bestPeriod =
      timeData.reduce(
        (best: any, current: any) =>
          Number(current?.value || 0) >
          Number(best?.value || 0)
            ? current
            : best
      );


    worstPeriod =
      timeData.reduce(
        (worst: any, current: any) =>
          Number(current?.value || 0) <
          Number(worst?.value || 0)
            ? current
            : worst
      );


    if (timeData.length > 1) {

      const first =
        Number(timeData[0]?.value || 0);

      const last =
        Number(
          timeData[timeData.length - 1]?.value ||
            0
        );

      if (first !== 0) {
        timeGrowth =
          ((last - first) /
            Math.abs(first)) *
          100;
      }
    }
  }


  // ==========================================================
  // STATUS
  // ==========================================================

  let status = "Analysis Ready";

  let statusType:
    | "positive"
    | "warning"
    | "neutral" =
    "neutral";

  if (timeData.length > 1) {

    if (timeGrowth > 5) {
      status = "Improving";
      statusType = "positive";
    } else if (timeGrowth < -5) {
      status = "Needs Attention";
      statusType = "warning";
    } else {
      status = "Stable";
    }

  }


  // ==========================================================
  // RECOMMENDATIONS
  // ==========================================================

  const recommendations: {
    type:
      | "positive"
      | "warning"
      | "opportunity";

    title: string;
    text: string;
  }[] = [];


  if (dataQuality < 90) {

    recommendations.push({
      type: "warning",
      title: "Improve data quality",
      text:
        `Dataset completeness is ${dataQuality.toFixed(
          1
        )}%. Review missing values before important decisions.`,
    });

  } else {

    recommendations.push({
      type: "positive",
      title: "Data quality looks healthy",
      text:
        `The dataset is ${dataQuality.toFixed(
          1
        )}% complete.`,
    });
  }


  if (highestNumeric) {

    recommendations.push({
      type: "opportunity",
      title: "Review the strongest numeric measure",
      text:
        `${titleCase(
          highestNumeric.column
        )} has the highest detected value of ${formatNumber(
          highestNumeric.maximum
        )}.`,
    });
  }


  if (strongestCategory) {

    recommendations.push({
      type: "opportunity",
      title: "Focus on the leading category",
      text:
        `${titleCase(
          strongestCategory.column
        )} is led by "${strongestCategoryName}" with ${formatNumber(
          strongestCategoryValue
        )} records.`,
    });
  }


  if (timeData.length > 1) {

    recommendations.push({
      type:
        timeGrowth >= 0
          ? "positive"
          : "warning",

      title:
        timeGrowth >= 0
          ? "Positive time movement"
          : "Negative time movement",

      text:
        `The detected time series moved ${timeGrowth >= 0 ? "up" : "down"} by ${Math.abs(
          timeGrowth
        ).toFixed(1)}%.`,
    });

  } else if (
    numericAnalysis.length > 1
  ) {

    recommendations.push({
      type: "opportunity",
      title: "Compare the numeric measures",
      text:
        "Multiple numeric fields are available. Comparing their totals, averages and ranges may reveal useful patterns.",
    });
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="w-full min-h-screen">

      <div className="
        w-full
        px-5
        sm:px-6
        lg:px-8
        py-6
      ">

        {/* ==================================================
            HEADER
        =================================================== */}

        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-5
          mb-6
        ">

          <div>

            <div className="
              flex
              items-center
              gap-3
            ">

              <div className="
                w-12
                h-12
                rounded-2xl
                bg-blue-500/10
                border border-blue-500/20
                flex
                items-center
                justify-center
                text-2xl
              ">
                🤖
              </div>

              <div>

                <h1 className="
                  text-3xl
                  xl:text-4xl
                  font-bold
                  text-white
                ">
                  AI Insights
                </h1>

                <p className="
                  text-slate-400
                  mt-1
                ">
                  Dynamic intelligence generated from your uploaded data
                </p>

              </div>

            </div>

          </div>


          <div className="
            flex
            flex-wrap
            gap-3
          ">

            <StatusChip
              label={status}
              type={statusType}
            />

            <StatusChip
              label={`${dataQuality.toFixed(
                1
              )}% Data Quality`}
              type={
                dataQuality >= 90
                  ? "positive"
                  : "warning"
              }
            />

            <StatusChip
              label={`📁 ${
                data?.filename ||
                "Uploaded Dataset"
              }`}
              type="neutral"
            />

          </div>

        </div>


        {/* ==================================================
            TOP OVERVIEW
        =================================================== */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-4
          gap-4
          mb-6
        ">

          <OverviewCard
            icon="📋"
            title="Records"
            value={formatNumber(
              totalRecords
            )}
            subtitle="Uploaded rows"
          />

          <OverviewCard
            icon="🔢"
            title="Numeric Fields"
            value={formatNumber(
              numericColumns.length
            )}
            subtitle="Detected automatically"
          />

          <OverviewCard
            icon="🏷️"
            title="Categories"
            value={formatNumber(
              categoricalColumns.length
            )}
            subtitle="Categorical columns"
          />

          <OverviewCard
            icon="📅"
            title="Date Fields"
            value={formatNumber(
              dateColumns.length
            )}
            subtitle="Time-analysis fields"
          />

        </div>


        {/* ==================================================
            EXECUTIVE SUMMARY
        =================================================== */}

        <section className="mb-6">

          <div className="
            bg-gradient-to-r
            from-slate-900
            via-slate-900
            to-blue-950/30
            border
            border-blue-500/20
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-4
            ">

              <div className="
                w-10
                h-10
                rounded-xl
                bg-blue-500/10
                flex
                items-center
                justify-center
              ">
                🧠
              </div>

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-white
                ">
                  Executive AI Summary
                </h2>

                <p className="
                  text-slate-500
                  text-sm
                ">
                  Automatic interpretation of the uploaded file
                </p>

              </div>

            </div>


            <div className="
              grid
              grid-cols-1
              xl:grid-cols-3
              gap-5
            ">

              <div className="xl:col-span-2">

                <p className="
                  text-slate-300
                  leading-7
                ">

                  This dataset contains{" "}

                  <span className="
                    text-blue-400
                    font-semibold
                  ">
                    {formatNumber(
                      totalRecords
                    )}
                  </span>{" "}

                  records and{" "}

                  <span className="
                    text-purple-400
                    font-semibold
                  ">
                    {formatNumber(
                      totalColumns
                    )}
                  </span>{" "}

                  columns.

                  The system detected{" "}

                  <span className="
                    text-blue-400
                    font-semibold
                  ">
                    {numericColumns.length}
                  </span>{" "}
                  numeric,{" "}

                  <span className="
                    text-purple-400
                    font-semibold
                  ">
                    {categoricalColumns.length}
                  </span>{" "}
                  categorical,{" "}

                  <span className="
                    text-green-400
                    font-semibold
                  ">
                    {dateColumns.length}
                  </span>{" "}
                  date and{" "}

                  <span className="
                    text-orange-400
                    font-semibold
                  ">
                    {textColumns.length}
                  </span>{" "}
                  text fields.

                </p>


                {largestTotal && (

                  <p className="
                    text-slate-300
                    mt-3
                    leading-7
                  ">

                    The largest total numeric measure is{" "}

                    <strong className="text-white">
                      {titleCase(
                        largestTotal.column
                      )}
                    </strong>{" "}
                    with a total of{" "}

                    <strong className="
                      text-blue-400
                    ">
                      {formatNumber(
                        largestTotal.sum
                      )}
                    </strong>.

                  </p>
                )}

              </div>


              <div className="
                bg-slate-800/50
                rounded-xl
                p-5
                border border-slate-700/50
              ">

                <p className="
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wide
                ">
                  Data Quality
                </p>

                <div className="
                  flex
                  items-end
                  justify-between
                  mt-2
                ">

                  <p className="
                    text-3xl
                    font-bold
                    text-white
                  ">
                    {dataQuality.toFixed(
                      1
                    )}%
                  </p>

                  <span className="
                    text-slate-500
                    text-xs
                  ">
                    completeness
                  </span>

                </div>

                <div className="
                  h-2
                  bg-slate-700
                  rounded-full
                  mt-4
                  overflow-hidden
                ">

                  <div
                    className={
                      dataQuality >= 90
                        ? "h-full bg-green-500 rounded-full"
                        : dataQuality >= 70
                        ? "h-full bg-yellow-500 rounded-full"
                        : "h-full bg-red-500 rounded-full"
                    }
                    style={{
                      width: `${Math.min(
                        100,
                        dataQuality
                      )}%`,
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================================
            IMPORTANT SIGNALS
        =================================================== */}

        <section className="mb-6">

          <SectionTitle
            icon="⚡"
            title="Important Signals"
            subtitle="The most useful automatic findings"
          />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          ">

            <SignalCard
              icon="🔝"
              title="Highest Value"
              value={
                highestNumeric
                  ? formatNumber(
                      highestNumeric.maximum
                    )
                  : "N/A"
              }
              subtitle={
                highestNumeric
                  ? titleCase(
                      highestNumeric.column
                    )
                  : "No numeric field"
              }
              accent="blue"
            />

            <SignalCard
              icon="📊"
              title="Highest Average"
              value={
                highestAverage
                  ? formatNumber(
                      highestAverage.average
                    )
                  : "N/A"
              }
              subtitle={
                highestAverage
                  ? titleCase(
                      highestAverage.column
                    )
                  : "No numeric field"
              }
              accent="purple"
            />

            <SignalCard
              icon="🏆"
              title="Top Category"
              value={
                strongestCategory
                  ? strongestCategoryName
                  : "N/A"
              }
              subtitle={
                strongestCategory
                  ? titleCase(
                      strongestCategory.column
                    )
                  : "No category field"
              }
              accent="yellow"
            />

            <SignalCard
              icon="📈"
              title="Trend"
              value={
                timeData.length > 1
                  ? `${
                      timeGrowth >= 0
                        ? "+"
                        : ""
                    }${timeGrowth.toFixed(
                      1
                    )}%`
                  : "N/A"
              }
              subtitle={
                timeData.length > 1
                  ? timeSeries?.metric ||
                    "Time metric"
                  : "No usable date trend"
              }
              accent={
                timeGrowth >= 0
                  ? "green"
                  : "red"
              }
            />

          </div>

        </section>


        {/* ==================================================
            KPI + BEST/WORST
        =================================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-4
          gap-6
          mb-6
        ">

          <div className="
            xl:col-span-3
          ">

            {kpis.length > 0 && (

              <section>

                <SectionTitle
                  icon="⚡"
                  title="Dynamic KPIs"
                  subtitle="Every KPI generated from the detected dataset"
                />

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">

                  {kpis.map(
                    (
                      kpi: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          bg-slate-900
                          border
                          border-slate-800
                          rounded-xl
                          p-4
                        "
                      >

                        <div className="
                          flex
                          justify-between
                        ">

                          <p className="
                            text-slate-400
                            text-sm
                          ">
                            {kpi?.name ||
                              "Metric"}
                          </p>

                          <span className="
                            text-blue-400
                          ">
                            ⚡
                          </span>

                        </div>

                        <p className="
                          text-2xl
                          font-bold
                          text-white
                          mt-3
                        ">
                          {formatNumber(
                            kpi?.value
                          )}
                        </p>

                        {kpi?.column && (

                          <p className="
                            text-slate-500
                            text-xs
                            mt-1
                          ">
                            {titleCase(
                              kpi.column
                            )}
                          </p>

                        )}

                      </div>

                    )
                  )}

                </div>

              </section>
            )}

          </div>


          {/* QUICK HEALTH */}

          <div>

            <SectionTitle
              icon="❤️"
              title="Health"
              subtitle="Dataset health"
            />

            <div className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
            ">

              <HealthItem
                label="Completeness"
                value={`${dataQuality.toFixed(
                  1
                )}%`}
                positive={dataQuality >= 90}
              />

              <HealthItem
                label="Numeric fields"
                value={String(
                  numericColumns.length
                )}
                positive={
                  numericColumns.length > 0
                }
              />

              <HealthItem
                label="Categories"
                value={String(
                  categoricalColumns.length
                )}
                positive={
                  categoricalColumns.length > 0
                }
              />

              <HealthItem
                label="Dates"
                value={String(
                  dateColumns.length
                )}
                positive={
                  dateColumns.length > 0
                }
                last
              />

            </div>

          </div>

        </div>


        {/* ==================================================
            NUMERIC + CATEGORY
        =================================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-6
        ">

          {/* NUMERIC */}

          {numericAnalysis.length > 0 && (

            <section>

              <SectionTitle
                icon="🔢"
                title="Numeric Intelligence"
                subtitle="Automatic statistics for detected numeric columns"
              />

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              ">

                {numericAnalysis
                  .slice(0, 8)
                  .map(
                    (
                      item: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="
                          bg-slate-900
                          border
                          border-slate-800
                          rounded-xl
                          p-4
                        "
                      >

                        <h3 className="
                          text-white
                          font-semibold
                        ">
                          {titleCase(
                            item?.column
                          )}
                        </h3>

                        <div className="
                          grid
                          grid-cols-2
                          gap-3
                          mt-4
                        ">

                          <MiniStat
                            label="Total"
                            value={formatNumber(
                              item?.sum
                            )}
                          />

                          <MiniStat
                            label="Average"
                            value={formatNumber(
                              item?.average
                            )}
                          />

                          <MiniStat
                            label="Minimum"
                            value={formatNumber(
                              item?.minimum
                            )}
                          />

                          <MiniStat
                            label="Maximum"
                            value={formatNumber(
                              item?.maximum
                            )}
                          />

                        </div>

                      </div>

                    )
                  )}

              </div>

            </section>
          )}


          {/* CATEGORY */}

          {categoryAnalysis.length > 0 && (

            <section>

              <SectionTitle
                icon="🏷️"
                title="Category Intelligence"
                subtitle="Top values in categorical fields"
              />

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              ">

                {categoryAnalysis
                  .slice(0, 6)
                  .map(
                    (
                      item: any,
                      index: number
                    ) => {

                      const top =
                        safeArray(
                          item?.topValues
                        )[0];

                      return (

                        <div
                          key={index}
                          className="
                            bg-slate-900
                            border
                            border-slate-800
                            rounded-xl
                            p-4
                          "
                        >

                          <div className="
                            flex
                            justify-between
                          ">

                            <h3 className="
                              text-white
                              font-semibold
                            ">
                              {titleCase(
                                item?.column
                              )}
                            </h3>

                            <span>
                              🏷️
                            </span>

                          </div>

                          <p className="
                            text-slate-500
                            text-xs
                            mt-2
                          ">
                            {formatNumber(
                              item?.uniqueValues
                            )} unique values
                          </p>

                          {top && (

                            <div className="
                              mt-4
                              bg-slate-800/50
                              rounded-lg
                              p-3
                            ">

                              <p className="
                                text-slate-500
                                text-xs
                              ">
                                Most common
                              </p>

                              <p className="
                                text-white
                                font-semibold
                                mt-1
                              ">
                                {top.name}
                              </p>

                              <p className="
                                text-purple-400
                                text-sm
                                mt-1
                              ">
                                {formatNumber(
                                  top.value
                                )} records
                              </p>

                            </div>

                          )}

                        </div>

                      );
                    }
                  )}

              </div>

            </section>
          )}

        </div>


        {/* ==================================================
            TIME + GROUPED
        =================================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-6
        ">

          {/* TIME */}

          <section>

            <SectionTitle
              icon="📅"
              title="Time Intelligence"
              subtitle="Shown automatically when time data exists"
            />

            <div className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
            ">

              {timeData.length > 1 ? (

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                ">

                  <InsightCard
                    icon="🏆"
                    title="Best"
                    value={
                      bestPeriod?.month ||
                      "N/A"
                    }
                    subtitle={
                      formatNumber(
                        bestPeriod?.value
                      )
                    }
                  />

                  <InsightCard
                    icon="⚠️"
                    title="Lowest"
                    value={
                      worstPeriod?.month ||
                      "N/A"
                    }
                    subtitle={
                      formatNumber(
                        worstPeriod?.value
                      )
                    }
                  />

                  <InsightCard
                    icon="📈"
                    title="Movement"
                    value={`${
                      timeGrowth >= 0
                        ? "+"
                        : ""
                    }${timeGrowth.toFixed(
                      1
                    )}%`}
                    subtitle={
                      timeSeries?.metric ||
                      "Metric"
                    }
                  />

                </div>

              ) : (

                <div className="
                  py-8
                  text-center
                ">

                  <div className="text-4xl">
                    📅
                  </div>

                  <p className="
                    text-white
                    font-semibold
                    mt-3
                  ">
                    No usable time series
                  </p>

                  <p className="
                    text-slate-500
                    text-sm
                    mt-1
                  ">
                    This dataset is being analyzed using
                    numeric and categorical information.
                  </p>

                </div>

              )}

            </div>

          </section>


          {/* GROUPED */}

          <section>

            <SectionTitle
              icon="🔗"
              title="Grouped Intelligence"
              subtitle="Category and numeric relationships"
            />

            <div className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              p-5
            ">

              {groupedAnalysis.length > 0 ? (

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-3
                ">

                  {groupedAnalysis
                    .slice(0, 6)
                    .map(
                      (
                        group: any,
                        index: number
                      ) => {

                        const top =
                          safeArray(
                            group?.data
                          )[0];

                        return (

                          <div
                            key={index}
                            className="
                              bg-slate-800/50
                              rounded-lg
                              p-3
                            "
                          >

                            <p className="
                              text-blue-400
                              text-xs
                            ">
                              {titleCase(
                                group?.category
                              )}
                            </p>

                            <p className="
                              text-white
                              text-sm
                              font-semibold
                              mt-1
                            ">
                              {titleCase(
                                group?.metric
                              )}
                            </p>

                            {top && (

                              <p className="
                                text-green-400
                                text-xs
                                mt-2
                              ">
                                {top.name}:{" "}
                                {formatNumber(
                                  top.value
                                )}
                              </p>

                            )}

                          </div>

                        );
                      }
                    )}

                </div>

              ) : (

                <div className="
                  py-8
                  text-center
                  text-slate-500
                ">
                  No grouped relationships detected.
                </div>

              )}

            </div>

          </section>

        </div>


        {/* ==================================================
            AUTOMATIC FINDINGS
        =================================================== */}

        <section className="mb-6">

          <SectionTitle
            icon="🎯"
            title="Automatic Findings"
            subtitle="Most useful individual values detected"
          />

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          ">

            <InsightCard
              icon="🔝"
              title="Highest Value"
              value={
                highestNumeric
                  ? formatNumber(
                      highestNumeric.maximum
                    )
                  : "N/A"
              }
              subtitle={
                highestNumeric
                  ? titleCase(
                      highestNumeric.column
                    )
                  : "No numeric field"
              }
            />

            <InsightCard
              icon="📉"
              title="Lowest Value"
              value={
                lowestNumeric
                  ? formatNumber(
                      lowestNumeric.minimum
                    )
                  : "N/A"
              }
              subtitle={
                lowestNumeric
                  ? titleCase(
                      lowestNumeric.column
                    )
                  : "No numeric field"
              }
            />

            <InsightCard
              icon="Σ"
              title="Largest Total"
              value={
                largestTotal
                  ? formatNumber(
                      largestTotal.sum
                    )
                  : "N/A"
              }
              subtitle={
                largestTotal
                  ? titleCase(
                      largestTotal.column
                    )
                  : "No numeric field"
              }
            />

          </div>

        </section>


        {/* ==================================================
            RECOMMENDATIONS
        =================================================== */}

        <section className="mb-6">

          <SectionTitle
            icon="💡"
            title="AI Recommendations"
            subtitle="Suggested actions from the detected patterns"
          />

          <div className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-4
          ">

            {recommendations.map(
              (
                item,
                index
              ) => (

                <Recommendation
                  key={index}
                  index={index + 1}
                  type={item.type}
                  title={item.title}
                  text={item.text}
                />

              )
            )}

          </div>

        </section>


        {/* ==================================================
            BACKEND FINDINGS
        =================================================== */}

        {backendInsights.length > 0 && (

          <section className="mb-6">

            <SectionTitle
              icon="🧠"
              title="Analytics Engine Findings"
              subtitle="Additional findings returned by the backend"
            />

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-3
            ">

              {backendInsights
                .slice(0, 10)
                .map(
                  (
                    insight: any,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="
                        bg-slate-900
                        border border-slate-800
                        rounded-xl
                        p-4
                      "
                    >

                      <div className="
                        flex
                        items-start
                        gap-3
                      ">

                        <span>
                          🤖
                        </span>

                        <p className="
                          text-slate-300
                          text-sm
                        ">
                          {String(
                            insight
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

            </div>

          </section>
        )}


        {/* ==================================================
            DETECTED COLUMNS
        =================================================== */}

        <section className="mb-6">

          <SectionTitle
            icon="🧩"
            title="Detected Columns"
            subtitle="Complete structure detected from the uploaded file"
          />

          <div className="
            bg-slate-900
            border border-slate-800
            rounded-xl
            p-5
          ">

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-5
              xl:grid-cols-6
              gap-3
            ">

              {columns.map(
                (
                  column: string,
                  index: number
                ) => {

                  let type =
                    "text";

                  if (
                    numericColumns.includes(
                      column
                    )
                  ) {
                    type =
                      "numeric";
                  } else if (
                    categoricalColumns.includes(
                      column
                    )
                  ) {
                    type =
                      "category";
                  } else if (
                    dateColumns.includes(
                      column
                    )
                  ) {
                    type =
                      "date";
                  } else if (
                    idColumns.includes(
                      column
                    )
                  ) {
                    type =
                      "id";
                  }

                  return (

                    <div
                      key={index}
                      className="
                        bg-slate-800
                        border border-slate-700
                        rounded-lg
                        p-3
                      "
                    >

                      <p className="
                        text-white
                        text-sm
                        font-medium
                        truncate
                      ">
                        {titleCase(
                          column
                        )}
                      </p>

                      <p className="
                        text-slate-500
                        text-xs
                        mt-1
                      ">
                        {type}
                      </p>

                    </div>

                  );
                }
              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            FOOTER
        =================================================== */}

        <div className="
          bg-blue-500/5
          border border-blue-500/20
          rounded-xl
          p-5
        ">

          <div className="
            flex
            items-start
            gap-3
          ">

            <div className="text-2xl">
              🤖
            </div>

            <div>

              <h3 className="
                text-white
                font-semibold
              ">
                Dynamic AI Analytics Engine
              </h3>

              <p className="
                text-slate-400
                text-sm
                mt-1
              ">
                This page automatically adapts to the
                detected columns and data types. It does
                not require fixed Revenue, Profit, Product,
                Customer or Region columns.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// COMPONENTS
// ============================================================

function StatusChip({
  label,
  type,
}: {
  label: string;
  type:
    | "positive"
    | "warning"
    | "neutral";
}) {

  const classes =
    type === "positive"
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : type === "warning"
      ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
      : "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <span className={`
      px-3
      py-1.5
      rounded-lg
      border
      text-xs
      font-medium
      ${classes}
    `}>
      {label}
    </span>
  );
}


function OverviewCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}) {

  return (
    <div className="
      bg-slate-900
      border border-slate-800
      rounded-xl
      p-5
    ">

      <div className="
        flex
        items-center
        justify-between
      ">

        <p className="
          text-slate-400
          text-sm
        ">
          {title}
        </p>

        <span>
          {icon}
        </span>

      </div>

      <p className="
        text-2xl
        font-bold
        text-white
        mt-4
      ">
        {value}
      </p>

      <p className="
        text-slate-500
        text-xs
        mt-1
      ">
        {subtitle}
      </p>

    </div>
  );
}


function SignalCard({
  icon,
  title,
  value,
  subtitle,
  accent,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
  accent:
    | "blue"
    | "purple"
    | "yellow"
    | "green"
    | "red";
}) {

  const iconClass =
    accent === "purple"
      ? "bg-purple-500/10"
      : accent === "yellow"
      ? "bg-yellow-500/10"
      : accent === "green"
      ? "bg-green-500/10"
      : accent === "red"
      ? "bg-red-500/10"
      : "bg-blue-500/10";

  return (
    <div className="
      bg-slate-900
      border border-slate-800
      rounded-xl
      p-5
      hover:border-slate-700
      transition
    ">

      <div className="
        flex
        justify-between
        items-center
      ">

        <p className="
          text-slate-400
          text-sm
        ">
          {title}
        </p>

        <div className={`
          w-9
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          ${iconClass}
        `}>
          {icon}
        </div>

      </div>

      <p className="
        text-2xl
        font-bold
        text-white
        mt-4
      ">
        {value}
      </p>

      <p className="
        text-slate-500
        text-xs
        mt-1
        truncate
      ">
        {subtitle}
      </p>

    </div>
  );
}


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
    <div className="mb-4">

      <div className="
        flex
        items-center
        gap-2
      ">

        <span className="text-lg">
          {icon}
        </span>

        <h2 className="
          text-lg
          lg:text-xl
          font-bold
          text-white
        ">
          {title}
        </h2>

      </div>

      <p className="
        text-slate-500
        text-xs
        mt-1
      ">
        {subtitle}
      </p>

    </div>
  );
}


function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (
    <div>

      <p className="
        text-slate-500
        text-xs
      ">
        {label}
      </p>

      <p className="
        text-white
        font-semibold
        text-sm
        mt-1
      ">
        {value}
      </p>

    </div>
  );
}


function InsightCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}) {

  return (
    <div className="
      bg-slate-800/50
      border border-slate-700/50
      rounded-xl
      p-4
    ">

      <div className="
        flex
        items-center
        justify-between
      ">

        <p className="
          text-slate-400
          text-xs
        ">
          {title}
        </p>

        <span>
          {icon}
        </span>

      </div>

      <p className="
        text-white
        text-xl
        font-bold
        mt-3
      ">
        {value}
      </p>

      <p className="
        text-slate-500
        text-xs
        mt-1
      ">
        {subtitle}
      </p>

    </div>
  );
}


function HealthItem({
  label,
  value,
  positive,
  last,
}: {
  label: string;
  value: string;
  positive: boolean;
  last?: boolean;
}) {

  return (
    <div className={`
      flex
      items-center
      justify-between
      py-3
      ${!last ? "border-b border-slate-800" : ""}
    `}>

      <span className="
        text-slate-400
        text-sm
      ">
        {label}
      </span>

      <span className={`
        text-sm
        font-semibold
        ${
          positive
            ? "text-green-400"
            : "text-slate-400"
        }
      `}>
        {value}
      </span>

    </div>
  );
}


function Recommendation({
  index,
  type,
  title,
  text,
}: {
  index: number;
  type:
    | "positive"
    | "warning"
    | "opportunity";
  title: string;
  text: string;
}) {

  const classes =
    type === "positive"
      ? "bg-green-500/5 border-green-500/20"
      : type === "warning"
      ? "bg-orange-500/5 border-orange-500/20"
      : "bg-purple-500/5 border-purple-500/20";

  const badge =
    type === "positive"
      ? "bg-green-500/10 text-green-400"
      : type === "warning"
      ? "bg-orange-500/10 text-orange-400"
      : "bg-purple-500/10 text-purple-400";

  return (
    <div className={`
      ${classes}
      border
      rounded-xl
      p-4
    `}>

      <div className="
        flex
        items-start
        gap-3
      ">

        <div className={`
          w-8
          h-8
          rounded-lg
          flex
          items-center
          justify-center
          font-bold
          text-sm
          flex-shrink-0
          ${badge}
        `}>
          {index}
        </div>

        <div>

          <p className="
            text-white
            font-semibold
          ">
            {title}
          </p>

          <p className="
            text-slate-400
            text-sm
            mt-1
            leading-6
          ">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}