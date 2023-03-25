// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const baseEntries = ['react-hot-loader/patch', 'babel-polyfill'];

module.exports = {
  entry: {
    app: baseEntries.concat(['js/entries/app']),
    auth: baseEntries.concat(['js/entries/auth']),
    admin: baseEntries.concat(['js/entries/admin'])
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    chunkFilename: 'js/[name].js'
  },
  resolve: {
    modules: ['node_modules'],
    alias: {
      js: path.join(__dirname, '../src/js'),
      components: path.join(__dirname, '../src/js/components'),
      pages: path.join(__dirname, '../src/js/pages'),
      utils: path.join(__dirname, '../src/js/utils'),
      css: path.join(__dirname, '../src/css'),
      images: path.join(__dirname, '../src/assets/images')
    },
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  plugins: [
    // Shared code
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest',
      inlineManifest: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/),
  ],
  module: {
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src/js'),
        loader: 'babel-loader'
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      }
    ]
  }
};
