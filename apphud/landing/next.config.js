const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
// const withFonts = require('next')

module.exports = withImages({
  webpack(config, options) {
    // if (options.dev) {
    //   config.module.rules.push({
    //     sassOptions: {
    //       includePaths: [path.join(__dirname, 'styles')],
    //     },
    //   });
    // }
    return config;
    // return [
    //   ...config,
    //   {
    //     sassOptions: {
    //       includePaths: [path.join(__dirname, 'styles')],
    //     },
    //   },
    // ];
  },
  async redirects() {
    return [
      {
        source: '/contacts',
        destination: '/contact',
        permanent: false,
      },
    ]
  },
});
