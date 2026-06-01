import { Application, Container, Sprite } from "pixi.js";
import {
  fishAssets,
  fishCount,
  fishFacing,
  fishScaleMin,
  fishScaleRange,
  fishSpeedMin,
  fishSpeedRange,
  fishWobbleAmplitudeMin,
  fishWobbleAmplitudeRange,
  fishWobbleSpeedMin,
  fishWobbleSpeedRange,
  verticalPadding,
} from "./config/fish";
import type { FishSprite } from "./types/fish";

/** Создаёт рыб на сцене и добавляет их в переданный массив */
export function addFishes(app: Application, fishes: FishSprite[]) {
  const fishContainer = new Container();
  app.stage.addChild(fishContainer);

  const swimZoneHeight = app.screen.height - verticalPadding * 2;

  for (let i = 0; i < fishCount; i++) {
    const fishAsset = fishAssets[i % fishAssets.length];
    const fish = Sprite.from(fishAsset) as FishSprite;

    fish.anchor.set(0.5);

    fish.baseY = verticalPadding + Math.random() * swimZoneHeight;
    fish.y = fish.baseY;
    fish.wobblePhase = Math.random() * Math.PI * 2;
    fish.wobbleAmplitude =
      fishWobbleAmplitudeMin + Math.random() * fishWobbleAmplitudeRange;
    fish.wobbleSpeed =
      fishWobbleSpeedMin + Math.random() * fishWobbleSpeedRange;
    fish.x = Math.random() * app.screen.width;

    const direction = Math.random() > 0.5 ? 1 : -1;
    fish.velocityX =
      direction * (fishSpeedMin + Math.random() * fishSpeedRange);

    const scale = fishScaleMin + Math.random() * fishScaleRange;
    fish.baseScale = scale;
    fish.faceFlip = fishFacing[fishAsset];
    fish.scale.set(scale * direction * fish.faceFlip, scale);

    fishContainer.addChild(fish);
    fishes.push(fish);
  }
}
