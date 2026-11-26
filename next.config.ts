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

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: repo ? `/${repo}` : "",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
