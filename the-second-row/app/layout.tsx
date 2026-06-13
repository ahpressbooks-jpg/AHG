import type { Metadata, Viewport } from "next";
import ToolkitBanner from "@/components/ToolkitBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "The Second Row — The Wire",
    template: "%s · The Second Row",
  },
  description:
    "An independent news and media company. The live board re-ranks every 60 seconds by GRAVITY — and shows its work on every rank. One row back. Full view. Founded at 21.",
  openGraph: { siteName: "The Second Row", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#10161F" },
  ],
};

// House Lights: Daylight by day, Evening by night, reader override wins.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("tsr_theme");
    if (saved === "matinee") saved = "daylight";
    var hour = new Date().getHours();
    var auto = (hour >= 20 || hour < 6) ? "evening" : "daylight";
    document.documentElement.setAttribute("data-theme", saved === "daylight" || saved === "evening" ? saved : auto);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "daylight");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="daylight" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#house">
          Skip to the board
        </a>
        {children}
        <ToolkitBanner />
        <footer className="footer">
          <div className="wrap">
            <div className="footer-rows">
              <a href="/">The Wire</a>
              <a href="/today">Today</a>
              <a href="/spin">The Spin Room</a>
              <a href="/ledger">The Ledger</a>
              <a href="/column">From the Second Row</a>
              <a href="/company">The Company</a>
            </div>
            <div className="footer-rows">
              <a href="/weather">Civic Weather</a>
              <a href="/board-read">The Board Read</a>
              <a href="/gravity">GRAVITY</a>
              <a href="/tilt">The Tilt Meter</a>
              <a href="/glass">The Glass Desk</a>
              <a href="/rewind">The Rewind</a>
              <a href="/third-act">The Third Act</a>
              <a href="/documents">Documents</a>
              <a href="/assignment-desk">Assignment Desk</a>
              <a href="/seasons">Judgment Seasons</a>
              <a href="/predictions-night">Predictions Night</a>
              <a href="/toolkit">The Toolkit</a>
              <a href="/glossary">The Glossary</a>
              <a href="/classroom">Classroom</a>
              <a href="/course">Think for Yourself</a>
              <a href="/room">The Room</a>
              <a href="/widget">Embed the board</a>
              <a href="/founding">The Founding 500</a>
              <a href="/search">Search</a>
              <a href="/subscribe">Subscribe</a>
              <a href="/press">Press</a>
              <a href="/standards">Standards</a>
              <a href="/method">Method</a>
              <a href="/you">Your Seat</a>
              <a href="/desk">The Desk</a>
            </div>
            <div>
              THE SECOND ROW · an independent news &amp; media company · founded at 21 · one row
              back, full view. The news is free; the depth is how it stays free. Headlines link to
              their sources; the board shows its work; nothing you touched is ever lost.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
