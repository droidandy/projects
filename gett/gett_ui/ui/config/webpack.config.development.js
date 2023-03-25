const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./webpack.config.base');
const appConfig = require('./application.development');
const theme = require('./theme');
const fayeConfig = require('../faye/config.js');
const faviconHtml = require('./faviconData.json').favicon.html_code;

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development'),
    'RAILS_ENV': JSON.stringify(process.env.RAILS_ENV || 'development'),
    'RAILS_HOST': JSON.stringify('http://localhost:3000'),
    'FAYE': JSON.stringify(fayeConfig),
    'GOOGLE_ANALYTICS_ID': JSON.stringify(appConfig.googleAnalyticsId),
    'PAYMENTS_OS_PUBLIC_KEY': JSON.stringify(appConfig.paymentsOsPublicKey),
    'PAYMENTS_OS_ENV': JSON.stringify('test')
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
};

module.exports = merge(config, {
  cache: true,
  devtool: 'eval-source-map',
  mode: 'development',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions',
      renderDownloadForm: true,
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'app'],
      filename: 'index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions Admin',
      renderDownloadForm: true,
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'admin'],
      filename: 'admin/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Business Solutions',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'auth'],
      filename: 'auth/index.html',
      faviconHtml
    }),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!src/index.template.ejs',
      title: 'Gett Affiliate',
      googlePlacesSrc: appConfig.googlePlacesSrc,
      chunks: ['manifest', 'vendor', 'affiliate'],
      filename: 'affiliate/index.html',
      faviconHtml
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        include: path.resolve(__dirname, '../src/js'),
        use: ['eslint-loader']
      },
      // SCSS/CSS
      {
        test: /\.s?css$/,
        include: [
          path.resolve(__dirname, '../src/css'),
        ],
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
          `less-loader?{"sourceMap":true, "javascriptEnabled": true, "modifyVars":${JSON.stringify(theme)}}`
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
        { from: /^\/affiliate\/.+$/, to: '/affiliate' },
        { from: /^\/(?!auth|admin|affiliate).+$/, to: '/' }
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
