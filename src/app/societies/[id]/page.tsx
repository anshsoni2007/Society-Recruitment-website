"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Send,
  Github,
  Globe,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { CATEGORY_COLORS, formatDate, formatDateTime, isDeadlinePassed } from "@/lib/utils";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useAuth } from "@/context/AuthContext";

export default function SocietyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [society, setSociety] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [resumeUrl, setResumeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchSociety = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/societies/${id}`);
      if (!res.ok) {
        setError("Society not found or unavailable.");
        return;
      }
      const data = await res.json();
      setSociety(data.society);
    } catch {
      setError("Network error loading society.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSociety();
  }, [id]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/societies/${id}`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/societies/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responses: formData,
          resumeUrl,
          githubUrl,
          portfolioUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit application.");
        return;
      }

      setSubmitSuccess(true);
    } catch {
      setSubmitError("Failed to submit application due to a network error.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-64 bg-slate-900 rounded-3xl" />
        <div className="h-32 bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  if (error || !society) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">{error || "Society Not Found"}</h2>
        <Link
          href="/societies"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Societies</span>
        </Link>
      </div>
    );
  }

  const catStyle = CATEGORY_COLORS[society.category] || CATEGORY_COLORS.TECHNICAL;
  const expired = isDeadlinePassed(society.deadline);
  const isOpen = society.isHiring && !expired;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Back Button */}
      <Link
        href="/societies"
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Societies Catalog</span>
      </Link>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="relative h-60 sm:h-72 w-full bg-slate-800">
          <img
            src={society.bannerUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"}
            alt={society.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              {society.category.replace("_", " ")}
            </span>

            {isOpen ? (
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recruitment Open</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md">
                <XCircle className="w-3.5 h-3.5" />
                <span>Applications Closed</span>
              </span>
            )}
          </div>

          {/* Logo & Header Info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-900 p-1.5 border-2 border-slate-700 shadow-2xl overflow-hidden shrink-0">
                <img
                  src={society.logoUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=150&auto=format&fit=crop&q=80"}
                  alt={society.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {society.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {society.tagline}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            {society.websiteUrl && (
              <a
                href={society.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl backdrop-blur-md transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Official Website</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Sub-bar with Timer & Stats */}
        <div className="p-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CountdownTimer deadline={society.deadline} />

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block">Total Applicants</span>
              <span className="font-mono font-bold text-white text-sm">
                {society._count?.applications || 0} candidates
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Target Cohort</span>
              <span className="font-mono font-bold text-white text-sm">
                {society.capacity} seats
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Hard Deadline</span>
              <span className="font-mono font-bold text-white text-sm">
                {formatDate(society.deadline)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Recruitment Rounds + Application Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: About & Rounds (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* About Section */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              About the Society
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {society.description}
            </p>
          </div>

          {/* Recruitment Pipeline Rounds */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <span>Recruitment Stages</span>
            </h3>

            <div className="space-y-3">
              {society.rounds?.map((round: any, idx: number) => (
                <div
                  key={round.id}
                  className="flex items-start space-x-3 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{round.name}</h4>
                    {round.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{round.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Society Leads Roster */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Executive Board & Leads
            </h3>
            <div className="divide-y divide-slate-800/60">
              {society.members?.map((member: any) => (
                <div key={member.id} className="py-2.5 flex items-center space-x-3 first:pt-0 last:pb-0">
                  <img
                    src={member.user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=member"}
                    alt={member.user.fullName}
                    className="w-8 h-8 rounded-full bg-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{member.user.fullName}</h4>
                    <span className="text-[10px] text-indigo-400">{member.roleInClub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Application Form or Success State (7 cols) */}
        <div className="lg:col-span-7">
          {submitSuccess ? (
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your application to <strong>{society.name}</strong> has been logged into the review pipeline. A mock confirmation email has been dispatched to your inbox.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/applications"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Track My Applications
                </Link>
                <Link
                  href="/societies"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Browse Other Societies
                </Link>
              </div>
            </div>
          ) : !isOpen ? (
            <div className="bg-slate-900/80 border border-red-500/30 rounded-3xl p-8 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Recruitment is Closed</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                The deadline for <strong>{society.name}</strong> was <strong>{formatDateTime(society.deadline)}</strong>. As per university recruitment bylaws, server-side policies strictly prevent late submissions.
              </p>
              <Link
                href="/societies"
                className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 hover:underline pt-2"
              >
                <span>Find active societies</span>
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="space-y-1 pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Candidate Application Form</span>
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-normal border border-blue-500/20">
                    Cohort 2026
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Please provide accurate responses. Society leads evaluate all answers against standardized rubrics.
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Submission Rejected: </span>
                    <span>{submitError}</span>
                  </div>
                </div>
              )}

              {/* General Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    GitHub / Code Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Portfolio / Drive Resume Link
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/resume.pdf"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Dynamic Custom Questions */}
              {society.customFields && society.customFields.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Society-Specific Questions
                  </h4>

                  {society.customFields.map((field: any) => {
                    const options = field.options
                      ? typeof field.options === "string"
                        ? JSON.parse(field.options)
                        : field.options
                      : [];

                    return (
                      <div key={field.id} className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-200">
                          {field.label}{" "}
                          {field.required && <span className="text-red-400">*</span>}
                        </label>

                        {field.fieldType === "TEXTAREA" ? (
                          <textarea
                            rows={3}
                            required={field.required}
                            placeholder={field.placeholder || "Enter your response..."}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                          />
                        ) : field.fieldType === "SELECT" ? (
                          <select
                            required={field.required}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="">-- Choose an option --</option>
                            {options.map((opt: string, i: number) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            required={field.required}
                            placeholder={field.placeholder || "Enter answer"}
                            value={formData[field.id] || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/35 hover:scale-105 active:scale-95 border border-blue-400/40 ring-1 ring-blue-400/30 hover:ring-2 hover:ring-blue-400/70 text-white font-bold text-xs flex items-center justify-center space-x-2 disabled:opacity-50 transition-all duration-200"
                >
                  {submitting ? (
                    <span>Validating & Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application to {society.name}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
