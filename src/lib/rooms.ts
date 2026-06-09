// Chat rooms that mirror our OURCHAT Teaparty Discord channels.
// Each one is a cozy table you can pull up a chair to.
export type Room = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  category: string; // matches the Discord category it lives under
  accent: string; // translucent tablecloth tint (dark-theme friendly)
};

export const ROOMS: Room[] = [
  {
    id: "lobby",
    name: "lobby",
    emoji: "💬",
    blurb: "Where everyone first gathers — say hi and pull up a chair.",
    category: "start point",
    accent: "bg-strawberry/15"
  },
  {
    id: "memes",
    name: "memes",
    emoji: "😹",
    blurb: "Drop your funniest finds and cursed screenshots.",
    category: "start point",
    accent: "bg-honey/15"
  },
  {
    id: "screenshot-videos",
    name: "screenshot-videos",
    emoji: "📸",
    blurb: "Show off clutch plays and pretty in-game moments.",
    category: "start point",
    accent: "bg-lavender/15"
  },
  {
    id: "fps-wolf",
    name: "fps wolf",
    emoji: "🐺",
    blurb: "Squad up for shooters and call your next match.",
    category: "game zone",
    accent: "bg-sage/15"
  },
  {
    id: "horror",
    name: "horror",
    emoji: "👻",
    blurb: "Spooky co-op nights — bring a friend to hide behind.",
    category: "game zone",
    accent: "bg-strawberry/15"
  },
  {
    id: "karaoke",
    name: "karaoke",
    emoji: "🎤",
    blurb: "Late-night singalongs under the string lights.",
    category: "game zone",
    accent: "bg-rose/15"
  }
];

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
