"use client";

import React, { useState } from "react";
import { Star, X, Check, Award, AlertCircle } from "lucide-react";

interface RubricScoreModalProps {
  applicationId: string;
  applicantName: string;
  existingEvaluation?: any;
  onClose: () => void;
  onSaved: (evalData: any) => void;
}

export function RubricScoreModal({
  applicationId,
  applicantName,
  existingEvaluation,
  onClose,
  onSaved,
}: RubricScoreModalProps) {
  const initialCriteria = existingEvaluation?.criteriaScores
    ? (typeof existingEvaluation.criteriaScores === "string"
        ? JSON.parse(existingEvaluation.criteriaScores)
        : existingEvaluation.criteriaScores)
    : {
        technical: 7,
        communication: 8,
        cultureFit: 8,
        problemSolving: 7,
      };

  const [criteria, setCriteria] = useState<Record<string, number>>(initialCriteria);
  const [overallRating, setOverallRating] = useState<number>(existingEvaluation?.overallRating || 8);
  const [feedback, setFeedback] = useState<string>(existingEvaluation?.feedback || "");
  const [recommendation, setRecommendation] = useState<string>(existingEvaluation?.recommendation || "YES");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criteriaList = [
    { key: "technical", label: "Technical Competence & Domain Knowledge", desc: "Understanding of core tools, logic, and prior project complexity." },
    { key: "communication", label: "Communication & Articulation", desc: "Clarity in conveying thoughts, ideas, and answering questions." },
    { key: "cultureFit", label: "Teamwork & Cultural Alignment", desc: "Enthusiasm, collaborative mindset, and willingness to contribute." },
    { key: "problemSolving", label: "Problem Solving & Critical Thinking", desc: "Approach towards open-ended scenarios or live challenge questions." },
  ];

  const handleScoreChange = (key: string, val: number) => {
    const updated = { ...criteria, [key]: val };
    setCriteria(updated);

    // Calculate auto average for overall recommendation baseline
    const avg = Math.round(
      Object.values(updated).reduce((a, b) => a + b, 0) / Object.values(updated).length
    );
    setOverallRating(avg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Please write qualitative feedback/notes for other panel reviewers.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${applicationId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          criteriaScores: criteria,
          overallRating,
          feedback,
          recommendation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit evaluation");
        return;
      }

      onSaved(data.evaluation);
      onClose();
    } catch {
      setError("Network error while submitting evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Candidate Rubric Scorecard
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating candidate: <span className="text-purple-300 font-semibold">{applicantName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Criteria Sliders */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluation Criteria (Scale: 1 to 10)
            </h4>

            <div className="space-y-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              {criteriaList.map((item) => {
                const score = criteria[item.key] || 5;
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{item.label}</span>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                      <div className="flex items-center space-x-1 font-mono font-bold text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                        <span>{score}</span>
                        <span className="text-[10px] text-slate-500">/10</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={score}
                      onChange={(e) => handleScoreChange(item.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Rating & Recommendation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Overall Composite Rating (1-10)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={overallRating}
                  onChange={(e) => setOverallRating(parseInt(e.target.value) || 1)}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold font-mono text-center focus:outline-none focus:border-purple-500"
                />
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(overallRating / 2) ? "fill-amber-400" : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Panel Recommendation
              </label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-purple-500"
              >
                <option value="STRONG_YES">🟢 Strong Yes (Top Priority Hire)</option>
                <option value="YES">🔵 Yes (Qualified Candidate)</option>
                <option value="MAYBE">🟡 Maybe (Waitlist / Backup)</option>
                <option value="NO">🔴 No (Does Not Meet Threshold)</option>
              </select>
            </div>
          </div>

          {/* Written Feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Reviewer Notes & Constructive Feedback <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Detail candidate strengths, project depth, communication style, or potential red flags..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              {submitting ? (
                <span>Saving Score...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Submit Scorecard</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
