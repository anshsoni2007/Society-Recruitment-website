import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string | number) {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDeadlinePassed(deadline: Date | string) {
  return new Date(deadline).getTime() < Date.now();
}

export function getRemainingTime(deadline: Date | string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPassed: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isPassed: false };
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  TECHNICAL: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  CULTURAL: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  SPORTS: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  LITERARY: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  SOCIAL_INITIATIVE: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  ACADEMIC: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  SUBMITTED: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30" },
  UNDER_REVIEW: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  ROUND_ADVANCED: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  INTERVIEW_SCHEDULED: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  ACCEPTED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  WITHDRAWN: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" },
};
