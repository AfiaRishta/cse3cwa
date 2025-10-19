type TabItem = { id: string; label: string; content: string };
type TabsConfig = {
  title?: string;
  tabs: TabItem[];
  // Optional visual config knobs
  activeIndex?: number; // default 0
};

/**
 * Returns a FULL, standalone HTML document as a string.
 * Paste into a blank .html file and it works in any browser.
 */
export function buildStandaloneTabsHTML(cfg: TabsConfig): string {
  const active = Math.max(0, Math.min(cfg.activeIndex ?? 0, cfg.tabs.length - 1));

  // Inline styles only. Avoid classes. Keep it small and legible.
  const containerStyle = "font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif;max-width:900px;margin:24px auto;padding:16px;border:1px solid #ddd;border-radius:12px";
  const h1Style = "margin:0 0 16px 0;font-size:20px;font-weight:600";
  const tablistStyle = "display:flex;gap:8px;border-bottom:1px solid #ddd;padding-bottom:8px";
  const tabStyle = (selected: boolean) =>
    `padding:8px 12px;border:1px solid ${selected ? "#444" : "#ccc"};border-bottom:none;border-radius:8px 8px 0 0;` +
    `background:${selected ? "#f7f7f7" : "#fff"};cursor:pointer;outline:none`;
  const panelStyle = "padding:12px;border:1px solid #444;border-radius:0 8px 8px 8px;margin-top:-1px";

  const tabsButtons = cfg.tabs
    .map((t, i) => {
      const selected = i === active;
      return `
        <button
          role="tab"
          id="tab-${t.id}"
          aria-controls="panel-${t.id}"
          aria-selected="${selected ? "true" : "false"}"
          tabindex="${selected ? "0" : "-1"}"
          style="${tabStyle(selected)}"
        >${t.label}</button>
      `;
    })
    .join("");

  const panels = cfg.tabs
    .map((t, i) => {
      const hidden = i === active ? "" : `hidden`;
      return `
        <div
          role="tabpanel"
          id="panel-${t.id}"
          aria-labelledby="tab-${t.id}"
          ${hidden}
          style="${panelStyle}"
        >${t.content}</div>
      `;
    })
    .join("");

  // Minimal JS for ARIA-compliant tabs (arrow keys, Home/End, click)
  const script = `
<script>
(function(){
  const tablist = document.querySelector('[role="tablist"]');
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

  function select(index) {
    tabs.forEach((t,i) => {
      const sel = i === index;
      t.setAttribute('aria-selected', sel);
      t.tabIndex = sel ? 0 : -1;
      panels[i].hidden = !sel;
    });
    tabs[index].focus();
  }

  tablist.addEventListener('click', (e) => {
    const i = tabs.indexOf(e.target.closest('[role="tab"]'));
    if (i >= 0) select(i);
  });

  tablist.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (e.key === 'ArrowLeft')  next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End')  next = tabs.length - 1;
    if (next !== current) { e.preventDefault(); select(next); }
  });
})();
</script>`.trim();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>${cfg.title ?? "Tabs"}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
  </head>
  <body>
    <main style="${containerStyle}">
      <h1 style="${h1Style}">${cfg.title ?? "Tabs"}</h1>
      <div role="tablist" aria-label="Example Tabs" style="${tablistStyle}">
        ${tabsButtons}
      </div>
      ${panels}
    </main>
    ${script}
  </body>
</html>`;
}
