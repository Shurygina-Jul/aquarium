import { matchThreeCols, matchThreeRows } from "@/screens/matchThree/config";
import { collectMatchWave } from "@/screens/matchThree/matchWave";
import { pickPieceForCell } from "@/screens/matchThree/pickPiece";
import { isMatchThreeBonus } from "@/screens/matchThree/slotUtils";
import type {
  BoardSlot,
  BonusSpawn,
  CellCoord,
  MatchThreePiece,
} from "@/screens/matchThree/types";

export type FallMovement = {
  col: number;
  fromRow: number;
  toRow: number;
  slot: Exclude<BoardSlot, null>;
};

export type RefillMovement = {
  col: number;
  row: number;
  piece: MatchThreePiece;
};

export type CascadeWave = {
  score: number;
  matches: CellCoord[];
  spawns: BonusSpawn[];
  falls: FallMovement[];
  refills: RefillMovement[];
};

function applyCollectedWave(
  pieces: BoardSlot[][],
  cellsToClear: CellCoord[],
  spawns: BonusSpawn[],
): void {
  for (const { col, row } of cellsToClear) {
    pieces[row][col] = null;
  }

  for (const { coord, bonus } of spawns) {
    pieces[coord.row][coord.col] = bonus;
  }
}

/** Плитки в столбце падают вниз; бонусы остаются на месте */
export function applyGravity(pieces: BoardSlot[][]): FallMovement[] {
  const falls: FallMovement[] = [];

  for (let col = 0; col < matchThreeCols; col++) {
    const anchored = new Map<number, Exclude<BoardSlot, null>>();
    const movable: { fromRow: number; slot: Exclude<BoardSlot, null> }[] = [];

    for (let row = 0; row < matchThreeRows; row++) {
      const slot = pieces[row][col];
      if (slot === null) {
        continue;
      }

      if (isMatchThreeBonus(slot)) {
        anchored.set(row, slot);
        continue;
      }

      movable.push({ fromRow: row, slot });
    }

    const openRows: number[] = [];
    for (let row = 0; row < matchThreeRows; row++) {
      if (!anchored.has(row)) {
        openRows.push(row);
      }
    }

    const emptyTop = openRows.length - movable.length;
    const placementRows = openRows.slice(emptyTop);

    for (let row = 0; row < matchThreeRows; row++) {
      pieces[row][col] = null;
    }

    for (const [row, slot] of anchored) {
      pieces[row][col] = slot;
    }

    movable.forEach((entry, index) => {
      const toRow = placementRows[index];

      if (entry.fromRow !== toRow) {
        falls.push({
          col,
          fromRow: entry.fromRow,
          toRow,
          slot: entry.slot,
        });
      }

      pieces[toRow][col] = entry.slot;
    });
  }

  return falls;
}

/** Заполняет пустые ячейки; возвращает новые плитки для анимации */
export function refillBoard(pieces: BoardSlot[][]): RefillMovement[] {
  const refills: RefillMovement[] = [];
  const getPiece = (col: number, row: number) => pieces[row][col];

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      if (pieces[row][col] === null) {
        const piece = pickPieceForCell(getPiece, col, row);
        pieces[row][col] = piece;
        refills.push({ col, row, piece });
      }
    }
  }

  return refills;
}

/** Одна волна падения и дозаполнения (без матча) */
export function resolveSettleWave(pieces: BoardSlot[][]): CascadeWave | null {
  const falls = applyGravity(pieces);
  const refills = refillBoard(pieces);

  if (falls.length === 0 && refills.length === 0) {
    return null;
  }

  return {
    score: 0,
    matches: [],
    spawns: [],
    falls,
    refills,
  };
}

/** Падение, дозаполнение и каскады матчей — после бонусов */
export function resolveSettleAndCascade(pieces: BoardSlot[][]): CascadeWave[] {
  const waves: CascadeWave[] = [];

  const settle = resolveSettleWave(pieces);
  if (settle) {
    waves.push(settle);
  }

  while (true) {
    const wave = resolveOneWave(pieces);
    if (!wave) {
      break;
    }
    waves.push(wave);
  }

  return waves;
}

/** Одна волна каскада: убрать → бонусы → падение → дозаполнение */
export function resolveOneWave(pieces: BoardSlot[][]): CascadeWave | null {
  const collected = collectMatchWave(pieces);
  if (!collected) {
    return null;
  }

  applyCollectedWave(pieces, collected.cellsToClear, collected.spawns);
  const falls = applyGravity(pieces);
  const refills = refillBoard(pieces);

  return {
    score: collected.score,
    matches: collected.cellsToClear,
    spawns: collected.spawns,
    falls,
    refills,
  };
}
