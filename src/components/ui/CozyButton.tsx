import Link from "next/link";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "soft" | "ghost" | "discord";

const styles: Record<Variant, string> = {
  primary:
    "bg-rose-deep text-white shadow-cozy hover:bg-rose-deep/90 hover:shadow-cozy-lg",
  soft: "bg-sage text-cocoa shadow-cozy hover:bg-sage-deep hover:text-white",
  ghost: "bg-white/60 text-cocoa hover:bg-white",
  discord: "bg-[#5865F2] text-white shadow-cozy hover:bg-[#4752c4]"
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function CozyButton({
  variant = "primary",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display font-medium transition active:scale-95 disabled:opacity-50 disabled:active:scale-100",
        styles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function CozyLinkButton({
  variant = "primary",
  className,
  href,
  external,
  children
}: CommonProps & { href: string; external?: boolean }) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-display font-medium transition active:scale-95",
    styles[variant],
    className
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
