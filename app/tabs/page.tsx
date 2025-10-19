"use client";
import { useEffect, useState } from "react";

/* ---------- cookie helpers ---------- */
function setCookie(name: string, value: string, days = 14) {
  const d = new Date();
  d.setTime(d.getTime() + days * 864e5);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}
function getCookie(name: string) {
  return document.cookie.split("; ").reduce((acc, cur) => {
    const [k, v] = cur.split("=");
    return k === name ? decodeURIComponent(v) : acc;
  }, "");
}

/* ---------- types ---------- */
type Tab = { id: string; title: string; content: string };

const LS_KEY = "cwa_tabs_v1";
const MAX_TABS = 15;

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState(0);
  const [html, setHtml] = useState("");

  /* load tabs + active index */
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Tab[];
        if (Array.isArray(parsed) && parsed.length) setTabs(parsed);
      } catch {}
    }
    if (!tabs.length) {
      // sensible defaults if nothing saved
      setTabs([
        { id: crypto.randomUUID(), title: "Step 1", content: "Describe step 1 here." },
        { id: crypto.randomUUID(), title: "Step 2", content: "Describe step 2 here." },
        { id: crypto.randomUUID(), title: "Step 3", content: "Describe step 3 here." },
      ]);
    }
    const idx = parseInt(getCookie("cwa_active_idx") || "0", 10);
    if (!Number.isNaN(idx)) setActive(Math.max(0, Math.min(idx, MAX_TABS - 1)));
  }, []); // eslint-disable-line

  /* persist changes */
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
    setTabs((t) => t.map((tab, i) => (i === index ? { ...tab, ...patch } : tab)));
  }

  /* ---------- Output generator: inline CSS + JS, NO CSS CLASSES ---------- */
  function escapeHtml(s: string) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function buildOutputHtml(source: Tab[]) {
    const data = source.map((t) => ({
      title: t.title || "",
      content: t.content || "",
    }));

    const head = `
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tabs Output</title>
<style>
  /* no class selectors used below */
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 0; padding: 24px; background:#fff; color:#111827; }
  h1 { margin: 0 0 16px 0; font-size: 20px; }
  #wrap { display: grid; grid-template-columns: 200px 1fr; gap: 16px; }
  @media (max-width: 820px) { #wrap { grid-template-columns: 1fr; } }
  #tablist { display: grid; gap: 8px; }
  #tablist button { text-align: left; border:1px solid #e5e7eb; background:#fff; color:#111827; padding:8px 10px; border-radius:8px; cursor:pointer; }
  #tablist button[data-active="true"] { border-color:#111827; box-shadow: inset 0 0 0 2px rgba(0,0,0,.07); }
  #panel { border:1px dashed #e5e7eb; border-radius:12px; padding:12px; min-height:120px; white-space:pre-wrap; }
  footer { margin-top:24px; color:#6b7280; font-size:14px; }
</style>`.trim();

    const bodyOpen = `
<body>
  <h1>Tabs</h1>
  <div id="wrap">
    <div id="tablist" role="tablist" aria-label="Steps">
    </div>
    <div id="panel" role="tabpanel" aria-live="polite"></div>
  </div>
  <footer>Generated single-file HTML • Inline CSS + tiny JS • No CSS classes</footer>
<script>
  const TABS = ${JSON.stringify(
    data.map((t) => ({ title: t.title, content: t.content })),
  )};

  // build tab buttons
  const tablist = document.getElementById('tablist');
  const panel = document.getElementById('panel');

  function renderButtons(activeIndex){
    tablist.innerHTML = '';
    TABS.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role','tab');
      b.setAttribute('aria-selected', String(i===activeIndex));
      b.dataset.active = String(i===activeIndex);
      b.textContent = t.title || ('Step ' + (i+1));
      b.addEventListener('click', () => show(i));
      tablist.appendChild(b);
    });
  }

  function show(i){
    renderButtons(i);
    const t = TABS[i];
    panel.innerText = t && t.content ? t.content : '';
  }

  // init
  show(0);
</script>`.trim();

    const end = `</body></html>`;

    return [head, bodyOpen, end].join("\n");
  }

  function generateHtml() {
    setHtml(buildOutputHtml(tabs));
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(html);
      alert("HTML copied to clipboard.");
    } catch {
      alert("Copy failed. Select the text and copy manually.");
    }
  }

  /* ---------- UI ---------- */
  return (
    <section className="container">
      <h1>Tabs Page</h1>

      <div className="row" style={{ marginBottom: 8 }}>
        <button onClick={addTab}>Add Tab</button>
        <button onClick={() => removeTab(active)}>Remove Current Tab</button>
        <button className="btn btn-primary" onClick={generateHtml}>Generate HTML</button>
        <button className="btn btn-ghost" onClick={copyHtml} disabled={!html}>Copy</button>
      </div>

      {/* editor */}
      {activeTab && (
        <>
          <input
            type="text"
            value={activeTab.title}
            onChange={(e) => updateTab(active, { title: e.target.value })}
            aria-label="Tab title"
            style={{ marginBottom: 8 }}
          />
          <textarea
            value={activeTab.content}
            onChange={(e) => updateTab(active, { content: e.target.value })}
            aria-label="Tab content"
            rows={6}
          />
        </>
      )}

      {/* show current JSON so you can see persistence while testing */}
      <pre aria-label="Debug tabs JSON">
        {JSON.stringify(tabs, null, 2)}
      </pre>

      {/* output area */}
      <h2 style={{ marginTop: 16 }}>Output</h2>
      <textarea
        className="outputbox"
        readOnly
        value={html}
        placeholder='Click "Generate HTML" to produce the single-file output here…'
        rows={14}
      />
    </section>
  );
}
