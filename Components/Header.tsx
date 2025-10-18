// Components/Header.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/Components/ThemeToggle";
import { SITE_TITLE, STUDENT_NO } from "@/lib/config";
import { MENU_ACTIVE_KEY, safeGet, safeSet } from "@/lib/prefs";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("/");

  const links = [
    { href: "/", label: "Home" },
    { href: "/tabs", label: "Tabs" },
    { href: "/about", label: "About" },
    { href: "/escape-room", label: "Escape Room" },
    { href: "/coding-races", label: "Coding Races" },
    { href: "/court-room", label: "Court Room" },
  ];

  // 1) On first mount: restore previous active link (or current path)
  useEffect(() => {
    const stored = safeGet(MENU_ACTIVE_KEY);
    setActive(stored || pathname);
  }, []); // run once

  // 2) On every route change: update and persist
  useEffect(() => {
    setActive(pathname);
    safeSet(MENU_ACTIVE_KEY, pathname);
  }, [pathname]);

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Left: site title */}
        <div className="brand" aria-label="Site identity">
          <span aria-label="Site title">{SITE_TITLE}</span>
        </div>

        {/* Middle: nav + hamburger + theme */}
        <div className="hambox">
          <nav
            id="primary-navigation"
            className="primary-nav"
            aria-label="Primary"
            aria-hidden={open ? "false" : "true"}
          >
            {links.map((l) => {
              const isActive = active === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    fontWeight: isActive ? 700 : 400,
                    textDecoration: isActive ? "underline" : "none",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <button
            className="hamburger"
            aria-controls="primary-navigation"
            aria-expanded={open ? "true" : "false"}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          <ThemeToggle />
        </div>

        {/* Right: student number */}
        <span className="student-badge" aria-label="Student number">
          {STUDENT_NO}
        </span>
      </div>
    </header>
  );
}
