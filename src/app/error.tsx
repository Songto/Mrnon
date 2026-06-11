"use client";

import { useEffect } from "react";

// Friendly catch-all so a hiccup shows a cozy page (with a retry) instead of a
// scary raw crash. The message/digest is shown so issues are easy to report.
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console + server logs for debugging.
    console.error("Ourchat page error:", error);
  }, [error]);

  return (
    <div className="cozy-card mx-auto mt-10 flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <div className="text-6xl animate-wiggle">🫖</div>
      <h2 className="text-2xl">Oops — the tea went cold</h2>
      <p className="max-w-sm text-sm text-cocoa-soft">
        Something steeped wrong on this page. Give it a fresh pour — it usually sorts itself out.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-strawberry px-5 py-2 text-sm font-display text-night shadow-cozy transition hover:-translate-y-0.5"
      >
        Try again ☕
      </button>
      {error?.digest && (
        <p className="mt-2 text-[10px] text-cocoa-soft/70">ref: {error.digest}</p>
      )}
    </div>
  );
}
