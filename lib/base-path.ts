/** Staging on GitHub Pages: https://ludeesha-cse.github.io/medura/ */
export const BASE_PATH = "/medura";

/** Prefixes a root-relative asset path ("/images/x.svg") with BASE_PATH. */
export const withBasePath = (path: string): string => `${BASE_PATH}${path}`;
