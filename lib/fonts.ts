import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * Fonts are self-hosted at build time by next/font (no runtime request to Google).
 * The CSS variables below are mapped to `font-heading` / `font-body` in styles/theme.css.
 * To change a font: swap the import here and keep the same `variable` names.
 *
 * - Cormorant Garamond: elegant high-contrast serif, echoing the MEDURA wordmark.
 * - Jost: clean geometric sans, echoing the logo's "Design & Engineering Consultants" line.
 */
export const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const bodyFont = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});
