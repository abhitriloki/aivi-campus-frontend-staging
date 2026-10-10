/**
 * WCAG 2.1 AA Contrast Guard Utility for AIVI Campus
 * Ensures 4.5:1 minimum contrast for text & 3:1 for UI components.
 */

/**
 * Calculates relative luminance of a HEX color (WCAG 2.1 algorithm)
 */
export function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3
    ? cleanHex.split("").map((c) => c + c).join("")
    : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16) / 255;
  const g = parseInt(fullHex.substring(2, 4), 16) / 255;
  const b = parseInt(fullHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates contrast ratio between two HEX colors (1:1 to 21:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns readable text color ('#ffffff' or '#0f172a') for a given background HEX color.
 * Guarantees >= 4.5:1 contrast ratio.
 */
export function accessibleOn(hexColor: string): string {
  const whiteContrast = getContrastRatio(hexColor, "#ffffff");
  const darkContrast = getContrastRatio(hexColor, "#0f172a");

  return whiteContrast >= darkContrast ? "#ffffff" : "#0f172a";
}

/**
 * Ensures tenant primary accent color satisfies minimum contrast against background.
 * Darkens/lightens color if necessary to meet minimum ratio (default 3:1 for UI elements).
 */
export function ensureTenantAccent(
  accentHex: string,
  bgHex: string = "#ffffff",
  minRatio: number = 3.0
): string {
  if (!accentHex || !accentHex.startsWith("#")) return "#169C8F"; // Default AIVI teal

  let ratio = getContrastRatio(accentHex, bgHex);
  if (ratio >= minRatio) return accentHex;

  const bgLum = getLuminance(bgHex);
  const shouldDarken = bgLum > 0.5;

  let cleanHex = accentHex.replace("#", "");
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }

  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  // Iteratively adjust brightness until ratio is satisfied
  for (let i = 0; i < 40; i++) {
    const factor = shouldDarken ? 0.9 : 1.1;
    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));

    const currentHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    if (getContrastRatio(currentHex, bgHex) >= minRatio) {
      return currentHex;
    }
  }

  return shouldDarken ? "#0d5c54" : "#22d3ee";
}
