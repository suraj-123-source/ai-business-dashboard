import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface RegionData {
  region: string;
  revenue: number;
}

interface Props {
  data?: RegionData[];
}

export default function RegionalSalesChart({ data = [] }: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-96">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Regional Sales
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="region" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Bar
            dataKey="revenue"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}