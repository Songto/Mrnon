import { clsx } from "@/lib/clsx";

export function CozyCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("cozy-card p-5", className)}>{children}</div>;
}

export function SectionHeading({
  emoji,
  title,
  subtitle
}: {
  emoji: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-2xl">
        <span className="animate-float-slow">{emoji}</span>
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-cocoa-soft">{subtitle}</p>}
    </div>
  );
}
