/** Число колонок и строк на поле */
export const matchThreeCols = 8;
export const matchThreeRows = 8;

/** Базовый размер ячейки на мобилке (пиксели) */
export const matchThreeBaseCellSize = 48;
export const matchThreeBaseCellGap = 4;
export const matchThreeBasePiecePadding = 6;

/** До этой ширины/высоты (меньшая сторона) — базовый размер; выше — крупнее */
export const matchThreeLayoutMobileBreakpoint = 700;
export const matchThreeLayoutDesktopMin = 1100;
export const matchThreeLayoutMaxScale = 1.35;

/** Ячейки в стиле проекта: глубокая вода + золотая кайма (как кнопка «Назад») */
export const matchThreeCellFill = 0x0a4a68;
export const matchThreeCellFillHover = 0x1a7a9e;
export const matchThreeCellStroke = 0xe4b82a;
export const matchThreeCellStrokeHover = 0xfff9dc;
export const matchThreeCellStrokeWidth = 1.5;
export const matchThreeCellStrokeWidthHover = 2.5;
export const matchThreeCellAlpha = 0.62;
export const matchThreeCellAlphaHover = 0.82;
export const matchThreeCellFillSelected = 0x1a8ab0;
export const matchThreeCellStrokeSelected = 0xfff9dc;
export const matchThreeCellInnerGlow = 0xc8f4ff;
export const matchThreeHoverRingAlpha = 0.2;
export const matchThreePieceHoverScale = 1.1;

/** Минимальный сдвиг для свайпа (доля размера ячейки) */
export const matchThreeSwipeMinDistanceFraction = 0.3;
export const matchThreeGoldBonusDragFraction = 0.55;
export const matchThreeGoldBonusAimFraction = 0.68;
export const matchThreeGoldBonusAimDurationMs = 140;

/** Длительность анимаций (мс) */
export const matchThreeSwapDurationMs = 180;
export const matchThreeRemoveDurationMs = 160;
export const matchThreeFallDurationMs = 160;
export const matchThreeFlyStrikeDurationMs = 520;

/** Свечение бонусов: 2×2 — серебро, 5+ — золото */
export const matchThreeSilverBonusGlow = 0xc8d8e8;
export const matchThreeGoldBonusGlow = 0xffd966;

/** Пульсация свечения бонусов (ticker.lastTime, мс) */
export const matchThreeBonusPulseSpeed = 0.004;
export const matchThreeBonusPulseAlphaMin = 0.42;
export const matchThreeBonusPulseAlphaMax = 1;
export const matchThreeBonusPulseScaleMin = 0.86;
export const matchThreeBonusPulseScaleMax = 1.22;

/** Типы бонусных плиток */
export const matchThreeBonusTypes = [
  "shell_arrow_bonus",
  "airplane_bonus",
] as const;

/** Типы плиток match-3 (алиасы в assets.ts) */
export const matchThreePieceAssets = [
  "box",
  "corall",
  "diamond",
  "shell",
  "ship",
] as const;
