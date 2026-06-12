"use client";

import { useEffect, useState } from "react";

// Flips the `dark` class on <html> and remembers the choice. The initial class
// is set by an inline script in layout.tsx (so there's no flash of the wrong
// theme); this button just reflects and toggles it.
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ourchat:theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-surface/70"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
