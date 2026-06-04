import { Application, Container } from "pixi.js";
import { addMatchThreeBoard } from "@/screens/matchThree/addMatchThreeBoard";
import { createScoreLabel } from "@/screens/matchThree/scoreLabel";
import { addBackground } from "@/shared/addBackground";
import { addWaterOverlay } from "@/shared/addOverlay";
import type { Scene } from "@/types/scene";
import { createBackButton } from "@/ui/htmlButtons";

const sceneDestroyOptions = { children: true } as const;

type MatchThreeSceneOptions = {
  onBack: () => void;
};

/** Экран match-3: поле с плитками (заглушка), счёт, «Назад» в HTML */
export function showMatchThree(
  app: Application,
  { onBack }: MatchThreeSceneOptions,
): Scene {
  const root = new Container();
  const { width, height } = app.screen;

  addBackground(app, root);
  const water = addWaterOverlay(app, root);

  const board = addMatchThreeBoard(width, height);
  board.position.set(width / 2, height / 2);
  root.addChild(board);

  const score = createScoreLabel(0);
  score.position.set(width / 2, 24);
  root.addChild(score);

  app.stage.addChild(root);

  const backButton = createBackButton(onBack);
  backButton.show();

  return {
    tick(ticker) {
      water.tick(ticker);
    },

    destroy() {
      backButton.destroy();
      root.destroy(sceneDestroyOptions);
      if (root.parent === app.stage) {
        app.stage.removeChild(root);
      }
    },
  };
}
