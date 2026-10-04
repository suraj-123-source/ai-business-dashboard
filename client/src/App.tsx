
// import { useEffect, useState } from "react";

// import Dashboard from "./pages/Dashboard";
// import UploadData from "./pages/UploadData";
// import Analytics from "./pages/Analytics";
// import AIInsights from "./pages/AIInsights";
// import Reports from "./pages/Reports";
// import Settings from "./pages/Settings";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

// import Sidebar from "./components/Sidebar";

// import {
//   SettingsProvider,
//   useSettings,
// } from "./context/SettingsContext";


// function AppContent() {

//   // =========================================================
//   // AUTHENTICATION
//   // =========================================================

//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return localStorage.getItem("dashboard_authenticated") === "true";
//   });

//   const [showRegister, setShowRegister] = useState(false);


//   // =========================================================
//   // APPLICATION STATE
//   // =========================================================

//   const [activePage, setActivePage] =
//     useState("Dashboard");

//   const [dashboardData, setDashboardData] =
//     useState<any>(null);

//   const { settings } = useSettings();


//   // =========================================================
//   // SETTINGS LAYOUT
//   // =========================================================

//   useEffect(() => {

//     document.body.setAttribute(
//       "data-dashboard-layout",
//       settings.layout
//     );

//   }, [settings.layout]);


//   // =========================================================
//   // LOGIN
//   // =========================================================

//   const handleLogin = (
//     email: string,
//     password: string
//   ) => {

//     /*
//       TEMPORARY FRONTEND AUTHENTICATION

//       This is only for connecting the Login page
//       with the application.

//       Real authentication will be connected to
//       the FastAPI backend in the next authentication step.
//     */

//     if (!email || !password) {
//       return;
//     }

//     localStorage.setItem(
//       "dashboard_authenticated",
//       "true"
//     );

//     localStorage.setItem(
//       "dashboard_user_email",
//       email
//     );

//     setIsAuthenticated(true);

//     setActivePage("Dashboard");
//   };


//   // =========================================================
//   // LOGOUT
//   // =========================================================

//   const handleLogout = () => {

//     localStorage.removeItem(
//       "dashboard_authenticated"
//     );

//     localStorage.removeItem(
//       "dashboard_user_email"
//     );

//     setIsAuthenticated(false);

//     setDashboardData(null);

//     setActivePage("Dashboard");
//   };


//   // =========================================================
//   // LOGIN SCREEN
//   // =========================================================

//   if (!isAuthenticated) {

//   if (showRegister) {

//     return (
//       <Register

//         onRegister={(name, email, password) => {

//           /*
//             TEMPORARY REGISTRATION

//             Real registration will be connected
//             to FastAPI in the authentication step.
//           */

//           localStorage.setItem(
//             "dashboard_authenticated",
//             "true"
//           );

//           localStorage.setItem(
//             "dashboard_user_name",
//             name
//           );

//           localStorage.setItem(
//             "dashboard_user_email",
//             email
//           );

//           setShowRegister(false);

//           setIsAuthenticated(true);

//           setActivePage("Dashboard");

//         }}

//         onLogin={() => {
//           setShowRegister(false);
//         }}

//       />
//     );

//   }


//   return (
//     <Login

//       onLogin={handleLogin}

//       onRegister={() => {
//         setShowRegister(true);
//       }}

//       onForgotPassword={() => {
//         alert(
//           "Forgot Password will be connected after authentication setup."
//         );
//       }}

//     />
//   );

// }

//   // =========================================================
//   // PAGE RENDERING
//   // =========================================================

//   const renderPage = () => {

//     switch (activePage) {

//       // -----------------------------------------------------
//       // DASHBOARD
//       // -----------------------------------------------------

//       case "Dashboard":

//         return (
//           <Dashboard
//             dashboardData={dashboardData}
//             setDashboardData={setDashboardData}
//           />
//         );


//       // -----------------------------------------------------
//       // UPLOAD DATA
//       // -----------------------------------------------------

//       case "Upload Data":

//         return (
//           <UploadData
//             setDashboardData={setDashboardData}
//           />
//         );


//       // -----------------------------------------------------
//       // ANALYTICS
//       // -----------------------------------------------------

//       case "Analytics":

//         return (
//           <Analytics
//             data={dashboardData}
//           />
//         );


