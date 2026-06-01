import { Application } from "pixi.js";

export function getPixiContainer(): HTMLDivElement {
  const element = document.querySelector("#pixi-container");

  if (!(element instanceof HTMLDivElement)) {
    throw new Error("#pixi-container not found");
  }

  return element;
}

export async function initApp(container: HTMLDivElement) {
  const app = new Application();

  await app.init({
    background: "#1099bb",
    resizeTo: container,
  });

  container.appendChild(app.canvas);

  return app;
}
