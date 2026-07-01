import { matchThreeCols, matchThreeRows } from "@/screens/matchThree/config";
import type {
  BoardSlot,
  CellCoord,
  MatchThreePiece,
} from "@/screens/matchThree/types";

export type ShellArrowStrike = {
  from: CellCoord;
  target: CellCoord;
};

/** Стрелка: убирает себя и одну случайную ячейку */
export function activateShellArrowBonus(
  pieces: BoardSlot[][],
  bonusCoord: CellCoord,
): ShellArrowStrike | null {
  if (pieces[bonusCoord.row][bonusCoord.col] !== "shell_arrow_bonus") {
    return null;
  }

  const candidates: CellCoord[] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      if (col === bonusCoord.col && row === bonusCoord.row) {
        continue;
      }
      if (pieces[row][col] !== null) {
        candidates.push({ col, row });
      }
    }
  }

  pieces[bonusCoord.row][bonusCoord.col] = null;

  if (candidates.length === 0) {
    return { from: bonusCoord, target: bonusCoord };
  }

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  pieces[target.row][target.col] = null;

  return { from: bonusCoord, target };
}

/** Самолёт-бонус: убирает все плитки выбранного типа и сам бонус */
export function activateAirplaneBonus(
  pieces: BoardSlot[][],
  bonusCoord: CellCoord,
  piece: MatchThreePiece,
): CellCoord[] {
  const removed: CellCoord[] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      const slot = pieces[row][col];
      const isTargetPiece = slot === piece;
      const isBonusCell =
        col === bonusCoord.col &&
        row === bonusCoord.row &&
        slot === "airplane_bonus";

      if (isTargetPiece || isBonusCell) {
        pieces[row][col] = null;
        removed.push({ col, row });
      }
    }
  }

  return removed;
}

/** Координаты всех ячеек с данным типом плитки */
export function getCoordsOfPiece(
  pieces: BoardSlot[][],
  piece: MatchThreePiece,
): CellCoord[] {
  const coords: CellCoord[] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      if (pieces[row][col] === piece) {
        coords.push({ col, row });
      }
    }
  }

  return coords;
}
