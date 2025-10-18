"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** --------------------------------------------
 * Types & constants
 * ------------------------------------------ */
type TaskId = "alt" | "validation" | "login" | "securedb" | "titlecolor";

type Task = {
  id: TaskId;
  label: string;
  hint: string;
  offense?: string; // used when we go to "court"
};

type MessageLevel = 1 | 2; // 1 = normal, 2 = urgent

type Message = {
  id: string;
  taskId: TaskId;
  text: string;
  level: MessageLevel;
  createdAt: number;
};

const TASKS: Task[] = [
  { id: "alt",        label: "Fix alt text in img1",       hint: "Add meaningful alt text for images.", offense: "Disability Discrimination Act (Accessibility)" },
  { id: "validation", label: "Fix input validation",       hint: "Validate inputs (length, format, required).", offense: "Negligence / Laws of Tort (security hygiene)" },
  { id: "login",      label: "Fix User Login",             hint: "Make login usable; broken login = no users.", offense: "Business failure (bankruptcy scenario)" },
  { id: "securedb",   label: "Secure the Database",        hint: "Use parameterized queries, least privilege.", offense: "Data breach → Laws of Tort" },
  { id: "titlecolor", label: "Change title colour to Red", hint: "Apply accessible color contrast for titles." },
];

const INITIAL_MINUTES = 5;             // default timer minutes
const INITIAL_MSG_MIN_MS = 20000;      // 20 seconds
const INITIAL_MSG_MAX_MS = 30000;      // 30 seconds
const ESCALATE_AFTER_MS = 120000;      // 2 minutes
const COURT_AFTER_MS = 120000;         // 2 minutes after urgent (total 4)

/** Utility: random int between [min, max] */
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** --------------------------------------------
 * Main Component
 * ------------------------------------------ */
