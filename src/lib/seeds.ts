// The seed gacha: 10 famous plants across three rarity tiers.
// Pure data + a weighted roll — shared by server and client.

export type SeedRarity = "regular" | "rare" | "legendary";

export type SeedDef = {
  id: string;
  name: string;
  emoji: string;
  rarity: SeedRarity;
  blurb: string;
};

export const RARITY_META: Record<
  SeedRarity,
  { label: string; color: string; chance: number }
> = {
  regular: { label: "Regular", color: "#7FB976", chance: 0.6 },
  rare: { label: "Rare", color: "#8B7DF0", chance: 0.3 },
  legendary: { label: "Legendary", color: "#F0A848", chance: 0.1 }
};

export const SEEDS: SeedDef[] = [
  // — Regular (3)
  { id: "sunflower", name: "Sunflower", emoji: "🌻", rarity: "regular", blurb: "Always turns to face the bright side." },
  { id: "tulip", name: "Tulip", emoji: "🌷", rarity: "regular", blurb: "A spring classic, cozy in every colour." },
  { id: "daisy", name: "Daisy", emoji: "🌼", rarity: "regular", blurb: "Simple, sweet, and always smiling." },
  // — Rare (3)
  { id: "rose", name: "Rose", emoji: "🌹", rarity: "rare", blurb: "The most famous flower in the world." },
  { id: "lotus", name: "Lotus", emoji: "🪷", rarity: "rare", blurb: "Blooms beautifully out of the muddiest pond." },
  { id: "lavender", name: "Lavender", emoji: "🪻", rarity: "rare", blurb: "A calming scent for late-night chats." },
  // — Legendary (4)
  { id: "sakura", name: "Sakura", emoji: "🌸", rarity: "legendary", blurb: "Cherry blossom — beauty that visits once a year." },
  { id: "clover", name: "Four-Leaf Clover", emoji: "🍀", rarity: "legendary", blurb: "1-in-10,000 luck, now in your garden." },
  { id: "fairy-mushroom", name: "Fairy Mushroom", emoji: "🍄", rarity: "legendary", blurb: "Grows only where the fae have danced." },
  { id: "lucky-bamboo", name: "Lucky Bamboo", emoji: "🎋", rarity: "legendary", blurb: "Brings fortune to the whole tearoom." }
];

export function seedById(id: string): SeedDef | undefined {
  return SEEDS.find((s) => s.id === id);
}

// Weighted roll: pick a tier by chance, then a seed uniformly within it.
export function rollSeed(rand: () => number = Math.random): SeedDef {
  const r = rand();
  let tier: SeedRarity;
  if (r < RARITY_META.legendary.chance) tier = "legendary";
  else if (r < RARITY_META.legendary.chance + RARITY_META.rare.chance) tier = "rare";
  else tier = "regular";
  const pool = SEEDS.filter((s) => s.rarity === tier);
  return pool[Math.floor(rand() * pool.length)];
}
