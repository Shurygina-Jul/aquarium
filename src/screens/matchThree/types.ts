import {
  matchThreeBonusTypes,
  matchThreePieceAssets,
} from "@/screens/matchThree/config";

/** Тип плитки: box, shell, diamond и т.д. */
export type MatchThreePiece = (typeof matchThreePieceAssets)[number];

/** Бонус: квадрат 2×2 или линия из 5 */
export type MatchThreeBonus = (typeof matchThreeBonusTypes)[number];

/** Ячейка поля: обычная плитка, бонус или пусто */
export type BoardSlot = MatchThreePiece | MatchThreeBonus | null;

/** Координаты ячейки на поле */
export type CellCoord = {
  col: number;
  row: number;
};

/** Появление бонуса после матча */
export type BonusSpawn = {
  coord: CellCoord;
  bonus: MatchThreeBonus;
};
