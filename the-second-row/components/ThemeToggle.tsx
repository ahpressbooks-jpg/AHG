"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("matinee");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "matinee");
  }, []);

  const flip = () => {
    const next = theme === "matinee" ? "evening" : "matinee";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tsr_theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      className="btn-instrument"
      onClick={flip}
      aria-label={theme === "matinee" ? "Switch to evening performance (dark)" : "Switch to matinee (light)"}
      title="House lights"
    >
      {theme === "matinee" ? "Evening" : "Matinee"}
    </button>
  );
}
