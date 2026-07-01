import { matchThreeCols, matchThreeRows } from "@/screens/matchThree/config";
import { pickPieceForCell } from "@/screens/matchThree/pickPiece";
import type { MatchThreePiece } from "@/screens/matchThree/types";

/** Случайное поле 8×8 без готовых троек слева направо и сверху вниз */
export function generateInitialBoard(): MatchThreePiece[][] {
  const board: MatchThreePiece[][] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    const rowPieces: MatchThreePiece[] = [];

    for (let col = 0; col < matchThreeCols; col++) {
      const getPiece = (c: number, r: number) => {
        if (r === row) {
          return rowPieces[c];
        }
        return board[r][c];
      };

      rowPieces.push(pickPieceForCell(getPiece, col, row));
    }

    board.push(rowPieces);
  }

  return board;
}
