"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Kanban,
  Users,
  Calendar,
  Settings,
  Plus,
  Clock,
  Download,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/lib/utils";

export default function SocietyAdminPipelinePage() {
  const params = useParams();
  const { user } = useAuth();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<"KANBAN" | "SLOTS" | "SETTINGS">("KANBAN");
  const [society, setSociety] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Slot Form State
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [newSlotLocation, setNewSlotLocation] = useState("Room 402, SAC / Google Meet");
  const [newSlotCapacity, setNewSlotCapacity] = useState(1);
  const [creatingSlot, setCreatingSlot] = useState(false);

  // Search in applicants
  const [applicantSearch, setApplicantSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [socRes, appsRes, slotsRes] = await Promise.all([
        fetch(`/api/societies/${id}`),
        fetch(`/api/societies/${id}/applications`),
        fetch(`/api/societies/${id}/interview-slots`),
      ]);

      if (socRes.ok) {
        const socData = await socRes.json();
        setSociety(socData.society);
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      }

      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setSlots(slotsData.slots || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotStart || !newSlotEnd) return;

    setCreatingSlot(true);
    try {
      const res = await fetch(`/api/societies/${id}/interview-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: newSlotStart,
          endTime: newSlotEnd,
          location: newSlotLocation,
          maxCapacity: Number(newSlotCapacity),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSlots((prev) => [...prev, data.slot]);
        setNewSlotStart("");
        setNewSlotEnd("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingSlot(false);
    }
  };

  const exportCandidatesCSV = () => {
    if (applications.length === 0) return;

    const headers = ["Student Name", "Email", "Roll Number", "Department", "Status", "Average Rating", "Submitted Date"];
    const rows = applications.map((a) => {
      const avg = a.evaluations?.length > 0
        ? (a.evaluations.reduce((acc: number, e: any) => acc + e.overallRating, 0) / a.evaluations.length).toFixed(1)
        : "N/A";
      return [
        `"${a.student.fullName}"`,
        `"${a.student.email}"`,
        `"${a.student.rollNumber || ""}"`,
        `"${a.student.department || ""}"`,
        `"${a.status}"`,
        `"${avg}"`,
        `"${new Date(a.submittedAt).toLocaleDateString()}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${society?.slug || "applicants"}-recruitment-roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter((app) => {
    if (!applicantSearch.trim()) return true;
    const q = applicantSearch.toLowerCase();
    return (
      app.student.fullName.toLowerCase().includes(q) ||
      app.student.email.toLowerCase().includes(q) ||
      (app.student.department && app.student.department.toLowerCase().includes(q))
    );
  });

  if (loading && !society) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-44 bg-slate-900 rounded-3xl" />
        <div className="h-96 bg-slate-900 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Top Breadcrumb & Society Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <img
            src={society?.logoUrl || "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=100&auto=format&fit=crop&q=80"}
            alt={society?.name}
            className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-slate-700 shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-white">{society?.name}</h1>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                Lead Workspace
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate Pipeline • Multi-Round Scoring • Interview Publishing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCandidatesCSV}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all duration-200 border border-slate-700 hover:border-slate-500 hover:scale-105 active:scale-95 hover:shadow-md"
            title="Download CSV of applicants"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster CSV</span>
          </button>
          <Link
            href={`/societies/${society?.slug || society?.id}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 text-white text-xs font-bold transition-all duration-200 border border-blue-400/40 ring-1 ring-blue-400/30 hover:ring-2 hover:ring-blue-400/60 hover:scale-105 active:scale-95"
          >
            <span>Public Page ➔</span>
          </Link>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("KANBAN")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
            activeTab === "KANBAN"
              ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/25 scale-105"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 hover:scale-105 active:scale-95"
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span>Candidate Pipeline ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("SLOTS")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
            activeTab === "SLOTS"
              ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/25 scale-105"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-800/80 hover:scale-105 active:scale-95"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Interview Slots ({slots.length})</span>
        </button>
      </div>

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === "KANBAN" && (
        <div className="space-y-4">
          {/* Quick Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={applicantSearch}
              onChange={(e) => setApplicantSearch(e.target.value)}
              placeholder="Quick search candidate by name, email, or dept..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <KanbanBoard
            societyId={id}
            applications={filteredApplications}
            rounds={society?.rounds || []}
            onStatusUpdated={fetchData}
          />
        </div>
      )}

      {/* TAB 2: INTERVIEW SLOTS MANAGER */}
      {activeTab === "SLOTS" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Create New Slot Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Plus className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Publish New Interview Slot</h3>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Location or Meeting Link</label>
                <input
                  type="text"
                  required
                  value={newSlotLocation}
                  onChange={(e) => setNewSlotLocation(e.target.value)}
                  placeholder="SAC Room 402 or Google Meet Link"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Candidate Capacity per Slot</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newSlotCapacity}
                  onChange={(e) => setNewSlotCapacity(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={creatingSlot}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md"
              >
                {creatingSlot ? "Publishing..." : "Publish Interview Slot"}
              </button>
            </form>
          </div>

          {/* Existing Slots List */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Published Interview Slots</h3>

            <div className="space-y-3">
              {slots.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                  No interview slots created yet. Use the publisher to create slots for shortlisted candidates.
                </div>
              ) : (
                slots.map((slot) => {
                  const bookedCount = slot.bookings?.length || 0;
                  return (
                    <div
                      key={slot.id}
                      className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs font-bold text-white">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          <span>{formatDateTime(slot.startTime)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{slot.location}</span>
                        </div>
                        {slot.bookings?.length > 0 && (
                          <div className="text-[10px] text-emerald-400 font-medium pt-1">
                            Booked by: {slot.bookings.map((b: any) => b.student?.fullName).join(", ")}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          bookedCount >= slot.maxCapacity
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          {bookedCount} / {slot.maxCapacity} Booked
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
