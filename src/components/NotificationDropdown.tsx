"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // 10s polling for real-time updates
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-slate-800 text-white border-blue-400 ring-2 ring-blue-400/40 shadow-lg shadow-blue-500/20 border"
            : "text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 hover:border-blue-400/50 hover:ring-1 hover:ring-blue-400/25 hover:shadow-md hover:shadow-blue-500/10"
        }`}
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/50 ring-2 ring-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-700/50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-500/20 text-blue-400 font-medium px-2 py-0.5 rounded-full border border-blue-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-slate-400 hover:text-blue-400 flex items-center space-x-1 hover:scale-105 active:scale-95 transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 mt-2 space-y-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No notifications yet. You will receive updates on application stages here!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`py-2.5 px-3 rounded-xl transition-all duration-150 border ${
                    n.isRead
                      ? "text-slate-400 border-transparent hover:border-slate-800 hover:bg-slate-800/40 hover:scale-[1.01]"
                      : "bg-blue-500/10 text-slate-200 border-blue-500/30 hover:bg-blue-500/15 hover:border-blue-500/50 hover:scale-[1.01] shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className={`text-xs font-semibold ${n.isRead ? "text-slate-300" : "text-blue-400"}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300 hover:underline mt-1.5 font-medium hover:translate-x-0.5 transition-transform"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
