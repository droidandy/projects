const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve("react-docgen-typescript-loader"),
      },
    ],
  });
  config.resolve.extensions.push(".ts", ".tsx");

  const TSconfigOptions = {
    logLevel: "info",
    extensions: [".ts", ".tsx", ".js"],
    configFile: path.resolve(__dirname, "../tsconfig.json"),
  };
  config.resolve.plugins = config.resolve.plugins || [];
  config.resolve.plugins.push(new TsconfigPathsPlugin(TSconfigOptions));
  return config;
};
