const { version } = require("./package.json");
const pwaCacheConfig = require("./pwa.cache");
const withPWA = require("next-pwa");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
module.exports = withPWA({
  pwa: {
    dest: "public",
    fallbacks: { document: "/offline.html" },
    runtimeCaching: pwaCacheConfig,
    disable: process.env.NODE_ENV === "development",
  },
  ...withMDX({
    pageExtensions: ["js", "jsx", "md", "mdx"],
    reactStrictMode: true,
    images: {
      domains: ["raw.communitydragon.org"],
    },
    publicRuntimeConfig: { version },
    async redirects() {
      return [{ source: "/champions", destination: "/", permanent: false }];
    },
  }),
});
