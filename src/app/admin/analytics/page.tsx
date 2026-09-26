"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Building2,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function RecruitmentAnalyticsPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-44 bg-slate-900 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-900 rounded-3xl" />
          <div className="h-80 bg-slate-900 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { metrics, funnel, statusDistribution, categoryBreakdown } = data;
  const chartColors = theme === "light"
    ? { grid: "#94a3b8", axis: "#334155", muted: "#475569", tooltipBackground: "#ffffff", tooltipBorder: "#64748b", tooltipText: "#0f172a" }
    : { grid: "#1e293b", axis: "#94a3b8", muted: "#64748b", tooltipBackground: "#0f172a", tooltipBorder: "#334155", tooltipText: "#f8fafc" };
  const tooltipStyle = { backgroundColor: chartColors.tooltipBackground, borderColor: chartColors.tooltipBorder, borderRadius: "12px", fontSize: "12px", color: chartColors.tooltipText };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <span>Campus Recruitment Intelligence</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold">
            Analytics Suite
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Conversion funnels, applicant distribution across campus departments, and club induction statistics.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-md space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Total Applications</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {metrics.totalApplications}
          </div>
          <p className="text-[10px] text-slate-500">Across active clubs</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-md space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Total Inductions</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {metrics.acceptedCount}
          </div>
          <p className="text-[10px] text-slate-500">{metrics.acceptanceRate}% acceptance rate</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-md space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Active Societies</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">
            {metrics.activeRecruitments} / {metrics.totalSocieties}
          </div>
          <p className="text-[10px] text-slate-500">Recruiting cohorts</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl backdrop-blur-md space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Registered Talent</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {metrics.totalStudents}
          </div>
          <p className="text-[10px] text-slate-500">Enrolled student profiles</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Funnel */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Recruitment Conversion Funnel</span>
            </h3>
            <span className="text-[10px] text-slate-400">Stage attrition analysis</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel} layout="vertical" margin={{ left: 30, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis type="number" stroke={chartColors.muted} tick={{ fontSize: 11, fill: chartColors.muted }} />
                <YAxis dataKey="stage" type="category" stroke={chartColors.axis} tick={{ fontSize: 11, fill: chartColors.axis }} width={120} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: chartColors.tooltipText, fontWeight: 700 }}
                  itemStyle={{ color: chartColors.tooltipText }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnel.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/80 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Application Volume by Category</h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="applications"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent, x, y }: any) => (
                    <text x={x} y={y} fill={theme === "light" ? "#334155" : "#e2e8f0"} fontSize={12} fontWeight={700} textAnchor={x > 250 ? "start" : "end"}>
                      {`${name.slice(0, 4)}: ${(percent * 100).toFixed(0)}%`}
                    </text>
                  )}
                  labelLine={false}
                >
                  {categoryBreakdown.map((entry: any, index: number) => {
                    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#f472b6", "#fbbf24"];
                    return <Cell key={`pie-cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: chartColors.tooltipText, fontWeight: 700 }}
                  itemStyle={{ color: chartColors.tooltipText }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
