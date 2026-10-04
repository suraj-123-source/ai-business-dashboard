import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface PieItem {
  name: string;
  value: number;
}

interface Props {
  data?: PieItem[];
  pdf?: boolean;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function PieRevenue({
  data = [],
  pdf = false,
}: Props) {
  return (
    <div
      id="pie-chart"
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
        Revenue Distribution
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}