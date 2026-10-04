import { ReactNode } from "react";
import {
  BarChart3,
  TrendingUp,
  Database,
  Hash,
  Layers,
  CalendarDays,
  Table2,
  Brain,
  FileSpreadsheet,
  Activity,
  Target,
  Users,
  MapPin,
  Package,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface ReportTemplateProps {
  dashboardData: any;
  reportType?: string;
}

interface RowData {
  [key: string]: any;
}

/* =========================================================
   HELPERS
========================================================= */

const asArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;

  if (value && typeof value === "object") {
    return Object.entries(value).map(([key, val]) => ({
      name: key,
      value: val,
    }));
  }

  return [];
};

const isNumber = (value: any): boolean => {
  return (
    value !== null &&
    value !== undefined &&
    value !== "" &&
    Number.isFinite(Number(value))
  );
};

const toNumber = (value: any, fallback = 0): number => {
  if (isNumber(value)) return Number(value);
  return fallback;
};

const formatNumber = (value: any): string => {
  const num = toNumber(value);

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(num);
};

const formatCurrency = (value: any): string => {
  const num = toNumber(value);

  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(num)}`;
};

const cleanLabel = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getObjectValue = (
  obj: any,
  keys: string[],
  fallback: any = undefined
): any => {
  if (!obj || typeof obj !== "object") return fallback;

  for (const key of keys) {
    if (
      obj[key] !== undefined &&
      obj[key] !== null &&
      obj[key] !== ""
    ) {
      return obj[key];
    }
  }

  return fallback;
};

const getColumnName = (item: any): string => {
  return getObjectValue(
    item,
    [
      "column",
      "columnName",
      "field",
      "fieldName",
      "name",
      "dimension",
      "category",
      "groupBy",
    ],
    "Unknown"
  );
};

const getMetricValue = (item: any): number => {
  return toNumber(
    getObjectValue(
      item,
      [
        "sum",
        "total",
        "value",
        "metric",
        "amount",
        "revenue",
        "sales",
        "profit",
        "count",
        "records",
      ],
      0
    )
  );
};

const getAverageValue = (item: any): number => {
  return toNumber(
    getObjectValue(
      item,
      ["average", "avg", "mean", "averageValue"],
      0
    )
  );
};

const getMinValue = (item: any): number => {
  return toNumber(
    getObjectValue(
      item,
      ["min", "minimum", "minValue"],
      0
    )
  );
};

const getMaxValue = (item: any): number => {
  return toNumber(
    getObjectValue(
      item,
      ["max", "maximum", "maxValue"],
      0
    )
  );
};

const isCurrencyMetric = (metricName: string): boolean => {
  const name = metricName.toLowerCase();

  return [
    "revenue",
    "sales",
    "profit",
    "amount",
    "price",
    "cost",
    "income",
    "value",
    "turnover",
    "margin",
  ].some((keyword) => name.includes(keyword));
};

const formatMetric = (
  value: any,
  metricName: string
): string => {
  return isCurrencyMetric(metricName)
    ? formatCurrency(value)
    : formatNumber(value);
};

const getPrimaryMetric = (dashboardData: any): string => {
  return (
    dashboardData?.summary?.primaryMetric ||
    dashboardData?.primaryMetric ||
    dashboardData?.detectedColumns?.numeric?.[0] ||
    dashboardData?.columnInformation?.numeric?.[0] ||
    ""
  );
};

const getProfitMetric = (dashboardData: any): string => {
  return (
    dashboardData?.summary?.profitMetric ||
    dashboardData?.profitMetric ||
    ""
  );
};

const getNumericColumns = (dashboardData: any): string[] => {
  const detected = dashboardData?.detectedColumns;

  if (Array.isArray(detected?.numeric)) {
    return detected.numeric;
  }

  if (Array.isArray(dashboardData?.numericColumns)) {
    return dashboardData.numericColumns;
  }

  return [];
};

const getCategoryColumns = (dashboardData: any): string[] => {
  const detected = dashboardData?.detectedColumns;

  if (Array.isArray(detected?.categorical)) {
    return detected.categorical;
  }

  if (Array.isArray(dashboardData?.categoricalColumns)) {
    return dashboardData.categoricalColumns;
  }

  return [];
};

const getDateColumns = (dashboardData: any): string[] => {
  const detected = dashboardData?.detectedColumns;

  if (Array.isArray(detected?.date)) {
    return detected.date;
  }

  if (Array.isArray(detected?.dates)) {
    return detected.dates;
  }

  if (Array.isArray(dashboardData?.dateColumns)) {
    return dashboardData.dateColumns;
  }

  return [];
};

/* =========================================================
   SECTION COMPONENTS
========================================================= */

const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <Icon size={18} />
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            {title}
          </h2>
        </div>

        {subtitle && (
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({
  title = "No data available",
  message = "There is not enough information in the uploaded dataset for this section.",
}: {
  title?: string;
  message?: string;
}) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <AlertCircle className="mx-auto mb-2 text-slate-400" size={25} />

      <p className="font-semibold text-slate-600">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {message}
      </p>
    </div>
  );
};

const DynamicKPI = ({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: any;
  description?: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-slate-800">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-[11px] text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   GENERIC ROW NORMALIZERS
========================================================= */

const normalizeNumericAnalysis = (
  analysis: any,
  numericColumns: string[]
): RowData[] => {
  const result: RowData[] = [];

  if (Array.isArray(analysis)) {
    analysis.forEach((item) => {
      result.push({
        column: getColumnName(item),
        total: getMetricValue(item),
        average: getAverageValue(item),
        min: getMinValue(item),
        max: getMaxValue(item),
      });
    });
  } else if (analysis && typeof analysis === "object") {
    Object.entries(analysis).forEach(([column, value]: any) => {
      if (value && typeof value === "object") {
        result.push({
          column,
          total: getMetricValue(value),
          average: getAverageValue(value),
          min: getMinValue(value),
          max: getMaxValue(value),
        });
      } else if (isNumber(value)) {
        result.push({
          column,
          total: Number(value),
          average: 0,
          min: 0,
          max: 0,
        });
      }
    });
  }

  if (result.length === 0 && numericColumns.length > 0) {
    numericColumns.forEach((column) => {
      result.push({
        column,
        total: 0,
        average: 0,
        min: 0,
        max: 0,
      });
    });
  }

  return result;
};

const normalizeCategoryAnalysis = (
  analysis: any
): RowData[] => {
  const result: RowData[] = [];

  const source = asArray(analysis);

  source.forEach((item: any) => {
    const column = getColumnName(item);

    const values =
      item?.values ||
      item?.topValues ||
      item?.categories ||
      item?.data ||
      item?.groups;

    if (Array.isArray(values)) {
      values.forEach((value: any) => {
        result.push({
          column,
          category: getObjectValue(
            value,
            [
              "category",
              "name",
              "label",
              "value",
              "group",
            ],
            "Unknown"
          ),
          count: getObjectValue(
            value,
            ["count", "records", "frequency"],
            ""
          ),
          metric: getMetricValue(value),
        });
      });

      return;
    }

    const category =
      getObjectValue(
        item,
        ["category", "label", "value", "name"],
        null
      );

    if (category !== null) {
      result.push({
        column,
        category,
        count: getObjectValue(
          item,
          ["count", "records", "frequency"],
          ""
        ),
        metric: getMetricValue(item),
      });
    }
  });

  return result;
};

const normalizeSeries = (
  data: any
): RowData[] => {
  const result: RowData[] = [];

  asArray(data).forEach((item: any) => {
    const label = getObjectValue(
      item,
      [
        "month",
        "period",
        "date",
        "label",
        "name",
        "year",
        "time",
      ],
      null
    );

    const value = getObjectValue(
      item,
      [
        "revenue",
        "sales",
        "value",
        "amount",
        "profit",
        "total",
        "metric",
        "forecast",
        "predicted",
      ],
      null
    );

    if (label !== null || value !== null) {
      result.push({
        label: label ?? "Unknown",
        value: toNumber(value),
      });
    }
  });

  return result;
};

const normalizeGenericGroups = (
  groupedAnalysis: any
): RowData[] => {
  const result: RowData[] = [];

  const source = asArray(groupedAnalysis);

  source.forEach((item: any) => {
    const dimension = getColumnName(item);

    const nested =
      item?.groups ||
      item?.data ||
      item?.rows ||
      item?.results ||
      item?.values;

    if (Array.isArray(nested)) {
      nested.forEach((row: any) => {
        result.push({
          dimension,
          group: getObjectValue(
            row,
            [
              "group",
              "category",
              "name",
              "label",
              "value",
            ],
            "Unknown"
          ),
          metric: getMetricValue(row),
          count: getObjectValue(
            row,
            ["count", "records", "frequency"],
            ""
          ),
        });
      });

      return;
    }

    const group = getObjectValue(
      item,
      [
        "group",
        "category",
        "name",
        "label",
        "value",
      ],
      null
    );

    if (group !== null) {
      result.push({
        dimension,
        group,
        metric: getMetricValue(item),
        count: getObjectValue(
          item,
          ["count", "records", "frequency"],
          ""
        ),
      });
    }
  });

  return result;
};

const normalizeTopRows = (
  data: any
): RowData[] => {
  return asArray(data).map((item: any) => ({
    name: getObjectValue(
      item,
      [
        "name",
        "product",
        "customer",
        "region",
        "category",
        "label",
      ],
      "Unknown"
    ),
    value: getMetricValue(item),
    count: getObjectValue(
      item,
      ["count", "orders", "quantity"],
      ""
    ),
  }));
};

/* =========================================================
   MAIN REPORT
========================================================= */

export default function ReportTemplate({
  dashboardData,
  reportType = "complete",
}: ReportTemplateProps) {
  if (!dashboardData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Database
          size={42}
          className="mx-auto mb-3 text-slate-400"
        />

        <h2 className="text-lg font-bold text-slate-700">
          No Report Data Available
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Upload a CSV or Excel dataset first to generate
          the dynamic report.
        </p>
      </div>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const summary = dashboardData?.summary || {};

  const primaryMetric = getPrimaryMetric(
    dashboardData
  );

  const profitMetric = getProfitMetric(
    dashboardData
  );

  const numericColumns =
    getNumericColumns(dashboardData);

  const categoryColumns =
    getCategoryColumns(dashboardData);

  const dateColumns =
    getDateColumns(dashboardData);

  const kpis = asArray(
    dashboardData?.kpis
  );

  const numericAnalysis =
    normalizeNumericAnalysis(
      dashboardData?.numericAnalysis,
      numericColumns
    );

  const categoryAnalysis =
    normalizeCategoryAnalysis(
      dashboardData?.categoryAnalysis
    );

  const groupedAnalysis =
    normalizeGenericGroups(
      dashboardData?.groupedAnalysis
    );

  const monthlyData =
    normalizeSeries(
      dashboardData?.monthlyRevenue
    );

  const dateAnalysisData =
    normalizeSeries(
      dashboardData?.dateAnalysis
    );

  const timeSeries =
    monthlyData.length > 0
      ? monthlyData
      : dateAnalysisData;

  const forecastData =
    normalizeSeries(
      dashboardData?.forecast
    );

  const topProducts =
    normalizeTopRows(
      dashboardData?.topProducts
    );

  const topCustomers =
    normalizeTopRows(
      dashboardData?.topCustomers
    );

  const regionalSales =
    normalizeTopRows(
      dashboardData?.regionalSales
    );

  const categoryRevenue =
    normalizeTopRows(
      dashboardData?.categoryRevenue
    );

  /* =======================================================
     KPI CALCULATIONS
  ======================================================= */

  const findKPI = (
    searchTerms: string[]
  ): number | null => {
    for (const kpi of kpis) {
      const label = String(
        getObjectValue(
          kpi,
          ["name", "title", "label", "metric"],
          ""
        )
      ).toLowerCase();

      if (
        searchTerms.some((term) =>
          label.includes(term.toLowerCase())
        )
      ) {
        const value = getObjectValue(
          kpi,
          ["value", "total", "amount", "metric"],
          null
        );

        if (value !== null) {
          return toNumber(value);
        }
      }
    }

    return null;
  };

  const primaryNumericRow =
    numericAnalysis.find(
      (row) =>
        String(row.column).toLowerCase() ===
        String(primaryMetric).toLowerCase()
    );

  const profitNumericRow =
    profitMetric
      ? numericAnalysis.find(
          (row) =>
            String(row.column).toLowerCase() ===
            String(profitMetric).toLowerCase()
        )
      : undefined;

  const totalPrimaryMetric =
    primaryNumericRow?.total ??
    summary?.revenue ??
    findKPI([
      primaryMetric,
      "revenue",
      "sales",
      "total",
    ]) ??
    0;

  const averagePrimaryMetric =
    primaryNumericRow?.average ??
    findKPI([
      `average ${primaryMetric}`,
      "average",
      "avg",
    ]) ??
    0;

  const totalProfit =
    profitNumericRow?.total ??
    summary?.profit ??
    findKPI([
      profitMetric,
      "profit",
      "net profit",
    ]) ??
    0;

  const totalRecords =
    toNumber(
      summary?.totalRecords,
      0
    ) ||
    toNumber(
      dashboardData?.rows,
      0
    ) ||
    findKPI([
      "total records",
      "records",
      "total rows",
    ]) ||
    0;

  const orders =
    toNumber(summary?.orders, 0) ||
    findKPI(["orders", "order"]);

  const customers =
    toNumber(summary?.customers, 0) ||
    findKPI([
      "customers",
      "customer",
      "unique",
    ]);

  const averageOrder =
    toNumber(summary?.averageOrder, 0);

  /* =======================================================
     REPORT METADATA
  ======================================================= */

  const fileName =
    dashboardData?.fileName ||
    dashboardData?.filename ||
    "Uploaded Dataset";

  const preview =
    asArray(
      dashboardData?.preview
    );

  const aiInsights =
    asArray(
      dashboardData?.aiInsights
    );

  const columnInformation =
    asArray(
      dashboardData?.columnInformation
    );

  const detectedColumnCount =
    numericColumns.length +
    categoryColumns.length +
    dateColumns.length;

  const reportDate =
    new Date().toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  /* =======================================================
     SMALL GENERIC TABLE
  ======================================================= */

  const GenericTable = ({
    columns,
    rows,
  }: {
    columns: string[];
    rows: any[];
  }) => {
    if (!rows.length) {
      return <EmptyState />;
    }

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600"
                  >
                    {cleanLabel(column)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map(
                (row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-slate-100"
                  >
                    {columns.map(
                      (column) => (
                        <td
                          key={column}
                          className="whitespace-nowrap px-4 py-3 text-slate-600"
                        >
                          {row[column] ===
                          null ||
                          row[column] ===
                            undefined
                            ? "-"
                            : String(
                                row[column]
                              )}
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
    );
  };

  /* =======================================================
     REPORT
  ======================================================= */

  return (
    <div
      id="dynamic-report"
      className="w-full space-y-6 bg-slate-50 p-4 md:p-6"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                <FileSpreadsheet size={15} />

                AI Business Analytics
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                {cleanLabel(
                  reportType === "complete"
                    ? "Complete Business Analytics Report"
                    : `${cleanLabel(
                        reportType
                      )} Report`
                )}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Dynamic analysis generated from{" "}
                <span className="font-medium text-slate-700">
                  {fileName}
                </span>
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-right">
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Generated
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {reportDate}
              </p>
            </div>
          </div>
        </div>

        {/* DATASET QUICK INFO */}

        <div className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
          <div className="p-4">
            <p className="text-[11px] text-slate-400">
              Records
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {formatNumber(totalRecords)}
            </p>
          </div>

          <div className="p-4">
            <p className="text-[11px] text-slate-400">
              Numeric Fields
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {numericColumns.length}
            </p>
          </div>

          <div className="p-4">
            <p className="text-[11px] text-slate-400">
              Category Fields
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {categoryColumns.length}
            </p>
          </div>

          <div className="p-4">
            <p className="text-[11px] text-slate-400">
              Date Fields
            </p>

            <p className="mt-1 text-lg font-bold text-slate-800">
              {dateColumns.length}
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================
          KPI SUMMARY
      =================================================== */}

      <section>
        <SectionTitle
          icon={Activity}
          title="Executive KPI Summary"
          subtitle="Key metrics automatically detected from the dataset"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DynamicKPI
            title={
              primaryMetric
                ? `Total ${cleanLabel(
                    primaryMetric
                  )}`
                : "Primary Metric"
            }
            value={formatMetric(
              totalPrimaryMetric,
              primaryMetric
            )}
            icon={TrendingUp}
            description={
              primaryMetric
                ? `Based on ${cleanLabel(
                    primaryMetric
                  )}`
                : undefined
            }
          />

          <DynamicKPI
            title={
              primaryMetric
                ? `Average ${cleanLabel(
                    primaryMetric
                  )}`
                : "Average Metric"
            }
            value={formatMetric(
              averagePrimaryMetric,
              primaryMetric
            )}
            icon={BarChart3}
          />

          <DynamicKPI
            title={
              profitMetric
                ? `Total ${cleanLabel(
                    profitMetric
                  )}`
                : "Total Profit"
            }
            value={formatMetric(
              totalProfit,
              profitMetric || "profit"
            )}
            icon={Target}
            description={
              profitMetric
                ? `Detected profit field`
                : "Available when a profit field is detected"
            }
          />

          <DynamicKPI
            title="Total Records"
            value={formatNumber(
              totalRecords
            )}
            icon={Database}
            description="Rows in uploaded dataset"
          />
        </div>

        {(orders || customers || averageOrder) ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {orders ? (
              <DynamicKPI
                title="Orders"
                value={formatNumber(
                  orders
                )}
                icon={Layers}
              />
            ) : null}

            {customers ? (
              <DynamicKPI
                title="Customers"
                value={formatNumber(
                  customers
                )}
                icon={Users}
              />
            ) : null}

            {averageOrder ? (
              <DynamicKPI
                title="Average Order"
                value={formatMetric(
                  averageOrder,
                  primaryMetric
                )}
                icon={Hash}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      {/* ===================================================
          DATASET OVERVIEW
      =================================================== */}

      <section>
        <SectionTitle
          icon={Database}
          title="Dataset Overview"
          subtitle="Automatic structure and field detection"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Hash
                size={17}
                className="text-blue-600"
              />

              <h3 className="font-semibold text-slate-800">
                Numeric Fields
              </h3>
            </div>

            {numericColumns.length ? (
              <div className="flex flex-wrap gap-2">
                {numericColumns.map(
                  (column) => (
                    <span
                      key={column}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {cleanLabel(column)}
                    </span>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title="No numeric fields"
                message="No numeric columns were detected."
              />
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers
                size={17}
                className="text-purple-600"
              />

              <h3 className="font-semibold text-slate-800">
                Category Fields
              </h3>
            </div>

            {categoryColumns.length ? (
              <div className="flex flex-wrap gap-2">
                {categoryColumns.map(
                  (column) => (
                    <span
                      key={column}
                      className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                    >
                      {cleanLabel(column)}
                    </span>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title="No category fields"
                message="No categorical columns were detected."
              />
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarDays
                size={17}
                className="text-green-600"
              />

              <h3 className="font-semibold text-slate-800">
                Date Fields
              </h3>
            </div>

            {dateColumns.length ? (
              <div className="flex flex-wrap gap-2">
                {dateColumns.map(
                  (column) => (
                    <span
                      key={column}
                      className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                    >
                      {cleanLabel(column)}
                    </span>
                  )
                )}
              </div>
            ) : (
              <EmptyState
                title="No date fields"
                message="Time-based analysis may not be available."
              />
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          NUMERIC ANALYSIS
      =================================================== */}

      <section>
        <SectionTitle
          icon={Hash}
          title="Numeric Field Analysis"
          subtitle="Statistical summary of detected numeric columns"
        />

        {numericAnalysis.length ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3">
                      Field
                    </th>

                    <th className="px-5 py-3">
                      Total
                    </th>

                    <th className="px-5 py-3">
                      Average
                    </th>

                    <th className="px-5 py-3">
                      Minimum
                    </th>

                    <th className="px-5 py-3">
                      Maximum
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {numericAnalysis.map(
                    (row, index) => (
                      <tr
                        key={`${row.column}-${index}`}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-700">
                          {cleanLabel(
                            row.column
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatMetric(
                            row.total,
                            String(
                              row.column
                            )
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatMetric(
                            row.average,
                            String(
                              row.column
                            )
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatMetric(
                            row.min,
                            String(
                              row.column
                            )
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {formatMetric(
                            row.max,
                            String(
                              row.column
                            )
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* ===================================================
          TIME ANALYSIS
      =================================================== */}

      <section>
        <SectionTitle
          icon={CalendarDays}
          title="Time-Based Performance"
          subtitle={
            dateColumns.length
              ? `Analysis based on ${cleanLabel(
                  dateColumns[0]
                )}`
              : "Monthly or date-based analysis"
          }
        />

        {timeSeries.length ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {timeSeries.map(
                (item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="rounded-lg bg-slate-50 p-4"
                  >
                    <p className="text-xs text-slate-500">
                      {cleanLabel(
                        item.label
                      )}
                    </p>

                    <p className="mt-2 font-bold text-slate-800">
                      {formatMetric(
                        item.value,
                        primaryMetric
                      )}
                    </p>
                  </div>
                )
              )}
            </div>

            {timeSeries.length > 1 && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3">
                        Period
                      </th>

                      <th className="px-4 py-3">
                        Value
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {timeSeries.map(
                      (item, index) => (
                        <tr
                          key={index}
                          className="border-t border-slate-100"
                        >
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {cleanLabel(
                              item.label
                            )}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {formatMetric(
                              item.value,
                              primaryMetric
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            title="Time analysis unavailable"
            message="Upload a dataset containing a detectable date/time column or monthly analysis data."
          />
        )}
      </section>

      {/* ===================================================
          CATEGORY ANALYSIS
      =================================================== */}

      <section>
        <SectionTitle
          icon={Layers}
          title="Category Analysis"
          subtitle="Distribution and performance across categorical fields"
        />

        {categoryAnalysis.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {categoryAnalysis
              .slice(0, 12)
              .map((row, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        {cleanLabel(
                          row.column
                        )}
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {cleanLabel(
                          row.category
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      {row.metric ? (
                        <p className="font-bold text-blue-600">
                          {formatMetric(
                            row.metric,
                            primaryMetric
                          )}
                        </p>
                      ) : null}

                      {row.count !== "" &&
                      row.count !==
                        undefined ? (
                        <p className="text-[11px] text-slate-400">
                          {formatNumber(
                            row.count
                          )}{" "}
                          records
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <EmptyState
            title="Category analysis unavailable"
            message="No detailed categorical analysis was returned for this dataset."
          />
        )}
      </section>

      {/* ===================================================
          CATEGORY REVENUE / METRIC
      =================================================== */}

      {categoryRevenue.length > 0 && (
        <section>
          <SectionTitle
            icon={BarChart3}
            title={
              categoryColumns.length
                ? `${cleanLabel(
                    categoryColumns[0]
                  )} Performance`
                : "Category Performance"
            }
            subtitle="Performance grouped by category"
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3">
                      Category
                    </th>

                    <th className="px-5 py-3">
                      Metric
                    </th>

                    <th className="px-5 py-3">
                      Records
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categoryRevenue
                    .slice(0, 15)
                    .map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-medium text-slate-700">
                            {cleanLabel(
                              row.name
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-blue-600">
                            {formatMetric(
                              row.value,
                              primaryMetric
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {row.count !==
                            ""
                              ? formatNumber(
                                  row.count
                                )
                              : "-"}
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

      {/* ===================================================
          PRODUCT
      =================================================== */}

      {topProducts.length > 0 && (
        <section>
          <SectionTitle
            icon={Package}
            title="Top Products"
            subtitle="Highest performing detected products"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {topProducts
              .slice(0, 3)
              .map(
                (row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        #{index + 1}
                      </span>

                      <Package
                        size={17}
                        className="text-blue-500"
                      />
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-800">
                      {cleanLabel(
                        row.name
                      )}
                    </h3>

                    <p className="mt-2 text-lg font-bold text-blue-600">
                      {formatMetric(
                        row.value,
                        primaryMetric
                      )}
                    </p>
                  </div>
                )
              )}
          </div>
        </section>
      )}

      {/* ===================================================
          CUSTOMER
      =================================================== */}

      {topCustomers.length > 0 && (
        <section>
          <SectionTitle
            icon={Users}
            title="Top Customers"
            subtitle="Highest contributing detected customers"
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3">
                      Rank
                    </th>

                    <th className="px-5 py-3">
                      Customer
                    </th>

                    <th className="px-5 py-3">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {topCustomers
                    .slice(0, 10)
                    .map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-bold text-slate-400">
                            #{index + 1}
                          </td>

                          <td className="px-5 py-4 font-medium text-slate-700">
                            {cleanLabel(
                              row.name
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-blue-600">
                            {formatMetric(
                              row.value,
                              primaryMetric
                            )}
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

      {/* ===================================================
          REGIONAL
      =================================================== */}

      {regionalSales.length > 0 && (
        <section>
          <SectionTitle
            icon={MapPin}
            title="Regional Performance"
            subtitle="Performance across detected geographical groups"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {regionalSales
              .slice(0, 8)
              .map(
                (row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="text-blue-500"
                      />

                      <p className="font-semibold text-slate-700">
                        {cleanLabel(
                          row.name
                        )}
                      </p>
                    </div>

                    <p className="mt-3 text-lg font-bold text-blue-600">
                      {formatMetric(
                        row.value,
                        primaryMetric
                      )}
                    </p>
                  </div>
                )
              )}
          </div>
        </section>
      )}

      {/* ===================================================
          GENERIC GROUPED ANALYSIS
      =================================================== */}

      {groupedAnalysis.length > 0 && (
        <section>
          <SectionTitle
            icon={Layers}
            title="Grouped Analysis"
            subtitle="Additional dimensions discovered automatically"
          />

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3">
                      Dimension
                    </th>

                    <th className="px-5 py-3">
                      Group
                    </th>

                    <th className="px-5 py-3">
                      Metric
                    </th>

                    <th className="px-5 py-3">
                      Records
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {groupedAnalysis
                    .slice(0, 20)
                    .map(
                      (
                        row,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-slate-100"
                        >
                          <td className="px-5 py-4 font-medium text-slate-700">
                            {cleanLabel(
                              row.dimension
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {cleanLabel(
                              row.group
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-blue-600">
                            {formatMetric(
                              row.metric,
                              primaryMetric
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {row.count !==
                            ""
                              ? formatNumber(
                                  row.count
                                )
                              : "-"}
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

      {/* ===================================================
          FORECAST
      =================================================== */}

      <section>
        <SectionTitle
          icon={TrendingUp}
          title="Forecast & Future Outlook"
          subtitle="Future values generated when sufficient historical data is available"
        />

        {forecastData.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {forecastData.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-blue-100 bg-blue-50/40 p-5"
                >
                  <p className="text-xs text-slate-500">
                    {cleanLabel(
                      item.label
                    )}
                  </p>

                  <p className="mt-2 text-xl font-bold text-blue-700">
                    {formatMetric(
                      item.value,
                      primaryMetric
                    )}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
                    <TrendingUp
                      size={13}
                    />

                    Forecast value
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <EmptyState
            title="Forecast unavailable"
            message="Forecasting requires sufficient date-based historical data. Upload more time-series records to enable this section."
          />
        )}
      </section>

      {/* ===================================================
          AI INSIGHTS
      =================================================== */}

      <section>
        <SectionTitle
          icon={Brain}
          title="AI Insights"
          subtitle="Automatically generated observations from the dataset"
        />

        {aiInsights.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {aiInsights.map(
              (item: any, index) => {
                const text =
                  typeof item ===
                  "string"
                    ? item
                    : getObjectValue(
                        item,
                        [
                          "insight",
                          "text",
                          "message",
                          "description",
                          "recommendation",
                        ],
                        JSON.stringify(
                          item
                        )
                      );

                return (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mt-0.5 shrink-0 rounded-lg bg-green-50 p-2 text-green-600">
                      <CheckCircle2
                        size={17}
                      />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {String(text)}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <EmptyState
            title="AI insights unavailable"
            message="No AI insights were returned for the current dataset."
          />
        )}
      </section>

      {/* ===================================================
          COLUMN INFORMATION
      =================================================== */}

      <section>
        <SectionTitle
          icon={Table2}
          title="Column Information"
          subtitle={`${detectedColumnCount} detected analytical fields`}
        />

        {columnInformation.length > 0 ? (
          <GenericTable
            columns={[
              "name",
              "type",
              "category",
              "description",
            ]}
            rows={columnInformation}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ...numericColumns.map(
                (column) => ({
                  name: column,
                  type: "Numeric",
                  category: "Measure",
                  description:
                    "Automatically detected numeric field",
                })
              ),

              ...categoryColumns.map(
                (column) => ({
                  name: column,
                  type: "Categorical",
                  category: "Dimension",
                  description:
                    "Automatically detected categorical field",
                })
              ),

              ...dateColumns.map(
                (column) => ({
                  name: column,
                  type: "Date",
                  category: "Time",
                  description:
                    "Automatically detected date field",
                })
              ),
            ].map(
              (
                column,
                index
              ) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="font-semibold text-slate-800">
                    {cleanLabel(
                      column.name
                    )}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600">
                      {column.type}
                    </span>

                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] text-blue-600">
                      {column.category}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {column.description}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ===================================================
          DATA PREVIEW
      =================================================== */}

      <section>
        <SectionTitle
          icon={Table2}
          title="Data Preview"
          subtitle="Sample records from the uploaded dataset"
        />

        {preview.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    {Object.keys(
                      preview[0]
                    ).map(
                      (column) => (
                        <th
                          key={column}
                          className="whitespace-nowrap px-4 py-3 font-semibold text-slate-600"
                        >
                          {cleanLabel(
                            column
                          )}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {preview
                    .slice(0, 10)
                    .map(
                      (
                        row: any,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-slate-100"
                        >
                          {Object.keys(
                            preview[0]
                          ).map(
                            (
                              column
                            ) => (
                              <td
                                key={
                                  column
                                }
                                className="max-w-[220px] truncate whitespace-nowrap px-4 py-3 text-slate-600"
                              >
                                {row[
                                  column
                                ] ===
                                null ||
                                row[
                                  column
                                ] ===
                                  undefined
                                  ? "-"
                                  : String(
                                      row[
                                        column
                                      ]
                                    )}
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
        ) : (
          <EmptyState
            title="Preview unavailable"
            message="No preview records were returned by the backend."
          />
        )}
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <p className="text-xs text-slate-400">
          AI Business Analytics Dashboard
        </p>

        <p className="mt-1 text-[11px] text-slate-400">
          This report is dynamically generated from the
          uploaded dataset and detected analytical fields.
        </p>
      </div>
    </div>
  );
}