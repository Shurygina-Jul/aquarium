/** Сколько рыб создать на сцене */
export const fishCount = 20;

/** Алиасы текстур из assets.ts (по кругу: синяя, зелёная, фиолетовая…) */
export const fishAssets = ["blue_fish", "green_fish", "purple_fish"] as const;

/**
 * Куда смотрит спрайт в PNG: +1 вправо, −1 влево.
 * Нужно, чтобы при velocityX рыба не плыла «задом».
 */
export const fishFacing: Record<(typeof fishAssets)[number], 1 | -1> = {
  blue_fish: 1,
  green_fish: 1,
  purple_fish: -1,
};

/** Отступ сверху и снизу — рыбы не плавают у самого края экрана */
export const verticalPadding = 80;

/** Запас за левым/правым краем при «телепорте» на другую сторону */
export const stagePadding = 100;

/** Эталон меньшей стороны экрана: на узком (iPhone) рыбы уменьшаются */
export const fishScreenReference = 900;

/** Минимальный масштаб рыбы (базовый размер спрайта) */
export const fishScaleMin = 0.12;

/** К случайному размеру добавляется от 0 до этого значения */
export const fishScaleRange = 0.06;

/** Минимальная горизонтальная скорость (пикселей за кадр при ~60 FPS) */
export const fishSpeedMin = 0.6;

/** Разброс скорости: итого от fishSpeedMin до fishSpeedMin + fishSpeedRange */
export const fishSpeedRange = 0.8;

/** Минимальная амплитуда покачивания вверх–вниз (пиксели) */
export const fishWobbleAmplitudeMin = 10;

/** Разброс амплитуды: у каждой рыбы своя высота волны */
export const fishWobbleAmplitudeRange = 14;

/** Минимальная скорость покачивания (больше — быстрее) */
export const fishWobbleSpeedMin = 0.0007;

/** Разброс скорости: у каждой рыбы свой ритм */
export const fishWobbleSpeedRange = 0.001;

/** Вероятность разворота за один кадр (0.001 ≈ 6% в секунду при 60 FPS) */
export const fishTurnChance = 0.0001;
