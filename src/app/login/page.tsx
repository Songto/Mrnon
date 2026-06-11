"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useIdentity, randomGuestName } from "@/lib/identity";
import { CozyButton } from "@/components/ui/CozyButton";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { discordEnabled, setGuestName } = useIdentity();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        const reg = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        }).then((r) => r.json());
        if (!reg.ok) {
          setError(reg.error || "Could not create your account.");
          return;
        }
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.ok) router.push("/");
      else setError("Wrong email or password.");
    } catch {
      setError("Something went wrong — try again.");
    } finally {
      setBusy(false);
    }
  };

  const guest = () => {
    setGuestName(randomGuestName());
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="cozy-card p-6 sm:p-8">
        <h1 className="text-center text-2xl font-bold">
          {mode === "login" ? "Welcome back 🫖" : "Join the teaparty 🍓"}
        </h1>
        <p className="mt-1 text-center text-sm text-cocoa-soft">
          {mode === "login"
            ? "Log in to your cozy account."
            : "Create an account to keep your profile, seeds, and badges."}
        </p>

        {/* tabs */}
        <div className="mt-4 flex rounded-full bg-cocoa/5 p-1 text-sm font-display">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 rounded-full py-1.5 transition ${
                mode === m ? "bg-strawberry text-night shadow-cozy" : "text-cocoa-soft"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              maxLength={24}
              required
              className="w-full rounded-2xl border border-cocoa/10 bg-surface px-4 py-2.5 text-sm outline-none focus:border-strawberry"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={120}
            required
            className="w-full rounded-2xl border border-cocoa/10 bg-surface px-4 py-2.5 text-sm outline-none focus:border-strawberry"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            maxLength={200}
            required
            className="w-full rounded-2xl border border-cocoa/10 bg-surface px-4 py-2.5 text-sm outline-none focus:border-strawberry"
          />
          {error && <p className="text-sm text-strawberry">{error}</p>}
          <CozyButton disabled={busy} className="w-full">
            {busy ? "…" : mode === "login" ? "Log in" : "Create account 🌷"}
          </CozyButton>
        </form>

        {discordEnabled && (
          <>
            <div className="my-4 flex items-center gap-2 text-[11px] text-cocoa-soft">
              <span className="h-px flex-1 bg-cocoa/10" /> or <span className="h-px flex-1 bg-cocoa/10" />
            </div>
            <CozyButton variant="discord" onClick={() => signIn("discord")} className="w-full">
              Sign in with Discord 💌
            </CozyButton>
          </>
        )}

        <div className="mt-4 text-center text-xs text-cocoa-soft">
          <button onClick={guest} className="underline hover:text-strawberry">
            or just look around as a guest →
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-cocoa-soft">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
