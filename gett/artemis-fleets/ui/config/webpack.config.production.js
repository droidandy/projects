const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.base');
const appConfig = require('./application.production');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const theme = require('./theme');
const fayeConfig = require('../faye/config.js');
const faviconHtml = require('./faviconData.json').favicon.html_code;

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'FAYE': JSON.stringify(fayeConfig)
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

module.exports = merge(config, {
  output: {
    filename: 'js/[name].[chunkhash].js',
    path: path.resolve(__dirname, '../build/assets'),
    publicPath: '/assets/',
    chunkFilename: 'js/[name].[chunkhash].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/assets/images'),
        to: 'images'
      }
    ]),
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        'screw_ie8': true
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[chunkhash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'app'],
      filename: '../index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets Admin',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'admin'],
      filename: '../admin/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'auth'],
      filename: '../auth/index.html',
      faviconHtml
    })
  ],
  module: {
    noParse: /\.min\.js$/,
    rules: [
      // CSS
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src/css'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            'postcss-loader',
            { loader: 'sass-loader', options: { outputStyle: 'compressed' } }
          ]
        })
      },
      // CSS modules
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src/js/components'),
          path.resolve(__dirname, '../src/js/pages')
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            },
            'postcss-loader',
            { loader: 'sass-loader', options: { outputStyle: 'compressed' } }
          ]
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'less-loader', query: `{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}` }
          ]
        })
      }
    ]
  },
});
