import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const discordConfigured = Boolean(
  process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
);

export const authOptions: NextAuthOptions = {
  providers: discordConfigured
    ? [
        DiscordProvider({
          clientId: process.env.DISCORD_CLIENT_ID!,
          clientSecret: process.env.DISCORD_CLIENT_SECRET!,
          authorization: { params: { scope: "identify guilds" } }
        })
      ]
    : [],
  secret: process.env.NEXTAUTH_SECRET || "ourchat-dev-secret-change-me",
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        // Discord profile fields
        const p = profile as { id?: string; username?: string; avatar?: string };
        if (p.id) token.discordId = p.id;
        if (p.username) token.discordName = p.username;
        if (p.id && p.avatar) {
          token.picture = `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png`;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { discordId?: string }).discordId = token.discordId as string | undefined;
        if (token.discordName) session.user.name = token.discordName as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    }
  }
};
