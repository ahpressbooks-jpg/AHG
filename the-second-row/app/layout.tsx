import type { Metadata, Viewport } from "next";
import BigFooter from "@/components/BigFooter";
import JuneteenthBanner from "@/components/JuneteenthBanner";
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
        <JuneteenthBanner />
        {children}
        <ToolkitBanner />
        <BigFooter />
      </body>
    </html>
  );
}
