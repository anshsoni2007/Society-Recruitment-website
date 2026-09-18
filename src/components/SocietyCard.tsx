import React from "react";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { CATEGORY_COLORS, formatDate, isDeadlinePassed } from "@/lib/utils";
import { CountdownTimer } from "./CountdownTimer";

interface SocietyCardProps {
  society: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    category: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    deadline: string | Date;
    isHiring: boolean;
    capacity: number;
    _count?: {
      applications: number;
      members: number;
    };
  };
}

export function SocietyCard({ society }: SocietyCardProps) {
  const catStyle = CATEGORY_COLORS[society.category] || CATEGORY_COLORS.TECHNICAL;
  const expired = isDeadlinePassed(society.deadline);
  const isOpen = society.isHiring && !expired;

  return (
    <div className="group relative flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-xl hover:border-blue-500/40 hover:ring-1 hover:ring-blue-400/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      {/* Card Banner Image */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-800">
        <img
          src={society.bannerUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"}
          alt={society.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Category Badge & Status Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-sm ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
            {society.category.replace("_", " ")}
          </span>

          {isOpen ? (
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              <span>Hiring Active</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md">
              <XCircle className="w-3 h-3" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Logo Avatar */}
        <div className="absolute -bottom-5 left-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 p-1 border-2 border-slate-700 shadow-xl overflow-hidden group-hover:border-blue-500/50 group-hover:ring-2 group-hover:ring-blue-400/30 transition-all duration-300">
            <img
              src={society.logoUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80"}
              alt={society.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col p-6 pt-8 space-y-3">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {society.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {society.tagline}
          </p>
        </div>

        {/* Countdown & Stats */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
          <CountdownTimer deadline={society.deadline} compact />

          <div className="flex items-center space-x-1 text-slate-400 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{society._count?.applications || 0} applied</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <Link
            href={`/societies/${society.slug || society.id}`}
            className="society-card-action w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800/90 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:border-blue-400/50 hover:ring-2 hover:ring-blue-400/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-700/80"
          >
            <span>{isOpen ? "View & Apply" : "View Club Details"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
