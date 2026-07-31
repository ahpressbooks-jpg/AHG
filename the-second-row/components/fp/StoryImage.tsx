"use client";

import { useState } from "react";
import { coverFor } from "@/lib/cover";

// Renders the source feed's image when present; falls back to an on-brand
// generative cover (zero rights) — and swaps to it if the remote image fails.
export default function StoryImage({
  src,
  id,
  tier,
  beats,
  alt,
  className,
}: {
  src?: string;
  id: string;
  tier?: string;
  beats?: string[];
  alt: string;
  className?: string;
}) {
  const cover = coverFor({ id, tier, beats });
  const [url, setUrl] = useState(src || cover);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => url !== cover && setUrl(cover)}
    />
  );
}
