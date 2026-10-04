
import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  Download,
  FileText,
  Layers3,
  PieChart as PieChartIcon,
  Printer,
  Sparkles,
  Table2,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type AnyObject = Record<string, any>;

interface ReportsProps {
  dashboardData?: AnyObject | null;
}

interface NumericStat {
  column: string;
  count?: number;
  sum?: number;
  average?: number;
  minimum?: number;
  maximum?: number;
  median?: number;
}

interface ChartItem {
  name: string;
  value: number;
}

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#059669",
  "#0891b2",
  "#ca8a04",
  "#4f46e5",
  "#16a34a",
  "#dc2626",
  "#9333ea",
  "#0f766e",
];

const safeArray = (value: any): any[] => {
  return Array.isArray(value) ? value : [];
};

const toNumber = (value: any): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/[₹$€£%]/g, "")
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
};

const isNumericValue = (value: any): boolean => {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  const cleaned = value
    .replace(/,/g, "")
    .replace(/[₹$€£%]/g, "")
    .trim();

  return Number.isFinite(Number(cleaned));
};

const formatNumber = (value: number, decimals = 2): string => {
  if (!Number.isFinite(value)) return "0";

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals === 0 ? 0 : Math.min(decimals, 2),
  });
};

const formatCompact = (value: number): string => {
  if (!Number.isFinite(value)) return "0";

  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `${(value / 10000000).toFixed(1)}Cr`;
  }

  if (abs >= 100000) {
    return `${(value / 100000).toFixed(1)}L`;
  }

  if (abs >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return formatNumber(value, 0);
};

const titleCase = (value: string): string => {
  if (!value) return "";

  return value
    .replace(/^_+/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const isIdColumn = (column: string): boolean => {
  const value = column.toLowerCase().replace(/[\s_-]/g, "");

  return (
    value === "id" ||
    value === "index" ||
    value === "serial" ||
    value === "serialnumber" ||
    value === "rownumber" ||
    value === "rowid" ||
    value.endsWith("id") ||
    value.includes("identifier") ||
    value.includes("uuid") ||
    value.includes("guid")
  );
};

const isSensitiveColumn = (column: string): boolean => {
  const value = column.toLowerCase();

  return [
    "password",
    "passcode",
    "token",
    "secret",
    "aadhaar",
    "aadhar",
    "pan",
    "credit card",
    "card number",
    "cvv",
    "otp",
  ].some((word) => value.includes(word));
};

const isFinancialColumn = (column: string): boolean => {
  const value = column.toLowerCase();

  return [
    "revenue",
    "sales",
    "sale",
    "amount",
    "price",
    "income",
    "turnover",
    "gmv",
    "value",
    "cost",
    "profit",
    "margin",
    "earning",
    "earnings",
    "salary",
    "expense",
    "discount",
  ].some((word) => value.includes(word));
};

const isProfitColumn = (column: string): boolean => {
  const value = column.toLowerCase();

  return (
    value.includes("profit") ||
    value.includes("margin") ||
    value.includes("earning")
  );
};

const isOrderColumn = (column: string): boolean => {
  const value = column.toLowerCase();

  return [
    "order",
    "quantity",
    "qty",
    "units",
    "count",
    "transaction",
    "transactions",
  ].some((word) => value.includes(word));
};

const isDateColumn = (column: string): boolean => {
  const value = column.toLowerCase();

  return (
    value.includes("date") ||
    value.includes("time") ||
    value.includes("month") ||
    value.includes("year")
  );
};

const getColumnValue = (row: AnyObject, column: string): any => {
  if (!row) return undefined;

  if (column in row) {
    return row[column];
  }

  const target = column.toLowerCase();

  const key = Object.keys(row).find(
    (item) => item.toLowerCase() === target
  );

  return key ? row[key] : undefined;
};

const getRows = (data: AnyObject): AnyObject[] => {
  const candidates = [
    data?.preview,
    data?.data,
    data?.rows,
    data?.records,
    data?.tableData,
    data?.uploadedData,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate;
    }
  }

  return [];
};

const getColumnsFromRows = (rows: AnyObject[]): string[] => {
  if (!rows.length) return [];

  const keys = new Set<string>();

  rows.slice(0, 100).forEach((row) => {
    Object.keys(row || {}).forEach((key) => keys.add(key));
  });

  return Array.from(keys);
};

const uniqueValues = (rows: AnyObject[], column: string): string[] => {
  const values = rows
    .map((row) => getColumnValue(row, column))
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    )
    .map((value) => String(value));

  return Array.from(new Set(values));
};

