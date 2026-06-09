import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { Nav } from "@/components/ui/Nav";
import { AmbiencePlayer } from "@/components/AmbiencePlayer";
import { BadgeToaster } from "@/components/BadgeToaster";
import { discordConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ourchat 🫖 — a cozy tea-party game community",
  description:
    "A warm little corner of the internet for our game community. Pull up a chair, sip the tea of the day, grow your garden, and chat live — all linked to our Discord."
};

export const viewport: Viewport = {
  themeColor: "#FBF5EC"
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
          <div className="relative z-10 flex min-h-screen flex-col">
            <Nav />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
            <footer className="border-t border-white/50 px-4 py-6 text-center text-xs text-cocoa-soft">
              Made with 🫖 &amp; 🌿 for our cozy community · Ourchat
            </footer>
          </div>
          <AmbiencePlayer />
          <BadgeToaster />
        </Providers>
      </body>
    </html>
  );
}
