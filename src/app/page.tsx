import Link from "next/link";
import { teaOfTheDay } from "@/lib/tea";
import { DiscordWidget } from "@/components/DiscordWidget";
import { TeaOfTheDay } from "@/components/TeaOfTheDay";
import { CozyLinkButton } from "@/components/ui/CozyButton";

const FEATURES = [
  {
    href: "/tearoom",
    emoji: "💬",
    title: "Live chat",
    text: "Hang out in the public lobby, or open a private room with a code just for your friends."
  },
  {
    href: "/members",
    emoji: "🪪",
    title: "Meet the members",
    text: "From Householders to Inner Members — see everyone's place at the table and who's online."
  },
  {
    href: "/feed",
    emoji: "🌷",
    title: "Find a friend",
    text: "Post a 90-minute card when you're looking for someone to play with, and wave at new friends."
  }
];

export default function HomePage() {
  const tea = teaOfTheDay();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-surface/70 px-4 py-1 text-xs font-display text-strawberry">
            🍓 the home of our cozy game community
          </span>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-strawberry to-sage-deep bg-clip-text text-transparent">
              OURCHAT Teaparty
            </span>
            <br />
            our cozy little garden 🌸
          </h1>
          <p className="mt-4 max-w-md text-cocoa-soft">
            A warm, slow place to hang out between quests. Steep some tea, chat live in our
            rooms, meet the teaparty members, and stay linked with our Discord — all in one
            cozy spot.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CozyLinkButton href="/tearoom">Enter the rooms 💬</CozyLinkButton>
            <CozyLinkButton href="/members" variant="soft">
              Meet the members 🪪
            </CozyLinkButton>
          </div>
        </div>

        <div className="space-y-4">
          <TeaOfTheDay initialTea={tea} />
        </div>
      </section>

      {/* Discord + features */}
      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <DiscordWidget />
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="cozy-card group flex flex-col p-5 transition hover:-translate-y-1 hover:shadow-cozy-lg"
            >
              <span className="text-4xl transition group-hover:animate-wiggle">{f.emoji}</span>
              <h3 className="mt-3 text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-cocoa-soft">{f.text}</p>
              <span className="mt-auto pt-3 text-sm font-display text-rose-deep">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cozy footer note */}
      <section className="cozy-card flex flex-col items-center gap-2 p-8 text-center">
        <span className="text-4xl animate-float-slow">🌙🫖🌿</span>
        <h2 className="text-2xl">Stay a while</h2>
        <p className="max-w-lg text-sm text-cocoa-soft">
          Turn on the rain or fireplace with the music button in the corner, draw a fortune
          while your tea steeps, and let the table fill up. There's always a seat for you.
        </p>
      </section>
    </div>
  );
}
