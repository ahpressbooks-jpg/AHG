import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Second Row — One row back. Full view.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card: the navy banner, the rows, the promise.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#16202E",
          color: "#EDE6D8",
          padding: 72,
          alignItems: "center",
          gap: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            width: 280,
          }}
        >
          <div style={{ display: "flex", width: 190, height: 26, background: "#64778A", borderRadius: 13 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", width: 14, height: 14, background: "#C0455A", borderRadius: 7 }} />
            <div style={{ display: "flex", width: 210, height: 38, background: "#C0455A", borderRadius: 19 }} />
            <div style={{ display: "flex", width: 14, height: 14, background: "#C0455A", borderRadius: 7 }} />
          </div>
          <div style={{ display: "flex", width: 160, height: 24, background: "#EDE6D8", borderRadius: 12 }} />
          <div style={{ display: "flex", width: 120, height: 20, background: "#EDE6D8", borderRadius: 10 }} />
          <div style={{ display: "flex", width: 84, height: 16, background: "#EDE6D8", borderRadius: 8 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: -1 }}>
            THE SECOND ROW
          </div>
          <div
            style={{
              display: "flex",
              width: 260,
              height: 6,
              background: "#7E2230",
              margin: "26px 0",
              borderRadius: 3,
            }}
          />
          <div style={{ display: "flex", fontSize: 34, color: "#93A5B5", letterSpacing: 6 }}>
            ONE ROW BACK · FULL VIEW
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#93A5B5", marginTop: 28 }}>
            The live board re-ranks every 60 seconds — and shows its work.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
