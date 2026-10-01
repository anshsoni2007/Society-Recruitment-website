"use client";

import { useEffect } from "react";

/** Ensures a fresh browser visit always starts with the requested light theme. */
export function DefaultLightTheme() {
  useEffect(() => {
    window.localStorage.removeItem("crewdeck-theme");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return null;
}