export default function CourtRoomGame() {
  // timer
  const [minutes, setMinutes] = useState<number>(INITIAL_MINUTES);
  const [remaining, setRemaining] = useState<number>(INITIAL_MINUTES * 60); // seconds
  const [running, setRunning] = useState<boolean>(false);

  // tasks
  const [done, setDone] = useState<Record<TaskId, boolean>>({
    alt: false, validation: false, login: false, securedb: false, titlecolor: false,
  });

  // messages + scheduling
  const [messages, setMessages] = useState<Message[]>([]);
  const escalateTimers = useRef<Record<TaskId, number | null>>({ alt: null, validation: null, login: null, securedb: null, titlecolor: null });
  const courtTimers = useRef<Record<TaskId, number | null>>({ alt: null, validation: null, login: null, securedb: null, titlecolor: null });
  const initialTimers = useRef<Record<TaskId, number | null>>({ alt: null, validation: null, login: null, securedb: null, titlecolor: null });

  // court modal
  const [courtOpen, setCourtOpen] = useState(false);
  const [courtReason, setCourtReason] = useState<string>("");

  // aria-live region for screen readers
  const liveText = useMemo(() => {
    const last = messages[messages.length - 1];
    return last ? `${last.level === 2 ? "URGENT: " : ""}${last.text}` : "";
  }, [messages]);

  /** Start or reset scheduling */
  const startScenario = () => {
    clearAllTimers();
    console.log("[instrument] start", { minutes });
    // schedule first wave of messages, only for tasks not finished
    TASKS.forEach(t => {
      if (done[t.id]) return;
      const delay = rand(INITIAL_MSG_MIN_MS, INITIAL_MSG_MAX_MS);
      const handle = window.setTimeout(() => fireMessage(t.id, 1), delay);
      initialTimers.current[t.id] = handle;
    });
  };

  /** Push a message and schedule escalate/court if unresolved */
  const fireMessage = (taskId: TaskId, level: MessageLevel) => {
    if (done[taskId]) return; // if already fixed, don't message
    const text = buildMessage(taskId, level);
    console.log("[instrument] message", { taskId, level }); 
    const msg: Message = { id: `${taskId}-${Date.now()}-${level}`, taskId, text, level, createdAt: Date.now() };
    setMessages(m => [...m, msg]);

    // schedule next stages
    if (level === 1) {
      // escalate after 2 mins
      clearTimer(escalateTimers.current[taskId]);
      escalateTimers.current[taskId] = window.setTimeout(() => fireMessage(taskId, 2), ESCALATE_AFTER_MS);
    } else {
      // go to court after 2 more mins
      clearTimer(courtTimers.current[taskId]);
      courtTimers.current[taskId] = window.setTimeout(() => goToCourt(taskId), COURT_AFTER_MS);
    }
  };

  /** Build message text for each task/level */
  const buildMessage = (taskId: TaskId, level: MessageLevel) => {
    const prefix = level === 2 ? "URGENT: " : "";
    switch (taskId) {
      case "alt":        return `${prefix}Fix alt in img1`;
      case "validation": return `${prefix}Fix input validation`;
      case "login":      return `${prefix}Fix User login`;
      case "securedb":   return `${prefix}Fix Secure Database`;
      case "titlecolor": return `${prefix}Change Title colour to Red`;
    }
  };

  /** Court penalty modal */
  const goToCourt = (taskId: TaskId) => {
    if (done[taskId]) return;
    const offense = TASKS.find(t => t.id === taskId)?.offense ?? "Breach of requirements";
    setCourtReason(offense);
    console.log("[instrument] court", { reason: offense });
    setCourtOpen(true);
  };
  
  /** Clear a timer id safely */
  const clearTimer = (id: number | null) => { if (id) window.clearTimeout(id); };

  /** Clear ALL timers */
  const clearAllTimers = () => {
    (Object.keys(initialTimers.current) as TaskId[]).forEach(k => clearTimer(initialTimers.current[k]));
    (Object.keys(escalateTimers.current) as TaskId[]).forEach(k => clearTimer(escalateTimers.current[k]));
    (Object.keys(courtTimers.current) as TaskId[]).forEach(k => clearTimer(courtTimers.current[k]));
  };

  /** Fix a task now */
  const fixTask = (taskId: TaskId) => {
    console.log("[instrument] fix", { taskId });
    setDone(prev => ({ ...prev, [taskId]: true }));
    setMessages(m => m.filter(x => x.taskId !== taskId));   // remove visible messages for this task
    clearTimer(initialTimers.current[taskId]);
    clearTimer(escalateTimers.current[taskId]);
    clearTimer(courtTimers.current[taskId]);
  };

  /** Snooze = postpone by 30s (only makes sense for level 1 or 2) */
  /** Snooze = postpone by 30s (only makes sense for level 1 or 2) */
  const snooze = (taskId: TaskId) => {
    console.log("[instrument] snooze", { taskId });   // <-- ADD THIS LINE
    clearTimer(escalateTimers.current[taskId]);
    clearTimer(courtTimers.current[taskId]);
    const handle = window.setTimeout(() => fireMessage(taskId, 1), 30000);
    escalateTimers.current[taskId] = handle;
  };


  /** Save progress to API (now has access to minutes & done) */
  async function saveProgress() {
    try {
      console.log("[instrument] save", { done, minutes });
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, done }),
      });
      if (!res.ok) throw new Error(await res.text());
      alert("Saved!");
    } catch (e: any) {
      alert("Save failed: " + e.message);
    }
  }

  /** Reset everything */
  const resetAll = () => {
    clearAllTimers();
    setDone({ alt: false, validation: false, login: false, securedb: false, titlecolor: false });
    setMessages([]);
    setCourtOpen(false);
    setCourtReason("");
    setRemaining(minutes * 60);
  };

  /** Timer ticking */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining(s => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          clearAllTimers();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  /** Persist progress locally (optional) */
  useEffect(() => {
    localStorage.setItem("court_done", JSON.stringify(done));
  }, [done]);

  useEffect(() => {
    const saved = localStorage.getItem("court_done");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  /** Manage focus when modal opens (basic accessibility) */
  const closeCourt = () => setCourtOpen(false);

  /** Derived */
  const allDone = Object.values(done).every(Boolean);

  return (
    <section className="court-bg" aria-label="Court Room Scenario">
      {/* Hidden live region for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">{liveText}</div>

      <div className="row" style={{ alignItems: "flex-start" }}>
        {/* Timer / Controls */}
        <div className="card" style={{ flex: "1 1 280px" }}>
          <h2>Timer</h2>
          <label>
            Minutes:&nbsp;
            <input
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={(e) => {
                const v = Math.max(1, Number(e.target.value || 1));
                setMinutes(v);
                setRemaining(v * 60);
              }}
              aria-label="Set minutes for the scenario"
            />
          </label>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={() => { setRunning(true); startScenario(); }} aria-label="Start the scenario">Start</button>{" "}
            <button className="btn" onClick={() => setRunning(false)} aria-label="Pause timer">Pause</button>{" "}
            <button className="btn" onClick={() => { setRunning(false); resetAll(); }} aria-label="Reset scenario">Reset</button>{" "}
            <button className="btn btn-primary" onClick={saveProgress} aria-label="Save progress">Save</button>
          </div>
          <p style={{ marginTop: 10 }}>
            <strong>Remaining:</strong> {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </p>
          <p className="badge" aria-label="Instructions">Messages arrive every 20–30s. Ignore 2 min → URGENT. Ignore 2 more min → court.</p>
        </div>

        {/* Tasks */}
        <div className="card" style={{ flex: "2 1 380px" }}>
          <h2>Stages</h2>
          <ul>
            {TASKS.map(t => (
              <li key={t.id} style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>{t.label}</span>{" "}
                {done[t.id] ? <span className="badge" aria-label="Task completed">Done</span> : null}
                <div style={{ fontSize: 12, color: "#555" }}>{t.hint}</div>
                {!done[t.id] && (
                  <div style={{ marginTop: 6 }}>
                    <button className="btn btn-primary" onClick={() => fixTask(t.id)} aria-label={`Fix ${t.label} now`}>Fix Now</button>{" "}
                    <button className="btn" onClick={() => snooze(t.id)} aria-label="Snooze message for 30 seconds">Snooze 30s</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {allDone && <p className="badge">All tasks complete 🎉</p>}
        </div>

        {/* Messages */}
        <div className="card" style={{ flex: "1 1 300px" }}>
          <h2>Messages</h2>
          {messages.length === 0 && <p>No messages yet.</p>}
          <div role="list">
            {messages.slice(-6).reverse().map(m => (
              <div role="listitem" key={m.id} className={`toast ${m.level === 2 ? "urgent" : ""}`} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{m.text}</div>
                <div style={{ fontSize: 12, opacity: .8 }}>{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Court Modal */}
      {courtOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="court-title" aria-describedby="court-desc">
          <div className="modal">
            <h3 id="court-title">You’re in Court</h3>
            <p id="court-desc">
              You ignored urgent issues for too long. You are fined for <strong>{courtReason}</strong>.
            </p>
            <p>Fix the outstanding task(s) to continue.</p>
            <button className="btn btn-primary" onClick={closeCourt} autoFocus>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
