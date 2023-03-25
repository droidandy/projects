// Common Webpack configuration used by webpack.config.development and webpack.config.production

const path = require('path');
const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
// 'react-hot-loader/patch' does nothing in production env.
const baseEntries = ['babel-polyfill', 'react-hot-loader/patch'];

module.exports = {
  entry: {
    app: baseEntries.concat(['js/entries/app']),
    auth: baseEntries.concat(['js/entries/auth']),
    admin: baseEntries.concat(['js/entries/admin']),
    affiliate: baseEntries.concat(['js/entries/affiliate'])
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
      assets: path.join(__dirname, '../src/assets'),
      immutable: path.join(__dirname, '../node_modules/immutable')
    },
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  plugins: [
    new WebpackChunkHash(),
    // Shared code
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/),
  ],
  module: {
    rules: [
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/js')
        ],
        loaders: ['babel-loader']
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
