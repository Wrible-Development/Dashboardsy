module.exports = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, os: false, net: false, tls: false, crypto: false, stream: false, timers: false, process: false, zlib: false, cardinal: false, buffer: false, events: false, util: false };
    config.experiments = config.experiments || {}
    config.experiments.topLevelAwait = true
    return config;
  },
  images: {
    domains: ['cdn.discordapp.com', 'media.discordapp.net'],
  },
//  productionBrowserSourceMaps: true, // very useful for debugging errors in production
};
