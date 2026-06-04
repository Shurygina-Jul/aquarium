import { Container } from "pixi.js";
import { MatchThreeBoardModel } from "@/screens/matchThree/boardModel";
import { createBoardView } from "@/screens/matchThree/boardView";

/** Поле match-3: раскладка без стартовых троек + отрисовка */
export function addMatchThreeBoard(
  screenWidth: number,
  screenHeight: number,
): Container {
  const model = MatchThreeBoardModel.create();
  return createBoardView(model, screenWidth, screenHeight);
}
