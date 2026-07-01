import {
  areAdjacent,
  coordsEqual,
  coordsInList,
} from "@/screens/matchThree/cellUtils";
import type { MatchThreeBoardModel } from "@/screens/matchThree/boardModel";
import type { BoardView } from "@/screens/matchThree/boardView";
import type { CascadeWave } from "@/screens/matchThree/resolveBoard";
import { isPlainPiece } from "@/screens/matchThree/slotUtils";
import type {
  BonusSpawn,
  CellCoord,
  MatchThreePiece,
} from "@/screens/matchThree/types";

type BoardControllerOptions = {
  model: MatchThreeBoardModel;
  view: BoardView;
  onScoreChange?: (delta: number) => void;
};

function getUiLayer(): HTMLDivElement {
  const layer = document.querySelector("#ui-layer");

  if (!(layer instanceof HTMLDivElement)) {
    throw new Error("#ui-layer not found");
  }

  return layer;
}

/**
 * Клики и свайпы: swap, каскад, бонус 5+ (золотой алмаз). Серебряный алмаз (2×2) — сам.
 */
export function createBoardController({
  model,
  view,
  onScoreChange,
}: BoardControllerOptions): { destroy: () => void } {
  let selected: CellCoord | null = null;
  let busy = false;
  let pendingAirplane: CellCoord | null = null;
  let pendingAirplaneTargets: CellCoord[] = [];

  const hint = document.createElement("div");
  hint.hidden = true;
  hint.style.cssText =
    "position:absolute;left:50%;bottom:88px;transform:translateX(-50%);padding:8px 14px;border-radius:12px;background:rgba(0,40,60,0.92);border:2px solid #e4b82a;color:#faf8ff;font:700 14px Arial,sans-serif;pointer-events:none;text-align:center;white-space:nowrap;";
  getUiLayer().appendChild(hint);

  const clearSelection = () => {
    selected = null;
    view.setSelected(null);
  };

  const showHint = (text: string) => {
    hint.textContent = text;
    hint.hidden = false;
  };

  const hideHint = () => {
    hint.hidden = true;
  };

  const cancelAirplaneMode = () => {
    pendingAirplane = null;
    pendingAirplaneTargets = [];
    hideHint();
    view.clearHighlights();
    view.setSelected(null);
  };

  const autoActivateSilverSpawns = async (spawns: BonusSpawn[]) => {
    for (const { coord, bonus } of spawns) {
      if (bonus !== "shell_arrow_bonus") {
        continue;
      }

      await executeShellArrowBonus(coord);
    }
  };

  const playWaveWithSilver = async (wave: CascadeWave) => {
    await view.playWave(wave, {
      afterSpawns: () => autoActivateSilverSpawns(wave.spawns),
    });
    if (wave.score > 0) {
      onScoreChange?.(wave.score);
    }
  };

  const playWaves = async (waves: CascadeWave[]) => {
    for (const wave of waves) {
      await playWaveWithSilver(wave);
    }
  };

  const playMatchCascade = async () => {
    while (true) {
      const wave = model.resolveOneWave();
      if (!wave) {
        break;
      }

      await playWaveWithSilver(wave);
    }
  };

  const executeShellArrowBonus = async (coord: CellCoord) => {
    const strike = model.activateShellArrowBonus(coord);
    if (!strike) {
      return;
    }

    await view.animateShellArrowStrike(strike.from, strike.target);
    const removedScore = coordsEqual(strike.from, strike.target) ? 1 : 2;
    onScoreChange?.(removedScore);
    await playWaves(model.resolveSettleAndCascade());
  };

  const activateAirplane = async (
    bonusCoord: CellCoord,
    piece: MatchThreePiece,
  ) => {
    busy = true;

    try {
      const removed = model.activateAirplaneBonus(bonusCoord, piece);
      cancelAirplaneMode();

      await view.animateRemove(removed);
      onScoreChange?.(removed.length);
      await playWaves(model.resolveSettleAndCascade());
    } finally {
      busy = false;
    }
  };

  const trySwap = async (first: CellCoord, second: CellCoord) => {
    if (!areAdjacent(first, second)) {
      return;
    }

    clearSelection();
    busy = true;

    try {
      model.swap(first, second);
      await view.animateSwap(first, second);

      if (!model.hasMatches()) {
        model.swap(first, second);
        await view.animateSwap(first, second);
        return;
      }

      await playMatchCascade();
    } finally {
      busy = false;
    }
  };

  const processSwipe = async (from: CellCoord, to: CellCoord) => {
    if (busy) {
      return;
    }

    if (model.getBonus(from.col, from.row) === "airplane_bonus") {
      if (!areAdjacent(from, to)) {
        return;
      }

      const slot = model.getSlot(to.col, to.row);
      if (!isPlainPiece(slot)) {
        return;
      }

      await activateAirplane(from, slot);
      return;
    }

    if (pendingAirplane) {
      return;
    }

    if (model.getBonus(from.col, from.row) !== null) {
      return;
    }

    await trySwap(from, to);
  };

  const processClick = async (coord: CellCoord) => {
    if (busy) {
      return;
    }

    if (pendingAirplane) {
      if (coordsEqual(coord, pendingAirplane)) {
        cancelAirplaneMode();
        return;
      }

      if (!coordsInList(coord, pendingAirplaneTargets)) {
        return;
      }

      const slot = model.getSlot(coord.col, coord.row);
      if (!isPlainPiece(slot)) {
        return;
      }

      const bonusCoord = pendingAirplane;
      pendingAirplane = null;
      pendingAirplaneTargets = [];

      await activateAirplane(bonusCoord, slot);
      return;
    }

    const bonus = model.getBonus(coord.col, coord.row);

    if (!selected && bonus === "airplane_bonus") {
      const neighbors = model.getAdjacentPlainPieceCoords(coord);
      if (neighbors.length === 0) {
        return;
      }

      pendingAirplane = coord;
      pendingAirplaneTargets = neighbors;
      view.setSelected(coord);
      showHint("Свайпните к соседней плитке");
      return;
    }

    if (!selected) {
      selected = coord;
      view.setSelected(coord);
      return;
    }

    if (coordsEqual(selected, coord)) {
      clearSelection();
      return;
    }

    if (!areAdjacent(selected, coord)) {
      selected = coord;
      view.setSelected(coord);
      return;
    }

    const first = selected;
    await trySwap(first, coord);
  };

  const handleCellClick = (coord: CellCoord) => {
    void processClick(coord);
  };

  const handleCellSwipe = (from: CellCoord, to: CellCoord) => {
    void processSwipe(from, to);
  };

  const unsubscribeClick = view.onCellClick(handleCellClick);
  const unsubscribeSwipe = view.onCellSwipe(handleCellSwipe);

  return {
    destroy() {
      unsubscribeClick();
      unsubscribeSwipe();
      clearSelection();
      cancelAirplaneMode();
      hint.remove();
    },
  };
}
