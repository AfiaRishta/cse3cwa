"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/Components/ThemeToggle"; // fixed case
import { SITE_TITLE, STUDENT_NO } from "@/lib/config";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/tabs", label: "Tabs" },
    { href: "/about", label: "About" },
    { href: "/escape-room", label: "Escape Room" },
    { href: "/coding-races", label: "Coding Races" },
    { href: "/court-room", label: "Court Room" },
  ];

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Left side → site title only */}
        <div className="brand" aria-label="Site identity">
          <span aria-label="Site title">{SITE_TITLE}</span>
        </div>

        {/* Nav + controls in the middle */}
        <div className="hambox">
          <nav
            id="primary-navigation"
            className="primary-nav"
            aria-label="Primary"
            aria-hidden={open ? "false" : "true"}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
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

        {/* Right side → student number */}
        <span className="student-badge" aria-label="Student number">
          {STUDENT_NO}
        </span>
      </div>
    </header>
  );
}
