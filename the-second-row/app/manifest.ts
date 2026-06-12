import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Second Row — The Wire",
    short_name: "TSR",
    description: "The live civic news board. One row back. Full view.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#101319",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
