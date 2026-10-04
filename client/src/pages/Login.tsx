

import React, { useState } from "react";
import axios from "axios";

interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
}

const API_URL = "http://127.0.0.1:8000";

export default function Login({
  onLogin,
  onRegister,
  onForgotPassword,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(true);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ========================================================
  // LOGIN
  // ========================================================

  const handleLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      if (!response.data?.success) {
        setError("Login failed. Please try again.");
        return;
      }

      const user = response.data.user;
      const accessToken =
        response.data.access_token;

      if (!accessToken) {
        setError(
          "Authentication token was not received from the server."
        );
        return;
      }


      // ====================================================
      // SAVE AUTHENTICATION INFORMATION
      // ====================================================

      /*
       * Store the JWT token.
       *
       * IMPORTANT:
       * We never store the password.
       */

      localStorage.setItem(
        "dashboard_access_token",
        accessToken
      );

      localStorage.setItem(
        "dashboard_authenticated",
        "true"
      );

      localStorage.setItem(
        "dashboard_user_name",
        user.name
      );

      localStorage.setItem(
        "dashboard_user_email",
        user.email
      );

      localStorage.setItem(
        "dashboard_user_id",
        String(user.id)
      );


      // Remember-me preference

      if (rememberMe) {
        localStorage.setItem(
          "dashboard_remember_me",
          "true"
        );
      } else {
        localStorage.removeItem(
          "dashboard_remember_me"
        );
      }


      // Notify App.tsx

      if (onLogin) {
        onLogin(
          user.email,
          password
        );
      }

    } catch (err: any) {

      console.error(
        "Login error:",
        err
      );

      const message =
        err?.response?.data?.detail ||
        "Invalid email or password.";

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

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

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

            Analyze your business data with
            powerful analytics, AI insights,
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


          {/* Dashboard Preview */}

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

          {/* Mobile Logo */}

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
              WELCOME BACK
            </p>

            <h2 className="text-3xl font-bold">
              Sign in to your account
            </h2>

            <p className="text-slate-400 mt-2">
              Continue to your business analytics
              dashboard.
            </p>

          </div>


          {/* Login Card */}

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">

            {/* Error */}

            {error && (
              <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">

                <p className="text-sm text-red-300">
                  {error}
                </p>

              </div>
            )}


            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

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
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

              </div>


              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>

                </div>


                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 pr-16 text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
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


              {/* Remember Me */}

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  disabled={loading}
                  className="w-4 h-4 accent-blue-600"
                />

                <span className="text-sm text-slate-400">
                  Remember me
                </span>

              </label>


              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed py-3.5 font-semibold transition shadow-lg shadow-blue-600/20"
              >

                {loading
                  ? "Signing in..."
                  : "Sign In"}

              </button>

            </form>


            {/* Register */}

            <div className="mt-7 pt-6 border-t border-slate-800 text-center">

              <p className="text-sm text-slate-500">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={onRegister}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create Account
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
// FEATURE
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
// MINI CARD
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