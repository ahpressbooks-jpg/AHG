"use client";

import { useEffect, useState } from "react";

// CLASSROOM MODE — a teacher spins up a class code that points students at a
// Toolkit sequence + the live board. Code lives in the browser now; full
// rosters arrive with the education phase. Honest, usable today.
export default function Classroom() {
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCode(localStorage.getItem("tsr_class"));
    } catch {}
  }, []);

  const make = () => {
    const c = "TSR-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    try {
      localStorage.setItem("tsr_class", c);
    } catch {}
    setCode(c);
  };

  const link = typeof window !== "undefined" && code ? `${window.location.origin}/toolkit?class=${code}` : "";

  return (
    <div className="card" style={{ margin: "16px 0" }}>
      <div className="card-kicker">Teacher setup</div>
      {!code ? (
        <>
          <p>Create a class code, share the link, and run a live-news judgment league with your students — no logins to manage.</p>
          <button className="btn btn--maroon" onClick={make}>Create a class code</button>
        </>
      ) : (
        <>
          <p className="mono" style={{ fontSize: "1.4rem", color: "var(--pulse)" }}>{code}</p>
          <p>Share this link with your class:</p>
          <p className="mono" style={{ wordBreak: "break-all", color: "var(--slate)" }}>{link}</p>
          <button className="btn btn--ghost btn--small" onClick={() => navigator.clipboard?.writeText(link)}>Copy link</button>
        </>
      )}
    </div>
  );
}
