import { Container, Text } from "pixi.js";
import { scoreTextStyle } from "@/styles/pixiText";

/** Счётчик очков на экране игры */
export function createScoreLabel(initialScore = 0): Container & {
  setScore: (value: number) => void;
} {
  const root = new Container() as Container & {
    setScore: (value: number) => void;
  };

  const caption = new Text({
    text: formatScore(initialScore),
    style: scoreTextStyle,
  });
  caption.anchor.set(0.5, 0);

  root.addChild(caption);

  root.setScore = (value: number) => {
    caption.text = formatScore(value);
  };

  return root;
}

function formatScore(score: number): string {
  return `Очки: ${score}`;
}