const inferNumericColumns = (
  rows: AnyObject[],
  columns: string[]
): string[] => {
  return columns.filter((column) => {
    if (isSensitiveColumn(column)) return false;

    const sample = rows
      .slice(0, 100)
      .map((row) => getColumnValue(row, column))
      .filter((value) => value !== null && value !== undefined && value !== "");

    if (!sample.length) return false;

    const numericCount = sample.filter(isNumericValue).length;

    return numericCount / sample.length >= 0.7;
  });
};

const inferCategoryColumns = (
  rows: AnyObject[],
  columns: string[]
): string[] => {
  return columns.filter((column) => {
    if (isSensitiveColumn(column) || isIdColumn(column)) return false;

    const values = uniqueValues(rows, column);

    if (!values.length) return false;

    const numeric = inferNumericColumns(rows, [column]).includes(column);

    if (numeric) return false;

    return values.length >= 2 && values.length <= 50;
  });
};

const getStats = (
  rows: AnyObject[],
  numericColumns: string[]
): NumericStat[] => {
  return numericColumns.map((column) => {
    const values = rows
      .map((row) => getColumnValue(row, column))
      .filter(isNumericValue)
      .map(toNumber);

    if (!values.length) {
      return {
        column,
        count: 0,
        sum: 0,
        average: 0,
        minimum: 0,
        maximum: 0,
        median: 0,
      };
    }

    const sorted = [...values].sort((a, b) => a - b);

    const middle = Math.floor(sorted.length / 2);

    const median =
      sorted.length % 2 === 0
        ? (sorted[middle - 1] + sorted[middle]) / 2
        : sorted[middle];

    return {
      column,
      count: values.length,
      sum: values.reduce((a, b) => a + b, 0),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      minimum: sorted[0],
      maximum: sorted[sorted.length - 1],
      median,
    };
  });
};

const getBestMetric = (
  numericColumns: string[],
  stats: NumericStat[]
): string | null => {
  const valid = numericColumns.filter(
    (column) => !isIdColumn(column) && !isSensitiveColumn(column)
  );

  if (!valid.length) return null;

  const financial = valid.find(isFinancialColumn);

  if (financial) return financial;

  const order = valid.find(isOrderColumn);

  if (order) return order;

  const sorted = [...stats]
    .filter((stat) => valid.includes(stat.column))
    .sort((a, b) => (b.sum || 0) - (a.sum || 0));

  return sorted[0]?.column || valid[0];
};

const buildCategoryData = (
  rows: AnyObject[],
  categoryColumn: string,
  metricColumn: string | null
): ChartItem[] => {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const category = getColumnValue(row, categoryColumn);

    if (
      category === null ||
      category === undefined ||
      String(category).trim() === ""
    ) {
      return;
    }

    const name = String(category);

    const value = metricColumn
      ? toNumber(getColumnValue(row, metricColumn))
      : 1;

    grouped.set(name, (grouped.get(name) || 0) + value);
  });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

const buildTrendData = (
  rows: AnyObject[],
  dateColumn: string | null,
  metricColumn: string | null
): ChartItem[] => {
  if (!dateColumn) return [];

  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    const rawDate = getColumnValue(row, dateColumn);

    if (rawDate === null || rawDate === undefined || rawDate === "") {
      return;
    }

    let label = String(rawDate);

    const date = new Date(rawDate);

    if (!Number.isNaN(date.getTime())) {
      label = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
    }

    const value = metricColumn
      ? toNumber(getColumnValue(row, metricColumn))
      : 1;

    grouped.set(label, (grouped.get(label) || 0) + value);
  });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(-12);
};

const getBestCategory = (
  rows: AnyObject[],
  categoryColumns: string[]
): string | null => {
  if (!categoryColumns.length) return null;

  const candidates = categoryColumns
    .map((column) => ({
      column,
      count: uniqueValues(rows, column).length,
    }))
    .filter((item) => item.count >= 2 && item.count <= 30)
    .sort((a, b) => a.count - b.count);

  return candidates[0]?.column || categoryColumns[0];
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}
  >
    {children}
  </section>
);

const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      {icon}
    </div>

    <div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>

      {subtitle && (
        <p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p>
      )}
    </div>
  </div>
);

