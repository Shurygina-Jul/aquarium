import { Application, Ticker } from "pixi.js";
import { fishTurnChance, stagePadding } from "@/screens/cover/config/fish";
import type { FishSprite } from "@/screens/cover/types/fish";

/** Обновляет позицию и вид каждой рыбы каждый кадр */
export function animateFishes(
  app: Application,
  fishes: FishSprite[],
  ticker: Ticker,
) {
  const delta = ticker.deltaTime;
  const boundWidth = app.screen.width + stagePadding * 2;

  fishes.forEach((fish) => {
    fish.x += fish.velocityX * delta;

    const wave = ticker.lastTime * fish.wobbleSpeed + fish.wobblePhase;
    fish.y = fish.baseY + Math.sin(wave) * fish.wobbleAmplitude;

    if (Math.random() < fishTurnChance) {
      fish.velocityX *= -1;
    }

    const direction = fish.velocityX > 0 ? 1 : -1;
    fish.scale.x = fish.baseScale * direction * fish.faceFlip;
    fish.scale.y = fish.baseScale;

    if (fish.x < -stagePadding) {
      fish.x += boundWidth;
    }
    if (fish.x > app.screen.width + stagePadding) {
      fish.x -= boundWidth;
    }
  });
}
