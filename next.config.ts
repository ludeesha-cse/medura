// import type { NextConfig } from "next";

// /**
//  * Fully static site: `npm run build` writes plain HTML/CSS/JS to `out/`,
//  * which is uploaded as-is to Cloudflare Pages. No server, no API routes.
//  */
// const nextConfig: NextConfig = {
//   output: "export",
//   // Each route becomes a folder with index.html (e.g. /projects/index.html).
//   trailingSlash: true,
//   images: {
//     // The Next.js image optimizer needs a server, so serve images as-is.
//     unoptimized: true,
//   },
//   reactCompiler: true,
//   turbopack: {
//     // Pin the project root (ignores stray lockfiles in parent folders).
//     root: __dirname,
//     rules: {
//       "*.css": {
//         loaders: ["@tailwindcss/turbopack"],
//         as: "*.css",
//       },
//     },
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

/**
 * Fully static site: `npm run build` writes plain HTML/CSS/JS to `out/`.
 *
 * On GitHub Pages the site lives under /<repo>/ (e.g. /medura/), so basePath
 * is set from GITHUB_REPOSITORY when building in GitHub Actions. Locally (and
 * on a custom domain) it stays empty.
 */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = repo ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  // Each route becomes a folder with index.html (e.g. /projects/index.html).
  trailingSlash: true,
  basePath,
  // basePath is NOT applied to plain strings like "/images/x.svg", so expose it
  // to the app and prefix asset paths ourselves (see lib/content.ts).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    // The Next.js image optimizer needs a server, so serve images as-is.
    unoptimized: true,
  },
  reactCompiler: true,
  turbopack: {
    // Pin the project root (ignores stray lockfiles in parent folders).
    root: __dirname,
    rules: {
      // Compiles Tailwind. Without this, the CSS ships with raw @apply/@import.
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
