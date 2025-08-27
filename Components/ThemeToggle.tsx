"use client";
import { useEffect, useState } from "react";


export default function ThemeToggle() {
const [theme, setTheme] = useState<"light" | "dark">("light");


useEffect(() => {
const saved = localStorage.getItem("cwa_theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const initial = (saved as "light" | "dark") || (prefersDark ? "dark" : "light");
setTheme(initial);
document.documentElement.setAttribute("data-theme", initial);
}, []);


useEffect(() => {
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem("cwa_theme", theme);
}, [theme]);


return (
<button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Toggle theme">
{theme === "light" ? "🌞 Light" : "🌙 Dark"}
</button>
);
}