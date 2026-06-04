/**
 * Текст в Pixi — те же значения, что --text-* в tokens.css.
 */

export const textFontFamily = "Arial, sans-serif";
export const textFill = 0xfaf8ff;
export const textStroke = 0x003344;

/** Счёт и другие крупные подписи */
export const scoreTextStyle = {
  fontFamily: textFontFamily,
  fontSize: 24,
  fontWeight: "700" as const,
  fill: textFill,
  stroke: { color: textStroke, width: 4 },
};
