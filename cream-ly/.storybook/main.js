const path = require("path");

module.exports = {
  stories: ["../src/scripts/**/*.stories.(js|tsx|mdx)"],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-knobs",
    "@storybook/addon-storysource",
    "@storybook/addon-viewport/register",
    "@storybook/addon-docs",
  ], // '@storybook/addon-actions/register', , '@storybook/addon-links'
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpack: async (config) => {
    // do mutation to the config

    // Make whatever fine-grained changes you need
    config.module.rules.push(
      {
        test: /gloabal_theme.scss$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              data: '@import "./theme.scss";',
              includePaths: [__dirname, "../src/styles/"],
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      }
    );

    return config;
  },
};
