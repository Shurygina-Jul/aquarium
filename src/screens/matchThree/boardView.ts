import {
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
  type Ticker,
} from "pixi.js";
import {
  drawBonusGlow,
  drawGoldDiamondBonusMark,
  drawSilverDiamondBonusMark,
} from "@/screens/matchThree/bonusGraphics";
import {
  applyBonusPulse,
  bonusPulseWave,
} from "@/screens/matchThree/bonusPulse";
import { tween } from "@/screens/matchThree/boardAnimations";
import {
  cellKey,
  forEachCell,
  getSwipeNeighbor,
} from "@/screens/matchThree/cellUtils";
import type { MatchThreeBoardModel } from "@/screens/matchThree/boardModel";
import type { CascadeWave } from "@/screens/matchThree/resolveBoard";
import { isMatchThreePiece } from "@/screens/matchThree/slotUtils";
import {
  matchThreeCellAlpha,
  matchThreeCellAlphaHover,
  matchThreeCellFill,
  matchThreeCellFillHover,
  matchThreeCellFillSelected,
  matchThreeCellInnerGlow,
  matchThreeCellStroke,
  matchThreeCellStrokeHover,
  matchThreeCellStrokeSelected,
  matchThreeCols,
  matchThreeFallDurationMs,
  matchThreeFlyStrikeDurationMs,
  matchThreeGoldBonusGlow,
  matchThreeGoldBonusAimDurationMs,
  matchThreeGoldBonusAimFraction,
  matchThreeGoldBonusDragFraction,
  matchThreeHoverRingAlpha,
  matchThreePieceHoverScale,
  matchThreeRemoveDurationMs,
  matchThreeRows,
  matchThreeSilverBonusGlow,
  matchThreeSwipeMinDistanceFraction,
  matchThreeSwapDurationMs,
} from "@/screens/matchThree/config";
import {
  getMatchThreeLayout,
  type MatchThreeLayout,
} from "@/screens/matchThree/layout";
import type { BoardSlot, CellCoord } from "@/screens/matchThree/types";

type CellVisualState = {
  hovered: boolean;
  selected: boolean;
  marked: boolean;
};

type CellView = {
  setSlot: (slot: BoardSlot) => void;
  setVisualState: (state: Omit<CellVisualState, "marked">) => void;
  setMarked: (marked: boolean) => void;
  hidePiece: () => void;
  resetPiece: () => void;
  animateFadeOut: () => Promise<void>;
  animateFall: (
    fromRow: number,
    toRow: number,
    slot: Exclude<BoardSlot, null>,
    cellStep: number,
  ) => Promise<void>;
  animateDropFromAbove: (
    row: number,
    slot: Exclude<BoardSlot, null>,
    cellStep: number,
  ) => Promise<void>;
  animateSwapOffset: (dx: number, dy: number) => Promise<void>;
  tickBonusPulse: (timeMs: number) => void;
};

export type BoardView = {
  container: Container;
  animateSwap: (a: CellCoord, b: CellCoord) => Promise<void>;
  animateShellArrowStrike: (
    from: CellCoord,
    target: CellCoord,
  ) => Promise<void>;
  animateRemove: (coords: CellCoord[]) => Promise<void>;
  highlightCells: (coords: CellCoord[]) => void;
  clearHighlights: () => void;
  playWave: (
    wave: CascadeWave,
    hooks?: { afterSpawns?: () => Promise<void> },
  ) => Promise<void>;
  syncFromModel: () => void;
  setSelected: (coord: CellCoord | null) => void;
  onCellClick: (handler: (coord: CellCoord) => void) => () => void;
  onCellSwipe: (
    handler: (from: CellCoord, to: CellCoord) => void,
  ) => () => void;
  tick: (ticker: Ticker) => void;
};

function scalePieceToCell(sprite: Sprite, cellSize: number, padding: number) {
  const maxSide = cellSize - padding * 2;
  return Math.min(maxSide / sprite.width, maxSide / sprite.height);
}

