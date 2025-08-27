import Link from "next/link";


export default function HomePage() {
return (
<section className="stack">
<h1>Title – Tabs Generator</h1>
<p>Build tabs, save to <code>localStorage</code>, and generate a single HTML file with inline CSS + JS for Moodle‑style embeds. Use the Tabs page.</p>


<h2>Quick checklist</h2>
<ul>
<li>Nav bar (Home, Tabs, About), Header, Footer </li>
<li>Dark/Light themes </li>
<li>Hamburger menu with CSS transform (rotates on open) </li>
<li>Tabs: add/remove/rename/edit, persist to localStorage, max 15 </li>
<li>“Generate HTML” → standalone, inline CSS only, no classes </li>
</ul>


<div className="row">
<Link className="btn btn-primary" href="/tabs">Go to Tabs</Link>
<Link className="btn btn-ghost" href="/about">About</Link>
</div>
</section>
);
}