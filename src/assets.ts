import { Assets } from "pixi.js";

export const ASSETS = [
  { alias: "background", src: "/assets/background.jpg" },
  { alias: "blue_fish", src: "/assets/blue_fish.png" },
  { alias: "green_fish", src: "/assets/green_fish.png" },
  { alias: "purple_fish", src: "/assets/purple_fish.png" },
  { alias: "overlay", src: "/assets/aquarium_overlay.png" },
] as const;

export async function preloadAssets() {
  await Assets.load([...ASSETS]);
}
