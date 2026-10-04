import {
  Bell,
  Search,
  Moon,
  UserCircle2,
} from "lucide-react";

interface NavbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

export default function Navbar({
  search,
  setSearch,
  onSearch,
}: NavbarProps) {
  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          AI Business Analytics
        </h2>

        <p className="text-slate-400 text-sm">
          Welcome back 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
           type="text"
           placeholder="Search products, customers..."
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
         }
        }}
        className="bg-slate-800 text-white rounded-xl pl-10 pr-4 py-2 w-72 outline-none border border-slate-700 focus:border-blue-500 transition"
      />         
        </div>

        {/* Theme */}
        <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition">
          <Moon size={20} />
        </button>

        {/* Notification */}
        <button className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition relative">
          <Bell size={20} className="text-slate-300" />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl">

          <UserCircle2 size={34} />

          <div>
            <p className="text-sm font-semibold">
              Prince
            </p>

            <p className="text-xs text-slate-400">
              Admin
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}