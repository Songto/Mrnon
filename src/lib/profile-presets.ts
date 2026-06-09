// Cosmetic presets for member profiles — pure data, safe to import on client
// and server. Banners/backgrounds are CSS so they need no hosted image assets;
// members can also paste a custom image URL instead.

export type Preset = { id: string; label: string; css: string };

// Banner = the wide strip behind the avatar at the top of a profile.
export const BANNERS: Preset[] = [
  { id: "berry", label: "Berry", css: "linear-gradient(135deg,#FF5E7E,#E0A6FF)" },
  { id: "matcha", label: "Matcha", css: "linear-gradient(135deg,#9FC79A,#7FD0C0)" },
  { id: "sunset", label: "Sunset", css: "linear-gradient(135deg,#F0A868,#FF5E7E)" },
  { id: "twilight", label: "Twilight", css: "linear-gradient(135deg,#8B7DF0,#C9BCE0)" },
  { id: "honey", label: "Honey", css: "linear-gradient(135deg,#F0C987,#FF8FB0)" },
  { id: "sakura", label: "Sakura", css: "linear-gradient(135deg,#FF8FB0,#FFD9E8)" },
  { id: "ocean", label: "Ocean", css: "linear-gradient(135deg,#5BC0EB,#7FD0C0)" },
  { id: "midnight", label: "Midnight", css: "linear-gradient(135deg,#3a2740,#241829)" }
];

// Background = the full-page wash behind the profile cards.
export const BACKGROUNDS: Preset[] = [
  {
    id: "plum",
    label: "Plum Glow",
    css: "radial-gradient(circle at 20% 10%,rgba(255,94,126,.18),transparent 45%),radial-gradient(circle at 85% 0%,rgba(224,166,255,.16),transparent 45%),#1b1320"
  },
  {
    id: "forest",
    label: "Night Forest",
    css: "radial-gradient(circle at 15% 15%,rgba(143,208,138,.18),transparent 45%),radial-gradient(circle at 90% 10%,rgba(127,208,192,.14),transparent 45%),#141a16"
  },
  {
    id: "lavender",
    label: "Lavender Haze",
    css: "radial-gradient(circle at 25% 10%,rgba(139,125,240,.22),transparent 50%),radial-gradient(circle at 80% 0%,rgba(201,188,224,.16),transparent 45%),#171428"
  },
  {
    id: "peach",
    label: "Peach Sky",
    css: "radial-gradient(circle at 20% 10%,rgba(240,168,104,.18),transparent 45%),radial-gradient(circle at 85% 5%,rgba(255,143,176,.16),transparent 45%),#1f1620"
  },
  {
    id: "starry",
    label: "Starry",
    css: "radial-gradient(white 1px,transparent 1px) 0 0/26px 26px,radial-gradient(white 1px,transparent 1px) 13px 13px/26px 26px,#120e1a"
  },
  {
    id: "cotton",
    label: "Cotton Candy",
    css: "radial-gradient(circle at 30% 10%,rgba(255,143,176,.2),transparent 50%),radial-gradient(circle at 75% 5%,rgba(127,208,235,.16),transparent 45%),#1a1422"
  }
];

export const ACCENTS = [
  "#FF5E7E", "#FF8FB0", "#E0A6FF", "#8B7DF0",
  "#9FC79A", "#7FD0C0", "#F0C987", "#F0A868"
];

// Optional starter "profile theme" music. These play in the visitor's browser.
// Members can paste any direct audio (.mp3/.ogg) or YouTube link instead.
export const MUSIC_SUGGESTIONS: { label: string; url: string }[] = [
  { label: "Lofi beats (YouTube)", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
  { label: "Cozy cottage (YouTube)", url: "https://www.youtube.com/watch?v=lP26UCnoH9s" }
];

export function bannerCss(id: string, url?: string): string {
  if (id === "custom" && url) return `url("${url}") center/cover no-repeat`;
  return (BANNERS.find((b) => b.id === id) ?? BANNERS[0]).css;
}

export function backgroundCss(id: string, url?: string): string {
  if (id === "custom" && url) return `url("${url}") center/cover fixed no-repeat`;
  return (BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0]).css;
}

// Pull a playable embed/audio descriptor out of a user-supplied music URL.
export function parseMusic(url?: string): { kind: "youtube" | "audio" | "none"; id?: string; url?: string } {
  if (!url) return { kind: "none" };
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  if (/\.(mp3|ogg|wav|m4a)(\?|$)/i.test(url)) return { kind: "audio", url };
  // Unknown link — best effort: treat as audio source.
  return { kind: "audio", url };
}
