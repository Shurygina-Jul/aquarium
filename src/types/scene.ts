import type { Ticker } from "pixi.js";

export type Scene = {
  tick: (ticker: Ticker) => void;
  destroy: () => void;
};
