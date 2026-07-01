import { Container, Text } from "pixi.js";
import { tween } from "@/screens/matchThree/boardAnimations";
import { scoreTextStyle } from "@/styles/pixiText";

const scorePopDurationMs = 220;
const scorePopScale = 0.18;

/** Счётчик очков на экране игры */
export function createScoreLabel(initialScore = 0): Container & {
  addScore: (delta: number) => void;
  setScore: (value: number) => void;
} {
  const root = new Container() as Container & {
    addScore: (delta: number) => void;
    setScore: (value: number) => void;
  };

  const caption = new Text({
    text: formatScore(initialScore),
    style: scoreTextStyle,
  });
  caption.anchor.set(0.5, 0);

  root.addChild(caption);

  let currentScore = initialScore;

  const popScore = () => {
    void tween(scorePopDurationMs, (progress) => {
      const scale = 1 + Math.sin(progress * Math.PI) * scorePopScale;
      caption.scale.set(scale);
    }).then(() => {
      caption.scale.set(1);
    });
  };

  root.addScore = (delta: number) => {
    if (delta <= 0) {
      return;
    }

    currentScore += delta;
    caption.text = formatScore(currentScore);
    popScore();
  };

  root.setScore = (value: number) => {
    currentScore = value;
    caption.text = formatScore(value);
    caption.scale.set(1);
  };

  return root;
}

function formatScore(score: number): string {
  return `Очки: ${score}`;
}
