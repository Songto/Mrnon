// Tea of the Day + fortune-cookie draws. The daily tea is deterministic
// (seeded by the calendar date) so every visitor sees the same brew today.

export type Tea = {
  name: string;
  emoji: string;
  note: string;
  mood: string;
};

export const TEAS: Tea[] = [
  { name: "Chamomile Dream", emoji: "🌼", note: "honey & soft meadow", mood: "for slow, sleepy afternoons" },
  { name: "Matcha Morning", emoji: "🍵", note: "grassy & bright", mood: "for focused little quests" },
  { name: "Midnight Oolong", emoji: "🌙", note: "toasted & mellow", mood: "for late-night chats" },
  { name: "Strawberry Rooibos", emoji: "🍓", note: "jammy & warm", mood: "for cheerful catch-ups" },
  { name: "Lavender Earl Grey", emoji: "💜", note: "floral bergamot", mood: "for cozy reading" },
  { name: "Peppermint Frost", emoji: "🌿", note: "cool & clean", mood: "for a fresh restart" },
  { name: "Golden Chai", emoji: "🧡", note: "spiced & creamy", mood: "for rainy windowsills" },
  { name: "Jasmine Cloud", emoji: "☁️", note: "delicate & sweet", mood: "for daydreaming" },
  { name: "Yuzu Honey", emoji: "🍯", note: "citrus & gold", mood: "for gentle pick-me-ups" },
  { name: "Hojicha Hearth", emoji: "🔥", note: "roasty & nutty", mood: "for fireside company" }
];

export const FORTUNES: string[] = [
  "A new friend will pull up a chair at your table soon. 🪑",
  "Plant a little kindness today; it grows faster than you think. 🌱",
  "Your next cozy evening holds an unexpected delight. ✨",
  "Slow down — the best tea is the one you don't rush. 🍵",
  "Someone in the server is hoping you'll say hello. 💌",
  "A small win is brewing. Keep your cup ready. ☕",
  "Today is a good day to start the quest you've been putting off. 🗺️",
  "Warmth shared is warmth doubled. Pour a second cup. 🫖",
  "The garden remembers every drop you give it. 💧",
  "Rest is productive too. Curl up guilt-free. 🛋️",
  "A cozy idea will visit you — write it down before it drifts off. 📒",
  "You belong at this table, exactly as you are. 🌸"
];

// Days since epoch — stable for the whole calendar day.
function dayIndex(date = new Date()): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / 86_400_000);
}

export function teaOfTheDay(date = new Date()): Tea {
  return TEAS[dayIndex(date) % TEAS.length];
}

export function drawFortune(): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}
