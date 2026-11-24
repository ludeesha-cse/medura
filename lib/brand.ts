/**
 * The few brand colors needed OUTSIDE CSS (browser toolbar color, web manifest), where
 * CSS variables can't be used. Keep these in sync with styles/theme.css.
 */
export const BRAND_COLORS = {
  /** Deep Ocean Blue — --color-ocean-800 */
  primary: "#12284B",
  /** Ice White — --color-ice-50 (light-mode page background) */
  lightBackground: "#f4f8fa",
  /** --color-ocean-950 (dark-mode page background) */
  darkBackground: "#081428",
} as const;
