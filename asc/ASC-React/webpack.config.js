var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval-source-map',
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:9000',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'www'),
    // filename: 'bundle.js',
    publicPath: '/'
    // filename: '[name].js'
  },

  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: false,
    port: 9000,
    hot: true
  },

  module: {
    loaders: [
      {
        test: /\.jpeg$|\.jpg$|\.gif$|\.png$|\.wav$|\.mp3$/,
        loader: 'file'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.styl$/,
        loader: 'style!css!postcss!stylus?paths=node_modules'
      },
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel',
        query: {
          'presets': ['es2015', 'es2017', 'stage-2', 'stage-3', 'react'],
          'plugins': ['react-hot-loader/babel', 'transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']
        },
        // exclude: path.join(__dirname, 'node_modules')
        exclude: s => /(node_modules|bower_components)/.test(s) && !/react-polymer/.test(s)
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'www/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
