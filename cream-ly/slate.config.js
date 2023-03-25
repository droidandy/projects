/* eslint-disable */

// Configuration file for all things Slate.
// For more information, visit https://github.com/Shopify/slate/wiki/Slate-Configuration

//const webpackConfig = require("./webpack.config");
/* 
module.exports = {
  cssVarLoaderEnable: false,
  "webpack.extend": {
    //optimization: webpackConfig.optimization,
    mode: webpackConfig.mode,
    module: webpackConfig.module,
    resolve: webpackConfig.resolve,
    output: {
      globalObject: "window",
    },
  },
}; */

/* eslint-disable */

const path = require("path");

const environment =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  "cssVarLoader.enable": false,
  //"cssVarLoader.liquidPath": ["src/snippets/css-variables.liquid"],
  "webpack.extend": {
    mode: environment,
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: "_",
      },
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          use: ["babel-loader"],
          exclude: /node_modules/,
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
    output: {
      globalObject: "window",
    },
    plugins: [],
  },
};
