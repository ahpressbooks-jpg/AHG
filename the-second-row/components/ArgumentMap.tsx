import { ArgMap } from "@/lib/extras";

// ARGUMENT MAP — the claim, its strongest support, its strongest opposition,
// steelman-structured. Desk-authored; rendered when present.
export default function ArgumentMap({ map }: { map: ArgMap }) {
  return (
    <div className="argmap">
      <div className="argmap-claim">
        <span className="argmap-kicker">The claim</span>
        {map.claim}
      </div>
      <div className="argmap-cols">
        <div className="argmap-col argmap-col--for">
          <span className="argmap-kicker">Strongest for</span>
          <ul>{map.forPts.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
        <div className="argmap-col argmap-col--against">
          <span className="argmap-kicker">Strongest against</span>
          <ul>{map.againstPts.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      </div>
      {map.verdict && (
        <div className="argmap-verdict">
          <span className="argmap-kicker">Where the desk lands</span>
          {map.verdict}
        </div>
      )}
    </div>
  );
}
