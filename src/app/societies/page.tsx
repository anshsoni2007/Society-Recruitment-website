"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Sparkles, AlertCircle } from "lucide-react";
import { SocietyCard } from "@/components/SocietyCard";

const CATEGORIES = [
  { id: "ALL", label: "All Societies" },
  { id: "TECHNICAL", label: "Technical & AI" },
  { id: "CULTURAL", label: "Cultural & Arts" },
  { id: "LITERARY", label: "Debating & Literary" },
  { id: "SOCIAL_INITIATIVE", label: "Social Initiatives" },
  { id: "SPORTS", label: "Sports & Athletics" },
  { id: "ACADEMIC", label: "Academic" },
];

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [hiringOnly, setHiringOnly] = useState(false);

  const fetchSocieties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (search.trim()) params.append("search", search.trim());
      if (hiringOnly) params.append("isHiring", "true");

      const res = await fetch(`/api/societies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSocieties(data.societies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchSocieties, 250);
    return () => clearTimeout(debounce);
  }, [search, selectedCategory, hiringOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Campus Societies
        </h1>
        <p className="text-sm text-slate-400">
          Find your tribe, apply to open cohorts, and showcase your skills.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-3xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by society name, domain, or keywords (e.g. robotics, web, debating)..."
              className="w-full bg-slate-950 border border-slate-700/70 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Hiring Only Toggle */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer select-none bg-slate-950 border border-slate-700/70 px-4 py-2.5 rounded-2xl shrink-0">
            <input
              type="checkbox"
              checked={hiringOnly}
              onChange={(e) => setHiringOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Hiring Now Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Society Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-slate-900/40 border border-slate-800/80 animate-pulse"
            />
          ))}
        </div>
      ) : societies.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No societies match your filter</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query or reset category filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setHiringOnly(false);
            }}
            className="text-xs font-bold text-blue-400 hover:underline pt-2"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {societies.map((society) => (
            <SocietyCard key={society.id} society={society} />
          ))}
        </div>
      )}
    </div>
  );
}
