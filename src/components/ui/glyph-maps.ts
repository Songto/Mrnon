// Maps the app's existing keys/emoji to CozyGlyph motifs, so callers can keep
// using their stable keys (role, garden-stage) or even raw emoji strings and
// get the matching hand-drawn glyph.

import type { GlyphName } from "./CozyGlyph";
import type { Role } from "@/lib/roles";

export const ROLE_GLYPH: Record<Role, GlyphName> = {
  admin: "crown",
  moderator: "shield",
  vip: "vipHeart",
  member: "tulip"
};

// Garden growth-stage keys (see GROWTH_STAGES in lib/db.ts).
export const STAGE_GLYPH: Record<string, GlyphName> = {
  seed: "acorn",
  sprout: "sprout",
  leafy: "leafy",
  budding: "potted",
  bloom: "blossom",
  flourishing: "hibiscus"
};

// Raw emoji → glyph. Covers the role/stage/quest emoji plus the decorative
// ones sprinkled through copy and buttons. Anything not listed falls back to
// the original emoji (so nothing ever disappears).
export const EMOJI_GLYPH: Record<string, GlyphName> = {
  "👑": "crown",
  "🛡️": "shield",
  "🛡": "shield",
  "💖": "vipHeart",
  "💗": "vipHeart",
  "🌷": "tulip",
  "🌰": "acorn",
  "🌱": "sprout",
  "🌿": "leafy",
  "🪴": "potted",
  "🌸": "blossom",
  "🌺": "hibiscus",
  "🍵": "teacup",
  "🫖": "teapot",
  "💬": "chatBubble",
  "🌙": "moon",
  "🏡": "house",
  "🏠": "house",
  "💧": "droplet",
  "🎲": "dice",
  "🪞": "mirror",
  "🍓": "strawberry",
  "✨": "sparkles",
  "⭐": "star",
  "🌟": "star",
  "🎀": "ribbon",
  "❤️": "heart",
  "❤": "heart",
  "🤍": "heart",
  // flowers & plants
  "🌼": "daisy",
  "🌻": "sunflower",
  "🌹": "rose",
  "🪷": "lotus",
  "🪻": "lavender",
  "🍀": "clover",
  "🍄": "mushroom",
  "🎋": "bamboo",
  "🌳": "tree",
  "🌲": "tree",
  // cozy objects & ambience
  "💜": "purpleHeart",
  "🧡": "orangeHeart",
  "☁️": "cloud",
  "☁": "cloud",
  "🍯": "honey",
  "🔥": "fire",
  "🌧️": "rainCloud",
  "🌧": "rainCloud",
  "🎐": "windChime",
  "🎶": "musicNote",
  "🎵": "musicNote",
  "☕": "coffee",
  "☕️": "coffee",
  "🪪": "idCard",
  "📝": "memo",
  "📸": "camera",
  "💌": "envelope",
  "✉️": "envelope",
  "✉": "envelope",
  "🔑": "key",
  "🌍": "globe",
  "🌎": "globe",
  "🌏": "globe",
  "🥚": "egg",
  "😌": "contentFace",
  "🤝": "handshake"
};
