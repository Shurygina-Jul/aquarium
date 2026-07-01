import { MatchThreeBoardModel } from "@/screens/matchThree/boardModel";
import { createBoardController } from "@/screens/matchThree/boardController";
import { createBoardView } from "@/screens/matchThree/boardView";

type MatchThreeBoardHandle = {
  container: ReturnType<typeof createBoardView>["container"];
  tick: ReturnType<typeof createBoardView>["tick"];
  destroy: () => void;
};

/** Поле match-3: модель, отрисовка и обработка кликов */
export function addMatchThreeBoard(
  screenWidth: number,
  screenHeight: number,
  onScoreChange?: (delta: number) => void,
): MatchThreeBoardHandle {
  const model = MatchThreeBoardModel.create();
  const view = createBoardView(model, screenWidth, screenHeight);
  const controller = createBoardController({ model, view, onScoreChange });

  return {
    container: view.container,
    tick: view.tick,
    destroy() {
      controller.destroy();
    },
  };
}
