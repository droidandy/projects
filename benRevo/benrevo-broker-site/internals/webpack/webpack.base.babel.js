/**
 * COMMON WEBPACK CONFIGURATION
 */
const path = require('path');
const webpack = require('webpack');
const uuidV1 = require('uuid/v1');

const uuid = uuidV1();

module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    rules: [{
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
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            mozjpeg: {
              progressive: true,
              optimizationLevel: 7,
            },
            gifsicle: {
              interlaced: true,
            },
            optipng: {
              optimizationLevel: 7,
              interlaced: false,
            }
          },
        },
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
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
    /*alias: {
      '@benrevo/benrevo-react-quote': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-quote'),
      '@benrevo/benrevo-react-core': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-core'),
      '@benrevo/benrevo-react-clients': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-clients'),
      '@benrevo/benrevo-react-timeline': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-timeline'),
      '@benrevo/benrevo-react-rfp': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-rfp'),
      '@benrevo/benrevo-react-onboarding': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-onboarding'),
      '@benrevo/benrevo-react-match': path.resolve(__dirname, '../../packages/@benrevo/benrevo-react-match'),
    },*/
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  node: {
    fs: 'empty',
  },
});
