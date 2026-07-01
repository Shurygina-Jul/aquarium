import { matchThreePieceAssets } from "@/screens/matchThree/config";
import type {
  BoardSlot,
  MatchThreeBonus,
  MatchThreePiece,
} from "@/screens/matchThree/types";

export function isMatchThreeBonus(slot: BoardSlot): slot is MatchThreeBonus {
  return slot === "shell_arrow_bonus" || slot === "airplane_bonus";
}

/** Обычная плитка на поле (не бонус и не пусто) */
export function isPlainPiece(slot: BoardSlot): slot is MatchThreePiece {
  return (
    slot !== null &&
    !isMatchThreeBonus(slot) &&
    matchThreePieceAssets.includes(slot)
  );
}

export function isMatchThreePiece(slot: BoardSlot): slot is MatchThreePiece {
  return isPlainPiece(slot);
}
