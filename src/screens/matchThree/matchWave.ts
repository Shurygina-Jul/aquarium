import { cellKey, parseCellKey } from "@/screens/matchThree/cellUtils";
import {
  findAirplaneMatches,
  findRegularMatches,
  findSquareMatches,
} from "@/screens/matchThree/findMatches";
import type {
  BoardSlot,
  BonusSpawn,
  CellCoord,
} from "@/screens/matchThree/types";

export type CollectedMatchWave = {
  score: number;
  cellsToClear: CellCoord[];
  spawns: BonusSpawn[];
};

/** Собирает одну волну: обычные матчи, квадрат 2×2 и линия 5+ */
export function collectMatchWave(
  pieces: BoardSlot[][],
): CollectedMatchWave | null {
  const airplanes = findAirplaneMatches(pieces);
  const squares = findSquareMatches(pieces);
  const regular = findRegularMatches(pieces);

  if (airplanes.length === 0 && squares.length === 0 && regular.length === 0) {
    return null;
  }

  const spawns = new Map<string, BonusSpawn>();
  const cleared = new Set<string>();

  for (const match of airplanes) {
    const spawnKey = cellKey(match.spawnAt);

    for (const cell of match.cells) {
      const key = cellKey(cell);
      if (key === spawnKey) {
        spawns.set(key, { coord: match.spawnAt, bonus: "airplane_bonus" });
      } else {
        cleared.add(key);
      }
    }
  }

  for (const match of squares) {
    const spawnKey = cellKey(match.spawnAt);

    for (const cell of match.cells) {
      const key = cellKey(cell);
      if (spawns.has(key)) {
        continue;
      }

      if (key === spawnKey) {
        spawns.set(key, { coord: match.spawnAt, bonus: "shell_arrow_bonus" });
      } else {
        cleared.add(key);
      }
    }
  }

  for (const cell of regular) {
    const key = cellKey(cell);
    if (!spawns.has(key)) {
      cleared.add(key);
    }
  }

  const cellsToClear = [...cleared].map(parseCellKey);

  return {
    score: cellsToClear.length + spawns.size,
    cellsToClear,
    spawns: [...spawns.values()],
  };
}
