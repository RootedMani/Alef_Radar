/**
 * Helper utilities for formatting numbers with comma (thousands) separators.
 */

/**
 * Format a number with comma separators (e.g. 1000 -> 1,000, 15000 -> 15,000)
 */
export function formatThousands(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return String(val);
  return num.toLocaleString('en-US');
}

/**
 * Format a number with comma separators.
 * If isRtl is true, outputs Persian numerals; otherwise strictly outputs standard English digits (en-US).
 */
export function formatNum(val: number | string | undefined | null, isRtl: boolean = false): string {
  if (val === undefined || val === null) return '';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return String(val);
  return num.toLocaleString(isRtl ? 'fa-IR' : 'en-US');
}

/**
 * Format a number strictly to English digits (e.g. 1000 -> 1,000, 0 -> 0)
 * Prevents Persian digits from rendering on devices with Persian system locales.
 */
export function formatEnglish(val: number | string | undefined | null): string {
  return formatNum(val, false);
}
