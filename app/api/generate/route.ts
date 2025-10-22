export const runtime = "edge"; // ensures compatibility both locally and on Amplify

export async function GET(req: Request) {
  try {
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Tabs Generator</title>
  <style>
    body{font-family:system-ui,Arial;margin:1rem}
    .tablist{display:flex;gap:.5rem;margin-bottom:1rem}
    .tab{border:1px solid #ccc;padding:.5rem 1rem;cursor:pointer}
    .tab[aria-selected="true"]{background:#eee}
    .panel{display:none;border:1px solid #ddd;padding:1rem}
    .panel[aria-hidden="false"]{display:block}
  </style>
</head>
<body>
<h1>Tabs Generator</h1>
<div role="tablist" class="tablist" aria-label="Tabs">
  <button class="tab" role="tab" id="t0" aria-selected="true" aria-controls="p0">Tab 1</button>
  <button class="tab" role="tab" id="t1" aria-selected="false" aria-controls="p1">Tab 2</button>
  <button class="tab" role="tab" id="t2" aria-selected="false" aria-controls="p2">Tab 3</button>
</div>
<section role="tabpanel" class="panel" id="p0" aria-labelledby="t0" aria-hidden="false"><p>Content for Tab 1</p></section>
<section role="tabpanel" class="panel" id="p1" aria-labelledby="t1" aria-hidden="true"><p>Content for Tab 2</p></section>
<section role="tabpanel" class="panel" id="p2" aria-labelledby="t2" aria-hidden="true"><p>Content for Tab 3</p></section>
<script>
  const tabs=[...document.querySelectorAll('.tab')];
  const panels=[...document.querySelectorAll('.panel')];
  tabs.forEach((btn,i)=>{
    btn.addEventListener('click',()=>{
      tabs.forEach(b=>b.setAttribute('aria-selected','false'));
      panels.forEach(p=>p.setAttribute('aria-hidden','true'));
      btn.setAttribute('aria-selected','true');
      panels[i].setAttribute('aria-hidden','false');
      console.log('[instrument] tab_switched index='+i);
    });
  });
  console.log('[instrument] /api/generate executed successfully');
</script>
</body></html>`;

    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
