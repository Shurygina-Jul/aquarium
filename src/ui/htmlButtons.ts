export type HtmlButtonHandle = {
  show: () => void;
  hide: () => void;
  destroy: () => void;
};

function getUiLayer(): HTMLDivElement {
  const layer = document.querySelector("#ui-layer");

  if (!(layer instanceof HTMLDivElement)) {
    throw new Error("#ui-layer not found");
  }

  return layer;
}

/**
 * Создаёт HTML-кнопку в слое поверх canvas.
 * Классы: `game-btn`, `game-btn--primary` | `game-btn--secondary` → `src/styles/buttons/`.
 */
export function createHtmlButton(
  label: string,
  variant: "primary" | "secondary",
  onClick: () => void,
): HtmlButtonHandle {
  const layer = getUiLayer();
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = `game-btn game-btn--${variant}`;
  button.addEventListener("click", onClick);

  layer.appendChild(button);

  return {
    show() {
      button.hidden = false;
    },
    hide() {
      button.hidden = true;
    },
    destroy() {
      button.remove();
    },
  };
}

/** Кнопка «Играть» на главном экране */
export function createPlayButton(onClick: () => void): HtmlButtonHandle {
  return createHtmlButton("Играть", "primary", onClick);
}

/** Кнопка «Назад» на экране игры */
export function createBackButton(onClick: () => void): HtmlButtonHandle {
  return createHtmlButton("Назад", "secondary", onClick);
}
