const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('./webpack.config.base');
const appConfig = require('./application.production');
const theme = require('./theme');
const fayeConfig = require('../faye/config.js');
const faviconHtml = require('./faviconData.json').favicon.html_code;
const isProductionInstance = process.env.INSTANCE === 'production';

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('production'),
    'RAILS_ENV': JSON.stringify(process.env.RAILS_ENV || 'production'),
    'FAYE': JSON.stringify(fayeConfig),
    'GOOGLE_ANALYTICS_ID': JSON.stringify(isProductionInstance && appConfig.googleAnalyticsId),
    'PAYMENTS_OS_PUBLIC_KEY': JSON.stringify(isProductionInstance ?
      appConfig.paymentsOsProdPublicKey : appConfig.paymentsOsTestPublicKey),
    'PAYMENTS_OS_ENV': JSON.stringify(isProductionInstance ? 'live' : 'test')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

const handler = (percentage, message) => {
  if (process.stdout.isTTY) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${percentage} ${message}`);
  } else {
    // e.g. Output each progress message directly to the console:
    console.info(percentage, message);
  }
};

module.exports = merge(config, {
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../build/assets'),
    publicPath: '/assets/',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  devtool: 'cheap-module-source-map',
  mode: 'production',
  optimization: {
    noEmitOnErrors: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          parallel: 4,
          warnings: false,
          compress: {
            ie8: true,
          },
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(handler),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/assets/images'),
        to: 'images'
      },
      {
        from: path.join(__dirname, '../src/assets/iconfont'),
        to: 'iconfont'
      }
    ]),
    new webpack.DefinePlugin(GLOBALS),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions',
      renderDownloadForm: true,
      renderLivePersonScript: true,
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'app'],
      filename: '../index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions Admin',
      renderDownloadForm: true,
      renderLivePersonScript: true,
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'admin'],
      filename: '../admin/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions',
      renderLivePersonScript: true,
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'auth'],
      filename: '../auth/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Affiliate',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      path: path.join(__dirname, '../build'),
      chunks: ['manifest', 'vendor', 'affiliate'],
      filename: '../affiliate/index.html',
      faviconHtml
    }),
  ],
  module: {
    rules: [
      // SCSS/CSS
      {
        test: /\.s?css$/,
        include: [
          path.resolve(__dirname, '../src/css'),
        ],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          'postcss-loader',
          { loader: 'sass-loader', options: { outputStyle: 'compressed' } }
        ]
      },
      // CSS modules
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src/js/components'),
          path.resolve(__dirname, '../src/js/pages')
        ],
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          { loader: 'less-loader', query: `{"sourceMap":true,"javascriptEnabled": true,"modifyVars":${JSON.stringify(theme)}}` }
        ]
      }
    ]
  },
});
