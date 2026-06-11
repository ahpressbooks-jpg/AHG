import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "The Second Row — The Wire",
    template: "%s · The Second Row",
  },
  description:
    "A live civic news board that re-ranks itself every 60 seconds — and shows its work on every rank. One row back. Full view.",
  openGraph: {
    siteName: "The Second Row",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDE6D8" },
    { media: "(prefers-color-scheme: dark)", color: "#131D2B" },
  ],
};

// House Lights: Matinee by day, Evening Performance by night, reader override
// wins. Runs before paint so the curtain never flickers.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("tsr_theme");
    var hour = new Date().getHours();
    var auto = (hour >= 19 || hour < 7) ? "evening" : "matinee";
    document.documentElement.setAttribute("data-theme", saved === "matinee" || saved === "evening" ? saved : auto);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "matinee");
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="matinee" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700;8..60,900&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#house">
          Skip to the board
        </a>
        {children}
        <footer className="footer">
          <div className="wrap">
            <div className="footer-rows">
              <a href="/">The Wire</a>
              <a href="/briefing">The Briefing</a>
              <a href="/spin">The Spin Room</a>
              <a href="/ledger">The Ledger</a>
              <a href="/method">The Method</a>
              <a href="/about">The Seat</a>
              <a href="/standards">Standards</a>
            </div>
            <div>
              THE SECOND ROW · an independent civic platform · one row back, full view.
              Headlines link to their sources; the board shows its work.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
