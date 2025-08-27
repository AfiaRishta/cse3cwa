"use client";
import { useEffect, useState } from "react";

// ——— cookie helpers ———
function setCookie(name: string, value: string, days = 14) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${d.toUTCString()}; path=/`;
}
function getCookie(name: string) {
  return document.cookie.split("; ").reduce((acc, cur) => {
    const [k, v] = cur.split("=");
    return k === name ? decodeURIComponent(v) : acc;
  }, "");
}

// ——— types ———
type Tab = { id: string; title: string; content: string };

const LS_KEY = "cwa_tabs_v1";
const MAX_TABS = 15;

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState(0);
  const [html, setHtml] = useState("");

  // Load tabs + active index
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Tab[];
        if (Array.isArray(parsed)) setTabs(parsed);
      } catch {}
    } else {
      // sensible defaults
      setTabs([
        { id: crypto.randomUUID(), title: "Step 1", content: "Describe step 1 here." },
        { id: crypto.randomUUID(), title: "Step 2", content: "Describe step 2 here." },
        { id: crypto.randomUUID(), title: "Step 3", content: "Describe step 3 here." },
      ]);
    }
    const idx = parseInt(getCookie("cwa_active_idx") || "0", 10);
    if (!Number.isNaN(idx)) setActive(Math.max(0, Math.min(idx, MAX_TABS - 1)));
  }, []);

  // Persist changes
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    setCookie("cwa_active_idx", String(active));
  }, [active]);

  const activeTab = tabs[active];

  function addTab() {
    if (tabs.length >= MAX_TABS) return;
    setTabs((t) => [
      ...t,
      {
        id: crypto.randomUUID(),
        title: `Step ${t.length + 1}`,
        content: `Describe step ${t.length + 1} here.`,
      },
    ]);
    setActive(tabs.length);
  }

  function removeTab(index: number) {
    const copy = tabs.slice();
    copy.splice(index, 1);
    if (!copy.length) return;
    setTabs(copy);
    setActive(Math.max(0, Math.min(index - 1, copy.length - 1)));
  }

  function updateTab(index: number, patch: Partial<Tab>) {
    setTabs((t) =>
      t.map((tab, i) => (i === index ? { ...tab, ...patch } : tab))
    );
  }

  // minimal render just to avoid errors
  return (
    <section>
      <h1>Tabs Page</h1>
      <button onClick={addTab}>Add Tab</button>
      <button onClick={() => removeTab(active)}>Remove Current Tab</button>

      {activeTab && (
        <div>
          <input
            type="text"
            value={activeTab.title}
            onChange={(e) => updateTab(active, { title: e.target.value })}
          />
          <textarea
            value={activeTab.content}
            onChange={(e) => updateTab(active, { content: e.target.value })}
          />
        </div>
      )}

      <pre>{JSON.stringify(tabs, null, 2)}</pre>
    </section>
  );
}
