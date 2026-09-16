"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Sparkles,
  ArrowRight,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { STATUS_COLORS, formatDateTime, formatDate, isDeadlinePassed } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { InterviewBookingModal } from "@/components/InterviewBookingModal";

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingApp, setBookingApp] = useState<any | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications/my");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const handleWithdraw = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }

    setWithdrawingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to withdraw");
      }
    } catch {
      alert("Network error while withdrawing application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>My Recruitment Applications</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-semibold">
              {applications.length} Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stage tracking, interview invitations, and status logs across all your applied societies.
          </p>
        </div>

        <Link
          href="/societies"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <span>Apply to More Societies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Active Applications</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven&apos;t submitted any society recruitment applications yet. Explore the catalog to discover clubs hiring now.
          </p>
          <Link
            href="/societies"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
          >
            <span>Browse Campus Societies</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.SUBMITTED;
            const canWithdraw = !isDeadlinePassed(app.society.deadline) && app.status !== "ACCEPTED" && app.status !== "REJECTED";
            const needsInterviewBooking = app.status === "INTERVIEW_SCHEDULED" && !app.interview;

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all space-y-5"
              >
                {/* Top Society Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={app.society.logoUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80"}
                      alt={app.society.name}
                      className="w-12 h-12 rounded-2xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                    />
                    <div>
                      <Link
                        href={`/societies/${app.society.slug || app.society.id}`}
                        className="text-base font-bold text-white hover:text-blue-400 transition-colors inline-flex items-center space-x-1"
                      >
                        <span>{app.society.name}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>Applied on {formatDate(app.submittedAt)}</span>
                        <span>•</span>
                        <span className="text-slate-500">{app.society.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {/* Visual Stage Progression Timeline */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto text-[10px]">
                        ✓
                      </div>
                      <span className="font-bold text-white text-[11px]">Submitted</span>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-5 h-5 rounded-full font-bold flex items-center justify-center mx-auto text-[10px] ${
                          app.status === "ROUND_ADVANCED" || app.status === "INTERVIEW_SCHEDULED" || app.status === "ACCEPTED"
                            ? "bg-emerald-500 text-white"
                            : app.status === "UNDER_REVIEW"
                            ? "bg-amber-500 text-white animate-pulse"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {app.status === "ROUND_ADVANCED" || app.status === "INTERVIEW_SCHEDULED" || app.status === "ACCEPTED" ? "✓" : "2"}
                      </div>
                      <span className={`font-semibold text-[11px] ${app.status !== "SUBMITTED" ? "text-white" : "text-slate-500"}`}>
                        Technical Review
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-5 h-5 rounded-full font-bold flex items-center justify-center mx-auto text-[10px] ${
                          app.status === "INTERVIEW_SCHEDULED" || app.status === "ACCEPTED"
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {app.status === "ACCEPTED" ? "✓" : "3"}
                      </div>
                      <span className={`font-semibold text-[11px] ${app.status === "INTERVIEW_SCHEDULED" || app.status === "ACCEPTED" ? "text-white" : "text-slate-500"}`}>
                        Panel Interview
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div
                        className={`w-5 h-5 rounded-full font-bold flex items-center justify-center mx-auto text-[10px] ${
                          app.status === "ACCEPTED"
                            ? "bg-emerald-500 text-white"
                            : app.status === "REJECTED"
                            ? "bg-red-500 text-white"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {app.status === "ACCEPTED" ? "★" : app.status === "REJECTED" ? "✕" : "4"}
                      </div>
                      <span className={`font-semibold text-[11px] ${app.status === "ACCEPTED" ? "text-emerald-400 font-bold" : app.status === "REJECTED" ? "text-red-400" : "text-slate-500"}`}>
                        {app.status === "ACCEPTED" ? "Inducted!" : app.status === "REJECTED" ? "Closed" : "Decision"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interview Booking Callout if Scheduled */}
                {app.status === "INTERVIEW_SCHEDULED" && (
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-300">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span>Interview Call Invitation</span>
                      </div>
                      {app.interview?.slot ? (
                        <p className="text-xs text-slate-300">
                          Your slot is booked for <strong>{formatDateTime(app.interview.slot.startTime)}</strong> at <strong>{app.interview.slot.location}</strong>.
                        </p>
                      ) : (
                        <p className="text-xs text-slate-300">
                          You are shortlisted! Please pick your preferred interview time slot from the published calendar.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => setBookingApp(app)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95 border border-purple-400/40 ring-1 ring-purple-400/30 hover:ring-2 hover:ring-purple-400/60 text-white font-bold text-xs transition-all duration-200 shrink-0"
                    >
                      {app.interview ? "Change Interview Slot" : "Book Interview Slot ➔"}
                    </button>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-500">
                    Application ID: <span className="font-mono">{app.id.slice(0, 8)}...</span>
                  </span>

                  {canWithdraw && (
                    <button
                      disabled={withdrawingId === app.id}
                      onClick={() => handleWithdraw(app.id)}
                      className="text-slate-500 hover:text-red-400 flex items-center space-x-1 transition-colors"
                      title="Withdraw before deadline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Withdraw Application</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interview Slot Booking Modal */}
      {bookingApp && (
        <InterviewBookingModal
          applicationId={bookingApp.id}
          societyName={bookingApp.society.name}
          availableSlots={bookingApp.society.interviewSlots || []}
          onClose={() => setBookingApp(null)}
          onBooked={() => {
            fetchMyApplications();
          }}
        />
      )}
    </div>
  );
}
