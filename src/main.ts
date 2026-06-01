import { addBackground } from "@/addBackground";
import { addBubbles, animateBubbles } from "@/addBubbles";
import { addFishes } from "@/addFishes";
import { addWaterOverlay, animateWaterOverlay } from "@/addOverlay";
import { animateFishes } from "@/animateFishes";
import { preloadAssets } from "@/assets";
import { getPixiContainer, initApp } from "@/setupApp";
import type { FishSprite } from "@/types/fish";

(async () => {
  const container = getPixiContainer();
  const app = await initApp(container);

  await preloadAssets();

  addBackground(app);
  addWaterOverlay(app);

  const fishes: FishSprite[] = [];
  addFishes(app, fishes);
  addBubbles(app);

  app.ticker.add((ticker) => {
    animateBubbles(app, ticker);
    animateFishes(app, fishes, ticker);
    animateWaterOverlay(ticker);
  });
})();
