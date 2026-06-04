/** Сколько пузырьков на экране */
export const bubbleCount = 50;

/** Минимальный радиус пузырька (пиксели) */
export const bubbleRadiusMin = 3;

/** К радиусу добавляется от 0 до этого значения */
export const bubbleRadiusRange = 5;

/** Максимальное горизонтальное смещение за кадр (±половина от этого значения) */
export const bubbleDriftMax = 0.3;

/** Минимальная скорость всплытия вверх (отрицательный vy, пикселей за кадр) */
export const bubbleRiseSpeedMin = 0.15;

/** Разброс скорости всплытия */
export const bubbleRiseSpeedRange = 0.35;

/** Запас за краем экрана при «переспавне» снизу/сверху */
export const bubbleWrapMargin = 20;

/** Заливка шара */
export const bubbleFillAlpha = 0.1;

/** Контур шара */
export const bubbleStrokeWidth = 1.2;
export const bubbleStrokeAlpha = 0.45;

/** Блик на пузырьке (маленький круг смещён вверх-влево) */
export const bubbleHighlightAlpha = 0.35;
export const bubbleHighlightRadiusFactor = 0.22;
export const bubbleHighlightOffsetFactor = 0.3;
