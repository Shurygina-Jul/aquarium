import { Graphics, Sprite } from "pixi.js";
import {
  matchThreeBonusPulseAlphaMax,
  matchThreeBonusPulseAlphaMin,
  matchThreeBonusPulseScaleMax,
  matchThreeBonusPulseScaleMin,
  matchThreeBonusPulseSpeed,
} from "@/screens/matchThree/config";

function lerp(min: number, max: number, t: number): number {
  return min + t * (max - min);
}

export function bonusPulseWave(timeMs: number, phase: number): number {
  const slow = (Math.sin(timeMs * matchThreeBonusPulseSpeed + phase) + 1) * 0.5;
  const fast =
    (Math.sin(timeMs * matchThreeBonusPulseSpeed * 2.4 + phase * 1.6) + 1) *
    0.5;
  return slow * 0.72 + fast * 0.28;
}

export function applyBonusPulse(
  glow: Graphics,
  mark: Graphics,
  wave: number,
  piece?: Sprite,
) {
  glow.alpha = lerp(
    matchThreeBonusPulseAlphaMin,
    matchThreeBonusPulseAlphaMax,
    wave,
  );
  glow.scale.set(
    lerp(matchThreeBonusPulseScaleMin, matchThreeBonusPulseScaleMax, wave),
  );
  const markScale = lerp(0.97, 1.03, wave);
  mark.scale.set(markScale);
  mark.alpha = lerp(0.88, 1, wave);
  if (piece?.visible) {
    piece.alpha = lerp(0.9, 1, wave);
  }
}
