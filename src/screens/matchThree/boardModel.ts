import { getOrthogonalNeighbors } from "@/screens/matchThree/cellUtils";
import { generateInitialBoard } from "@/screens/matchThree/generateInitialBoard";
import {
  activateAirplaneBonus,
  activateShellArrowBonus,
  getCoordsOfPiece,
  type ShellArrowStrike,
} from "@/screens/matchThree/bonusActivation";
import { hasMatchPatterns } from "@/screens/matchThree/findMatches";
import {
  resolveOneWave,
  resolveSettleAndCascade,
  type CascadeWave,
} from "@/screens/matchThree/resolveBoard";
import {
  isMatchThreeBonus,
  isMatchThreePiece,
  isPlainPiece,
} from "@/screens/matchThree/slotUtils";
import type {
  BoardSlot,
  CellCoord,
  MatchThreeBonus,
  MatchThreePiece,
} from "@/screens/matchThree/types";

/** Данные поля (без Pixi): раскладка плиток */
export class MatchThreeBoardModel {
  readonly pieces: BoardSlot[][];

  private constructor(pieces: BoardSlot[][]) {
    this.pieces = pieces;
  }

  static create(): MatchThreeBoardModel {
    return new MatchThreeBoardModel(generateInitialBoard());
  }

  getSlot(col: number, row: number): BoardSlot {
    return this.pieces[row][col];
  }

  getBonus(col: number, row: number): MatchThreeBonus | null {
    const slot = this.getSlot(col, row);
    return isMatchThreeBonus(slot) ? slot : null;
  }

  getPiece(col: number, row: number): MatchThreePiece {
    const slot = this.getSlot(col, row);
    if (!isMatchThreePiece(slot)) {
      throw new Error(`No piece at ${col}:${row}`);
    }
    return slot;
  }

  hasMatches(): boolean {
    return hasMatchPatterns(this.pieces);
  }

  getCoordsOfPiece(piece: MatchThreePiece): CellCoord[] {
    return getCoordsOfPiece(this.pieces, piece);
  }

  /** Соседние простые плитки (для выбора золотого бонуса) */
  getAdjacentPlainPieceCoords(coord: CellCoord): CellCoord[] {
    return getOrthogonalNeighbors(coord).filter(({ col, row }) =>
      isPlainPiece(this.getSlot(col, row)),
    );
  }

  /** Меняет содержимое двух ячеек местами */
  swap(a: CellCoord, b: CellCoord): void {
    const slotA = this.pieces[a.row][a.col];
    const slotB = this.pieces[b.row][b.col];

    this.pieces[a.row][a.col] = slotB;
    this.pieces[b.row][b.col] = slotA;
  }

  /** Одна волна каскада после удачного хода */
  resolveOneWave(): CascadeWave | null {
    return resolveOneWave(this.pieces);
  }

  /** Падение, дозаполнение и каскады — после активации бонуса */
  resolveSettleAndCascade(): CascadeWave[] {
    return resolveSettleAndCascade(this.pieces);
  }

  /** Стрелка: случайная цель на поле */
  activateShellArrowBonus(coord: CellCoord): ShellArrowStrike | null {
    return activateShellArrowBonus(this.pieces, coord);
  }

  /** Самолёт-бонус: все плитки выбранного типа */
  activateAirplaneBonus(coord: CellCoord, piece: MatchThreePiece): CellCoord[] {
    if (this.getSlot(coord.col, coord.row) !== "airplane_bonus") {
      return [];
    }
    return activateAirplaneBonus(this.pieces, coord, piece);
  }
}
