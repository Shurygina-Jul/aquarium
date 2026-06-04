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
export const matchThreeCellInnerGlow = 0xc8f4ff;
export const matchThreePieceHoverScale = 1.1;

/** Типы плиток match-3 (алиасы в assets.ts) */
export const matchThreePieceAssets = [
  "box",
  "corall",
  "diamond",
  "shell",
  "ship",
] as const;
