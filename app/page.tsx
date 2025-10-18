"use client";

import { useMemo, useState } from "react";
import { buildStandaloneTabsHTML } from "@/lib/buildStandalone";

type TabItem = { id: string; label: string; content: string };

export default function TabsGeneratorPage() {
  // --- Editable state for the generator UI (in-app only) ---
  const [title, setTitle] = useState("Course Tabs");
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: "t1", label: "Overview", content: "<p>Hello world</p>" },
    { id: "t2", label: "Details", content: "<p>Details here</p>" },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Build the SINGLE-FILE HTML document (inline CSS + tiny JS)
  const html = useMemo(
    () => buildStandaloneTabsHTML({ title, tabs, activeIndex }),
    [title, tabs, activeIndex]
  );

  // --- Helpers ------------------------------------------------
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(html);
    alert("Standalone HTML copied to clipboard.");
  };

  const downloadFile = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "output.html",
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const addTab = () => {
    const n = tabs.length + 1;
    const next: TabItem = {
      id: `t${n}`,
      label: `Tab ${n}`,
      content: `<p>Tab ${n} content</p>`,
    };
    setTabs((prev) => [...prev, next]);
  };

  const removeTab = (i: number) => {
    setTabs((prev) => prev.filter((_, idx) => idx !== i));
    setActiveIndex((prev) => {
      if (i < prev) return prev - 1;
      if (i === prev) return Math.max(0, prev - 1);
      return prev;
    });
  };

  const updateTab = (i: number, patch: Partial<TabItem>) => {
    setTabs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  };

  // --- UI (app styling can use your normal CSS/Tailwind).
  // IMPORTANT: only the GENERATED HTML must be classless + inline styles. ---
  return (
    <div className="p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tabs Generator</h1>
        <p className="text-sm opacity-80">
          Configure tabs below. Then{" "}
          <strong>Copy</strong> or <strong>Download</strong> a single-file HTML
          with inline CSS and a tiny inline script (no external assets).
        </p>
      </header>

      {/* Config: title + active index */}
      <section className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Course Tabs"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Active tab (0-based)</span>
          <input
            type="number"
            min={0}
            max={Math.max(0, tabs.length - 1)}
            className="mt-1 w-full rounded border px-3 py-2"
            value={activeIndex}
            onChange={(e) =>
              setActiveIndex(
                Math.max(0, Math.min(Number(e.target.value) || 0, tabs.length - 1))
              )
            }
          />
          <span className="text-xs opacity-70">
            Current max index: {Math.max(0, tabs.length - 1)}
          </span>
        </label>
      </section>

      {/* Tab rows editor */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tabs</h2>
          <button
            className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
            onClick={addTab}
          >
            + Add tab
          </button>
        </div>

        <ol className="space-y-3">
          {tabs.map((t, i) => (
            <li key={t.id} className="rounded border p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Label</span>
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={t.label}
                    onChange={(e) => updateTab(i, { label: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">ID (used in ARIA)</span>
                  <input
                    className="mt-1 w-full rounded border px-3 py-2"
                    value={t.id}
                    onChange={(e) =>
                      updateTab(i, {
                        id: e.target.value.replace(/\s+/g, "-").toLowerCase(),
                      })
                    }
                  />
                </label>
              </div>

              <label className="block mt-3">
                <span className="text-sm font-medium">
                  Content (HTML allowed)
                </span>
                <textarea
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={4}
                  value={t.content}
                  onChange={(e) => updateTab(i, { content: e.target.value })}
                />
              </label>

              <div className="mt-3 flex items-center justify-between">
                <button
                  className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                  onClick={() => setActiveIndex(i)}
                >
                  Set active
                </button>
                <button
                  className="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => removeTab(i)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      <section className="flex flex-wrap gap-2">
        <button
          className="rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={copyToClipboard}
        >
          Copy HTML
        </button>
        <button
          className="rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
          onClick={downloadFile}
        >
          Download output.html
        </button>
      </section>

      {/* Live preview of the generated single-file HTML */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Live preview</h2>
        <iframe
          title="Standalone Preview"
          style={{
            width: "100%",
            height: 520,
            border: "1px solid #e3e3e3",
            borderRadius: 8,
          }}
          // The magic line: render the exact HTML you'd copy/download
          srcDoc={html}
        />
        <p className="text-xs opacity-70">
          Tip: Download and open in Incognito. DevTools → Network should show 0
          external requests. Elements → No classes, only inline styles.
        </p>
      </section>
    </div>
  );
}
