import { Application, Container, Graphics, Ticker } from "pixi.js";
import {
  bubbleCount,
  bubbleDriftMax,
  bubbleFillAlpha,
  bubbleHighlightAlpha,
  bubbleHighlightOffsetFactor,
  bubbleHighlightRadiusFactor,
  bubbleRadiusMin,
  bubbleRadiusRange,
  bubbleRiseSpeedMin,
  bubbleRiseSpeedRange,
  bubbleStrokeAlpha,
  bubbleStrokeWidth,
  bubbleWrapMargin,
} from "@/screens/cover/config/bubbles";
import { bubbleFillColor, bubbleStrokeColor } from "@/styles/pixiBubbles";

/** Один пузырёк: графика и скорость по осям */
type Bubble = {
  dot: Graphics;
  vx: number;
  vy: number;
};

let bubbleContainer: Container;
let bubbles: Bubble[] = [];

/** Рисует круг с контуром и бликом */
function createBubble(radius: number) {
  const graphic = new Graphics()
    .circle(0, 0, radius)
    .fill({ color: bubbleFillColor, alpha: bubbleFillAlpha })
    .stroke({
      width: bubbleStrokeWidth,
      color: bubbleStrokeColor,
      alpha: bubbleStrokeAlpha,
    });

  graphic
    .circle(
      -radius * bubbleHighlightOffsetFactor,
      -radius * bubbleHighlightOffsetFactor,
      radius * bubbleHighlightRadiusFactor,
    )
    .fill({ color: bubbleFillColor, alpha: bubbleHighlightAlpha });

  return graphic;
}

/** Создаёт слой пузырьков и расставляет их по экрану */
export function addBubbles(app: Application, parent: Container) {
  const { width, height } = app.screen;

  bubbleContainer = new Container();
  bubbles = [];

  for (let i = 0; i < bubbleCount; i++) {
    const radius = bubbleRadiusMin + Math.random() * bubbleRadiusRange;
    const dot = createBubble(radius);

    dot.x = Math.random() * width;
    dot.y = Math.random() * height;

    bubbleContainer.addChild(dot);
    bubbles.push({
      dot,
      vx: (Math.random() - 0.5) * bubbleDriftMax,
      vy: -(bubbleRiseSpeedMin + Math.random() * bubbleRiseSpeedRange),
    });
  }

  parent.addChild(bubbleContainer);
}

/** Двигает пузырьки вверх и слегка в стороны; за краем — с другой стороны */
export function animateBubbles(app: Application, ticker: Ticker) {
  if (bubbles.length === 0) return;
  const { width, height } = app.screen;
  const delta = ticker.deltaTime;

  for (const { dot, vx, vy } of bubbles) {
    dot.x += vx * delta;
    dot.y += vy * delta;

    if (dot.x < 0) dot.x = width;
    if (dot.x > width) dot.x = 0;
    if (dot.y < -bubbleWrapMargin) dot.y = height + bubbleWrapMargin;
    if (dot.y > height + bubbleWrapMargin) dot.y = -bubbleWrapMargin;
  }
}
