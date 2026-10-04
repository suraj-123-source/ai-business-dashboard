import { CalendarDays } from "lucide-react";

interface Props {
  selected: string;
  onChange: (value: string) => void;
}

const filters = ["Today", "Week", "Month", "Year"];

export default function DateFilter({
  selected,
  onChange,
}: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">

      <div className="flex items-center gap-2 text-slate-300">
        <CalendarDays size={18} />
        <span className="font-medium">
          Filter
        </span>
      </div>

      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-4 py-2 rounded-xl transition-all duration-300
            ${
              selected === item
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }
          `}
        >
          {item}
        </button>
      ))}

    </div>
  );
}