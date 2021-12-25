const { version } = require("./package.json");

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
module.exports = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  images: {
    domains: ["raw.communitydragon.org"],
  },
  publicRuntimeConfig: { version },
  async redirects() {
    return [{ source: "/champions", destination: "/", permanent: false }];
  },
});
