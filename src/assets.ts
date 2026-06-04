import { Assets } from "pixi.js";

/** Путь к файлу в public/assets с учётом base (GitHub Pages: /aquarium/) */
function publicAsset(fileName: string) {
  return `${import.meta.env.BASE_URL}assets/${fileName}`;
}

export const ASSETS = [
  { alias: "background", src: publicAsset("background.jpg") },
  { alias: "blue_fish", src: publicAsset("blue_fish.png") },
  { alias: "green_fish", src: publicAsset("green_fish.png") },
  { alias: "purple_fish", src: publicAsset("purple_fish.png") },
  { alias: "overlay", src: publicAsset("aquarium_overlay.png") },
  { alias: "box", src: publicAsset("box.png") },
  { alias: "corall", src: publicAsset("corall.png") },
  { alias: "diamond", src: publicAsset("diamond.png") },
  { alias: "shell", src: publicAsset("shell.png") },
  { alias: "ship", src: publicAsset("ship.png") },
] as const;

export async function preloadAssets() {
  await Assets.load([...ASSETS]);
}
