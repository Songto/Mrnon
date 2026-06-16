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
    tint: "#FFD9E8"
  },
  {
    href: "/members",
    emoji: "🪪",
    title: "Meet the members",
    text: "See everyone who's pulled up a chair — their cards, mottos, and who's online right now.",
    tint: "#DDF0D6"
  },
  {
    href: "/feed",
    emoji: "🌷",
    title: "Find a friend",
    text: "Post a 90-minute card when you're looking for someone to play with, and wave at new friends.",
    tint: "#E5DEFF"
  }
];

export default function HomePage() {
  const tea = teaOfTheDay();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="fade-up grid items-center gap-8 lg:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="OURCHAT Teaparty"
            className="mb-5 w-44 rounded-3xl shadow-cozy-lg sm:w-52"
          />
          <span className="inline-flex items-center gap-1 rounded-full bg-surface/70 px-4 py-1 text-xs font-display text-strawberry">
            <Emoji char="🍓" size={15} /> the home of our cozy game community
          </span>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-strawberry to-sage-deep bg-clip-text text-transparent">
              OURCHAT Teaparty
            </span>
            <br />
            our cozy little garden <Emoji char="🌸" size={36} />
          </h1>
          <p className="mt-4 max-w-md text-cocoa-soft">
            A warm, slow place to hang out between quests. Steep some tea, chat live in our
            rooms, meet the teaparty members, and stay linked with our Discord — all in one
            cozy spot.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
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

        <div className="space-y-4">
          <TeaOfTheDay initialTea={tea} />
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
              className="group relative flex flex-col overflow-hidden rounded-cozy border border-rose/40 p-5 shadow-cozy transition hover:-translate-y-1 hover:shadow-cozy-lg"
              style={{ background: `linear-gradient(160deg, ${f.tint}, #FFFFFF 75%)` }}
            >
              {/* faint emoji watermark */}
              <span className="pointer-events-none absolute -bottom-3 -right-2 opacity-10">
                <Emoji char={f.emoji} size={112} />
              </span>
              <span className="relative transition group-hover:animate-wiggle">
                <Emoji char={f.emoji} size={40} />
              </span>
              <h3 className="relative mt-3 text-lg">{f.title}</h3>
              <p className="relative mt-1 text-sm text-cocoa-soft">{f.text}</p>
              <span className="relative mt-auto pt-3 text-sm font-display text-rose-deep">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cozy footer note */}
      <section className="fade-up cozy-card flex flex-col items-center gap-2 p-8 text-center" style={{ animationDelay: "0.2s" }}>
        <CozyMascot size={128} />
        <h2 className="text-2xl">Stay a while</h2>
        <p className="max-w-lg text-sm text-cocoa-soft">
          Turn on the rain or fireplace with the music button in the corner, draw a fortune
          while your tea steeps, and let the table fill up. There's always a seat for you.
        </p>
      </section>
    </div>
  );
}
