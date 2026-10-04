
import React, { useState } from "react";
import axios from "axios";

interface RegisterProps {
  onLogin?: () => void;
}

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export default function Register({
  onLogin,
}: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    // Basic validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please accept the terms and conditions."
      );
      return;
    }


    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );


      if (response.data?.success) {
        setSuccess(
          "Account created successfully. Redirecting to login..."
        );

        // Give the user a moment to see success message
        setTimeout(() => {
          if (onLogin) {
            onLogin();
          }
        }, 1000);
      }

    } catch (err: any) {

      console.error(
        "Registration error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Unable to create account. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#020617] text-white flex">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

        {/* Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />


        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-2xl font-bold">
                AI
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                AI Business
              </h1>

              <p className="text-slate-400 text-sm">
                Analytics Dashboard
              </p>
            </div>

          </div>


          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Turn Your Data
            <br />
            Into Smart Decisions
          </h2>


          <p className="text-slate-400 text-lg max-w-xl mb-10">
            Create your account and start exploring
            powerful business analytics, AI insights,
            forecasting and professional reports.
          </p>


          {/* Features */}

          <div className="grid grid-cols-2 gap-5 max-w-xl">

            <Feature
              title="Data Analytics"
              description="Understand your business data"
              icon="📊"
            />

            <Feature
              title="AI Insights"
              description="Get intelligent business insights"
              icon="🤖"
            />

            <Feature
              title="Forecasting"
              description="Analyze future trends"
              icon="📈"
            />

            <Feature
              title="Reports"
              description="Generate professional reports"
              icon="📄"
            />

          </div>


          {/* Dashboard preview */}

          <div className="mt-12 bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 max-w-xl backdrop-blur">

            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-xs text-slate-500">
                  BUSINESS OVERVIEW
                </p>

                <p className="font-semibold mt-1">
                  Analytics Dashboard
                </p>
              </div>

              <div className="w-2 h-2 rounded-full bg-green-400" />

            </div>


            <div className="grid grid-cols-3 gap-3">

              <MiniCard
                title="Revenue"
                value="₹8.26L"
              />

              <MiniCard
                title="Orders"
                value="1,248"
              />

              <MiniCard
                title="Growth"
                value="+18.4%"
              />

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">

        <div className="w-full max-w-md">

          {/* Mobile logo */}

          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">

              <span className="font-bold">
                AI
              </span>

            </div>

            <div>

              <p className="font-bold">
                AI Business Analytics
              </p>

              <p className="text-xs text-slate-500">
                Dashboard
              </p>

            </div>

          </div>


          {/* Heading */}

          <div className="mb-8">

            <p className="text-blue-400 text-sm font-medium mb-2">
              GET STARTED
            </p>

            <h2 className="text-3xl font-bold">
              Create your account
            </h2>

            <p className="text-slate-400 mt-2">
              Start managing your business data
              with AI-powered analytics.
            </p>

          </div>


          {/* Card */}

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">


            {/* Error */}

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>
            )}


            {/* Success */}

            {success && (
              <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">

                <p className="text-sm text-green-300">
                  {success}
                </p>

              </div>
            )}


            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  disabled={loading}
                />

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                  disabled={loading}
                />

              </div>


              {/* Password */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 pr-16 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter password again"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 pr-16 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* Terms */}

              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(event) =>
                    setAgreeTerms(
                      event.target.checked
                    )
                  }
                  className="mt-1 w-4 h-4 accent-blue-600"
                  disabled={loading}
                />

                <span className="text-sm text-slate-400 leading-5">
                  I agree to the{" "}
                  <span className="text-blue-400">
                    Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-400">
                    Privacy Policy
                  </span>
                  .
                </span>

              </label>


              {/* Register */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed py-3.5 font-semibold transition shadow-lg shadow-blue-600/20"
              >

                {loading
                  ? "Creating Account..."
                  : "Create Account"}

              </button>

            </form>


            {/* Login */}

            <div className="mt-7 pt-6 border-t border-slate-800 text-center">

              <p className="text-sm text-slate-500">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={onLogin}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Sign in
                </button>

              </p>

            </div>

          </div>


          <p className="text-center text-xs text-slate-600 mt-6">
            AI Business Analytics Dashboard
          </p>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// FEATURE CARD
// =========================================================

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
        {icon}
      </div>

      <div>

        <p className="font-medium text-sm">
          {title}
        </p>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}


// =========================================================
// MINI DASHBOARD CARD
// =========================================================

function MiniCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">

      <p className="text-[10px] text-slate-500">
        {title}
      </p>

      <p className="text-sm font-bold mt-1">
        {value}
      </p>

    </div>
  );
}



// import React, { useState } from "react";
// import axios from "axios";

