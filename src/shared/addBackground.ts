import { Application, Container, Sprite } from "pixi.js";
import { scaleToCover } from "@/utils/scaleToCover";

export function addBackground(app: Application, parent: Container) {
  const background = Sprite.from("background");
  background.anchor.set(0.5);

  scaleToCover(background, app.screen.width, app.screen.height);

  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  parent.addChild(background);
}
