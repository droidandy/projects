/* eslint import/no-commonjs: 0, strict: 0, no-param-reassign: 0, global-require: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const argv = require('yargs').argv;

const createStyledComponentsTransformer = require('typescript-plugin-styled-components')
  .default;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const styledComponentsTransformer = createStyledComponentsTransformer({
  getDisplayName: (filename, bindingName) => {
    const name = path.basename(filename).split('.')[0];
    return `${name}_${bindingName || ''}`;
  },
});
const __DEV__ = process.env.NODE_ENV === 'development';
const __PROD__ = process.env.NODE_ENV === 'production';

const fixStyleLoader = loader => {
  return {
    ...loader,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: __DEV__,
        },
      },
      ...loader.use,
    ],
  };
};

const getEnvPlugins = () => {
  if (__DEV__) {
    return [new webpack.HotModuleReplacementPlugin()];
  }
  return [];
};

const compact = array => array.filter(x => x);

const getAppStaticDir = dirname => {
  const staticPath = path.join(dirname, 'src/static');
  if (fs.existsSync(staticPath)) {
    return { from: staticPath };
  }
  return null;
};

module.exports = function makeWebpack(options) {
  const {
    dirname,
    entry,
    devtool = 'inline-eval-cheap-source-map',
    title,
  } = options;
  return {
    name: 'client',
    target: 'web',
    mode: __DEV__ ? 'development' : 'production',
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      // minimize: false,
      splitChunks: __DEV__
        ? undefined
        : {
            cacheGroups: {
              commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
          },
    },
    devtool: __DEV__ ? devtool : false,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', 'json5'],
      alias: {
        src: path.join(dirname, './src'),
        'react-spring$': 'react-spring/web.cjs',
        'react-spring/renderprops$': 'react-spring/renderprops.cjs',
      },
    },
    entry: {
      app: compact([
        'babel-polyfill',
        __DEV__ && 'webpack-hot-middleware/client',
        ...entry,
      ]),
    },
    output: {
      filename: '[name].[hash].js',
      path: path.join(dirname, './dist'),
      publicPath: '/',
      // chunkFilename: '[id].chunk.[hash].js',
    },
    plugins: compact([
      new CleanWebpackPlugin(['dist'], {
        root: dirname,
        verbose: false,
      }),
      new webpack.DefinePlugin({
        __COVERAGE__: !argv.watch && process.env.NODE_ENV === 'test',
        __DEV__: JSON.stringify(__DEV__),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          GOOGLE_MAPS_API_KEY: JSON.stringify(
            process.env.GOOGLE_MAPS_API_KEY || ''
          ),
          API_BASE_URL: JSON.stringify(
            process.env.API_BASE_URL ||
              'http://kpi-web-api-dev.azurewebsites.net/'
          ),
          API_NODE_BASE_URL: JSON.stringify(
            process.env.API_NODE_BASE_URL ||
              'http://localhost:3500'
          ),
        },
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.ejs'),
        hash: false,
        filename: 'index.html',
        inject: false,
        minify: {
          collapseWhitespace: false,
        },
        title,
      }),
      new CopyWebpackPlugin(compact([getAppStaticDir(dirname)])),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      ...getEnvPlugins(),
    ]),
    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                getCustomTransformers: () => ({
                  before: [styledComponentsTransformer],
                }),
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.json5$/,
          use: 'json5-loader',
        },
        fixStyleLoader({
          test: /\.css$/,
          use: ['css-loader'],
        }),
        {
          test: /\.woff(\?.*)?$/,
          use:
            'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.woff2(\?.*)?$/,
          use:
            'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2',
        },
        {
          test: /\.otf(\?.*)?$/,
          use:
            'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
        },
        {
          test: /\.ttf(\?.*)?$/,
          use:
            'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream',
        },
        {
          test: /\.eot(\?.*)?$/,
          use: 'file-loader?prefix=fonts/&name=[path][name].[ext]',
        },
        {
          test: /\.svg(\?.*)?$/,
          use:
            'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml',
        },
        { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=8192' },
      ],
    },
  };
};