// interface RegisterProps {
//   onRegister?: (
//     name: string,
//     email: string,
//     password: string
//   ) => void;
//   onLogin?: () => void;
// }

// const API_URL = "http://127.0.0.1:8000";

// export default function Register({
//   onRegister,
//   onLogin,
// }: RegisterProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleRegister = async (
//     event: React.FormEvent<HTMLFormElement>
//   ) => {
//     event.preventDefault();

//     setError("");
//     setSuccess("");

//     // -----------------------------
//     // VALIDATION
//     // -----------------------------

//     const trimmedName = name.trim();
//     const trimmedEmail = email.trim().toLowerCase();

//     if (!trimmedName) {
//       setError("Please enter your full name.");
//       return;
//     }

//     if (!trimmedEmail) {
//       setError("Please enter your email.");
//       return;
//     }

//     if (!password) {
//       setError("Please enter a password.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!agreeTerms) {
//       setError("Please accept the terms and conditions.");
//       return;
//     }

//     // -----------------------------
//     // REGISTER WITH BACKEND
//     // -----------------------------

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         `${API_URL}/auth/register`,
//         {
//           name: trimmedName,
//           email: trimmedEmail,
//           password: password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data?.success) {
//         setSuccess(
//           "Account created successfully. Redirecting to login..."
//         );

//         // Optional parent callback
//         if (onRegister) {
//           onRegister(
//             trimmedName,
//             trimmedEmail,
//             password
//           );
//         }

//         // Clear form
//         setName("");
//         setEmail("");
//         setPassword("");
//         setConfirmPassword("");
//         setAgreeTerms(false);

//         // Go to login
//         setTimeout(() => {
//           if (onLogin) {
//             onLogin();
//           }
//         }, 1200);
//       } else {
//         setError(
//           response.data?.message ||
//             "Unable to create account."
//         );
//       }
//     } catch (err: unknown) {
//       console.error("Registration error:", err);

//       if (axios.isAxiosError(err)) {
//         const backendMessage =
//           err.response?.data?.detail ||
//           err.response?.data?.message;

//         if (backendMessage) {
//           setError(String(backendMessage));
//         } else if (err.code === "ERR_NETWORK") {
//           setError(
//             "Cannot connect to the backend. Make sure FastAPI is running on port 8000."
//           );
//         } else {
//           setError(
//             "Unable to create account. Please try again."
//           );
//         }
//       } else {
//         setError(
//           "Something went wrong. Please try again."
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] text-white flex">
//       {/* =====================================================
//           LEFT SIDE
//       ===================================================== */}

//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

//         <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
//           {/* Logo */}

//           <div className="flex items-center gap-4 mb-10">
//             <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
//               <span className="text-2xl font-bold">
//                 AI
//               </span>
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold">
//                 AI Business
//               </h1>

//               <p className="text-slate-400 text-sm">
//                 Analytics Dashboard
//               </p>
//             </div>
//           </div>

//           <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
//             Turn Your Data
//             <br />
//             Into Smart Decisions
//           </h2>

//           <p className="text-slate-400 text-lg max-w-xl mb-10">
//             Create your account and start exploring
//             powerful business analytics, AI insights,
//             forecasting and professional reports.
//           </p>

//           {/* Features */}

//           <div className="grid grid-cols-2 gap-5 max-w-xl">
//             <Feature
//               title="Data Analytics"
//               description="Understand your business data"
//               icon="📊"
//             />

//             <Feature
//               title="AI Insights"
//               description="Get intelligent business insights"
//               icon="🤖"
//             />

//             <Feature
//               title="Forecasting"
//               description="Analyze future trends"
//               icon="📈"
//             />

//             <Feature
//               title="Reports"
//               description="Generate professional reports"
//               icon="📄"
//             />
//           </div>

//           {/* Dashboard Preview */}

//           <div className="mt-12 bg-slate-900/70 border border-slate-700/60 rounded-2xl p-5 max-w-xl backdrop-blur">
//             <div className="flex items-center justify-between mb-5">
//               <div>
//                 <p className="text-xs text-slate-500">
//                   BUSINESS OVERVIEW
//                 </p>

//                 <p className="font-semibold mt-1">
//                   Analytics Dashboard
//                 </p>
//               </div>

//               <div className="w-2 h-2 rounded-full bg-green-400" />
//             </div>

//             <div className="grid grid-cols-3 gap-3">
//               <MiniCard
//                 title="Revenue"
//                 value="₹8.26L"
//               />

//               <MiniCard
//                 title="Orders"
//                 value="1,248"
//               />

//               <MiniCard
//                 title="Growth"
//                 value="+18.4%"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           RIGHT SIDE
//       ===================================================== */}

//       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
//         <div className="w-full max-w-md">
//           {/* Mobile Logo */}

//           <div className="lg:hidden flex items-center gap-3 mb-8">
//             <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
//               <span className="font-bold">
//                 AI
//               </span>
//             </div>