//       // -----------------------------------------------------
//       // AI INSIGHTS
//       // -----------------------------------------------------

//       case "AI Insights":

//         return (
//           <AIInsights
//             data={dashboardData}
//           />
//         );


//       // -----------------------------------------------------
//       // REPORTS
//       // -----------------------------------------------------

//       case "Reports":

//         return (
//           <Reports
//             dashboardData={dashboardData}
//           />
//         );


//       // -----------------------------------------------------
//       // SETTINGS
//       // -----------------------------------------------------

//       case "Settings":

//         return <Settings />;


//       // -----------------------------------------------------
//       // DEFAULT
//       // -----------------------------------------------------

//       default:

//         return (
//           <Dashboard
//             dashboardData={dashboardData}
//             setDashboardData={setDashboardData}
//           />
//         );

//     }

//   };


//   // =========================================================
//   // MAIN APPLICATION
//   // =========================================================

//   return (

//     <div
//       className={`min-h-screen transition-all duration-300 ${
//         settings.layout === "compact"
//           ? "dashboard-compact"
//           : "dashboard-comfortable"
//       }`}
//     >

//       <div className="flex min-h-screen bg-slate-950 text-white">

//         {/* SIDEBAR */}

//         <Sidebar
//           activePage={activePage}
//           setActivePage={setActivePage}
//           onLogout={handleLogout}
//         />


//         {/* MAIN CONTENT */}

//         <div className="min-w-0 flex-1">

//           {renderPage()}

//         </div>

//       </div>

//     </div>

//   );
// }


// // =========================================================
// // APP ROOT
// // =========================================================

// function App() {

//   return (

//     <SettingsProvider>

//       <AppContent />

//     </SettingsProvider>

//   );

// }


// export default App;



import { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./pages/Dashboard";
import UploadData from "./pages/UploadData";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Sidebar from "./components/Sidebar";

import {
  SettingsProvider,
  useSettings,
} from "./context/SettingsContext";


const API_URL = "http://127.0.0.1:8000";


function AppContent() {

  // =========================================================
  // AUTHENTICATION STATE
  // =========================================================

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [authChecking, setAuthChecking] =
    useState(true);

  const [showRegister, setShowRegister] =
    useState(false);


  // =========================================================
  // APPLICATION STATE
  // =========================================================

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [dashboardData, setDashboardData] =
    useState<any>(null);

  const { settings } = useSettings();


  // =========================================================
  // VERIFY JWT WHEN APPLICATION STARTS
  // =========================================================

  useEffect(() => {

    const verifyAuthentication = async () => {

      const token = localStorage.getItem(
        "dashboard_access_token"
      );

      // No token = user is not logged in
      if (!token) {

        setIsAuthenticated(false);
        setAuthChecking(false);

        return;
      }


      try {

        const response = await axios.get(
          `${API_URL}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (
          response.data?.success &&
          response.data?.user
        ) {

          const user = response.data.user;


          // Keep user information synchronized
          localStorage.setItem(
            "dashboard_authenticated",
            "true"
          );

          localStorage.setItem(
            "dashboard_user_id",
            String(user.id)
          );

          localStorage.setItem(
            "dashboard_user_name",
            user.name
          );

          localStorage.setItem(
            "dashboard_user_email",
            user.email
          );


          setIsAuthenticated(true);

        } else {

          handleInvalidAuthentication();

        }

      } catch (error) {

        console.error(
          "Authentication verification failed:",
          error
        );

        handleInvalidAuthentication();

      } finally {

        setAuthChecking(false);

      }

    };


    verifyAuthentication();

  }, []);


  // =========================================================
  // INVALID AUTHENTICATION
  // =========================================================

  const handleInvalidAuthentication = () => {

    localStorage.removeItem(
      "dashboard_access_token"
    );

    localStorage.removeItem(
      "dashboard_authenticated"
    );

    localStorage.removeItem(
      "dashboard_user_id"
    );

    localStorage.removeItem(
      "dashboard_user_name"
    );

    localStorage.removeItem(
      "dashboard_user_email"
    );

    setIsAuthenticated(false);

  };


  // =========================================================
  // SETTINGS LAYOUT
  // =========================================================

  useEffect(() => {

    document.body.setAttribute(
      "data-dashboard-layout",
      settings.layout
    );

  }, [settings.layout]);


  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (
    email: string,
    password: string
  ) => {

    /*
     * Login.tsx has already contacted:
     *
     * POST /auth/login
     *
     * and stored the JWT token.
     *
     * We do NOT store the password.
     */

    if (!email || !password) {
      return;
    }


    const token = localStorage.getItem(
      "dashboard_access_token"
    );


    if (!token) {

      console.error(
        "Login succeeded but no JWT token was found."
      );

      return;

    }


    setIsAuthenticated(true);

    setShowRegister(false);

    setActivePage("Dashboard");

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    // Remove JWT
    localStorage.removeItem(
      "dashboard_access_token"
    );

    // Remove authentication state
    localStorage.removeItem(
      "dashboard_authenticated"
    );

    // Remove user information
    localStorage.removeItem(
      "dashboard_user_id"
    );

    localStorage.removeItem(
      "dashboard_user_name"
    );

    localStorage.removeItem(
      "dashboard_user_email"
    );

    localStorage.removeItem(
      "dashboard_remember_me"
    );


    // Reset application state
    setIsAuthenticated(false);

    setDashboardData(null);

    setActivePage("Dashboard");

    setShowRegister(false);

  };


  // =========================================================
  // AUTHENTICATION CHECK SCREEN
  // =========================================================

  if (authChecking) {

    return (

      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-lg font-semibold">
            Checking authentication...
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            Please wait
          </p>

        </div>

      </div>

    );

  }


  // =========================================================
  // LOGIN / REGISTER SCREEN
  // =========================================================

  if (!isAuthenticated) {

    // -------------------------------------------------------
    // REGISTER
    // -------------------------------------------------------

    if (showRegister) {

      return (

        <Register

          onRegister={() => {

            /*
             * Registration itself is handled by
             * Register.tsx through:
             *
             * POST /auth/register
             *
             * After successful registration,
             * Register.tsx sends the user back
             * to the Login screen through onLogin.
             */

            setShowRegister(false);

          }}

          onLogin={() => {

            setShowRegister(false);

          }}

        />

      );

    }


    // -------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------

    return (

      <Login

        onLogin={handleLogin}

        onRegister={() => {

          setShowRegister(true);

        }}

        onForgotPassword={() => {

          alert(
            "Forgot Password will be connected after authentication setup."
          );

        }}

      />

    );

  }


  // =========================================================
  // PAGE RENDERING
  // =========================================================

  const renderPage = () => {

    switch (activePage) {


      // -----------------------------------------------------
      // DASHBOARD
      // -----------------------------------------------------

      case "Dashboard":

        return (

          <Dashboard
            dashboardData={dashboardData}
            setDashboardData={setDashboardData}
          />

        );


      // -----------------------------------------------------
      // UPLOAD DATA
      // -----------------------------------------------------

      case "Upload Data":

        return (

          <UploadData
            setDashboardData={setDashboardData}
          />

        );


      // -----------------------------------------------------
      // ANALYTICS
      // -----------------------------------------------------

      case "Analytics":

        return (

          <Analytics
            data={dashboardData}
          />

        );


      // -----------------------------------------------------
      // AI INSIGHTS
      // -----------------------------------------------------

      case "AI Insights":

        return (

          <AIInsights
            data={dashboardData}
          />

        );


      // -----------------------------------------------------
      // REPORTS
      // -----------------------------------------------------

      case "Reports":

        return (

          <Reports
            dashboardData={dashboardData}
          />

        );


      // -----------------------------------------------------
      // SETTINGS
      // -----------------------------------------------------

      case "Settings":

        return <Settings />;


      // -----------------------------------------------------
      // DEFAULT
      // -----------------------------------------------------

      default:

        return (

          <Dashboard
            dashboardData={dashboardData}
            setDashboardData={setDashboardData}
          />

        );

    }

  };


  // =========================================================
  // MAIN APPLICATION
  // =========================================================

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        settings.layout === "compact"
          ? "dashboard-compact"
          : "dashboard-comfortable"
      }`}
    >

      <div className="flex min-h-screen bg-slate-950 text-white">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onLogout={handleLogout}
        />


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="min-w-0 flex-1">

          {renderPage()}

        </div>

      </div>

    </div>

  );

}


// =========================================================
// APP ROOT
// =========================================================

function App() {

  return (

    <SettingsProvider>

      <AppContent />

    </SettingsProvider>

  );

}


export default App;