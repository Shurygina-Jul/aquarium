import { Container, Graphics, Rectangle, Sprite } from "pixi.js";
import type { MatchThreeBoardModel } from "@/screens/matchThree/boardModel";
import {
  matchThreeCellAlpha,
  matchThreeCellAlphaHover,
  matchThreeCellFill,
  matchThreeCellFillHover,
  matchThreeCellInnerGlow,
  matchThreeCellStroke,
  matchThreeCellStrokeHover,
  matchThreeCols,
  matchThreePieceHoverScale,
  matchThreeRows,
} from "@/screens/matchThree/config";
import {
  getMatchThreeLayout,
  type MatchThreeLayout,
} from "@/screens/matchThree/layout";
import type { CellCoord, MatchThreePiece } from "@/screens/matchThree/types";

/** Вписывает спрайт плитки в квадрат ячейки с сохранением пропорций */
function scalePieceToCell(sprite: Sprite, cellSize: number, padding: number) {
  const maxSide = cellSize - padding * 2;
  return Math.min(maxSide / sprite.width, maxSide / sprite.height);
}

/** Фон ячейки: вода + золотая кайма (цвета в config.ts / tokens.css) */
function drawCellBackground(
  cell: Graphics,
  layout: MatchThreeLayout,
  hovered: boolean,
) {
  const { cellSize, cellRadius, strokeWidth, strokeWidthHover, scale } = layout;
  const inset = Math.max(2, Math.round(2 * scale));

  cell.clear();
  cell
    .roundRect(0, 0, cellSize, cellSize, cellRadius)
    .fill({
      color: hovered ? matchThreeCellFillHover : matchThreeCellFill,
      alpha: hovered ? matchThreeCellAlphaHover : matchThreeCellAlpha,
    })
    .stroke({
      width: hovered ? strokeWidthHover : strokeWidth,
      color: hovered ? matchThreeCellStrokeHover : matchThreeCellStroke,
    });

  // Лёгкий внутренний блик при наведении
  if (hovered) {
    cell
      .roundRect(
        inset,
        inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
        Math.max(4, cellRadius - 2),
      )
      .stroke({ width: 1, color: matchThreeCellInnerGlow, alpha: 0.35 });
  }
}

/** Одна клетка: фон + плитка, hover по всей ячейке */
function createCellView(
  coord: CellCoord,
  cellStep: number,
  layout: MatchThreeLayout,
  piece: MatchThreePiece,
): Container {
  const { cellSize, piecePadding } = layout;
  const slot = new Container();
  const cellCenter = cellSize / 2;

  slot.position.set(coord.col * cellStep, coord.row * cellStep);
  slot.eventMode = "static";
  slot.cursor = "pointer";
  slot.hitArea = new Rectangle(0, 0, cellSize, cellSize);

  const cell = new Graphics();
  drawCellBackground(cell, layout, false);
  slot.addChild(cell);

  const pieceSprite = Sprite.from(piece);
  pieceSprite.anchor.set(0.5);
  const baseScale = scalePieceToCell(pieceSprite, cellSize, piecePadding);
  pieceSprite.scale.set(baseScale);
  pieceSprite.position.set(cellCenter, cellCenter);
  slot.addChild(pieceSprite);

  const setHovered = (hovered: boolean) => {
    drawCellBackground(cell, layout, hovered);
    const scale = hovered ? baseScale * matchThreePieceHoverScale : baseScale;
    pieceSprite.scale.set(scale);
  };

  slot.on("pointerover", () => setHovered(true));
  slot.on("pointerout", () => setHovered(false));

  return slot;
}

/**
 * Рисует поле по данным модели.
 * pivot по центру — удобно ставить container в центр экрана.
 */
export function createBoardView(
  model: MatchThreeBoardModel,
  screenWidth: number,
  screenHeight: number,
): Container {
  const layout = getMatchThreeLayout(screenWidth, screenHeight);
  const cellStep = layout.cellSize + layout.cellGap;
  const boardWidth = matchThreeCols * cellStep - layout.cellGap;
  const boardHeight = matchThreeRows * cellStep - layout.cellGap;

  const container = new Container();
  const grid = new Container();
  container.pivot.set(boardWidth / 2, boardHeight / 2);
  container.addChild(grid);

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      grid.addChild(
        createCellView(
          { col, row },
          cellStep,
          layout,
          model.getPiece(col, row),
        ),
      );
    }
  }

  return container;
}
