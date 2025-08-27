"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = { id: string; title: string; content: string };
const LS_KEY = "cse3cwa_tabs_data";
const LS_ACTIVE = "cse3cwa_tabs_active";
const MAX_TABS = 15;

export default function TabsBuilder() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState(0);
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null") as Tab[] | null;
      const savedActive = Number(localStorage.getItem(LS_ACTIVE) || "0");
      if (saved && saved.length) {
        setTabs(saved);
        setActive(isFinite(savedActive) ? Math.max(0, Math.min(savedActive, saved.length - 1)) : 0);
      } else {
        setTabs([
          { id: "t1", title: "Step 1", content: "Describe step 1 here." },
          { id: "t2", title: "Step 2", content: "Describe step 2 here." },
          { id: "t3", title: "Step 3", content: "Describe step 3 here." },
        ]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(tabs)); } catch {}
  }, [tabs]);

  useEffect(() => {
    try { localStorage.setItem(LS_ACTIVE, String(active)); } catch {}
  }, [active]);

  const addTab = () => {
    if (tabs.length >= MAX_TABS) return alert(`Max ${MAX_TABS} tabs`);
    const n = tabs.length + 1;
    const t: Tab = { id: crypto.randomUUID(), title: `Step ${n}`, content: `Step ${n} details...` };
    setTabs((old) => [...old, t]);
    setActive(tabs.length);
  };
  const removeTab = (idx: number) => {
    const next = tabs.filter((_, i) => i !== idx);
    setTabs(next);
    setActive((a) => Math.max(0, Math.min(a, next.length - 1)));
  };
  const renameActive = (title: string) => setTabs((old) => old.map((t, i) => (i === active ? { ...t, title } : t)));
  const editActive = (content: string) => setTabs((old) => old.map((t, i) => (i === active ? { ...t, content } : t)));

  const generated = useMemo(() => buildStandaloneHTML(tabs), [tabs]);
  const copyHtml = async () => { await navigator.clipboard.writeText(generated); alert("Copied HTML to clipboard!"); };

  // Quick-fill for your video: instantly create 1/3/5 tabs
  const quick = (n: 1 | 3 | 5) => {
    const arr = Array.from({ length: n }).map((_, i) => ({
      id: crypto.randomUUID(),
      title: `Step ${i + 1}`,
      content: `Step ${i + 1}: example content.`,
    }));
    setTabs(arr); setActive(0);
  };

  return (
    <div className="tab-wrap">
      <div>
        <div className="controls">
          <button className="badge" onClick={addTab} aria-label="Add tab">＋</button>
          <button className="badge" onClick={() => removeTab(active)} aria-label="Remove tab" disabled={tabs.length <= 1}>−</button>
          <span className="small">({tabs.length}/{MAX_TABS})</span>
        </div>

        <div className="tablist" role="tablist" aria-label="Tab headers">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === active}
              aria-controls={`panel-${i}`}
              id={`tab-${i}`}
              onClick={() => setActive(i)}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="panel" role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          <label className="small">Tab title</label>
          <input type="text" value={tabs[active]?.title || ""} onChange={(e) => renameActive(e.target.value)} aria-label="Tab title" />
          <div style={{ height: 8 }} />
          <label className="small">Tab content (plain text or basic HTML)</label>
          <textarea rows={8} value={tabs[active]?.content || ""} onChange={(e) => editActive(e.target.value)} aria-label="Tab content" />
        </div>

        <div style={{ height: 12 }} />

        <div className="controls">
          <button className="badge" onClick={() => setHtml(generated)}>Generate HTML</button>
          <button className="badge" onClick={copyHtml}>Copy</button>
          <span className="small">Quick fill for video: </span>
          <button className="badge" onClick={() => quick(1)}>1 tab</button>
          <button className="badge" onClick={() => quick(3)}>3 tabs</button>
          <button className="badge" onClick={() => quick(5)}>5 tabs</button>
        </div>

        <textarea className="codebox" readOnly value={html || "Click “Generate HTML” to produce the file here…"} aria-label="Generated HTML output" />

        <div style={{ height: 8 }} />
        <div className="small">Output preview:</div>
        <iframe title="Preview" className="preview" srcDoc={html} />
      </div>
    </div>
  );
}

/** Single-file HTML with inline CSS + vanilla JS only (no CSS classes). */
function buildStandaloneHTML(tabs: Tab[]): string {
  const safeTabs = tabs.length ? tabs : [{ id: "t1", title: "Tab 1", content: "Hello" }];
  const styleTabBtn = "padding:8px 10px;border:1px solid #ccc;border-radius:10px;background:#fff;margin:4px;text-align:left;";
  const styleTabBtnSel = "padding:8px 10px;border:1px solid #2563eb;border-radius:10px;background:#eef5ff;margin:4px;text-align:left;";
  const stylePanel = "border:1px solid #ccc;border-radius:12px;padding:12px;margin-top:8px;";
  const styleWrap = "max-width:900px;margin:16px auto;padding:8px;font-family:Arial,Helvetica,sans-serif;";
  const styleTablist = "display:flex;flex-wrap:wrap;gap:8px;";

  const buttons = safeTabs.map((t, i) =>
    `<button role="tab" id="tab-${i}" aria-selected="${i===0?"true":"false"}" aria-controls="panel-${i}" data-index="${i}" style="${i===0?styleTabBtnSel:styleTabBtn}">${escapeHtml(t.title)}</button>`
  ).join("");

  const panels = safeTabs.map((t, i) =>
    `<div role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" ${i===0?"":'hidden="true"'} style="${stylePanel}">${t.content}</div>`
  ).join("");

  const js = `
  (function(){
    const tablist = document.getElementById('tablist');
    const btnStyle='${styleTabBtn}'.replace(/'/g,"\\'");
    const btnSel='${styleTabBtnSel}'.replace(/'/g,"\\'");
    function select(i){
      const buttons=[...document.querySelectorAll('[role="tab"]')];
      const panels=[...document.querySelectorAll('[role="tabpanel"]')];
      buttons.forEach((b,idx)=>{ b.setAttribute('aria-selected', String(idx===i)); b.style.cssText=(idx===i)?btnSel:btnStyle; });
      panels.forEach((p,idx)=>{ if(idx===i){ p.removeAttribute('hidden'); } else { p.setAttribute('hidden','true'); }});
      buttons[i].focus();
    }
    tablist.addEventListener('click', e=>{
      const btn = e.target.closest('[role="tab"]'); if(!btn) return; select(Number(btn.dataset.index));
    });
    tablist.addEventListener('keydown', e=>{
      const buttons=[...document.querySelectorAll('[role="tab"]')];
      const cur = buttons.findIndex(b=>b.getAttribute('aria-selected')==='true');
      if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){
        e.preventDefault();
        let next=cur;
        if(e.key==='ArrowRight') next=(cur+1)%buttons.length;
        if(e.key==='ArrowLeft') next=(cur-1+buttons.length)%buttons.length;
        if(e.key==='Home') next=0;
        if(e.key==='End') next=buttons.length-1;
        select(next);
      }
    });
  })();`;

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Generated Tabs</title>
<body style="background:#ffffff;color:#111;margin:0">
  <div id="wrap" style="${styleWrap}">
    <h1 style="margin:0 0 8px 0">Tabs</h1>
    <div id="tablist" role="tablist" aria-label="Tabs" style="${styleTablist}">
      ${buttons}
    </div>
    ${panels}
  </div>
  <script>${js}</script>
</body>
</html>`;
}

function escapeHtml(s: string){
  return s.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[m]
  );
}
