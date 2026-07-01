import { Graphics } from "pixi.js";
import {
  matchThreeCellStroke,
  matchThreeGoldBonusGlow,
  matchThreeSilverBonusGlow,
} from "@/screens/matchThree/config";

type DiamondStyle = {
  glow: number;
  main: number;
  light: number;
  dark: number;
  stroke: number;
};

const silverDiamond: DiamondStyle = {
  glow: matchThreeSilverBonusGlow,
  main: 0xb0bec8,
  light: 0xf5f8fc,
  dark: 0x78909c,
  stroke: 0xffffff,
};

const goldDiamond: DiamondStyle = {
  glow: matchThreeGoldBonusGlow,
  main: matchThreeCellStroke,
  light: 0xfff9dc,
  dark: 0xb8860b,
  stroke: 0xfff9dc,
};

export function drawBonusGlow(glow: Graphics, cellSize: number, color: number) {
  const outer = cellSize * 0.46;
  const mid = cellSize * 0.36;
  const inner = cellSize * 0.26;

  glow
    .clear()
    .circle(0, 0, outer)
    .fill({ color, alpha: 0.1 })
    .circle(0, 0, mid)
    .fill({ color, alpha: 0.18 })
    .circle(0, 0, inner)
    .fill({ color, alpha: 0.14 });
}

function drawDiamondGem(mark: Graphics, cellSize: number, style: DiamondStyle) {
  const h = cellSize * 0.3;
  const w = cellSize * 0.23;

  mark
    .moveTo(0, -h)
    .lineTo(w, 0)
    .lineTo(0, h)
    .lineTo(-w, 0)
    .closePath()
    .fill({ color: style.main, alpha: 0.98 })
    .stroke({ width: 2, color: style.stroke, alpha: 0.95 });

  mark
    .moveTo(0, -h)
    .lineTo(w * 0.55, -h * 0.12)
    .lineTo(0, 0)
    .lineTo(-w * 0.55, -h * 0.12)
    .closePath()
    .fill({ color: style.light, alpha: 0.9 });

  mark
    .moveTo(0, 0)
    .lineTo(w * 0.55, h * 0.12)
    .lineTo(0, h)
    .lineTo(-w * 0.55, h * 0.12)
    .closePath()
    .fill({ color: style.dark, alpha: 0.55 });

  mark
    .moveTo(0, -h * 0.35)
    .lineTo(0, h * 0.35)
    .stroke({ width: 1, color: style.light, alpha: 0.35 });
}

/** Бонус 2×2 — серебряный алмаз */
export function drawSilverDiamondBonusMark(mark: Graphics, cellSize: number) {
  mark.clear();
  drawDiamondGem(mark, cellSize, silverDiamond);
}

/** Бонус 5+ — золотой алмаз */
export function drawGoldDiamondBonusMark(mark: Graphics, cellSize: number) {
  mark.clear();
  drawDiamondGem(mark, cellSize * 1.06, goldDiamond);
}
