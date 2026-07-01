import { matchThreePieceAssets } from "@/screens/matchThree/config";
import { isMatchThreePiece } from "@/screens/matchThree/slotUtils";
import type { BoardSlot, MatchThreePiece } from "@/screens/matchThree/types";

type PieceLookup = (col: number, row: number) => BoardSlot | undefined;

function asPiece(slot: BoardSlot | undefined): MatchThreePiece | undefined {
  if (slot === undefined || slot === null) {
    return undefined;
  }
  return isMatchThreePiece(slot) ? slot : undefined;
}

/**
 * Тройка в ряд, если два соседа уже одинаковые
 * и мы ставим тот же тип в третью клетку.
 */
function isThirdInRow(
  neighborA: MatchThreePiece | undefined,
  neighborB: MatchThreePiece | undefined,
  candidate: MatchThreePiece,
): boolean {
  return neighborA === neighborB && neighborB === candidate;
}

/** Случайная плитка, которая не замыкает тройку слева или сверху */
export function pickPieceForCell(
  getPiece: PieceLookup,
  col: number,
  row: number,
): MatchThreePiece {
  const left = col >= 2 ? asPiece(getPiece(col - 1, row)) : undefined;
  const left2 = col >= 2 ? asPiece(getPiece(col - 2, row)) : undefined;
  const up = row >= 2 ? asPiece(getPiece(col, row - 1)) : undefined;
  const up2 = row >= 2 ? asPiece(getPiece(col, row - 2)) : undefined;

  const allowed = matchThreePieceAssets.filter(
    (piece) =>
      !isThirdInRow(left, left2, piece) && !isThirdInRow(up, up2, piece),
  );

  const index = Math.floor(Math.random() * allowed.length);
  return allowed[index];
}
