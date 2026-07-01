import { matchThreeCols, matchThreeRows } from "@/screens/matchThree/config";
import type { CellCoord } from "@/screens/matchThree/types";

/** Уникальный ключ ячейки, например "3:5" */
export function cellKey({ col, row }: CellCoord): string {
  return `${col}:${row}`;
}

export function parseCellKey(key: string): CellCoord {
  const [col, row] = key.split(":").map(Number);
  return { col, row };
}

export function coordsEqual(a: CellCoord, b: CellCoord): boolean {
  return a.col === b.col && a.row === b.row;
}

export function coordsInList(coord: CellCoord, list: CellCoord[]): boolean {
  return list.some((item) => coordsEqual(item, coord));
}

export function forEachCell(fn: (coord: CellCoord) => void): void {
  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      fn({ col, row });
    }
  }
}

/**
 * Проверяет, можно ли поменять две ячейки местами: они должны быть соседями
 * по горизонтали или вертикали (не по диагонали и не одна и та же).
 *
 * Примеры: (2,3)+(3,3) → true, (2,3)+(2,4) → true, (2,3)+(3,4) → false.
 * Используется перед swap: в match-3 меняют только соседние плитки.
 */
export function areAdjacent(a: CellCoord, b: CellCoord): boolean {
  const colDiff = Math.abs(a.col - b.col);
  const rowDiff = Math.abs(a.row - b.row);

  return (colDiff === 1 && rowDiff === 0) || (colDiff === 0 && rowDiff === 1);
}

/** Соседняя ячейка по направлению свайпа */
export function getSwipeNeighbor(
  from: CellCoord,
  dx: number,
  dy: number,
): CellCoord | null {
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    return null;
  }

  if (Math.abs(dx) >= Math.abs(dy)) {
    const col = from.col + (dx > 0 ? 1 : -1);
    if (col < 0 || col >= matchThreeCols) {
      return null;
    }
    return { col, row: from.row };
  }

  const row = from.row + (dy > 0 ? 1 : -1);
  if (row < 0 || row >= matchThreeRows) {
    return null;
  }

  return { col: from.col, row };
}

/** Соседние ячейки по вертикали и горизонтали */
export function getOrthogonalNeighbors(coord: CellCoord): CellCoord[] {
  const neighbors: CellCoord[] = [];

  for (const [col, row] of [
    [coord.col + 1, coord.row],
    [coord.col - 1, coord.row],
    [coord.col, coord.row + 1],
    [coord.col, coord.row - 1],
  ] as const) {
    if (col >= 0 && col < matchThreeCols && row >= 0 && row < matchThreeRows) {
      neighbors.push({ col, row });
    }
  }

  return neighbors;
}
