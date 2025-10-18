// Components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { THEME_KEY, LEGACY_THEME_KEY, safeGet, safeSet } from "@/lib/prefs";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const legacy = safeGet(LEGACY_THEME_KEY) as "light" | "dark" | "";
    const saved = (safeGet(THEME_KEY) as "light" | "dark" | "") || legacy;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = (saved as "light" | "dark") || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    safeSet(THEME_KEY, theme);
    safeSet(LEGACY_THEME_KEY, theme); // keep your old key updated too
  }, [theme]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
