import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RevenueItem {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data?: RevenueItem[];
  pdf?: boolean;
}

export default function RevenueChart({
  data = [],
  pdf = false,
}: RevenueChartProps) {
  return (
    <div
      id="revenue-chart"
      className={`rounded-2xl p-6 h-96 ${
        pdf
          ? "bg-white border border-gray-300"
          : "bg-slate-900 border border-slate-800"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          pdf ? "text-black" : "text-white"
        }`}
      >
        Monthly Revenue
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={pdf ? "#d1d5db" : "#334155"}
          />

          <XAxis
            dataKey="month"
            stroke={pdf ? "#374151" : "#94a3b8"}
          />

          <YAxis
            stroke={pdf ? "#374151" : "#94a3b8"}
          />

          <Tooltip />

          <Bar
            dataKey="revenue"
            fill="#3B82F6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}