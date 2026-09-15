"use client";

import React, { useState } from "react";
import {
  Users,
  ChevronRight,
  Star,
  Award,
  ExternalLink,
  Github,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { STATUS_COLORS } from "@/lib/utils";
import { RubricScoreModal } from "./RubricScoreModal";

interface KanbanBoardProps {
  societyId: string;
  applications: any[];
  rounds: any[];
  onStatusUpdated: () => void;
}

export function KanbanBoard({
  societyId,
  applications,
  rounds,
  onStatusUpdated,
}: KanbanBoardProps) {
  const [selectedAppForScoring, setSelectedAppForScoring] = useState<any | null>(null);
  const [activeDetailApp, setActiveDetailApp] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const columns = [
    {
      id: "SUBMITTED",
      title: "Round 1: Screening",
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      filter: (a: any) => a.status === "SUBMITTED",
    },
    {
      id: "ROUND_ADVANCED",
      title: "Round 2: Technical Task",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      filter: (a: any) => a.status === "ROUND_ADVANCED" || a.status === "UNDER_REVIEW",
    },
    {
      id: "INTERVIEW_SCHEDULED",
      title: "Round 3: Panel Interview",
      badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      filter: (a: any) => a.status === "INTERVIEW_SCHEDULED",
    },
    {
      id: "ACCEPTED",
      title: "Inducted / Accepted 🌟",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      filter: (a: any) => a.status === "ACCEPTED",
    },
    {
      id: "REJECTED",
      title: "Archived / Rejected",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/20",
      filter: (a: any) => a.status === "REJECTED",
    },
  ];

  const handleUpdateStatus = async (appId: string, newStatus: string, roundId?: string) => {
    setUpdatingId(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, roundId }),
      });
      if (res.ok) {
        onStatusUpdated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-6">
        {columns.map((col) => {
          const appsInCol = applications.filter(col.filter);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800/80 min-h-[500px] overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <span className="font-bold text-xs text-white truncate max-w-[170px]">
                  {col.title}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
                  {appsInCol.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {appsInCol.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-600 text-xs text-center p-4">
                    <span>No candidates in this stage</span>
                  </div>
                ) : (
                  appsInCol.map((app) => {
                    const avgScore =
                      app.evaluations?.length > 0
                        ? (
                            app.evaluations.reduce((acc: number, e: any) => acc + e.overallRating, 0) /
                            app.evaluations.length
                          ).toFixed(1)
                        : null;

                    return (
                      <div
                        key={app.id}
                        className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 hover:border-slate-700 hover:shadow-lg transition-all space-y-3"
                      >
                        {/* Student Profile Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={
                                app.student.avatarUrl ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar"
                              }
                              alt={app.student.fullName}
                              className="w-7 h-7 rounded-full bg-slate-800"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                                {app.student.fullName}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                                {app.student.department || app.student.email}
                              </p>
                            </div>
                          </div>

                          {avgScore && (
                            <div className="flex items-center space-x-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{avgScore}</span>
                            </div>
                          )}
                        </div>

                        {/* Interview Details if Scheduled */}
                        {app.interview?.slot && (
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-2 text-[10px] text-purple-300 flex items-center space-x-1.5">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {new Date(app.interview.slot.startTime).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        )}

                        {/* Links & Rubric Trigger */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <div className="flex items-center space-x-2">
                            {app.githubUrl && (
                              <a
                                href={app.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-white"
                                title="GitHub Profile"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setActiveDetailApp(app)}
                              className="text-slate-400 hover:text-blue-400 text-[10px] flex items-center space-x-0.5"
                              title="View Application Details"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Answers</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setSelectedAppForScoring(app)}
                            className="text-[10px] font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2 py-0.5 rounded-lg flex items-center space-x-1 transition-colors"
                          >
                            <Award className="w-3 h-3" />
                            <span>Score</span>
                          </button>
                        </div>

                        {/* Quick Stage Progression Buttons */}
                        <div className="pt-2 flex items-center space-x-1 border-t border-slate-800/80">
                          {col.id === "SUBMITTED" && (
                            <>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "ROUND_ADVANCED")}
                                className="flex-1 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 transition-colors"
                              >
                                Advance ➔
                              </button>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/20 transition-colors"
                              >
                                ✕
                              </button>
                            </>
                          )}

                          {col.id === "ROUND_ADVANCED" && (
                            <>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "INTERVIEW_SCHEDULED")}
                                className="flex-1 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-[10px] font-bold border border-purple-500/30 transition-colors"
                              >
                                Call Interview ➔
                              </button>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/20 transition-colors"
                              >
                                ✕
                              </button>
                            </>
                          )}

                          {col.id === "INTERVIEW_SCHEDULED" && (
                            <>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                                className="flex-1 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-colors"
                              >
                                Accept & Induct 🌟
                              </button>
                              <button
                                disabled={updatingId === app.id}
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/20 transition-colors"
                              >
                                ✕
                              </button>
                            </>
                          )}

                          {col.id === "REJECTED" && (
                            <button
                              disabled={updatingId === app.id}
                              onClick={() => handleUpdateStatus(app.id, "SUBMITTED")}
                              className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                            >
                              Restore to Screening
                            </button>
                          )}

                          {col.id === "ACCEPTED" && (
                            <div className="w-full text-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">
                              Inducted Member
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Scoring Modal */}
      {selectedAppForScoring && (
        <RubricScoreModal
          applicationId={selectedAppForScoring.id}
          applicantName={selectedAppForScoring.student.fullName}
          existingEvaluation={selectedAppForScoring.evaluations?.[0]}
          onClose={() => setSelectedAppForScoring(null)}
          onSaved={() => {
            onStatusUpdated();
          }}
        />
      )}

      {/* Application Details Slide-in / Modal */}
      {activeDetailApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Application Responses: {activeDetailApp.student.fullName}
              </h3>
              <button
                onClick={() => setActiveDetailApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-white font-mono">{activeDetailApp.student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Roll Number:</span>
                  <span className="text-white font-mono">{activeDetailApp.student.rollNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="text-white">{activeDetailApp.student.department || "N/A"}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                  Form Question Responses
                </h4>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  {activeDetailApp.responses ? (
                    Object.entries(
                      typeof activeDetailApp.responses === "string"
                        ? JSON.parse(activeDetailApp.responses)
                        : activeDetailApp.responses
                    ).map(([k, v]: [string, any], idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-slate-500 font-semibold text-[11px]">Field {idx + 1}:</span>
                        <p className="text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                          {String(v)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-500">No responses recorded</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
