import { Container, Graphics } from "pixi.js";
import {
  matchThreeCellFill,
  matchThreeCellGap,
  matchThreeCellSize,
  matchThreeCellStroke,
  matchThreeCellStrokeWidth,
  matchThreeCols,
  matchThreeRows,
} from "@/screens/matchThree/config";

/** Сетка match-3 (заглушка под будущую игру) */
export function addMatchThreeBoard(): Container {
  const board = new Container();
  const cellStep = matchThreeCellSize + matchThreeCellGap;
  const boardWidth = matchThreeCols * cellStep - matchThreeCellGap;
  const boardHeight = matchThreeRows * cellStep - matchThreeCellGap;

  board.pivot.set(boardWidth / 2, boardHeight / 2);

  for (let row = 0; row < matchThreeRows; row++) {
    for (let col = 0; col < matchThreeCols; col++) {
      const cell = new Graphics()
        .roundRect(0, 0, matchThreeCellSize, matchThreeCellSize, 8)
        .fill({ color: matchThreeCellFill, alpha: 0.85 })
        .stroke({
          width: matchThreeCellStrokeWidth,
          color: matchThreeCellStroke,
          alpha: 0.9,
        });

      cell.x = col * cellStep;
      cell.y = row * cellStep;
      board.addChild(cell);
    }
  }

  return board;
}
