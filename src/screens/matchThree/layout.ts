import {
  matchThreeBaseCellGap,
  matchThreeBaseCellSize,
  matchThreeBasePiecePadding,
  matchThreeCellStrokeWidth,
  matchThreeCellStrokeWidthHover,
  matchThreeLayoutDesktopMin,
  matchThreeLayoutMaxScale,
  matchThreeLayoutMobileBreakpoint,
} from "@/screens/matchThree/config";

export type MatchThreeLayout = {
  cellSize: number;
  cellGap: number;
  piecePadding: number;
  cellRadius: number;
  strokeWidth: number;
  strokeWidthHover: number;
  scale: number;
};

/**
 * Размеры поля под экран: на узком (мобилка) — базовые 48px,
 * на широком — крупнее (до matchThreeLayoutMaxScale).
 */
export function getMatchThreeLayout(
  screenWidth: number,
  screenHeight: number,
): MatchThreeLayout {
  const minSide = Math.min(screenWidth, screenHeight);

  let scale = 1;
  if (minSide > matchThreeLayoutMobileBreakpoint) {
    const range = matchThreeLayoutDesktopMin - matchThreeLayoutMobileBreakpoint;
    const progress = Math.min(
      1,
      (minSide - matchThreeLayoutMobileBreakpoint) / range,
    );
    scale = 1 + progress * (matchThreeLayoutMaxScale - 1);
  }

  const cellSize = Math.round(matchThreeBaseCellSize * scale);

  return {
    scale,
    cellSize,
    cellGap: Math.round(matchThreeBaseCellGap * scale),
    piecePadding: Math.round(matchThreeBasePiecePadding * scale),
    cellRadius: Math.max(6, Math.round(8 * scale)),
    strokeWidth:
      scale > 1.15 ? matchThreeCellStrokeWidth + 1 : matchThreeCellStrokeWidth,
    strokeWidthHover:
      scale > 1.15
        ? matchThreeCellStrokeWidthHover + 1
        : matchThreeCellStrokeWidthHover,
  };
}
