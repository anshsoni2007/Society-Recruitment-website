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
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-400">
          <UserCheck className="w-4 h-4" />
          <span>Quick 1-Click Demo Login</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo("STUDENT")}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white">Student</div>
            <div className="text-[10px] text-slate-400">Alex Rivera</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("SOCIETY_LEAD")}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white">Society Lead</div>
            <div className="text-[10px] text-slate-400">GDG Organizer</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("REVIEWER")}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white">Reviewer</div>
            <div className="text-[10px] text-slate-400">Devika Nair</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("SUPER_ADMIN")}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors text-xs"
          >
            <div className="font-bold text-white">Super Admin</div>
            <div className="text-[10px] text-slate-400">Dean of Affairs</div>
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
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:shadow-blue-500/25 active:scale-98 transition-all disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In to CrewDeck"}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
