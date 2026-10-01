"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Building2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SuperAdminPipelineIndex() {
  const { user, loading: authLoading } = useAuth();
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "SUPER_ADMIN") return;
    fetch("/api/societies")
      .then((res) => res.json())
      .then((data) => setSocieties(data.societies || []))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto w-full px-4 py-12 text-sm text-slate-400">Loading all society pipelines…</div>;
  }

  if (user?.role !== "SUPER_ADMIN") {
    return <div className="max-w-7xl mx-auto w-full px-4 py-12 text-sm text-red-500">This workspace is for Super Admins only.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <p className="text-xs font-bold tracking-wider uppercase text-indigo-500">Super Admin Workspace</p>
        <h1 className="mt-1 text-3xl font-extrabold text-white">All Society Pipelines</h1>
        <p className="mt-2 text-sm text-slate-400">Open any club’s full applicant pipeline, independent of society membership.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {societies.map((society) => (
          <Link key={society.id} href={`/admin/societies/${society.id}`} className="group rounded-3xl bg-slate-900/80 border border-slate-800 p-5 transition-all hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={society.logoUrl || "/brand/crewdeck-logo.png"} alt="" className="h-11 w-11 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h2 className="font-bold text-white">{society.name}</h2>
                  <p className="text-xs text-slate-400">{society.category.replace("_", " ")}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-5 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{society._count?.applications || 0} applicants</span>
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{society._count?.members || 0} leads</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
