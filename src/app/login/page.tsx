"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Sparkles, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login(email, password);
    if (res.success) {
      router.push("/societies");
    } else {
      setError(res.error || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "STUDENT" | "SOCIETY_LEAD" | "REVIEWER" | "SUPER_ADMIN") => {
    setLoading(true);
    await switchDemoRole(role);
    if (role === "STUDENT") {
      router.push("/dashboard/applications");
    } else if (role === "SOCIETY_LEAD" || role === "REVIEWER") {
      router.push("/societies");
    } else {
      router.push("/admin/analytics");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Sign In to CrewDeck
        </h1>
        <p className="text-xs text-slate-400">
          Access your applicant dashboard, society pipelines, or panel rubric reviews.
        </p>
      </div>

      {/* Quick Demo Accounts Helper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
          <UserCheck className="w-4 h-4" />
          <span>Quick 1-Click Demo Login</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickDemo("STUDENT")}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 hover:ring-2 hover:ring-blue-500/25 hover:shadow-lg hover:shadow-blue-500/15 hover:scale-105 active:scale-95 text-left transition-all duration-200 text-xs"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>Student</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="text-[10px] text-slate-400">Ayaan Khanna</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("SOCIETY_LEAD")}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/60 hover:ring-2 hover:ring-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/15 hover:scale-105 active:scale-95 text-left transition-all duration-200 text-xs"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>Society Lead</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
            <div className="text-[10px] text-slate-400">GDG Organizer</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("REVIEWER")}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/60 hover:ring-2 hover:ring-purple-500/25 hover:shadow-lg hover:shadow-purple-500/15 hover:scale-105 active:scale-95 text-left transition-all duration-200 text-xs"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>Reviewer</span>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
            </div>
            <div className="text-[10px] text-slate-400">Rhea Khanna</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("SUPER_ADMIN")}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-pink-500/60 hover:ring-2 hover:ring-pink-500/25 hover:shadow-lg hover:shadow-pink-500/15 hover:scale-105 active:scale-95 text-left transition-all duration-200 text-xs"
          >
            <div className="font-bold text-white flex items-center justify-between">
              <span>Super Admin</span>
              <span className="w-2 h-2 rounded-full bg-pink-500" />
            </div>
            <div className="text-[10px] text-slate-400">Dr. Rakesh Malhotra</div>
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-2xl"
      >
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            University Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@campus.edu"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 border border-blue-400/40 ring-1 ring-blue-400/30 hover:ring-2 hover:ring-blue-400/60 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In to CrewDeck"}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-blue-400 hover:underline hover:text-blue-300">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
