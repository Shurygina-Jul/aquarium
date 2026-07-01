export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Плавная анимация 0 → 1 с замедлением в конце */
export function tween(
  durationMs: number,
  onProgress: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();

    const frame = (now: number) => {
      const linear = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - linear) ** 2;
      onProgress(eased);

      if (linear < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(frame);
  });
}
