import Link from "next/link";

export const metadata = { title: "Privacy Policy · OURCHAT Teaparty" };

const UPDATED = "June 2025";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="cozy-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-1 text-sm text-cocoa-soft">Last updated: {UPDATED}</p>

        <p className="mt-4 text-sm text-cocoa-soft">
          This explains what information OURCHAT Teaparty (&quot;Ourchat&quot;) collects, why, and
          what you can do about it. We keep it to the minimum needed to run a cozy community. 🌸
        </p>

        <Section title="What we collect">
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <b>Account info:</b> a display name, and — depending on how you sign in — your email
              address (for email accounts) or basic Discord profile info (your Discord username,
              user ID, and avatar) if you choose &quot;Sign in with Discord&quot;.
            </li>
            <li>
              <b>Profile content:</b> anything you add to your profile — bio, motto, photos,
              showcases, links, and cosmetic choices.
            </li>
            <li>
              <b>Activity:</b> things like messages you send, mini-games you play, seeds you collect,
              badges, likes, and which days you visit — used for the garden, quests, and badges.
            </li>
            <li>
              <b>Passwords:</b> if you register with email, your password is stored only as a secure
              one-way <i>hash</i> — we never see or store the actual password.
            </li>
          </ul>
        </Section>

        <Section title="What we DON'T do">
          We don&apos;t sell your data, we don&apos;t show ads, and we don&apos;t track you across
          other websites.
        </Section>

        <Section title="How we use it">
          Only to run the site — to show your profile and cards to the community, power the chat,
          garden, games, and badges, and keep the place safe and cozy.
        </Section>

        <Section title="Where it's stored">
          Your data is stored on our hosting provider&apos;s servers to run the service. Chat
          messages are temporary (only the most recent few are kept, then deleted), and some data may
          be cleared during updates.
        </Section>

        <Section title="Cookies">
          We use a small login cookie to keep you signed in. We don&apos;t use advertising or
          third-party tracking cookies. Some preferences (like your guest name and ambience volume)
          are saved in your browser&apos;s local storage on your device.
        </Section>

        <Section title="Sharing">
          Content you post (profile, comments, photos) is visible to other members — that&apos;s the
          point of a community! We only share data with the services needed to run the site (e.g.
          our host, and Discord if you use Discord login). We may disclose info if required by law.
        </Section>

        <Section title="Your choices & rights">
          You can edit or remove most of your content anytime from your profile. To delete your
          account or request a copy of your data, contact us in our{" "}
          <a
            href="https://discord.gg/sDgzXBNjx8"
            target="_blank"
            rel="noreferrer"
            className="text-strawberry underline"
          >
            Discord server
          </a>{" "}
          and we&apos;ll help.
        </Section>

        <Section title="Children">
          Ourchat isn&apos;t aimed at children under 13. If you believe a child has given us personal
          info, contact us and we&apos;ll remove it.
        </Section>

        <Section title="Changes">
          We may update this policy as the site grows; we&apos;ll note the date above when we do.
        </Section>

        <p className="mt-6 text-xs text-cocoa-soft">
          See also our{" "}
          <Link href="/terms" className="text-strawberry underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2 className="font-display text-lg">{title}</h2>
      <div className="mt-1 text-sm text-cocoa-soft [overflow-wrap:anywhere]">{children}</div>
    </div>
  );
}
