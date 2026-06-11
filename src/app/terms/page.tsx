import Link from "next/link";

export const metadata = { title: "Terms of Service · OURCHAT Teaparty" };

const UPDATED = "June 2025";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="cozy-card p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-1 text-sm text-cocoa-soft">Last updated: {UPDATED}</p>

        <p className="mt-4 text-sm text-cocoa-soft">
          Welcome to OURCHAT Teaparty (&quot;Ourchat&quot;, &quot;we&quot;, &quot;us&quot;). By
          using this website you agree to these terms. Please read them — they&apos;re short and
          friendly. 🫖
        </p>

        <Section title="1. Who can use Ourchat">
          Ourchat is a cozy community space. You may use it if you can form a binding agreement in
          your country (generally 13+, or the minimum age where you live). If you&apos;re under that
          age, please ask a parent or guardian.
        </Section>

        <Section title="2. Your account">
          You can join as a guest, with a Discord account, or with an email and password. You&apos;re
          responsible for keeping your login details safe and for everything that happens under your
          account. Please give accurate information and don&apos;t impersonate others.
        </Section>

        <Section title="3. Be cozy & kind">
          This is a welcoming community. Don&apos;t post content that is hateful, harassing,
          threatening, sexually explicit, illegal, or that infringes someone&apos;s rights. Don&apos;t
          spam, scam, or try to break, overload, or hack the service. Be the friend you&apos;d want
          to find here.
        </Section>

        <Section title="4. Your content">
          You keep ownership of what you post (profile text, photos, messages, etc.). By posting it,
          you give us permission to display it on the site so the community can see it. You&apos;re
          responsible for the content you upload and confirm you have the right to share it.
        </Section>

        <Section title="5. Moderation">
          To keep things cozy, we (and our moderators) may remove content or suspend accounts that
          break these terms, at our discretion. You can report profiles or content using the in-app
          tools.
        </Section>

        <Section title="6. The service is provided “as is”">
          Ourchat is a community hobby project offered free of charge. It may change, break, or go
          offline at any time, and chat history and some data may be cleared. To the extent allowed
          by law, we provide the service without warranties and aren&apos;t liable for any losses
          from using it.
        </Section>

        <Section title="7. Changes to these terms">
          We may update these terms as the site grows. If we make a significant change, we&apos;ll do
          our best to let the community know. Continuing to use Ourchat means you accept the updated
          terms.
        </Section>

        <Section title="8. Contact">
          Questions? Reach us in our{" "}
          <a
            href="https://discord.gg/sDgzXBNjx8"
            target="_blank"
            rel="noreferrer"
            className="text-strawberry underline"
          >
            Discord server
          </a>
          .
        </Section>

        <p className="mt-6 text-xs text-cocoa-soft">
          See also our{" "}
          <Link href="/privacy" className="text-strawberry underline">
            Privacy Policy
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
      <p className="mt-1 text-sm text-cocoa-soft [overflow-wrap:anywhere]">{children}</p>
    </div>
  );
}
