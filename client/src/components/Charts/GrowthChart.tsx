import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthChartProps {
  data: any[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const growthData = data.map((item, index) => {
    const previousRevenue =
      index > 0 ? data[index - 1]?.revenue ?? 0 : 0;

    const currentRevenue = item?.revenue ?? 0;

    const growth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    return {
      month: item?.month,
      growth: Number(growth.toFixed(1)),
    };
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">
          Revenue Growth Trend
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Month-over-month revenue growth
        </p>
      </div>

      <div className="h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={growthData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
            />

            <YAxis
              tickFormatter={(value) => `${value}%`}
            />

            {/* <Tooltip
              formatter={(value: number | undefined) =>
                `${value ?? 0}%`
              }
            /> */}
            <Tooltip />

            <Line
              type="monotone"
              dataKey="growth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}