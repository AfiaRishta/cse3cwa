import { prisma } from "@/lib/prisma";

export async function GET() {
  const last = await prisma.session.findFirst({ orderBy: { id: "desc" } });
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"/>
<title>Generated Court Report</title>
<body>
<h1>Generated Court Report</h1>
${
  last
    ? `<p>Last session #${last.id} • minutes: ${last.minutes}</p>
       <ul>
         <li>alt: ${last.doneAlt}</li>
         <li>validation: ${last.doneValidation}</li>
         <li>login: ${last.doneLogin}</li>
         <li>securedb: ${last.doneSecureDb}</li>
         <li>titlecolor: ${last.doneTitleColor}</li>
       </ul>`
    : "<p>No sessions yet.</p>"
}
<style>body{font-family:system-ui;padding:24px;line-height:1.6}</style>
<script>console.log("generated page served")</script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
