import Link from "next/link";
import { teaOfTheDay } from "@/lib/tea";
import { TopMembers } from "@/components/TopMembers";
import { TeaOfTheDay } from "@/components/TeaOfTheDay";
import { CozyMascot } from "@/components/CozyMascot";
import { CozyLinkButton } from "@/components/ui/CozyButton";
import { Emoji } from "@/components/ui/CozyGlyph";

const FEATURES = [
  {
    href: "/tearoom",
    emoji: "💬",
    title: "Live chat",
    text: "Hang out in the public lobby, or open a private room with a code just for your friends.",
    tint: "#FFD9E8",
    accent: "#FF6385"
  },
  {
    href: "/members",
    emoji: "🪪",
    title: "Meet the members",
    text: "See everyone who's pulled up a chair — their cards, mottos, and who's online right now.",
    tint: "#DDF0D6",
    accent: "#7FB976"
  },
  {
    href: "/feed",
    emoji: "🌷",
    title: "Find a friend",
    text: "Post a 90-minute card when you're looking for someone to play with, and wave at new friends.",
    tint: "#E5DEFF",
    accent: "#8B7DF0"
  }
];

export default function HomePage() {
  const tea = teaOfTheDay();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          {/* logo with a soft warm halo + gentle float */}
          <span className="rise relative mb-5 inline-block">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-full bg-strawberry/30 blur-2xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="OURCHAT Teaparty"
              className="w-44 rounded-3xl shadow-cozy-lg transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03] motion-safe:animate-float-slow sm:w-52"
            />
          </span>
          <h1 className="rise mt-5 text-4xl leading-[1.08] tracking-tight [text-wrap:balance] sm:text-5xl" style={{ "--d": "0.12s" } as React.CSSProperties}>
            Welcome to{" "}
            <span className="text-strawberry-deep">OURCHAT Teaparty</span>
            <br />
            our cozy little garden <Emoji char="🌸" size={36} className="-mt-1" />
          </h1>
          <p className="rise mt-4 max-w-md text-pretty leading-relaxed text-cocoa-soft" style={{ "--d": "0.24s" } as React.CSSProperties}>
            A warm, slow place to hang out between quests. Steep some tea, chat live in our
            rooms, meet the teaparty members, and stay linked with our Discord — all in one
            cozy spot.
          </p>
          <div className="rise mt-6 flex flex-wrap items-center gap-2" style={{ "--d": "0.32s" } as React.CSSProperties}>
            <CozyLinkButton href="/tearoom" className="px-4 py-2 text-sm">
              Enter the rooms <Emoji char="💬" size={16} className="ml-1" />
            </CozyLinkButton>
            <CozyLinkButton href="/members" variant="soft" className="px-4 py-2 text-sm">
              Meet the members <Emoji char="🪪" size={16} className="ml-1" />
            </CozyLinkButton>
            <CozyLinkButton
              href="https://discord.gg/sDgzXBNjx8"
              external
              variant="discord"
              className="px-4 py-2 text-sm"
            >
              Join our Discord <Emoji char="💌" size={16} className="ml-1" />
            </CozyLinkButton>
          </div>
        </div>

        <div className="rise space-y-4" style={{ "--d": "0.4s" } as React.CSSProperties}>
          <TeaOfTheDay initialTea={tea} />
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose/50 bg-surface/70 px-4 py-1 text-xs font-display text-rose-deep shadow-cozy">
              <Emoji char="🍓" size={15} /> the home of our cozy game community
            </span>
          </div>
        </div>
      </section>

      {/* Top members + features */}
      <section className="fade-up grid gap-6 lg:grid-cols-[360px_1fr]" style={{ animationDelay: "0.1s" }}>
        <TopMembers />
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              style={{ background: `linear-gradient(160deg, ${f.tint}, rgb(var(--c-surface)) 78%)`, "--acc": f.accent } as React.CSSProperties}
              className="group relative flex flex-col overflow-hidden rounded-cozy border border-rose/40 p-5 shadow-cozy transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[color:var(--acc)] hover:shadow-cozy-lg focus-visible:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--acc)]"
            >
              {/* faint glyph watermark — drifts + brightens on hover */}
              <span className="pointer-events-none absolute -bottom-4 -right-3 opacity-[0.12] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:opacity-20">
                <Emoji char={f.emoji} size={120} />
              </span>
              {/* icon chip */}
              <span
                className="relative grid h-12 w-12 place-items-center rounded-2xl shadow-cozy transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                style={{ background: "rgb(var(--c-surface) / 0.85)" }}
              >
                <Emoji char={f.emoji} size={28} />
              </span>
              <h3 className="relative mt-3 text-lg">{f.title}</h3>
              <p className="relative mt-1 text-sm leading-relaxed text-cocoa-soft">{f.text}</p>
              <span
                className="relative mt-auto flex items-center gap-1 pt-4 text-sm font-display"
                style={{ color: f.accent }}
              >
                Explore
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cozy footer note */}
      <section className="fade-up cozy-card flex flex-col items-center gap-2 p-8 text-center sm:p-10" style={{ animationDelay: "0.2s" }}>
        <span className="group relative inline-block cursor-pointer">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 scale-90 rounded-full bg-honey/30 blur-2xl transition-transform duration-500 group-hover:scale-110"
          />
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105">
            <CozyMascot size={128} />
          </span>
        </span>
        <h2 className="mt-1 text-2xl [text-wrap:balance]">Stay a while</h2>
        <p className="max-w-lg text-pretty text-sm leading-relaxed text-cocoa-soft">
          Turn on the rain or fireplace with the music button in the corner, draw a fortune
          while your tea steeps, and let the table fill up. There's always a seat for you.
        </p>
      </section>
    </div>
  );
}
