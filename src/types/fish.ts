import type { Sprite } from "pixi.js";

/** Спрайт рыбы с горизонтальным движением */
export type FishSprite = Sprite & {
  velocityX: number;
  baseScale: number;
  faceFlip: number;
  baseY: number;
  wobblePhase: number;
  wobbleAmplitude: number;
  wobbleSpeed: number;
};
