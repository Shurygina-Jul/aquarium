import { matchThreePieceAssets } from "@/screens/matchThree/config";

/** Тип плитки: box, shell, diamond и т.д. */
export type MatchThreePiece = (typeof matchThreePieceAssets)[number];

/** Координаты ячейки на поле */
export type CellCoord = {
  col: number;
  row: number;
};
