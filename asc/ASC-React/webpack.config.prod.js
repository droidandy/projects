var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  context: __dirname,
  entry: [
    './index.js'
  ],
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'bundle.js'
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
      { test: /\.js$|\.jsx$/,
        // exclude: [/node_modules/],
        exclude: s => /(node_modules|bower_components)/.test(s) && !/react-polymer/.test(s),
        loaders: [
          'babel?' + JSON.stringify({presets: ['es2015', 'es2017', 'stage-2', 'stage-3', 'react'], plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties']})
        ]
      }
    ]
  },

  postcss: function() {
    return [autoprefixer];
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.EnvironmentPlugin([
      'GOOGLEMAPS_SECRET',
      'API_HOST'
    ])
  ]
};

