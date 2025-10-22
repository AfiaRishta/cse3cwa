// /app/api/generate/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") ?? "Tabs Generator";
    const tabs = JSON.parse(searchParams.get("tabs") ?? '["Tab 1","Tab 2","Tab 3"]');

    // ✅ No Prisma here — just build static HTML
    const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
body{font-family:system-ui;margin:1rem}
.tablist{display:flex;gap:.5rem;margin-bottom:1rem}
.tab{border:1px solid #ccc;padding:.5rem 1rem;cursor:pointer}
.tab[aria-selected="true"]{background:#eee}
.panel{display:none;border:1px solid #ddd;padding:1rem}
.panel[aria-hidden="false"]{display:block}
</style>
</head><body>
<h1>${title}</h1>
<div role="tablist" class="tablist">
${tabs.map((t,i)=>`<button class="tab" role="tab" id="t${i}" aria-selected="${i===0}" aria-controls="p${i}">${t}</button>`).join("")}
</div>
${tabs.map((t,i)=>`<section role="tabpanel" class="panel" id="p${i}" aria-labelledby="t${i}" aria-hidden="${i!==0}"><p>Content for ${t}</p></section>`).join("")}
<script>
const tabs=[...document.querySelectorAll('.tab')];
const panels=[...document.querySelectorAll('.panel')];
tabs.forEach((btn,i)=>{
 btn.addEventListener('click',()=>{
  tabs.forEach(b=>b.setAttribute('aria-selected','false'));
  panels.forEach(p=>p.setAttribute('aria-hidden','true'));
  btn.setAttribute('aria-selected','true');
  panels[i].setAttribute('aria-hidden','false');
  console.log('[instrument] stage=tabs index='+i);
 });
});
console.log('[instrument] /api/generate loaded OK');
</script>
</body></html>`;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (err: any) {
    console.error("API error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
