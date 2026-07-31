"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Candidate, GOV_STATES_2026, Office, OFFICE_LABEL, partyTag, stateName, US_STATES,
} from "@/lib/candidateMeta";
import TrackButton, { TrackTarget } from "./TrackButton";

interface Roster {
  candidates: Candidate[];
  source: "fec" | "curated" | "sample";
}

const SOURCE_NOTE: Record<Roster["source"], { label: string; cls: string }> = {
  fec: { label: "Live · FEC", cls: "src--live" },
  curated: { label: "Curated seat", cls: "src--curated" },
  sample: { label: "Sample data — live once FEC is configured", cls: "src--sample" },
};

function toTarget(c: Candidate): TrackTarget {
  return { id: c.id, name: c.name, office: c.office, state: c.state, district: c.district, party: c.party };
}

// THE FINDER — enter an address (resolve your U.S. House district) or pick a
// race by hand, then see who's running and track any of them.
export default function CandidateFinder() {
  const [address, setAddress] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveMsg, setResolveMsg] = useState<string | null>(null);

  const [stateCode, setStateCode] = useState("");
  const [office, setOffice] = useState<Office>("H");
  const [district, setDistrict] = useState("");

  const [roster, setRoster] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/track", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setSignedIn(!!d.signedIn);
        if (Array.isArray(d.tracked)) setTrackedIds(new Set(d.tracked.map((t: any) => t.id)));
      })
      .catch(() => setSignedIn(false));
  }, []);

  async function runSearch(s: string, o: Office, d: string) {
    if (!s) {
      setError("Pick a state first.");
      return;
    }
    setLoading(true);
    setError(null);
    setRoster(null);
    try {
      const usp = new URLSearchParams({ state: s, office: o });
      if (o === "H" && d) usp.set("district", d);
      const res = await fetch(`/api/candidates?${usp.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as Roster;
      setRoster(data);
    } catch {
      setError("Couldn't load candidates. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resolveAddress() {
    const q = address.trim();
    if (!q) return;
    setResolving(true);
    setResolveMsg(null);
    try {
      const res = await fetch(`/api/district?q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const data = await res.json();
      if (data?.result?.state) {
        const s = data.result.state as string;
        const d = String(data.result.district ?? "");
        setStateCode(s);
        setOffice("H");
        setDistrict(d === "At-large" ? "" : d);
        setResolveMsg(`Found: ${stateName(s)}${d ? ` · District ${d}` : ""}. Showing your U.S. House race.`);
        await runSearch(s, "H", d === "At-large" ? "" : d);
      } else {
        setResolveMsg("Couldn't match that address. Pick your state and race below instead.");
      }
    } catch {
      setResolveMsg("Address lookup is unavailable right now. Pick your state and race below.");
    } finally {
      setResolving(false);
    }
  }

  const govUnavailable = office === "G" && stateCode && !GOV_STATES_2026.includes(stateCode);

  return (
    <div className="el-finder">
      {/* Address path */}
      <div className="el-find-card">
        <label className="el-find-lab" htmlFor="el-addr">Find my district</label>
        <div className="el-find-row">
          <input
            id="el-addr"
            className="el-input"
            type="text"
            inputMode="text"
            placeholder="Street address or ZIP — e.g. 350 Fifth Ave, New York, NY"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && resolveAddress()}
          />
          <button className="btn btn--small" onClick={resolveAddress} disabled={resolving || !address.trim()}>
            {resolving ? "Locating…" : "Find my House race"}
          </button>
        </div>
        {resolveMsg && <p className="el-find-msg">{resolveMsg}</p>}
      </div>

      <div className="el-find-or" aria-hidden="true"><span>or pick any race</span></div>

      {/* Manual path */}
      <div className="el-find-card">
        <div className="el-find-grid">
          <div>
            <label className="el-find-lab" htmlFor="el-state">State</label>
            <select id="el-state" className="el-input" value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
              <option value="">Choose a state…</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="el-find-lab" htmlFor="el-office">Office</label>
            <select id="el-office" className="el-input" value={office} onChange={(e) => setOffice(e.target.value as Office)}>
              <option value="H">{OFFICE_LABEL.H}</option>
              <option value="S">{OFFICE_LABEL.S}</option>
              <option value="G">{OFFICE_LABEL.G}</option>
            </select>
          </div>
          {office === "H" && (
            <div>
              <label className="el-find-lab" htmlFor="el-dist">District</label>
              <input
                id="el-dist"
                className="el-input"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 12 (blank = all)"
                value={district}
                onChange={(e) => setDistrict(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          )}
          <div className="el-find-go">
            <button className="btn" onClick={() => runSearch(stateCode, office, district)} disabled={loading || !stateCode}>
              {loading ? "Loading…" : "Show candidates"}
            </button>
          </div>
        </div>
        {govUnavailable && (
          <p className="el-find-msg">No governor’s race in {stateName(stateCode)} in 2026. Try House or Senate.</p>
        )}
      </div>

      {/* Results */}
      {error && <p className="el-find-msg el-find-err">{error}</p>}
      {roster && (
        <div className="el-results" aria-live="polite">
          <div className="el-results-head">
            <span className="el-results-title">
              {stateName(stateCode)} · {OFFICE_LABEL[office]}
              {office === "H" && district ? ` · District ${district}` : ""}
            </span>
            <span className={`el-src ${SOURCE_NOTE[roster.source].cls}`}>{SOURCE_NOTE[roster.source].label}</span>
          </div>

          {roster.candidates.length === 0 ? (
            <p className="el-find-msg">
              No {office === "G" ? "race" : "candidates"} found for this selection yet. Federal candidates file with the
              FEC on a rolling basis — check back, or widen the district.
            </p>
          ) : (
            <ul className="el-cand-list">
              {roster.candidates.map((c) => (
                <li key={c.id} className="el-cand">
                  <Link className="el-cand-main" href={`/election-lens/candidate/${encodeURIComponent(c.id)}`}>
                    <span className="el-cand-name">{c.name}</span>
                    <span className="el-cand-meta">
                      <span className={`el-party el-party--${(c.partyCode || "").toUpperCase()}`}>{partyTag(c.partyCode, c.party)}</span>
                      {c.status && <span>{c.status}</span>}
                      {c.district && <span>Dist. {c.district}</span>}
                      {c.isRace && <span>See the field →</span>}
                    </span>
                  </Link>
                  <TrackButton
                    candidate={toTarget(c)}
                    initialSignedIn={signedIn}
                    initialTracked={trackedIds.has(c.id)}
                    onChange={(added) =>
                      setTrackedIds((prev) => {
                        const next = new Set(prev);
                        if (added) next.add(c.id);
                        else next.delete(c.id);
                        return next;
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
