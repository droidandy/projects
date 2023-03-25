const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const appConfig = require('./application.development');
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const theme = require('./theme');
const fayeConfig = require('../faye/config.js');
const faviconHtml = require('./faviconData.json').favicon.html_code;

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development'),
    'FAYE': JSON.stringify(fayeConfig)
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
};

module.exports = merge(config, {
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'app'],
      filename: 'index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets Admin',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'admin'],
      filename: 'admin/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.template.ejs'),
      title: 'One Transport Fleets',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'auth'],
      filename: 'auth/index.html',
      faviconHtml
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: 'eslint-loader',
        include: path.resolve(__dirname, '../src/js')
      },
      // CSS
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src/css'),
        use: [
          'css-hot-loader',
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
          { loader: 'sass-loader', options: { outputStyle: 'expanded' } }
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
          'css-hot-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader',
          { loader: 'sass-loader', options: { outputStyle: 'expanded' } }
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(theme)}}`
        ]
      }
    ]
  },
  devServer: {
    contentBase: './src',
    historyApiFallback: {
      rewrites: [
        { from: /^\/auth\/.+$/, to: '/auth' },
        { from: /^\/admin\/.+$/, to: '/admin' },
        { from: /^\/(?!auth|admin).+$/, to: '/' }
      ]
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        pathRewrite: { '^/api' : '' }
      }
    },
    port: 3030,
    compress: false,
    inline: true,
    hot: true,
    host: '0.0.0.0',
    stats: true
  }
});
