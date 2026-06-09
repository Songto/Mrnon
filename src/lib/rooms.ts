// Tea-table chat rooms. Each is a themed table you can pull up a chair to.
export type Room = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  accent: string; // tailwind bg color class for the tablecloth
};

export const ROOMS: Room[] = [
  {
    id: "chamomile-corner",
    name: "Chamomile Corner",
    emoji: "🌼",
    blurb: "A gentle, sleepy nook for soft conversation.",
    accent: "bg-honey/40"
  },
  {
    id: "matcha-booth",
    name: "Matcha Booth",
    emoji: "🍵",
    blurb: "Bright and lively — game talk and quick quests.",
    accent: "bg-matcha/60"
  },
  {
    id: "midnight-oolong",
    name: "Midnight Oolong",
    emoji: "🌙",
    blurb: "Late-night lo-fi chats under string lights.",
    accent: "bg-lavender/50"
  },
  {
    id: "strawberry-parlor",
    name: "Strawberry Parlor",
    emoji: "🍓",
    blurb: "Cheerful catch-ups and sweet little wins.",
    accent: "bg-rose/40"
  }
];

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
