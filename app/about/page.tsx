import { STUDENT_NAME, STUDENT_NO } from "@/lib/config";


export default function AboutPage() {
return (
<section className="stack">
<h1>About</h1>
<p><strong>Name:</strong> {STUDENT_NAME}</p>
<p><strong>Student Number:</strong> {STUDENT_NO}</p>


<h2>How to use this website (video)</h2>
<p>Place a file named <code>howto.mp4</code> into <code>/public</code>.</p>
<video src="/howto.mp4" controls style={{ width: "100%", maxWidth: 820, borderRadius: 12, border: "1px solid var(--border)" }}>
Sorry, your browser doesn’t support embedded videos.
</video>
</section>
);
}