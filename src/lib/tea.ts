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
  "You belong at this table, exactly as you are. 🌸",
  "A good laugh is closer than you think. 😊",
  "The friend you make today, you'll be glad you did. 🤝",
  "Tend to yourself like a little plant: water, light, patience. 🪴",
  "Your favourite song is about to find you again. 🎶",
  "A quiet morning will bring a loud joy. ☀️",
  "Say yes to the game night — it's the one. 🎮",
  "The kettle's whistle is the universe saying 'breathe'. 🌬️",
  "Small steps still cross big rooms. 👣",
  "Someone remembers your kindness more than you know. 💗",
  "Today's mistake is tomorrow's good story. 📖",
  "A cozy blanket and a clear mind await you tonight. 🌙",
  "Luck favours the one who shows up — so show up. 🍀",
  "You'll win something tiny and grin about it all day. 🏆",
  "Reach out first; they were too shy to. 📞",
  "The seed you doubt is the one that blooms. 🌼",
  "A snack break now will save the whole afternoon. 🍪",
  "Your patience is about to pay off, gently. ⏳",
  "Make space for wonder; it likes to visit you. 🌟",
  "An old hobby is calling you back for tea. 🎨",
  "You are someone's favourite person to see online. 💫",
  "Be soft with yourself; you're doing better than you think. 🫧",
  "A door you forgot about is unlocked. 🚪",
  "The cozy chaos will sort itself out. 🧶",
  "Compliment someone today; watch the ripple. 🌊",
  "Your next cup of tea tastes a little like home. 🏡",
  "Adventure is just a comfy detour away. 🍂",
  "Trust the slow days; they're saving up something good. 🐌",
  "A tiny act of courage will feel huge later. 🦋",
  "Let the rain be background music, not a mood. 🌧️",
  "You'll find the thing you lost when you stop looking. 🔎",
  "Someone is grateful you exist, exactly today. 🌷",
  "A warm message will arrive right when you need it. ✉️",
  "Give the new game a chance — it's about to click. 🕹️",
  "Your cozy corner is happier with you in it. 🛖",
  "Today, choose the option that sounds the most fun. 🎈",
  "A friendly rivalry will make you both better. ♟️",
  "The kettle is full and so is your luck. 🍵",
  "You'll teach someone something without even trying. 💡",
  "An afternoon nap is a tiny, perfect vacation. 😴",
  "Your laughter will fix someone's whole day. 🤣",
  "Keep the window cracked; good news likes a breeze. 🪟",
  "A sweet surprise is steeping just for you. 🍮",
  "The cozy league needs your player today. 🎲",
  "Be the friend you'd want to find here. 🌻",
  "Something you planted long ago is finally fruiting. 🍓",
  "Tonight's chat will be the highlight of the week. 💬",
  "Stay a while — the best part hasn't happened yet. 🌈"
];

// Days since epoch — stable for the whole calendar day.
function dayIndex(date = new Date()): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(utc / 86_400_000);
}

export function teaOfTheDay(date = new Date()): Tea {
  return TEAS[dayIndex(date) % TEAS.length];
}

// One deterministic fortune per calendar day (cycles through all 60, then loops).
export function fortuneOfDay(date = new Date()): string {
  return FORTUNES[dayIndex(date) % FORTUNES.length];
}

// Stable "today" key, used to limit cracking to once per day per person.
export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function drawFortune(): string {
  return fortuneOfDay();
}
