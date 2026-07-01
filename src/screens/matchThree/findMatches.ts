import { matchThreeCols, matchThreeRows } from "@/screens/matchThree/config";
import { cellKey } from "@/screens/matchThree/cellUtils";
import { isMatchThreePiece } from "@/screens/matchThree/slotUtils";
import type {
  BoardSlot,
  CellCoord,
  MatchThreePiece,
} from "@/screens/matchThree/types";

const minRegularMatch = 3;
const maxRegularMatch = 4;
const minAirplaneMatch = 5;

/** Матчи в одной строке или столбце с ограничением длины серии */
function findRunsInLine(
  line: BoardSlot[],
  lineIndex: number,
  direction: "row" | "col",
  minLength: number,
  maxLength?: number,
): CellCoord[] {
  const matched: CellCoord[] = [];
  let runLength = 1;

  for (let i = 1; i <= line.length; i++) {
    const sameAsPrevious =
      i < line.length &&
      isMatchThreePiece(line[i]) &&
      isMatchThreePiece(line[i - 1]) &&
      line[i] === line[i - 1];

    if (sameAsPrevious) {
      runLength++;
      continue;
    }

    const fitsMax = maxLength === undefined || runLength <= maxLength;

    if (runLength >= minLength && fitsMax) {
      const runStart = i - runLength;

      for (let j = runStart; j < i; j++) {
        matched.push(
          direction === "row"
            ? { col: j, row: lineIndex }
            : { col: lineIndex, row: j },
        );
      }
    }

    runLength = 1;
  }

  return matched;
}

function dedupeCells(cells: CellCoord[]): CellCoord[] {
  return [...new Map(cells.map((cell) => [cellKey(cell), cell])).values()];
}

const neighborDeltas = [
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: 1 },
  { col: 0, row: -1 },
] as const;

function findConnectedGroup(
  pieces: BoardSlot[][],
  start: CellCoord,
  piece: MatchThreePiece,
): CellCoord[] {
  const startKey = cellKey(start);
  const visited = new Set<string>([startKey]);
  const queue: CellCoord[] = [start];
  const cells: CellCoord[] = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    for (const delta of neighborDeltas) {
      const next = {
        col: current.col + delta.col,
        row: current.row + delta.row,
      };

      if (
        next.col < 0 ||
        next.col >= matchThreeCols ||
        next.row < 0 ||
        next.row >= matchThreeRows
      ) {
        continue;
      }

      const key = cellKey(next);
      if (visited.has(key) || pieces[next.row][next.col] !== piece) {
        continue;
      }

      visited.add(key);
      queue.push(next);
      cells.push(next);
    }
  }

  return cells;
}

function pickSpawnCell(cells: CellCoord[]): CellCoord {
  const sorted = [...cells].sort((a, b) => a.row - b.row || a.col - b.col);
  return sorted[Math.floor(sorted.length / 2)];
}

/** Обычные матчи: 3–4 в ряд (5+ связных — отдельно, самолёт) */
export function findRegularMatches(pieces: BoardSlot[][]): CellCoord[] {
  const matched: CellCoord[] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    matched.push(
      ...findRunsInLine(
        pieces[row],
        row,
        "row",
        minRegularMatch,
        maxRegularMatch,
      ),
    );
  }

  for (let col = 0; col < matchThreeCols; col++) {
    const column = pieces.map((row) => row[col]);
    matched.push(
      ...findRunsInLine(column, col, "col", minRegularMatch, maxRegularMatch),
    );
  }

  return dedupeCells(matched);
}

export type SpecialMatch = {
  cells: CellCoord[];
  spawnAt: CellCoord;
};

/** Связная группа из 5+ одинаковых плиток → бонус «самолёт» в центре */
export function findAirplaneMatches(pieces: BoardSlot[][]): SpecialMatch[] {
  const visited = new Set<string>();
  const matches: SpecialMatch[] = [];

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      const key = cellKey({ col, row });
      if (visited.has(key)) {
        continue;
      }

      const piece = pieces[row][col];
      if (!isMatchThreePiece(piece)) {
        continue;
      }

      const cells = findConnectedGroup(pieces, { col, row }, piece);
      for (const cell of cells) {
        visited.add(cellKey(cell));
      }

      if (cells.length >= minAirplaneMatch) {
        matches.push({ cells, spawnAt: pickSpawnCell(cells) });
      }
    }
  }

  return matches;
}

/** Квадрат 2×2 из одинаковых плиток → бонус «стрелка» */
export function findSquareMatches(pieces: BoardSlot[][]): SpecialMatch[] {
  const matches: SpecialMatch[] = [];

  for (let row = 0; row < matchThreeRows - 1; row++) {
    for (let col = 0; col < matchThreeCols - 1; col++) {
      const topLeft = pieces[row][col];
      if (!isMatchThreePiece(topLeft)) {
        continue;
      }

      const topRight = pieces[row][col + 1];
      const bottomLeft = pieces[row + 1][col];
      const bottomRight = pieces[row + 1][col + 1];

      if (
        topLeft === topRight &&
        topLeft === bottomLeft &&
        topLeft === bottomRight
      ) {
        matches.push({
          cells: [
            { col, row },
            { col: col + 1, row },
            { col, row: row + 1 },
            { col: col + 1, row: row + 1 },
          ],
          spawnAt: { col: col + 1, row: row + 1 },
        });
      }
    }
  }

  return matches;
}

/** Все обычные матчи (3–4 в ряд) */
export function findMatches(pieces: BoardSlot[][]): CellCoord[] {
  return findRegularMatches(pieces);
}

/** Есть ли на поле любой матч или спец-фигура */
export function hasMatchPatterns(pieces: BoardSlot[][]): boolean {
  return (
    findRegularMatches(pieces).length > 0 ||
    findAirplaneMatches(pieces).length > 0 ||
    findSquareMatches(pieces).length > 0
  );
}
