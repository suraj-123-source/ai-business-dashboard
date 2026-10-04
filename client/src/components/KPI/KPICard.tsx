import { ArrowUpRight } from "lucide-react";

interface Props {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
  trend: string;
}

export default function KPICard({
  title,
  value,
  color,
  icon,
  trend,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400">{title}</p>

          <h2 className={`text-3xl font-bold mt-2 ${color}`}>
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
            <ArrowUpRight size={16} />
            <span>{trend}</span>
          </div>

        </div>

        <div className={`p-4 rounded-xl bg-slate-800 ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}