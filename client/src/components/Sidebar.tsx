
// import {
//   LayoutDashboard,
//   Upload,
//   BarChart3,
//   Bot,
//   FileText,
//   Settings,
// } from "lucide-react";

// const menu = [
//   { icon: LayoutDashboard, title: "Dashboard" },
//   { icon: Upload, title: "Upload Data" },
//   { icon: BarChart3, title: "Analytics" },
//   { icon: Bot, title: "AI Insights" },
//   { icon: FileText, title: "Reports" },
//   { icon: Settings, title: "Settings" },
// ];

// interface SidebarProps {
//   activePage: string;
//   setActivePage: (page: string) => void;
// }

// export default function Sidebar({
//   activePage,
//   setActivePage,
// }: SidebarProps) {
//   return (
//     <aside className="w-60 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">

//       {/* Logo */}

//       <div className="p-6">

//         <h1 className="text-2xl font-bold text-blue-400">
//           📊 AI Dashboard
//         </h1>

//         <p className="text-slate-400 mt-2 text-sm">
//           Business Analytics
//         </p>

//       </div>


//       {/* Menu */}

//       <nav className="px-3 space-y-2">

//         {menu.map((item) => {

//           const Icon = item.icon;

//           const isActive = activePage === item.title;

//           return (
//             <button
//               key={item.title}
//               onClick={() => setActivePage(item.title)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "text-slate-300 hover:bg-slate-800"
//               }`}
//             >

//               <Icon size={20} />

//               <span>
//                 {item.title}
//               </span>

//             </button>
//           );

//         })}

//       </nav>

//     </aside>
//   );
// }



import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Bot,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout?: () => void;
}

const menu = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    icon: Upload,
    title: "Upload Data",
  },
  {
    icon: BarChart3,
    title: "Analytics",
  },
  {
    icon: Bot,
    title: "AI Insights",
  },
  {
    icon: FileText,
    title: "Reports",
  },
  {
    icon: Settings,
    title: "Settings",
  },
];

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">

      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}

      <div className="px-5 py-6 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">

            <BarChart3
              size={22}
              className="text-white"
            />

          </div>

          <div className="min-w-0">

            <h1 className="text-sm font-bold text-white truncate">
              AI Business
            </h1>

            <p className="text-xs text-blue-400 truncate">
              Analytics Dashboard
            </p>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <nav className="flex-1 px-3 py-5">

        <p className="px-3 mb-3 text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
          Main Menu
        </p>

        <div className="space-y-1">

          {menu.map((item) => {

            const Icon = item.icon;

            const isActive =
              activePage === item.title;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  setActivePage(item.title)
                }
                className={`
                  w-full flex items-center gap-3
                  px-3 py-3
                  rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }
                `}
              >

                <Icon size={19} />

                <span>
                  {item.title}
                </span>

              </button>
            );

          })}

        </div>

      </nav>


      {/* ================================================= */}
      {/* USER / LOGOUT */}
      {/* ================================================= */}

      <div className="p-3 border-t border-slate-800">

        {/* User information */}

        <div className="px-3 py-3 mb-2">

          <p className="text-xs text-slate-500">
            Signed in as
          </p>

          <p className="text-sm text-slate-300 font-medium truncate">
            {localStorage.getItem(
              "dashboard_user_email"
            ) || "Dashboard User"}
          </p>

        </div>


        {/* Logout */}

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
        >

          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}