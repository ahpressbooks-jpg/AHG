import localFont from "next/font/local";

// Redesign brief: self-hosted woff2 via next/font/local, display swap, subset —
// never Google Fonts at runtime. The woff2 come from the @fontsource packages
// (deps in package.json) so no binaries live in the repo; next/font copies them
// into the build output at build time, keeping them self-hosted.
// Lora (display + pull-quotes), IBM Plex Serif (body), IBM Plex Mono (labels).

export const lora = localFont({
  src: [
    { path: "../node_modules/@fontsource/lora/files/lora-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../node_modules/@fontsource/lora/files/lora-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../node_modules/@fontsource/lora/files/lora-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lora",
  display: "swap",
});

export const plexSerif = localFont({
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/ibm-plex-serif/files/ibm-plex-serif-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-serif",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const tsrFontVars = `${lora.variable} ${plexSerif.variable} ${plexMono.variable}`;
