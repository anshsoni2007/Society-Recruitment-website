import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 mt-20 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base">CrewDeck</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The next-generation campus society recruitment & talent evaluation platform. Streamlined applications, Kanban review pipelines, and structured panel scoring.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server-Side Deadline Enforcement</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Real-Time Pipeline Updates</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/societies" className="hover:text-white transition-colors">
                  Explore Active Societies
                </Link>
              </li>
              <li>
                <Link href="/dashboard/applications" className="hover:text-white transition-colors">
                  Student Application Tracker
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="hover:text-white transition-colors">
                  Recruitment Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Campus Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/societies?category=TECHNICAL" className="hover:text-white transition-colors">
                  Technical & AI Clubs
                </Link>
              </li>
              <li>
                <Link href="/societies?category=CULTURAL" className="hover:text-white transition-colors">
                  Cultural & Music Guilds
                </Link>
              </li>
              <li>
                <Link href="/societies?category=LITERARY" className="hover:text-white transition-colors">
                  Debating & Literary Societies
                </Link>
              </li>
              <li>
                <Link href="/societies?category=SOCIAL_INITIATIVE" className="hover:text-white transition-colors">
                  Social & Entrepreneurship
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} CrewDeck Platform. Built for University Excellence.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Engineered with pair-programming precision</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
