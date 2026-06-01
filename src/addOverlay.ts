import { Application, Texture, Ticker, TilingSprite } from "pixi.js";

let water: TilingSprite;

const bottomHeightFraction = 0.4;

/** Каустика у дна аквариума */
export function addWaterOverlay(app: Application) {
  const { width, height } = app.screen;
  const overlayHeight = height * bottomHeightFraction;

  water = new TilingSprite({
    texture: Texture.from("overlay"),
    width,
    height: overlayHeight,
  });

  water.y = height - overlayHeight;
  water.alpha = 0.2;
  water.blendMode = "screen";

  app.stage.addChild(water);
}

/** Сдвигает текстуру каустики — создаётся движение света на дне */
export function animateWaterOverlay(ticker: Ticker) {
  water.tilePosition.x -= ticker.deltaTime * 0.3;
}
