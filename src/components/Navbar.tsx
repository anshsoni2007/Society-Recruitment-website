"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Kanban,
  BarChart3,
  LogOut,
  LogIn,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, switchDemoRole } = useAuth();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const navLinks = [
    { label: "Explore Societies", href: "/societies", icon: Compass },
    ...(user?.role === "STUDENT"
      ? [{ label: "My Applications", href: "/dashboard/applications", icon: LayoutDashboard }]
      : []),
    ...(user?.role === "SOCIETY_LEAD" || user?.role === "SUPER_ADMIN"
      ? [
          {
            label: "Lead Pipeline",
            href: user.societyMemberships?.[0]?.societyId
              ? `/admin/societies/${user.societyMemberships[0].societyId}`
              : "/societies",
            icon: Kanban,
          },
          { label: "Recruitment Analytics", href: "/admin/analytics", icon: BarChart3 },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center space-x-1">
              <span>Crew</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Deck</span>
            </span>
            <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase -mt-1">
              Campus Talent Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Demo Role Switcher & Auth */}
        <div className="flex items-center space-x-3">
          {/* Quick Demo Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-medium transition-colors"
              title="Quickly switch roles to test different user journeys"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold text-indigo-300">
                {user ? user.role : "Guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Test Persona
                </div>
                <button
                  onClick={() => {
                    switchDemoRole("STUDENT");
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Student (Alex Rivera)</div>
                    <div className="text-[10px] text-slate-400">Can browse, apply, book slots</div>
                  </div>
                  {user?.role === "STUDENT" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoRole("SOCIETY_LEAD");
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Society Lead (GDG Lead)</div>
                    <div className="text-[10px] text-slate-400">Kanban, review candidates, slots</div>
                  </div>
                  {user?.role === "SOCIETY_LEAD" && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoRole("REVIEWER");
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Panel Reviewer (Devika)</div>
                    <div className="text-[10px] text-slate-400">Rubric scoring & evaluation</div>
                  </div>
                  {user?.role === "REVIEWER" && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoRole("SUPER_ADMIN");
                    setIsRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">Super Admin (Dean)</div>
                    <div className="text-[10px] text-slate-400">Full campus governance</div>
                  </div>
                  {user?.role === "SUPER_ADMIN" && <div className="w-2 h-2 rounded-full bg-pink-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile / Auth State */}
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
                <img
                  src={user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"}
                  alt={user.fullName}
                  className="w-6 h-6 rounded-full bg-slate-800"
                />
                <span className="text-xs font-semibold text-white hidden sm:inline max-w-[120px] truncate">
                  {user.fullName}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="flex items-center space-x-1 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Link>
              <Link
                href="/register"
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
