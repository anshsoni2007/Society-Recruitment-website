"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionUser } from "@/lib/types";

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoRole: (role: "STUDENT" | "SOCIETY_LEAD" | "REVIEWER" | "SUPER_ADMIN") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password = "Password@123") => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Network error during login" };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const switchDemoRole = async (role: "STUDENT" | "SOCIETY_LEAD" | "REVIEWER" | "SUPER_ADMIN") => {
    const demoAccounts: Record<string, { email: string; pass: string }> = {
      STUDENT: { email: "student.alex@campus.edu", pass: "Student@123" },
      SOCIETY_LEAD: { email: "lead.gdg@campus.edu", pass: "Lead@123" },
      REVIEWER: { email: "reviewer.tech@campus.edu", pass: "Reviewer@123" },
      SUPER_ADMIN: { email: "admin@campus.edu", pass: "Admin@123" },
    };

    const target = demoAccounts[role];
    if (target) {
      await login(target.email, target.pass);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