function drawCellBackground(
  cell: Graphics,
  layout: MatchThreeLayout,
  { hovered, selected, marked }: CellVisualState,
) {
  const { cellSize, cellRadius, strokeWidth, strokeWidthHover, scale } = layout;
  const inset = Math.max(2, Math.round(2 * scale));

  const fill = selected
    ? matchThreeCellFillSelected
    : marked
      ? 0x2a8a50
      : hovered
        ? matchThreeCellFillHover
        : matchThreeCellFill;
  const fillAlpha =
    selected || hovered || marked
      ? matchThreeCellAlphaHover
      : matchThreeCellAlpha;
  const stroke = selected
    ? matchThreeCellStrokeSelected
    : marked
      ? 0xfff9dc
      : hovered
        ? matchThreeCellStrokeHover
        : matchThreeCellStroke;
  const strokeW =
    marked || selected || hovered ? strokeWidthHover + 1 : strokeWidth;

  cell.clear();
  cell
    .roundRect(0, 0, cellSize, cellSize, cellRadius)
    .fill({ color: fill, alpha: fillAlpha })
    .stroke({ width: strokeW, color: stroke });

  if (hovered || selected || marked) {
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

function createCellView(
  coord: CellCoord,
  cellStep: number,
  layout: MatchThreeLayout,
  initialSlot: BoardSlot,
  onClick: (coord: CellCoord) => void,
  onSwipe: (from: CellCoord, to: CellCoord) => void,
  zOrder: { raise: () => void; restore: () => void },
): { slot: Container; cellView: CellView } {
  const { cellSize, piecePadding } = layout;
  const slot = new Container();
  const cellCenter = cellSize / 2;
  let visualState: CellVisualState = {
    hovered: false,
    selected: false,
    marked: false,
  };

  slot.position.set(coord.col * cellStep, coord.row * cellStep);
  slot.eventMode = "static";
  slot.cursor = "pointer";
  slot.hitArea = new Rectangle(0, 0, cellSize, cellSize);

  const cell = new Graphics();
  drawCellBackground(cell, layout, visualState);
  slot.addChild(cell);

  const hoverRing = new Graphics()
    .circle(cellCenter, cellCenter, cellSize * 0.38)
    .fill({ color: 0xffffff, alpha: matchThreeHoverRingAlpha });
  hoverRing.visible = false;
  slot.addChild(hoverRing);

  const bonusGlow = new Graphics();
  bonusGlow.position.set(cellCenter, cellCenter);
  bonusGlow.blendMode = "add";
  bonusGlow.visible = false;
  slot.addChild(bonusGlow);

  const pieceSprite = Sprite.from("box");
  pieceSprite.anchor.set(0.5);
  const baseScale = scalePieceToCell(pieceSprite, cellSize, piecePadding);
  pieceSprite.position.set(cellCenter, cellCenter);
  slot.addChild(pieceSprite);

  const bonusMark = new Graphics();
  bonusMark.position.set(cellCenter, cellCenter);
  bonusMark.visible = false;
  slot.addChild(bonusMark);

  let isBonusSlot = false;
  let pulseSuspended = false;
  let currentBoardSlot: BoardSlot = initialSlot;
  let draggingGoldBonus = false;
  const pulsePhase = coord.col * 0.9 + coord.row * 1.1;

  const isGoldBonusSlot = () => currentBoardSlot === "airplane_bonus";

  const clampDrag = (value: number, max: number) =>
    Math.max(-max, Math.min(max, value));

  const setGoldBonusDragOffset = (dx: number, dy: number) => {
    const max = cellSize * matchThreeGoldBonusDragFraction;
    const ox = clampDrag(dx, max);
    const oy = clampDrag(dy, max);
    bonusGlow.position.set(cellCenter + ox, cellCenter + oy);
    bonusMark.position.set(cellCenter + ox, cellCenter + oy);
  };

  const resetPieceTransform = () => {
    resetContentAlpha();
    bonusGlow.scale.set(1);
    bonusMark.scale.set(1);
    pieceSprite.position.set(cellCenter, cellCenter);
    bonusMark.position.set(cellCenter, cellCenter);
    bonusGlow.position.set(cellCenter, cellCenter);
    applyScale();
  };

  const visibleContent = () =>
    [pieceSprite, bonusMark, bonusGlow].filter((node) => node.visible);

  const resetContentAlpha = () => {
    pieceSprite.alpha = 1;
    bonusMark.alpha = 1;
    bonusGlow.alpha = 1;
  };

  const applyScale = () => {
    if (!pieceSprite.visible) {
      return;
    }
    const scale = visualState.hovered
      ? baseScale * matchThreePieceHoverScale
      : baseScale;
    pieceSprite.scale.set(scale);
  };

  const showShellArrowBonus = () => {
    bonusGlow.visible = true;
    drawBonusGlow(bonusGlow, cellSize, matchThreeSilverBonusGlow);
    bonusGlow.position.set(cellCenter, cellCenter);
    bonusMark.visible = true;
    drawSilverDiamondBonusMark(bonusMark, cellSize);
    bonusMark.position.set(cellCenter, cellCenter);
  };

  const showAirplaneBonus = () => {
    bonusGlow.visible = true;
    drawBonusGlow(bonusGlow, cellSize, matchThreeGoldBonusGlow);
    bonusGlow.position.set(cellCenter, cellCenter);
    bonusMark.visible = true;
    drawGoldDiamondBonusMark(bonusMark, cellSize);
    bonusMark.position.set(cellCenter, cellCenter);
  };

  const renderSlot = (boardSlot: BoardSlot) => {
    currentBoardSlot = boardSlot;
    bonusGlow.visible = false;
    bonusMark.visible = false;
    pieceSprite.visible = false;
    isBonusSlot = false;
    bonusGlow.scale.set(1);
    bonusMark.scale.set(1);

    if (boardSlot === null) {
      return;
    }

    if (isMatchThreePiece(boardSlot)) {
      pieceSprite.texture = Texture.from(boardSlot);
      pieceSprite.visible = true;
      pieceSprite.alpha = 1;
      applyScale();
      return;
    }

    isBonusSlot = true;

    if (boardSlot === "shell_arrow_bonus") {
      showShellArrowBonus();
      return;
    }

    showAirplaneBonus();
  };

  const setBonusContentY = (y: number, boardSlot: Exclude<BoardSlot, null>) => {
    if (isMatchThreePiece(boardSlot)) {
      pieceSprite.y = y;
      return;
    }

    bonusGlow.y = y;
    bonusMark.y = y;
    bonusMark.x = cellCenter;
  };

  const applyVisualState = () => {
    drawCellBackground(cell, layout, visualState);
    hoverRing.visible =
      visualState.hovered && !visualState.selected && !draggingGoldBonus;
    applyScale();
  };

  const animateVerticalMove = async (
    startY: number,
    boardSlot: Exclude<BoardSlot, null>,
  ) => {
    renderSlot(boardSlot);
    resetContentAlpha();
    setBonusContentY(startY, boardSlot);

    await tween(matchThreeFallDurationMs, (progress) => {
      const y = startY + (cellCenter - startY) * progress;
      setBonusContentY(y, boardSlot);
    });

    cellView.resetPiece();
    renderSlot(boardSlot);
  };

  slot.on("pointerover", () => {
    visualState = { ...visualState, hovered: true };
    applyVisualState();
  });
  slot.on("pointerout", () => {
    visualState = { ...visualState, hovered: false };
    applyVisualState();
  });

  let pointerStart: { x: number; y: number } | null = null;
  const swipeMinDistance = cellSize * matchThreeSwipeMinDistanceFraction;

  const handleGoldDrag = (event: { global: { x: number; y: number } }) => {
    if (!pointerStart || !draggingGoldBonus) {
      return;
    }

    setGoldBonusDragOffset(
      event.global.x - pointerStart.x,
      event.global.y - pointerStart.y,
    );
  };

  const stopGoldDragTracking = () => {
    draggingGoldBonus = false;
    slot.off("globalpointermove", handleGoldDrag);
  };

  const releaseGoldDragVisual = () => {
    zOrder.restore();
    resetPieceTransform();
    if (isGoldBonusSlot()) {
      showAirplaneBonus();
    }
    applyVisualState();
  };

  const finishPointer = async (globalX: number, globalY: number) => {
    if (!pointerStart) {
      return;
    }

    const dx = globalX - pointerStart.x;
    const dy = globalY - pointerStart.y;
    const wasGoldDrag = draggingGoldBonus;
    stopGoldDragTracking();
    pointerStart = null;

    if (Math.hypot(dx, dy) < swipeMinDistance) {
      if (wasGoldDrag) {
        releaseGoldDragVisual();
      }
      onClick(coord);
      return;
    }

    const target = getSwipeNeighbor(coord, dx, dy);
    if (!target) {
      if (wasGoldDrag) {
        releaseGoldDragVisual();
      }
      return;
    }

    if (wasGoldDrag) {
      const max = cellSize * matchThreeGoldBonusDragFraction;
      const fromOx = clampDrag(dx, max);
      const fromOy = clampDrag(dy, max);
      const aimDx =
        (target.col - coord.col) * cellStep * matchThreeGoldBonusAimFraction;
      const aimDy =
        (target.row - coord.row) * cellStep * matchThreeGoldBonusAimFraction;

      await tween(matchThreeGoldBonusAimDurationMs, (progress) => {
        const ox = fromOx + (aimDx - fromOx) * progress;
        const oy = fromOy + (aimDy - fromOy) * progress;
        bonusGlow.position.set(cellCenter + ox, cellCenter + oy);
        bonusMark.position.set(cellCenter + ox, cellCenter + oy);
      });
      releaseGoldDragVisual();
    }

    onSwipe(coord, target);
  };

  slot.on("pointerdown", (event) => {
    pointerStart = { x: event.global.x, y: event.global.y };
    if (isGoldBonusSlot()) {
      draggingGoldBonus = true;
      zOrder.raise();
      slot.on("globalpointermove", handleGoldDrag);
    }
  });
  slot.on("pointerup", (event) => {
    void finishPointer(event.global.x, event.global.y);
  });
  slot.on("pointerupoutside", (event) => {
    void finishPointer(event.global.x, event.global.y);
  });

  const cellView: CellView = {
    setSlot(boardSlot) {
      renderSlot(boardSlot);
    },

    setVisualState(state) {
      visualState = { ...visualState, ...state };
      applyVisualState();
    },

    setMarked(marked) {
      visualState = { ...visualState, marked };
      applyVisualState();
    },

    hidePiece() {
      pieceSprite.visible = false;
      bonusMark.visible = false;
      bonusGlow.visible = false;
      isBonusSlot = false;
      bonusGlow.scale.set(1);
      bonusGlow.alpha = 1;
      bonusMark.scale.set(1);
      bonusMark.alpha = 1;
      bonusGlow.position.set(cellCenter, cellCenter);
      bonusMark.position.set(cellCenter, cellCenter);
      visualState = { ...visualState, hovered: false };
      applyVisualState();
    },

    resetPiece() {
      resetPieceTransform();
    },

    tickBonusPulse(timeMs) {
      if (pulseSuspended || !isBonusSlot || !bonusGlow.visible) {
        return;
      }

      applyBonusPulse(
        bonusGlow,
        bonusMark,
        bonusPulseWave(timeMs, pulsePhase),
        pieceSprite,
      );
    },

    async animateFadeOut() {
      pulseSuspended = true;
      const targets = visibleContent();

      try {
        await tween(matchThreeRemoveDurationMs, (progress) => {
          for (const target of targets) {
            target.alpha = 1 - progress;
          }
          if (pieceSprite.visible) {
            pieceSprite.scale.set(baseScale * (1 - progress * 0.35));
          }
        });
      } finally {
        pulseSuspended = false;
      }

      for (const target of targets) {
        target.alpha = 1;
      }
    },

    async animateFall(fromRow, toRow, boardSlot, step) {
      const startY = cellCenter + (fromRow - toRow) * step;
      await animateVerticalMove(startY, boardSlot);
    },

    async animateDropFromAbove(row, boardSlot, step) {
      const startY = cellCenter - (row + 1) * step;
      await animateVerticalMove(startY, boardSlot);
    },

    async animateSwapOffset(dx, dy) {
      const targets = visibleContent();

      await tween(matchThreeSwapDurationMs, (progress) => {
        for (const target of targets) {
          target.position.set(
            cellCenter + dx * progress,
            cellCenter + dy * progress,
          );
        }
      });
    },
  };

  renderSlot(initialSlot);

  return { slot, cellView };
}

export function createBoardView(
  model: MatchThreeBoardModel,
  screenWidth: number,
  screenHeight: number,
): BoardView {
  const layout = getMatchThreeLayout(screenWidth, screenHeight);
  const cellStep = layout.cellSize + layout.cellGap;
  const boardWidth = matchThreeCols * cellStep - layout.cellGap;
  const boardHeight = matchThreeRows * cellStep - layout.cellGap;

  const container = new Container();
  const grid = new Container();
  grid.sortableChildren = true;
  container.pivot.set(boardWidth / 2, boardHeight / 2);
  container.addChild(grid);

  const cells = new Map<string, CellView>();
  let clickHandler: ((coord: CellCoord) => void) | null = null;
  let swipeHandler: ((from: CellCoord, to: CellCoord) => void) | null = null;
  let selectedKey: string | null = null;

  const getCell = (coord: CellCoord): CellView => {
    const view = cells.get(cellKey(coord));
    if (!view) {
      throw new Error(`Cell not found: ${cellKey(coord)}`);
    }
    return view;
  };

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      const coord = { col, row };
      const defaultZIndex = row * matchThreeCols + col;
      const { slot, cellView } = createCellView(
        coord,
        cellStep,
        layout,
        model.getSlot(col, row),
        (clicked) => clickHandler?.(clicked),
        (from, to) => swipeHandler?.(from, to),
        {
          raise: () => {
            slot.zIndex = 10_000;
            grid.sortChildren();
          },
          restore: () => {
            slot.zIndex = defaultZIndex;
            grid.sortChildren();
          },
        },
      );

      slot.zIndex = defaultZIndex;
      cells.set(cellKey(coord), cellView);
      grid.addChild(slot);
    }
  }

  const cellCenter = layout.cellSize / 2;

  const cellCenterAt = (coord: CellCoord) => ({
    x: coord.col * cellStep + cellCenter,
    y: coord.row * cellStep + cellCenter,
  });

  const syncFromModel = () => {
    forEachCell((coord) => {
      const cell = getCell(coord);
      cell.setSlot(model.getSlot(coord.col, coord.row));
      cell.resetPiece();
    });
  };

  const animateRemove = async (coords: CellCoord[]) => {
    await Promise.all(coords.map((coord) => getCell(coord).animateFadeOut()));
    for (const coord of coords) {
      getCell(coord).hidePiece();
    }
  };

  const clearHighlights = () => {
    forEachCell((coord) => getCell(coord).setMarked(false));
  };

  const highlightCells = (coords: CellCoord[]) => {
    clearHighlights();
    for (const coord of coords) {
      getCell(coord).setMarked(true);
    }
  };

  return {
    container,

    async animateSwap(a, b) {
      const dx = (b.col - a.col) * cellStep;
      const dy = (b.row - a.row) * cellStep;

      await Promise.all([
        getCell(a).animateSwapOffset(dx, dy),
        getCell(b).animateSwapOffset(-dx, -dy),
      ]);

      getCell(a).setSlot(model.getSlot(a.col, a.row));
      getCell(b).setSlot(model.getSlot(b.col, b.row));
      getCell(a).resetPiece();
      getCell(b).resetPiece();
    },

    animateRemove,

    async animateShellArrowStrike(from, target) {
      getCell(from).hidePiece();

      const projectile = new Container();
      const glow = new Graphics();
      drawBonusGlow(glow, layout.cellSize, matchThreeSilverBonusGlow);
      glow.blendMode = "add";

      const mark = new Graphics();
      drawSilverDiamondBonusMark(mark, layout.cellSize);
      projectile.addChild(glow, mark);

      const start = cellCenterAt(from);
      const end = cellCenterAt(target);
      projectile.position.set(start.x, start.y);
      grid.addChild(projectile);

      await tween(matchThreeFlyStrikeDurationMs, (progress) => {
        projectile.position.set(
          start.x + (end.x - start.x) * progress,
          start.y + (end.y - start.y) * progress,
        );
        applyBonusPulse(
          glow,
          mark,
          bonusPulseWave(performance.now(), from.col + from.row),
        );
      });

      projectile.destroy();

      if (from.col !== target.col || from.row !== target.row) {
        await getCell(target).animateFadeOut();
        getCell(target).hidePiece();
      }
    },

    highlightCells,
    clearHighlights,

    async playWave(wave, hooks) {
      await animateRemove(wave.matches);

      for (const { coord, bonus } of wave.spawns) {
        getCell(coord).setSlot(bonus);
      }

      if (hooks?.afterSpawns) {
        await hooks.afterSpawns();
      }

      for (const { col, fromRow } of wave.falls) {
        getCell({ col, row: fromRow }).hidePiece();
      }

      await Promise.all(
        wave.falls.map(({ col, fromRow, toRow, slot }) =>
          getCell({ col, row: toRow }).animateFall(
            fromRow,
            toRow,
            slot,
            cellStep,
          ),
        ),
      );

      await Promise.all(
        wave.refills.map(({ col, row, piece }) =>
          getCell({ col, row }).animateDropFromAbove(row, piece, cellStep),
        ),
      );

      syncFromModel();
    },

    syncFromModel,

    setSelected(coord) {
      if (selectedKey) {
        const previous = cells.get(selectedKey);
        previous?.setVisualState({ hovered: false, selected: false });
        previous?.setMarked(false);
        selectedKey = null;
      }

      if (!coord) return;

      const key = cellKey(coord);
      const cell = cells.get(key);
      cell?.setVisualState({ hovered: false, selected: true });
      cell?.setMarked(false);
      selectedKey = key;
    },

    onCellClick(handler) {
      clickHandler = handler;
      return () => {
        if (clickHandler === handler) {
          clickHandler = null;
        }
      };
    },

    onCellSwipe(handler) {
      swipeHandler = handler;
      return () => {
        if (swipeHandler === handler) {
          swipeHandler = null;
        }
      };
    },

    tick(ticker) {
      const timeMs = ticker.lastTime;
      for (const cellView of cells.values()) {
        cellView.tickBonusPulse(timeMs);
      }
    },
  };
}
