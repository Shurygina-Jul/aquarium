import { generateInitialBoard } from "@/screens/matchThree/generateInitialBoard";
import type { MatchThreePiece } from "@/screens/matchThree/types";

/** Данные поля (без Pixi): раскладка плиток */
export class MatchThreeBoardModel {
  readonly pieces: MatchThreePiece[][];

  private constructor(pieces: MatchThreePiece[][]) {
    this.pieces = pieces;
  }

  static create(): MatchThreeBoardModel {
    return new MatchThreeBoardModel(generateInitialBoard());
  }

  getPiece(col: number, row: number): MatchThreePiece {
    return this.pieces[row][col];
  }
}