//             <div>
//               <p className="font-bold">
//                 AI Business Analytics
//               </p>

//               <p className="text-xs text-slate-500">
//                 Dashboard
//               </p>
//             </div>
//           </div>

//           {/* Heading */}

//           <div className="mb-8">
//             <p className="text-blue-400 text-sm font-medium mb-2">
//               GET STARTED
//             </p>

//             <h2 className="text-3xl font-bold">
//               Create your account
//             </h2>

//             <p className="text-slate-400 mt-2">
//               Start managing your business data
//               with AI-powered analytics.
//             </p>
//           </div>

//           {/* Card */}

//           <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
//             {/* Error */}

//             {error && (
//               <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
//                 <p className="text-sm text-red-300">
//                   {error}
//                 </p>
//               </div>
//             )}

//             {/* Success */}

//             {success && (
//               <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
//                 <p className="text-sm text-green-300">
//                   {success}
//                 </p>
//               </div>
//             )}

//             <form
//               onSubmit={handleRegister}
//               className="space-y-5"
//             >
//               {/* Name */}

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Full Name
//                 </label>

//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(event) =>
//                     setName(event.target.value)
//                   }
//                   placeholder="Enter your full name"
//                   className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                   disabled={loading}
//                 />
//               </div>

//               {/* Email */}

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Email Address
//                 </label>

//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(event) =>
//                     setEmail(event.target.value)
//                   }
//                   placeholder="you@example.com"
//                   className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                   disabled={loading}
//                 />
//               </div>

//               {/* Password */}

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Password
//                 </label>

//                 <div className="relative">
//                   <input
//                     type={
//                       showPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={password}
//                     onChange={(event) =>
//                       setPassword(event.target.value)
//                     }
//                     placeholder="Minimum 6 characters"
//                     className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 pr-16 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                     disabled={loading}
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowPassword(
//                         (previous) => !previous
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
//                   >
//                     {showPassword
//                       ? "Hide"
//                       : "Show"}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}

//               <div>
//                 <label className="block text-sm font-medium text-slate-300 mb-2">
//                   Confirm Password
//                 </label>

//                 <div className="relative">
//                   <input
//                     type={
//                       showConfirmPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={confirmPassword}
//                     onChange={(event) =>
//                       setConfirmPassword(
//                         event.target.value
//                       )
//                     }
//                     placeholder="Enter password again"
//                     className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 pr-16 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
//                     disabled={loading}
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowConfirmPassword(
//                         (previous) => !previous
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
//                   >
//                     {showConfirmPassword
//                       ? "Hide"
//                       : "Show"}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms */}

//               <label className="flex items-start gap-3 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={agreeTerms}
//                   onChange={(event) =>
//                     setAgreeTerms(
//                       event.target.checked
//                     )
//                   }
//                   className="mt-1 w-4 h-4 accent-blue-600"
//                   disabled={loading}
//                 />

//                 <span className="text-sm text-slate-400 leading-5">
//                   I agree to the{" "}
//                   <span className="text-blue-400">
//                     Terms & Conditions
//                   </span>{" "}
//                   and{" "}
//                   <span className="text-blue-400">
//                     Privacy Policy
//                   </span>
//                   .
//                 </span>
//               </label>

//               {/* Register Button */}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed py-3.5 font-semibold transition shadow-lg shadow-blue-600/20"
//               >
//                 {loading
//                   ? "Creating Account..."
//                   : "Create Account"}
//               </button>
//             </form>

//             {/* Login */}

//             <div className="mt-7 pt-6 border-t border-slate-800 text-center">
//               <p className="text-sm text-slate-500">
//                 Already have an account?{" "}
//                 <button
//                   type="button"
//                   onClick={onLogin}
//                   className="text-blue-400 hover:text-blue-300 font-medium"
//                 >
//                   Sign in
//                 </button>
//               </p>
//             </div>
//           </div>

//           <p className="text-center text-xs text-slate-600 mt-6">
//             AI Business Analytics Dashboard
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// // ============================================================
// // FEATURE
// // ============================================================

// function Feature({
//   title,
//   description,
//   icon,
// }: {
//   title: string;
//   description: string;
//   icon: string;
// }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
//         {icon}
//       </div>

//       <div>
//         <p className="font-medium text-sm">
//           {title}
//         </p>

//         <p className="text-xs text-slate-500 mt-1">
//           {description}
//         </p>
//       </div>
//     </div>
//   );
// }


// // ============================================================
// // MINI DASHBOARD CARD
// // ============================================================

// function MiniCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
//       <p className="text-[10px] text-slate-500">
//         {title}
//       </p>

//       <p className="text-sm font-bold mt-1">
//         {value}
//       </p>
//     </div>
//   );
// }


