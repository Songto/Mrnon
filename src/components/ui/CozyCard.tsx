import { clsx } from "@/lib/clsx";
import { Icon, type IconName } from "./Icon";

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
  icon,
  emoji,
  title,
  subtitle
}: {
  icon?: IconName;
  emoji?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-2xl">
        {icon ? (
          <span className="text-strawberry">
            <Icon name={icon} size={26} strokeWidth={2} />
          </span>
        ) : (
          <span className="animate-float-slow">{emoji}</span>
        )}
        {title}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-cocoa-soft">{subtitle}</p>}
    </div>
  );
}
