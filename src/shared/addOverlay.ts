import { Application, Container, Texture, Ticker, TilingSprite } from "pixi.js";

const bottomHeightFraction = 0.4;

/** Каустика у дна аквариума */
export function addWaterOverlay(app: Application, parent: Container) {
  const { width, height } = app.screen;
  const overlayHeight = height * bottomHeightFraction;

  const water = new TilingSprite({
    texture: Texture.from("overlay"),
    width,
    height: overlayHeight,
  });

  water.y = height - overlayHeight;
  water.alpha = 0.2;
  water.blendMode = "screen";

  parent.addChild(water);

  return {
    tick(ticker: Ticker) {
      water.tilePosition.x -= ticker.deltaTime * 0.3;
    },
  };
}
