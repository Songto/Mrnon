import Link from "next/link";

export default function NotFound() {
  return (
    <div className="cozy-card mx-auto mt-10 flex max-w-md flex-col items-center gap-3 p-10 text-center">
      <div className="text-6xl animate-float-slow">🌿</div>
      <h2 className="text-2xl">This corner is empty</h2>
      <p className="max-w-sm text-sm text-cocoa-soft">
        We couldn&apos;t find that page. Let&apos;s head back to the parlor and put the kettle on.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-strawberry px-5 py-2 text-sm font-display text-night shadow-cozy transition hover:-translate-y-0.5"
      >
        Back to the parlor 🏡
      </Link>
    </div>
  );
}
