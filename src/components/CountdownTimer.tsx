"use client";

import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { getRemainingTime } from "@/lib/utils";

interface CountdownTimerProps {
  deadline: string | Date;
  compact?: boolean;
}

export function CountdownTimer({ deadline, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getRemainingTime(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.isPassed) {
    return (
      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-semibold ${compact ? "text-[11px]" : "text-xs"}`}>
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>Deadline Expired</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold">
        <Clock className="w-3 h-3 shrink-0 animate-pulse" />
        <span>
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
          {timeLeft.hours}h {timeLeft.minutes}m left
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-inner">
      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
        <Clock className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          Application Deadline Countdown
        </span>
        <div className="flex items-baseline space-x-2 text-white font-extrabold text-sm sm:text-base font-mono">
          <div>
            <span className="text-amber-400 text-lg">{timeLeft.days}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">days</span>
          </div>
          <span className="text-slate-600">:</span>
          <div>
            <span className="text-amber-400 text-lg">{timeLeft.hours}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">hrs</span>
          </div>
          <span className="text-slate-600">:</span>
          <div>
            <span className="text-amber-400 text-lg">{timeLeft.minutes}</span>
            <span className="text-[10px] text-slate-400 ml-0.5">min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