const KpiCard = ({
  label,
  value,
  description,
  icon,
  className,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  className: string;
}) => (
  <div
    className={`min-h-[118px] rounded-2xl p-5 text-white shadow-md ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-90">
          {label}
        </p>

        <p className="mt-3 text-2xl font-extrabold tracking-tight">
          {value}
        </p>

        <p className="mt-2 text-[10px] opacity-90">{description}</p>
      </div>

      <div className="rounded-lg bg-white/20 p-2">{icon}</div>
    </div>
  </div>
);

const EmptyChart = ({ message }: { message: string }) => (
  <div className="flex h-[260px] items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">
    {message}
  </div>
);

const Reports: React.FC<ReportsProps> = ({ dashboardData }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const data = dashboardData || {};

  const rows = useMemo(() => getRows(data), [data]);

  const columns = useMemo(
    () =>
      data?.preview?.columns ||
      data?.columns ||
      getColumnsFromRows(rows),
    [data, rows]
  );

  const normalizedColumns = useMemo(() => {
    if (Array.isArray(columns)) {
      return columns.map((column: any) =>
        typeof column === "string" ? column : column?.name || column?.column
      ).filter(Boolean);
    }

    return getColumnsFromRows(rows);
  }, [columns, rows]);

  const numericColumns = useMemo(() => {
    const backendNumeric =
      safeArray(data?.numericAnalysis)
        .map((item) => item?.column)
        .filter(Boolean) || [];

    const inferred = inferNumericColumns(rows, normalizedColumns);

    return Array.from(new Set([...backendNumeric, ...inferred])).filter(
      (column) =>
        !isSensitiveColumn(column) &&
        !isIdColumn(column)
    );
  }, [data, rows, normalizedColumns]);

  const categoryColumns = useMemo(() => {
    const backendCategory =
      safeArray(data?.categoryAnalysis)
        .map((item) => item?.column)
        .filter(Boolean) || [];

    const inferred = inferCategoryColumns(rows, normalizedColumns);

    return Array.from(new Set([...backendCategory, ...inferred])).filter(
      (column) =>
        !isSensitiveColumn(column) &&
        !isIdColumn(column)
    );
  }, [data, rows, normalizedColumns]);

  const dateColumns = useMemo(() => {
    const backendDate = data?.summary?.dateColumn
      ? [data.summary.dateColumn]
      : [];

    const inferred = normalizedColumns.filter((column) =>
      isDateColumn(column)
    );

    return Array.from(new Set([...backendDate, ...inferred]));
  }, [data, normalizedColumns]);

  const stats = useMemo(
    () => getStats(rows, numericColumns),
    [rows, numericColumns]
  );

  const bestMetric = useMemo(
    () => getBestMetric(numericColumns, stats),
    [numericColumns, stats]
  );

  const metric =
    selectedMetric && numericColumns.includes(selectedMetric)
      ? selectedMetric
      : bestMetric;

  const bestCategory = useMemo(
    () => getBestCategory(rows, categoryColumns),
    [rows, categoryColumns]
  );

  const category =
    selectedCategory && categoryColumns.includes(selectedCategory)
      ? selectedCategory
      : bestCategory;

  const dateColumn =
    selectedDate && dateColumns.includes(selectedDate)
      ? selectedDate
      : dateColumns[0] || null;

  const metricStat =
    stats.find((stat) => stat.column === metric) || null;

  const financialMetric =
    numericColumns.find((column) => isFinancialColumn(column)) || null;

  const profitMetric =
    numericColumns.find((column) => isProfitColumn(column)) || null;

  // const orderMetric =
  // numericColumns.find((column) => isOrderColumn(column)) || null;

const financialStat = stats.find(
  (stat) => stat.column === financialMetric
);

const profitStat = stats.find(
  (stat) => stat.column === profitMetric
);
  const categoryData = useMemo(
    () =>
      category
        ? buildCategoryData(rows, category, metric)
        : [],
    [rows, category, metric]
  );

  const trendData = useMemo(
    () => buildTrendData(rows, dateColumn, metric),
    [rows, dateColumn, metric]
  );

  const comparisonData = useMemo(() => {
    if (!category || !metric) return [];

    return categoryData.map((item, index) => ({
      ...item,
      rank: index + 1,
      average: (() => {
        const categoryRows = rows.filter(
          (row) =>
            String(getColumnValue(row, category)) === item.name
        );

        if (!categoryRows.length) return 0;

        const total = categoryRows.reduce(
          (sum, row) =>
            sum + toNumber(getColumnValue(row, metric)),
          0
        );

        return total / categoryRows.length;
      })(),
    }));
  }, [category, metric, categoryData, rows]);

  const topRecords = useMemo(() => {
    if (!metric) return [];

    const usefulColumns = normalizedColumns.filter(
      (column) =>
        !isSensitiveColumn(column) &&
        !isIdColumn(column) &&
        column !== metric
    );

    const preferredColumns = usefulColumns
      .filter((column) => !numericColumns.includes(column))
      .slice(0, 3);

    const fallbackColumns = usefulColumns.slice(0, 3);

    const displayColumns =
      preferredColumns.length > 0
        ? preferredColumns
        : fallbackColumns;

    return [...rows]
      .sort(
        (a, b) =>
          toNumber(getColumnValue(b, metric)) -
          toNumber(getColumnValue(a, metric))
      )
      .slice(0, 10)
      .map((row, index) => ({
        rank: index + 1,
        values: displayColumns.map((column) => ({
          column,
          value: getColumnValue(row, column),
        })),
        metricValue: toNumber(getColumnValue(row, metric)),
      }));
  }, [rows, metric, normalizedColumns, numericColumns]);

  const completeness = useMemo(() => {
    if (!rows.length || !normalizedColumns.length) return 0;

    let filled = 0;
    let total = rows.length * normalizedColumns.length;

    rows.forEach((row) => {
      normalizedColumns.forEach((column) => {
        const value = getColumnValue(row, column);

        if (
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        ) {
          filled += 1;
        }
      });
    });

    return total ? (filled / total) * 100 : 0;
  }, [rows, normalizedColumns]);

  const missingCells = useMemo(() => {
    if (!rows.length || !normalizedColumns.length) return 0;

    let missing = 0;

    rows.forEach((row) => {
      normalizedColumns.forEach((column) => {
        const value = getColumnValue(row, column);

        if (
          value === null ||
          value === undefined ||
          String(value).trim() === ""
        ) {
          missing += 1;
        }
      });
    });

    return missing;
  }, [rows, normalizedColumns]);

  const reportId = useMemo(() => {
    const random = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    return `RPT-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${random}`;
  }, []);

  const datasetName =
    data?.fileName ||
    data?.filename ||
    data?.datasetName ||
    data?.file?.name ||
    "Uploaded Dataset";

  const generatedDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const exportPDF = () => {
    const reportElement =
      document.getElementById("reports-print-area");

    if (!reportElement) {
      alert("Report area not found.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=1200,height=900"
    );

    if (!printWindow) {
      alert("Please allow pop-ups in your browser.");
      return;
    }

    const reportHTML = reportElement.outerHTML;

    const styles = Array.from(
      document.querySelectorAll(
        'link[rel="stylesheet"], style'
      )
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>AI Business Analytics Report</title>

          ${styles}

          <style>
            @page {
              size: A4;
              margin: 8mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white !important;
              color: #0f172a !important;
              font-family: Arial, Helvetica, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            body {
              width: 100%;
            }

            #reports-print-area {
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: white !important;
            }

            .no-print {
              display: none !important;
            }

            button {
              display: none !important;
            }

            aside,
            nav,
            header {
              display: none !important;
            }

            section {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .report-grid {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            tr {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .recharts-responsive-container {
              width: 100% !important;
              min-height: 250px !important;
            }

            svg {
              max-width: 100%;
            }
          </style>
        </head>

        <body>
          ${reportHTML}

          <script>
            window.onload = function () {
              setTimeout(function () {
                window.focus();
                window.print();
              }, 1200);
            };

            window.onafterprint = function () {
              setTimeout(function () {
                window.close();
              }, 500);
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const exportCSV = () => {
    if (!rows.length) {
      alert("No dataset available to export.");
      return;
    }

    const csvColumns = normalizedColumns;

    const escapeCSV = (value: any) => {
      const text = value === null || value === undefined
        ? ""
        : String(value);

      return `"${text.replace(/"/g, '""')}"`;
    };

    const csv = [
      csvColumns.map(escapeCSV).join(","),
      ...rows.map((row) =>
        csvColumns
          .map((column) =>
            escapeCSV(getColumnValue(row, column))
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${datasetName
      .replace(/\.[^/.]+$/, "")
      .replace(/\s+/g, "_")}_report_data.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  const kpis = [
    {
      label: financialMetric
        ? titleCase(financialMetric)
        : metric
        ? titleCase(metric)
        : "Total Records",
      value: financialMetric
        ? formatNumber(financialStat?.sum || 0)
        : metric
        ? formatNumber(metricStat?.sum || 0)
        : formatNumber(rows.length, 0),
      description: financialMetric
        ? "Primary financial measure"
        : metric
        ? "Primary dataset measure"
        : "Rows available for analysis",
      icon: <TrendingUp size={20} />,
      className: "bg-gradient-to-br from-blue-600 to-indigo-500",
    },
    {
      label: profitMetric
        ? titleCase(profitMetric)
        : "Average " + (metric ? titleCase(metric) : "Metric"),
      value: profitMetric
        ? formatNumber(profitStat?.average || 0)
        : metric
        ? formatNumber(metricStat?.average || 0)
        : "0",
      description: profitMetric
        ? "Profitability measure"
        : "Average available metric",
      icon: <BarChart3 size={20} />,
      className: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      label: "Total Records",
      value: formatNumber(rows.length, 0),
      description: "Rows available for analysis",
      icon: <Database size={20} />,
      className: "bg-gradient-to-br from-violet-600 to-purple-500",
    },
    {
      label: category
        ? `${titleCase(category)} Groups`
        : "Data Fields",
      value: category
        ? formatNumber(uniqueValues(rows, category).length, 0)
        : formatNumber(normalizedColumns.length, 0),
      description: category
        ? "Distinct groups available"
        : "Columns available for analysis",
      icon: <Layers3 size={20} />,
      className: "bg-gradient-to-br from-orange-500 to-pink-500",
    },
  ];

  const insights = useMemo(() => {
    const result: string[] = [];

    if (rows.length) {
      result.push(
        `The dataset contains ${formatNumber(
          rows.length,
          0
        )} records across ${formatNumber(
          normalizedColumns.length,
          0
        )} fields.`
      );
    }

    if (metric && metricStat) {
      result.push(
        `${titleCase(metric)} has a total of ${formatNumber(
          metricStat.sum || 0
        )}, with an average of ${formatNumber(
          metricStat.average || 0
        )}.`
      );
    }

    if (category && categoryData.length) {
      const top = categoryData[0];

      const total = categoryData.reduce(
        (sum, item) => sum + item.value,
        0
      );

      const share =
        total > 0 ? (top.value / total) * 100 : 0;

      result.push(
        `${top.name} is the leading ${titleCase(
          category
        )} group, contributing approximately ${share.toFixed(
          1
        )}% of the displayed metric.`
      );
    }

    if (dateColumn && trendData.length >= 2) {
      const first = trendData[0]?.value || 0;
      const last =
        trendData[trendData.length - 1]?.value || 0;

      if (first !== 0) {
        const change = ((last - first) / Math.abs(first)) * 100;

        result.push(
          `The latest period is ${Math.abs(change).toFixed(
            1
          )}% ${
            change >= 0 ? "above" : "below"
          } the first available period.`
        );
      }
    }

    if (completeness >= 99) {
      result.push(
        "The uploaded dataset has very high field completeness."
      );
    } else {
      result.push(
        `${formatNumber(
          missingCells,
          0
        )} missing cells were detected and should be reviewed before detailed analysis.`
      );
    }

    return result.slice(0, 6);
  }, [
    rows.length,
    normalizedColumns.length,
    metric,
    metricStat,
    category,
    categoryData,
    dateColumn,
    trendData,
    completeness,
    missingCells,
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* REPORT CONTROLS - NOT EXPORTED */}
      <div className="no-print mx-auto mb-4 max-w-[1100px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Report Explorer
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Select fields below to interact with the same dataset used
            by Analytics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={metric || ""}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none"
          >
            {numericColumns.length === 0 ? (
              <option value="">No numeric fields</option>
            ) : (
              numericColumns.map((column) => (
                <option key={column} value={column}>
                  Metric: {titleCase(column)}
                </option>
              ))
            )}
          </select>

          <select
            value={category || ""}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none"
          >
            <option value="">Category: None</option>

            {categoryColumns.map((column) => (
              <option key={column} value={column}>
                Category: {titleCase(column)}
              </option>
            ))}
          </select>

          <select
            value={dateColumn || ""}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none"
          >
            <option value="">Date: None</option>

            {dateColumns.map((column) => (
              <option key={column} value={column}>
                Date: {titleCase(column)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowPreview((value) => !value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <Table2 size={14} />
              {showPreview ? "Hide Data" : "Show Data Preview"}
            </span>
          </button>

          <button
            onClick={exportCSV}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <span className="flex items-center gap-2">
              <Download size={14} />
              Export Data
            </span>
          </button>

          <button
            onClick={exportPDF}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            <span className="flex items-center gap-2">
              <Printer size={14} />
              Export PDF
            </span>
          </button>
        </div>

        {showPreview && rows.length > 0 && (
          <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  {normalizedColumns.map((column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap border-b px-3 py-2 font-bold text-slate-600"
                    >
                      {titleCase(column)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.slice(0, 10).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b last:border-b-0"
                  >
                    {normalizedColumns.map((column) => (
                      <td
                        key={column}
                        className="whitespace-nowrap px-3 py-2 text-slate-600"
                      >
                        {String(
                          getColumnValue(row, column) ?? ""
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ONLY THIS AREA IS EXPORTED */}
      <main
        id="reports-print-area"
        className="mx-auto max-w-[1100px] bg-white text-slate-900"
      >
        {/* HEADER */}
        <div className="border-t-4 border-blue-600 rounded-t-2xl px-7 pb-5 pt-7">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <FileText size={24} />
              </div>

              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-600">
                  AI Business Analytics Dashboard
                </p>

                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
                  AI Business Analytics Report
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Dynamic business performance, analytics & intelligence
                </p>
              </div>
            </div>

            <div className="grid min-w-[230px] grid-cols-2 gap-x-7 gap-y-3 text-right">
              <div>
                <p className="text-[8px] font-bold uppercase text-slate-400">
                  Generated
                </p>

                <p className="mt-1 text-[9px] font-semibold text-slate-700">
                  {generatedDate}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase text-slate-400">
                  Report ID
                </p>

                <p className="mt-1 text-[9px] font-semibold text-slate-700">
                  {reportId}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase text-slate-400">
                  Dataset
                </p>

                <p className="mt-1 truncate text-[9px] font-semibold text-slate-700">
                  {datasetName}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase text-slate-400">
                  Prepared By
                </p>

                <p className="mt-1 text-[9px] font-semibold text-slate-700">
                  AI Business Analytics Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-4 px-7 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              description={kpi.description}
              icon={kpi.icon}
              className={kpi.className}
            />
          ))}
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<CheckCircle2 size={18} />}
              title="Executive Summary"
              subtitle="Automatically generated dataset indicators"
            />

            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
              {[
                ["Records", formatNumber(rows.length, 0)],
                ["Numeric Fields", formatNumber(numericColumns.length, 0)],
                ["Category Fields", formatNumber(categoryColumns.length, 0)],
                ["Date Fields", formatNumber(dateColumns.length, 0)],
                ["Completeness", `${completeness.toFixed(1)}%`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-[8px] font-bold uppercase text-slate-400">
                    {label}
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CHART GRID */}
        <div className="report-grid mt-5 grid grid-cols-1 gap-4 px-7 lg:grid-cols-2">
          {/* TREND */}
          <Card>
            <SectionHeader
              icon={<TrendingUp size={18} />}
              title="Performance Trend"
              subtitle={
                dateColumn
                  ? `${titleCase(
                      metric || "Metric"
                    )} across ${titleCase(dateColumn)}`
                  : "Dynamic dataset performance"
              }
            />

            <div className="h-[290px] p-4">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="trendGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.35}
                        />

                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0.03}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 9,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 9,
                        fill: "#64748b",
                      }}
                      tickFormatter={formatCompact}
                    />

                    <Tooltip
                      formatter={(value: any) =>
                        formatNumber(toNumber(value))
                      }
                    />

                    <AreaLike
                      dataKey="value"
                      stroke="#2563eb"
                      fill="url(#trendGradient)"
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#2563eb",
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No date-based trend available for this dataset." />
              )}
            </div>
          </Card>

          {/* DONUT */}
          <Card>
            <SectionHeader
              icon={<PieChartIcon size={18} />}
              title={
                category
                  ? `${titleCase(category)} Distribution`
                  : "Category Distribution"
              }
              subtitle="Largest available categorical dimension"
            />

            <div className="h-[290px] p-4">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${String(name).slice(0, 12)} ${(
                          (percent || 0) * 100
                        ).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value: any) =>
                        formatNumber(toNumber(value))
                      }
                    />

                    <Legend
                      wrapperStyle={{
                        fontSize: "9px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No suitable categorical field found." />
              )}
            </div>
          </Card>

          {/* CATEGORY PERFORMANCE */}
          <Card>
            <SectionHeader
              icon={<BarChart3 size={18} />}
              title="Category Performance"
              subtitle={
                category
                  ? `Top groups by ${titleCase(metric || "metric")}`
                  : "Dynamic category analysis"
              }
            />

            <div className="h-[300px] p-4">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 8,
                        fill: "#475569",
                      }}
                      angle={-25}
                      textAnchor="end"
                      height={65}
                    />

                    <YAxis
                      tick={{
                        fontSize: 9,
                        fill: "#64748b",
                      }}
                      tickFormatter={formatCompact}
                    />

                    <Tooltip
                      formatter={(value: any) =>
                        formatNumber(toNumber(value))
                      }
                    />

                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="Category performance is unavailable." />
              )}
            </div>
          </Card>

          {/* TOP GROUPS */}
          <Card>
            <SectionHeader
              icon={<Layers3 size={18} />}
              title="Top Groups"
              subtitle="Highest-performing groups from the uploaded dataset"
            />

            <div className="h-[300px] p-4">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...categoryData].slice(0, 8)}
                    layout="vertical"
                    margin={{
                      left: 30,
                      right: 15,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 9,
                        fill: "#64748b",
                      }}
                      tickFormatter={formatCompact}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tick={{
                        fontSize: 8,
                        fill: "#475569",
                      }}
                    />

                    <Tooltip
                      formatter={(value: any) =>
                        formatNumber(toNumber(value))
                      }
                    />

                    <Bar
                      dataKey="value"
                      radius={[0, 7, 7, 0]}
                    >
                      {categoryData
                        .slice(0, 8)
                        .map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                (index + 2) % COLORS.length
                              ]
                            }
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No groups available." />
              )}
            </div>
          </Card>
        </div>

        {/* COMPARISON SECTION */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<BarChart3 size={18} />}
              title="Comparison Analysis"
              subtitle={
                category && metric
                  ? `Comparison of ${titleCase(
                      metric
                    )} across ${titleCase(category)}`
                  : "Dynamic comparison of available dataset dimensions"
              }
            />

            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
              <div className="h-[320px]">
                {comparisonData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 8,
                          fill: "#475569",
                        }}
                        angle={-25}
                        textAnchor="end"
                        height={65}
                      />

                      <YAxis
                        tick={{
                          fontSize: 9,
                          fill: "#64748b",
                        }}
                        tickFormatter={formatCompact}
                      />

                      <Tooltip
                        formatter={(value: any) =>
                          formatNumber(toNumber(value))
                        }
                      />

                      <Legend
                        wrapperStyle={{
                          fontSize: "9px",
                        }}
                      />

                      <Bar
                        dataKey="value"
                        name={titleCase(metric || "Metric")}
                        radius={[6, 6, 0, 0]}
                      >
                        {comparisonData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="Comparison cannot be generated from this dataset." />
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="border-b bg-slate-50 px-4 py-3">
                  <h3 className="text-xs font-bold text-slate-800">
                    Group Comparison
                  </h3>
                </div>

                <div className="overflow-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="border-b bg-white">
                        <th className="px-3 py-3 text-left font-bold text-slate-500">
                          Rank
                        </th>

                        <th className="px-3 py-3 text-left font-bold text-slate-500">
                          {titleCase(category || "Group")}
                        </th>

                        <th className="px-3 py-3 text-right font-bold text-slate-500">
                          Total
                        </th>

                        <th className="px-3 py-3 text-right font-bold text-slate-500">
                          Average
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {comparisonData
                        .slice(0, 10)
                        .map((item) => (
                          <tr
                            key={`${item.name}-${item.rank}`}
                            className="border-b last:border-0"
                          >
                            <td className="px-3 py-3 font-bold text-blue-600">
                              #{item.rank}
                            </td>

                            <td className="max-w-[150px] truncate px-3 py-3 font-semibold text-slate-700">
                              {item.name}
                            </td>

                            <td className="px-3 py-3 text-right font-semibold text-slate-800">
                              {formatNumber(item.value)}
                            </td>

                            <td className="px-3 py-3 text-right text-slate-600">
                              {formatNumber(item.average)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* TOP RECORDS */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<Table2 size={18} />}
              title="Top Records"
              subtitle={
                metric
                  ? `Top 10 records ranked by ${titleCase(metric)}`
                  : "Highest-value records from the uploaded dataset"
              }
            />

            {topRecords.length > 0 ? (
              <div className="overflow-x-auto p-4">
                <table className="min-w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 px-3 py-3 text-left font-bold text-slate-600">
                        #
                      </th>

                      {topRecords[0]?.values.map((item) => (
                        <th
                          key={item.column}
                          className="border border-slate-200 px-3 py-3 text-left font-bold text-slate-600"
                        >
                          {titleCase(item.column)}
                        </th>
                      ))}

                      <th className="border border-slate-200 px-3 py-3 text-right font-bold text-slate-600">
                        {titleCase(metric || "Metric")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {topRecords.map((record) => (
                      <tr
                        key={record.rank}
                        className="hover:bg-slate-50"
                      >
                        <td className="border border-slate-200 px-3 py-2 font-bold text-blue-600">
                          {record.rank}
                        </td>

                        {record.values.map((item) => (
                          <td
                            key={item.column}
                            className="max-w-[180px] truncate border border-slate-200 px-3 py-2 text-slate-700"
                          >
                            {String(item.value ?? "-")}
                          </td>
                        ))}

                        <td className="border border-slate-200 px-3 py-2 text-right font-bold text-slate-900">
                          {formatNumber(record.metricValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-slate-400">
                No records available for ranking.
              </div>
            )}
          </Card>
        </div>

        {/* NUMERIC ANALYTICS */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<BarChart3 size={18} />}
              title="Numeric Analytics"
              subtitle="Automatically detected numeric fields"
            />

            {stats.length > 0 ? (
              <div className="overflow-x-auto p-4">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="px-3 py-3 text-left font-bold text-slate-500">
                        Field
                      </th>

                      <th className="px-3 py-3 text-right font-bold text-slate-500">
                        Total
                      </th>

                      <th className="px-3 py-3 text-right font-bold text-slate-500">
                        Average
                      </th>

                      <th className="px-3 py-3 text-right font-bold text-slate-500">
                        Minimum
                      </th>

                      <th className="px-3 py-3 text-right font-bold text-slate-500">
                        Maximum
                      </th>

                      <th className="px-3 py-3 text-right font-bold text-slate-500">
                        Median
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {stats.slice(0, 15).map((stat) => (
                      <tr
                        key={stat.column}
                        className="border-b last:border-0"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-700">
                          {titleCase(stat.column)}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {formatNumber(stat.sum || 0)}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {formatNumber(stat.average || 0)}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {formatNumber(stat.minimum || 0)}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {formatNumber(stat.maximum || 0)}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {formatNumber(stat.median || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-slate-400">
                No numeric fields were detected.
              </div>
            )}
          </Card>
        </div>

        {/* DATA QUALITY */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<Database size={18} />}
              title="Data Quality & Profile"
              subtitle="Automatic quality and structure analysis"
            />

            <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
              {[
                [
                  "Columns",
                  normalizedColumns.length,
                  "bg-blue-50 text-blue-700",
                ],
                [
                  "Numeric",
                  numericColumns.length,
                  "bg-purple-50 text-purple-700",
                ],
                [
                  "Categories",
                  categoryColumns.length,
                  "bg-emerald-50 text-emerald-700",
                ],
                [
                  "Date",
                  dateColumns.length,
                  "bg-orange-50 text-orange-700",
                ],
                [
                  "Completeness",
                  `${completeness.toFixed(1)}%`,
                  "bg-cyan-50 text-cyan-700",
                ],
              ].map(([label, value, className]) => (
                <div
                  key={String(label)}
                  className={`rounded-xl p-4 ${className}`}
                >
                  <p className="text-[8px] font-bold uppercase opacity-70">
                    {label}
                  </p>

                  <p className="mt-2 text-xl font-extrabold">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Data completeness
                  </span>

                  <span className="text-xs font-bold text-emerald-600">
                    {completeness.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                    style={{
                      width: `${Math.min(
                        100,
                        completeness
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-[10px] text-slate-500">
                  {missingCells === 0
                    ? "No missing cells were detected in the analyzed records."
                    : `${formatNumber(
                        missingCells,
                        0
                      )} missing cells were detected.`}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* INSIGHTS */}
        <div className="mt-5 px-7">
          <Card>
            <SectionHeader
              icon={<Sparkles size={18} />}
              title="AI Business Insights"
              subtitle="Automatically generated observations from the uploaded dataset"
            />

            <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="text-xs leading-5 text-slate-600">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* FOOTER */}
        <div className="px-7 pb-7 pt-6">
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-[9px] text-slate-400">
            <span>
              AI Business Analytics Dashboard
            </span>

            <span>
              Dynamic Analytics Report • {datasetName}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

/*
 * Small helper component used for the trend area.
 * It keeps the report self-contained without requiring another file.
 */
const AreaLike = ({
  dataKey,
  stroke,
  fill,
}: {
  dataKey: string;
  stroke: string;
  fill: string;
}) => {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      strokeWidth={1}
      fill={fill}
      dot={false}
      activeDot={false}
      strokeOpacity={0}
    />
  );
};

export default Reports;