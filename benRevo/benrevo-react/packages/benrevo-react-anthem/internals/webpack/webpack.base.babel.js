/**
 * COMMON WEBPACK CONFIGURATION
 */
const path = require('path');
const webpack = require('webpack');
const uuidV1 = require('uuid/v1');

const uuid = uuidV1();

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/anthem/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.jsx?$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      include: [
        path.resolve(__dirname, '../../node_modules/semantic-ui-css/themes'),
        path.resolve(__dirname, '../../app/vendor'),
      ],
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif|svg)$/,
      loaders: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            progressive: true,
            optimizationLevel: 7,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
      },
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        AUTH0_CLIENT_ID: JSON.stringify(process.env.AUTH0_CLIENT_ID),
        AUTH0_DOMAIN: JSON.stringify(process.env.AUTH0_DOMAIN),
        AUTH0_DOMAIN_LOGIN: JSON.stringify(process.env.AUTH0_DOMAIN_LOGIN),
        BENREVO_API_PATH: JSON.stringify(process.env.BENREVO_API_PATH),
        MIXPANEL_KEY: JSON.stringify(process.env.MIXPANEL_KEY),
        APP_VERSION: JSON.stringify(uuid),
        ENCRYPT_KEY: JSON.stringify(uuid),
        BENREVO_PATH: JSON.stringify(process.env.BENREVO_PATH),
      },
    }),
    new webpack.NamedModulesPlugin(),

  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
