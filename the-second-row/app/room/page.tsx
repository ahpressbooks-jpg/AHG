import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { CaptureInline } from "@/components/CaptureInline";

export const metadata: Metadata = { title: "The Room", description: "Live spin rooms, real debates, a members' room — the destination layer." };

export default function RoomPage() {
  return (
    <>
      <SiteHeader current="/company" />
      <div className="wrap wrap--reading page">
        <div className="page-kicker">The Room · the destination</div>
        <h1>The point was never to publish at people.</h1>
        <p className="lede">
          It was to get the people the platform gathered into one room, arguing in good faith,
          with the desk in it. Live Spin Rooms you can attend. Real debates — steelman on stage,
          not dunking. A members&apos; room where the regulars argue between episodes.
        </p>
        <h2>What opens, when</h2>
        <table>
          <tbody>
            <tr><td className="mono">Live-events pass</td><td>A seat at the Spin Rooms and debates, ticketed per night.</td></tr>
            <tr><td className="mono">Members&apos; room</td><td>The digital room for regulars, monthly.</td></tr>
            <tr><td className="mono">Inner circle</td><td>A small annual tier that funds the rest.</td></tr>
          </tbody>
        </table>
        <p>
          A room is only worth entering when there&apos;s already a crowd worth meeting — so The
          Room opens last, on purpose. The Wire and the column fill the seats; The Room sells
          them. Founding Members hold the first seats automatically.
        </p>
        <CaptureInline label="The Room waitlist" line="First nights announce here and by email. One list, no noise." />
      </div>
    </>
  );
}
