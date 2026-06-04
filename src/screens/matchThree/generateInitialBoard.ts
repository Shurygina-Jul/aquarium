import {
  matchThreeCols,
  matchThreePieceAssets,
  matchThreeRows,
} from "@/screens/matchThree/config";
import type { MatchThreePiece } from "@/screens/matchThree/types";

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

/** Случайное поле 8×8 без готовых троек слева направо и сверху вниз */
export function generateInitialBoard(): MatchThreePiece[][] {
  const board: MatchThreePiece[][] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    const rowPieces: MatchThreePiece[] = [];

    for (let col = 0; col < matchThreeCols; col++) {
      // Два соседа слева (для горизонтальной тройки)
      const left = col >= 2 ? rowPieces[col - 1] : undefined;
      const left2 = col >= 2 ? rowPieces[col - 2] : undefined;

      // Два соседа сверху (для вертикальной тройки)
      const up = row >= 2 ? board[row - 1][col] : undefined;
      const up2 = row >= 2 ? board[row - 2][col] : undefined;

      // Берём только типы, которые не замыкают тройку
      const allowed = matchThreePieceAssets.filter(
        (piece) =>
          !isThirdInRow(left, left2, piece) && !isThirdInRow(up, up2, piece),
      );

      const index = Math.floor(Math.random() * allowed.length);
      rowPieces.push(allowed[index]);
    }

    board.push(rowPieces);
  }

  return board;
}
