import { STUDENT_NAME, STUDENT_NO } from "@/lib/config";


export default function Footer() {
const d = new Date();
const dt = d.toLocaleDateString("en-AU", { year: "numeric", month: "numeric", day: "numeric" });
return (
<footer className="site-footer">
<div className="container" role="contentinfo">
© {new Date().getFullYear()} • {STUDENT_NAME} • Student No: {STUDENT_NO} • {dt}
</div>
</footer>
);
}