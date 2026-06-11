import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getAuthUserByEmail } from "./db";

export const discordConfigured = Boolean(
  process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
);

export const authOptions: NextAuthOptions = {
  providers: [
    // Email + password accounts (always available).
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(creds) {
        const email = (creds?.email || "").toString();
        const password = (creds?.password || "").toString();
        if (!email || !password) return null;
        const user = getAuthUserByEmail(email);
        if (!user) return null;
        if (!bcrypt.compareSync(password, user.passwordHash)) return null;
        return { id: user.userId, name: user.name, email: user.email };
      }
    }),
    // Discord OAuth (only if configured).
    ...(discordConfigured
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: "identify guilds" } }
          })
        ]
      : [])
  ],
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET || "ourchat-dev-secret-change-me",
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, profile }) {
      // Email login: `user` is the object returned by authorize().
      if (user) {
        token.uid = (user as { id?: string }).id;
        token.source = "email";
      }
      // Discord login: `profile` is the Discord profile.
      if (profile) {
        const p = profile as { id?: string; username?: string; avatar?: string };
        if (p.id) {
          token.uid = `discord:${p.id}`;
          token.discordId = p.id;
        }
        if (p.username) token.name = p.username;
        if (p.id && p.avatar) {
          token.picture = `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png`;
        }
        token.source = "discord";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as { uid?: string; discordId?: string; source?: string };
        u.uid = token.uid as string | undefined;
        u.discordId = token.discordId as string | undefined;
        u.source = token.source as string | undefined;
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    }
  }
};
