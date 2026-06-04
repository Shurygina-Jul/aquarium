import type { Application, Ticker } from "pixi.js";
import type { Scene } from "@/types/scene";

export function createSceneManager(app: Application) {
  let current: Scene | null = null;

  const tick = (ticker: Ticker) => {
    current?.tick(ticker);
  };

  app.ticker.add(tick);

  return {
    show(scene: Scene) {
      current?.destroy();
      current = scene;
    },

    destroy() {
      app.ticker.remove(tick);
      current?.destroy();
      current = null;
    },
  };
}
