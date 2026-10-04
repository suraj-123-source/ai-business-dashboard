import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ForecastItem {
  month: string;
  revenue: number;
}

interface Props {
  data?: ForecastItem[];
}

export default function ForecastChart({ data = [] }: Props) {
  if (!data.length) {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-96 flex items-center justify-center text-slate-400">
        No forecast data available
      </div>
    );
  }

  const first = data[0].revenue;
  const last = data[data.length - 1].revenue;

  const growth = (((last - first) / first) * 100).toFixed(1);
  const growthValue = Number(growth);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 h-[430px]">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-bold text-white">
            Revenue Forecast
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            AI Prediction for the next 6 periods
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
          growthValue >= 0
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
       }`}
       >
        < TrendingUp size={18} />

        {growthValue >= 0 ? "+" : ""}
        {growth}%
     </div>

      </div>

      <ResponsiveContainer width="100%" height="82%">
        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="month"
            stroke="#94a3b8"
          />

          <YAxis
            stroke="#94a3b8"
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#22c55e"
            strokeWidth={4}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}