"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Mark from "@/components/Mark";
import { BoardState, Tier } from "@/lib/types";

const TIERS: Tier[] = ["FLASH", "BULLETIN", "URGENT", "DEVELOPING", "BRIEF"];

export default function DeskPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [board, setBoard] = useState<BoardState | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/board", { cache: "no-store" });
      if (res.ok) setBoard(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30_000);
    return () => clearInterval(t);
  }, [refresh]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: pw }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuthed(true);
        setPw("");
      } else {
        setMsg(data.error || "No.");
      }
    } catch {
      setMsg("Network hiccup.");
    } finally {
      setBusy(false);
    }
  };

  const act = async (action: string, storyId: string, tier?: Tier) => {
    setMsg(null);
    try {
      const res = await fetch("/api/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, storyId, tier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error || "Failed.");
        if (res.status === 401) setAuthed(false);
        return;
      }
      setMsg(data.applied || "Done.");
      refresh();
    } catch {
      setMsg("Network hiccup.");
    }
  };

  return (
    <div className="wrap page" style={{ maxWidth: 1080 }}>
      <div className="page-kicker" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Mark size={26} /> The Control Room
      </div>
      <h1 style={{ fontSize: "1.8rem" }}>The desk&apos;s thumb on the scale — disclosed.</h1>
      <p>
        Every action here is written into the story&apos;s public biography as{" "}
        <em>by the desk</em>. The override shows its work too.{" "}
        <Link href="/">← the house</Link>
      </p>

      {!authed ? (
        <form onSubmit={login} className="capture-form" style={{ marginTop: 20 }}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Desk password"
            aria-label="Desk password"
          />
          <button type="submit" disabled={busy}>{busy ? "…" : "Open the desk"}</button>
        </form>
      ) : (
        <p className="mono">Desk open. Actions apply on the next sweep (≤60s); biographies update immediately.</p>
      )}
      {msg && <p className="mono" style={{ color: "var(--maroon-row)" }}>{msg}</p>}

      {authed && board && (
        <table style={{ marginTop: 12 }}>
          <thead>
            <tr>
              <th>Seat</th>
              <th>Story</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {board.stories.map((s, i) => (
              <tr key={s.id}>
                <td className="mono">
                  {i === 0 ? "STAGE" : `ROW ${i}`}
                  <br />
                  {s.tier}
                  {s.flash && !s.flash.confirmed ? " · machine" : ""}
                </td>
                <td>
                  {s.headline}
                  <br />
                  <span className="mono" style={{ color: "var(--slate)" }}>
                    {s.owners} owners · {s.certainty} · <Link href={`/wire/${s.id}`}>biography</Link>
                  </span>
                </td>
                <td className="mono">{s.score}</td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.tier === "FLASH" && !s.flash?.confirmed && (
                      <button className="btn" onClick={() => act("confirmFlash", s.id)}>Confirm flash</button>
                    )}
                    {s.tier === "FLASH" && (
                      <button className="btn btn--ghost" onClick={() => act("standDown", s.id)}>Stand down</button>
                    )}
                    <button className="btn btn--ghost" onClick={() => act("pin", s.id)}>
                      {s.desk?.pinned ? "Unpin" : "Pin"}
                    </button>
                    <select
                      aria-label="Force tier"
                      className="btn-instrument"
                      value=""
                      onChange={(e) => e.target.value && act("force", s.id, e.target.value as Tier)}
                    >
                      <option value="">Seat at…</option>
                      {TIERS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {s.desk?.forcedTier && (
                      <button className="btn btn--ghost" onClick={() => act("release", s.id)}>Release</button>
                    )}
                    <button className="btn btn--ghost" onClick={() => act("kill", s.id)}>Kill</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
