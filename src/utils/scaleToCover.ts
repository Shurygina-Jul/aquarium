/** Масштабирует спрайт так, чтобы закрыть весь экран (cover) */
export function scaleToCover(
  sprite: {
    width: number;
    height: number;
    scale: { set: (value: number) => void };
  },
  screenWidth: number,
  screenHeight: number,
) {
  const scale = Math.max(
    screenWidth / sprite.width,
    screenHeight / sprite.height,
  );
  sprite.scale.set(scale);
}
