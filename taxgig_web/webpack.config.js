

/*
 * Modules
 **/
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const Visualizer = require('webpack-visualizer-plugin');

/*
 * Configuration
 **/

module.exports = {
  //  Define entry point. Can be used with multiple entry points.
  entry: {
    app: [
      "./js/app.js"
    ]
  },

  // optimization of assets (only in production)
  optimization: {
    // minimizer: [new UglifyJsPlugin()]
  },

  // Output for JS files (if not set -> outputs into assets/dist)
  output: {
    path: path.resolve(__dirname, `./_build`),
    filename: 'js/[name].js',
    publicPath: '/' // Nessesary for tabs routes in frontend
  },

  devServer: {
    historyApiFallback: true,
    disableHostCheck: true
  },


  // Instructs webpack how to load files
  module: {
    rules: [
      // load js/jsx assets
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // load css assets
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      // load sass assets
      // {
      //   test: /\.scss$/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     'sass-loader'
      //   ]
      // },

      //load img assets
      {
        test: /\.(png|jpe?g|svg)$/i,
        exclude: /node_modules/,
        loaders: [
          'file-loader?name=images/[name].[ext]'
        ]
      },

       //load fonts assets
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },

      // swiper specific
      {
        exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.js(x)?$/],
        test: /\.js(x)?$/,
        use: [{ loader: 'babel-loader' }],
      }

    ]
  },

  plugins: [
    // Copies images folder into priv/static
    // new CopyWebpackPlugin([{
    //   from: "./static",
    //   to: path.resolve(__dirname, "../priv/static")
    // }]),

    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   deleteOriginalAssets: false,
    //   test: /\.js$|\.css$/,
    //   // compress if size is bigger than 10240 bytes
    //   threshold: 10240,
    //   // compress if size is compressed better than 0.8 ratio
    //   minRatio: 0.8
    // }),
    // creates visualization of files in root
    new Visualizer({
      filename: './stats.html'
    }),
  ]
}
