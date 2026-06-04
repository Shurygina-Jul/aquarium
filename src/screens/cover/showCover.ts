import { Application, Container } from "pixi.js";
import { addBubbles, animateBubbles } from "@/screens/cover/addBubbles";
import { addFishes } from "@/screens/cover/addFishes";
import { animateFishes } from "@/screens/cover/animateFishes";
import type { FishSprite } from "@/screens/cover/types/fish";
import { addBackground } from "@/shared/addBackground";
import { addWaterOverlay } from "@/shared/addOverlay";
import type { Scene } from "@/types/scene";
import { createPlayButton } from "@/ui/htmlButtons";

const sceneDestroyOptions = { children: true } as const;

type CoverSceneOptions = {
  onPlay: () => void;
};

/** Главный экран аквариума с кнопкой «Играть» */
export function showCover(
  app: Application,
  { onPlay }: CoverSceneOptions,
): Scene {
  const root = new Container();
  const fishes: FishSprite[] = [];
  const playButton = createPlayButton(onPlay);

  addBackground(app, root);
  const water = addWaterOverlay(app, root);
  addFishes(app, fishes, root);
  addBubbles(app, root);

  app.stage.addChild(root);
  playButton.show();

  return {
    tick(ticker) {
      animateBubbles(app, ticker);
      animateFishes(app, fishes, ticker);
      water.tick(ticker);
    },

    destroy() {
      playButton.destroy();
      fishes.length = 0;
      root.destroy(sceneDestroyOptions);
      if (root.parent === app.stage) {
        app.stage.removeChild(root);
      }
    },
  };
}
