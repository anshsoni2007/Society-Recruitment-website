import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Kanban,
  Award,
  Calendar,
  Users,
  Compass,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SocietyCard } from "@/components/SocietyCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const societies = await prisma.society.findMany({
    take: 6,
    include: {
      _count: {
        select: { applications: true, members: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSocieties = await prisma.society.count();
  const totalApplications = await prisma.application.count();
  const activeSocieties = await prisma.society.count({ where: { isHiring: true } });

  return (
    <div className="flex flex-col space-y-24 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="relative text-center pt-8 pb-12 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* Badge Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-blue-400 mb-6 shadow-inner transition-all duration-200 hover:scale-105 hover:border-blue-400/50 hover:ring-2 hover:ring-blue-500/20 hover:shadow-lg hover:shadow-blue-500/15 cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Fall 2026 Campus Recruitment Season is Live</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          Where Campus Talent Finds Its{" "}
          <span className="text-sky-400">
            Crew
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The all-in-one recruitment ecosystem for university societies. Dynamic forms, visual multi-round Kanban pipelines, panel rubric scorecards, and self-serve interview booking.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/societies"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 border border-blue-400/50 hover:border-blue-300 ring-2 ring-blue-500/30 hover:ring-4 hover:ring-blue-400/40 transition-all duration-200"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Active Societies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 hover:border-indigo-400/60 hover:ring-2 hover:ring-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Society Lead & Reviewer Portal</span>
          </Link>
        </div>

        {/* Metrics Ribbon */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-blue-500/40 hover:ring-1 hover:ring-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{activeSocieties}</div>
            <div className="text-xs text-slate-400 mt-1">Clubs Hiring Now</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-blue-500/40 hover:ring-1 hover:ring-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">{totalApplications}+</div>
            <div className="text-xs text-slate-400 mt-1">Applications Processed</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-indigo-500/40 hover:ring-1 hover:ring-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1">Server-Enforced Deadlines</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-emerald-500/40 hover:ring-1 hover:ring-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 cursor-default">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">4-Stage</div>
            <div className="text-xs text-slate-400 mt-1">Structured Rubrics</div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered Beyond the Minimum Requirements
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Experience why CrewDeck replaces spreadsheets and unorganized chats with an enterprise-grade recruiting workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4 hover:border-blue-500/50 hover:ring-1 hover:ring-blue-400/30 hover:shadow-2xl hover:shadow-blue-500/15 hover:scale-[1.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-inner">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Round Kanban Board</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag-and-drop applicants seamlessly across screening, task challenges, and board interviews with instant toast notifications and stage synchronization.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4 hover:border-purple-500/50 hover:ring-1 hover:ring-purple-400/30 hover:shadow-2xl hover:shadow-purple-500/15 hover:scale-[1.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-inner">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Standardized Rubric Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multiple panel reviewers score candidates across technical competence, communication, and culture fit, aggregating composite candidate metrics.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4 hover:border-emerald-500/50 hover:ring-1 hover:ring-emerald-400/30 hover:shadow-2xl hover:shadow-emerald-500/15 hover:scale-[1.03] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Self-Serve Interview Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No more messy WhatsApp coordination. Shortlisted candidates browse published panel slots and reserve their interview time directly.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Societies Hub */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Active Recruitment Cycles</h2>
            <p className="text-xs text-slate-400">Discover and apply to clubs actively accepting new cohorts</p>
          </div>
          <Link
            href="/societies"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-blue-500/40 hover:bg-blue-500/10 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>View all clubs ({totalSocieties})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {societies.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>
      </section>
    </div>
  );
}
