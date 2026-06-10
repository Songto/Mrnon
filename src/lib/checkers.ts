// A small, self-contained checkers (draughts) engine — 8x8, English/American
// rules: men move forward diagonally, kings move both ways, captures are
// mandatory, multi-jumps must be continued. Pure & serializable so the same
// code runs on the Socket.IO server and in the browser.

export type Color = "r" | "b";
export type Piece = { c: Color; k: boolean } | null;
export type Board = Piece[]; // length 64, index = row * 8 + col
export type Move = { from: number; to: number; captured: number | null };

export const SIZE = 8;

export function rc(i: number): [number, number] {
  return [Math.floor(i / SIZE), i % SIZE];
}
export function idx(r: number, c: number): number {
  return r * SIZE + c;
}
export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}
export function isDark(r: number, c: number): boolean {
  return (r + c) % 2 === 1; // pieces live on dark squares
}
export function other(c: Color): Color {
  return c === "r" ? "b" : "r";
}

export function initialBoard(): Board {
  const b: Board = Array(64).fill(null);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isDark(r, c)) continue;
      if (r <= 2) b[idx(r, c)] = { c: "b", k: false }; // black at top
      else if (r >= 5) b[idx(r, c)] = { c: "r", k: false }; // red at bottom
    }
  }
  return b;
}

// Diagonal directions a piece may move/jump.
function dirs(p: NonNullable<Piece>): [number, number][] {
  const fwd = p.c === "r" ? -1 : 1; // red moves up, black moves down
  if (p.k) return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  return [[fwd, 1], [fwd, -1]];
}

function jumpsFrom(board: Board, i: number): Move[] {
  const p = board[i];
  if (!p) return [];
  const [r, c] = rc(i);
  const out: Move[] = [];
  for (const [dr, dc] of dirs(p)) {
    const mr = r + dr,
      mc = c + dc; // square jumped over
    const tr = r + 2 * dr,
      tc = c + 2 * dc; // landing
    if (!inBounds(tr, tc)) continue;
    const mid = board[idx(mr, mc)];
    const land = board[idx(tr, tc)];
    if (mid && mid.c === other(p.c) && !land) {
      out.push({ from: i, to: idx(tr, tc), captured: idx(mr, mc) });
    }
  }
  return out;
}

function simpleFrom(board: Board, i: number): Move[] {
  const p = board[i];
  if (!p) return [];
  const [r, c] = rc(i);
  const out: Move[] = [];
  for (const [dr, dc] of dirs(p)) {
    const tr = r + dr,
      tc = c + dc;
    if (inBounds(tr, tc) && !board[idx(tr, tc)]) {
      out.push({ from: i, to: idx(tr, tc), captured: null });
    }
  }
  return out;
}

// All legal moves for `color`. If `mustFrom` is set (a multi-jump in progress),
// only further jumps from that square are legal. Captures are mandatory.
export function legalMoves(board: Board, color: Color, mustFrom: number | null = null): Move[] {
  if (mustFrom != null) return jumpsFrom(board, mustFrom);
  const jumps: Move[] = [];
  const simples: Move[] = [];
  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (!p || p.c !== color) continue;
    jumps.push(...jumpsFrom(board, i));
    simples.push(...simpleFrom(board, i));
  }
  return jumps.length ? jumps : simples;
}

export type ApplyResult = {
  board: Board;
  captured: boolean;
  kinged: boolean;
  // square the piece must keep jumping from (multi-jump), else null
  continueFrom: number | null;
};

export function applyMove(board: Board, move: Move): ApplyResult | null {
  const p = board[move.from];
  if (!p) return null;
  const next = board.slice();
  next[move.from] = null;
  if (move.captured != null) next[move.captured] = null;
  let kinged = false;
  const [tr] = rc(move.to);
  let piece = { ...p };
  if (!piece.k && ((piece.c === "r" && tr === 0) || (piece.c === "b" && tr === SIZE - 1))) {
    piece = { ...piece, k: true };
    kinged = true;
  }
  next[move.to] = piece;

  let continueFrom: number | null = null;
  if (move.captured != null && !kinged) {
    // multi-jump: same piece must continue if more jumps are available
    if (jumpsFrom(next, move.to).length) continueFrom = move.to;
  }
  return { board: next, captured: move.captured != null, kinged, continueFrom };
}

export function countPieces(board: Board, color: Color): number {
  return board.reduce((n, p) => n + (p && p.c === color ? 1 : 0), 0);
}

// Returns the winning colour if the game is over for the side `toMove`, else null.
export function winnerIfOver(board: Board, toMove: Color): Color | null {
  if (countPieces(board, toMove) === 0) return other(toMove);
  if (legalMoves(board, toMove).length === 0) return other(toMove);
  return null;
}
