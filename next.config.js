const { version } = require("./package.json");

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["raw.communitydragon.org"],
  },
  publicRuntimeConfig: { version },
  async redirects() {
    return [{ source: "/champions", destination: "/", permanent: false }];
  },
};
