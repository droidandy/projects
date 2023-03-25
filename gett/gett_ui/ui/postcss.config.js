module.exports = {
  plugins: [
    // TODO: check those plugins as a replacement for sass-loader
    // require('postcss-smart-import')({}),
    // require('precss')({}),
    require('postcss-custom-media'),
    require('autoprefixer')({
      browsers: ['last 2 versions']
    })
  ]
};
