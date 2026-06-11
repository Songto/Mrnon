import Link from "next/link";
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { Nav } from "@/components/ui/Nav";
import { AmbiencePlayer } from "@/components/AmbiencePlayer";
import { BadgeToaster } from "@/components/BadgeToaster";
import { Clouds } from "@/components/Clouds";
import { discordConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "OURCHAT Teaparty 🍓 — our cozy game community",
  description:
    "The home of the OURCHAT Teaparty community. Pull up a chair, sip the tea of the day, meet the members, and chat live in our cozy rooms — all linked to our Discord.",
  icons: { icon: "/logo.png", apple: "/logo.png" }
};

export const viewport: Viewport = {
  themeColor: "#DCEEFF"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Quicksand:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers discordEnabled={discordConfigured}>
          <Clouds />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Nav />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
            <footer className="border-t border-cocoa/10 px-4 py-6 text-center text-xs text-cocoa-soft">
              <p>Made with 🍓 &amp; 🫖 for the OURCHAT Teaparty · welcome home</p>
              <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <Link href="/terms" className="hover:text-strawberry hover:underline">
                  Terms of Service
                </Link>
                <span aria-hidden>·</span>
                <Link href="/privacy" className="hover:text-strawberry hover:underline">
                  Privacy Policy
                </Link>
                <span aria-hidden>·</span>
                <a
                  href="https://discord.gg/sDgzXBNjx8"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-strawberry hover:underline"
                >
                  Discord
                </a>
              </p>
            </footer>
          </div>
          <AmbiencePlayer />
          <BadgeToaster />
        </Providers>
      </body>
    </html>
  );
}
