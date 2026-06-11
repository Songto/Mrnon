// A small Othello / Reversi engine — 8x8. Black moves first; a legal move must
// flank and flip at least one opponent disc; a player with no move passes; the
// game ends when neither can move. Pure & serializable (shared server/client).

export type OColor = "b" | "w";
export type OPiece = OColor | null;
export type OBoard = OPiece[]; // length 64

export const OSIZE = 8;
const DIRS: [number, number][] = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function rc(i: number): [number, number] {
  return [Math.floor(i / OSIZE), i % OSIZE];
}
function idx(r: number, c: number): number {
  return r * OSIZE + c;
}
function inB(r: number, c: number): boolean {
  return r >= 0 && r < OSIZE && c >= 0 && c < OSIZE;
}
export function oOther(c: OColor): OColor {
  return c === "b" ? "w" : "b";
}

export function oInitialBoard(): OBoard {
  const b: OBoard = Array(64).fill(null);
  b[idx(3, 3)] = "w";
  b[idx(3, 4)] = "b";
  b[idx(4, 3)] = "b";
  b[idx(4, 4)] = "w";
  return b;
}

export type OMove = { to: number; flips: number[] };

function flipsFor(board: OBoard, i: number, color: OColor): number[] {
  if (board[i]) return [];
  const [r, c] = rc(i);
  const captured: number[] = [];
  for (const [dr, dc] of DIRS) {
    const line: number[] = [];
    let rr = r + dr,
      cc = c + dc;
    while (inB(rr, cc) && board[idx(rr, cc)] === oOther(color)) {
      line.push(idx(rr, cc));
      rr += dr;
      cc += dc;
    }
    if (line.length && inB(rr, cc) && board[idx(rr, cc)] === color) {
      captured.push(...line);
    }
  }
  return captured;
}

export function oLegalMoves(board: OBoard, color: OColor): OMove[] {
  const out: OMove[] = [];
  for (let i = 0; i < 64; i++) {
    const f = flipsFor(board, i, color);
    if (f.length) out.push({ to: i, flips: f });
  }
  return out;
}

export function oApplyMove(board: OBoard, move: OMove, color: OColor): OBoard {
  const next = board.slice();
  next[move.to] = color;
  for (const j of move.flips) next[j] = color;
  return next;
}

export function oCounts(board: OBoard): { b: number; w: number } {
  let b = 0,
    w = 0;
  for (const p of board) {
    if (p === "b") b++;
    else if (p === "w") w++;
  }
  return { b, w };
}

export function oIsOver(board: OBoard): boolean {
  return oLegalMoves(board, "b").length === 0 && oLegalMoves(board, "w").length === 0;
}

export function oWinner(board: OBoard): OColor | "draw" {
  const { b, w } = oCounts(board);
  return b === w ? "draw" : b > w ? "b" : "w";
}
