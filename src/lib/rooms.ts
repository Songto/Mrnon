// The single public room. Everything else is a private room you open with a
// shareable code (see ChatRoom) — those live only in the server's memory and
// vanish when the last person leaves.
export type Room = {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  accent: string;
};

export const LOBBY: Room = {
  id: "lobby",
  name: "lobby",
  emoji: "💬",
  blurb: "The cozy public table — say hi and pull up a chair.",
  accent: "bg-strawberry/15"
};

export const ROOMS: Room[] = [LOBBY];

export function roomById(id: string): Room | undefined {
  return ROOMS.find((r) => r.id === id);
}
