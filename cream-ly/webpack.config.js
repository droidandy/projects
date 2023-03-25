/* eslint-disable */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const { RetryChunkLoadPlugin } = require("webpack-retry-chunk-load-plugin");
const SentryPlugin = require("webpack-sentry-plugin");

const environment = "production";
//  process.env.NODE_ENV === "production" ? "production" : "development";

//SHOPIFY_THEME_ASSETS_URL is defined in github deploy action
const assetsPublicPath = process.env.SHOPIFY_THEME_ASSETS_URL
  ? process.env.SHOPIFY_THEME_ASSETS_URL
  : "/";

const path = require("path");

const getPluginsList = (environment) => {
  const list = [
    new RetryChunkLoadPlugin({
      // optional stringified function to get the cache busting query string appended to the script src
      // if not set will default to appending the string `?cache-bust=true`
      /* cacheBust: `function() {
        return Date.now();
      }`, */
      // optional value to set the maximum number of retries to load the chunk. Default is 1
      maxRetries: 3,
      // optional list of chunks to which retry script should be injected
      // if not set will add retry script to all chunks that have webpack script loading
      //chunks: ['chunkName'],
      // optional code to be executed in the browser context if after all retries chunk is not loaded.
      // if not set - nothing will happen and error will be returned to the chunk loader.
      //nplastResortScript: "window.location.href='/500.html';"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      //replace default insert as inste js we insert styles via build-dist-changeJsEntry
      insert: function(linkTag) {
        console.log("attempt to insert css from MiniCssExtractPlugin", linkTag);
      },
    }),
    new HtmlWebpackPlugin({
      filename: "../snippets/_js_entry.liquid",
      templateContent: "",
    }),
  ];

  if (
    environment == "production" &&
    process.env.GIT_SHA &&
    process.env.SENTRY_ORGANIZATION
  ) {
    plugins.push(
      new SentryPlugin({
        // Sentry options are required
        organization: process.env.SENTRY_ORGANIZATION,
        project: process.env.SENTRY_PROJECT,
        apiKey: process.env.SENTRY_API_KEY,
        suppressErrors: true,
        // Release version name/hash is required
        release: process.env.GIT_SHA,
        releaseBody: function(version, projects) {
          return {
            version,
            projects,
            refs: [
              {
                repository: "cream-ly/shopify_theme",
                commit: process.env.GIT_SHA,
              },
            ],
          };
        },
      })
    );
  }

  return list;
};
module.exports = {
  mode: environment,
  target: "web",

  optimization: {
    minimize: true,
    minimizer: [
      // Minify js files:
      // (TerserJS is webpack default minifier but we have to specify it explicitly
      // as soon as we include more minifiers)
      new TerserJSPlugin({}),
      // Minify css files:
      new OptimizeCSSAssetsPlugin(),
    ],
    //runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "_",
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.scss$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  entry: {
    entry: path.resolve(__dirname, "./src/scripts/layout/theme.js"),
  },
  output: {
    filename: (pathData) => {
      return "[name].[contenthash].js";
      /* return pathData.chunk.name === "vendors_entry"
        ? "[name].js"
        : "[name].[contenthash].js"; */
    },
    chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist/assets/"),
    publicPath: assetsPublicPath,
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.scss$/,

        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          /* {
            loader: "sass-resources-loader",
            options: {
              resources: [
                path.resolve(__dirname, "../styles/tools/mixins.scss"),
              ],
            },
          },  */
        ],
        //include: path.resolve(__dirname, "."),
      },
    ],
  },
  resolve: {
    alias: {
      "@Core": path.resolve("./src/scripts/core/"),
      "@Components": path.resolve("./src/scripts/react-components/"),
    },

    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: getPluginsList(),
};
