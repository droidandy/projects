const path = require('path');
const { BFF_URL, CATALOG_URL, CURRENT_ENV, ENVS } = require('./env.config');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTM = require('next-transpile-modules')(['@marketplace/ui-kit', '@marketplace/ui-modules'], { resolveSymlinks: false });

module.exports = withPlugins([withBundleAnalyzer, withTM], {
  trailingSlash: true,
  compress: true,
  webpack5: true,
  env: {
    BFF_URL,
    CATALOG_URL,
    CURRENT_ENV,
  },
  productionBrowserSourceMaps: process.env.ANALYZE === 'true',
  webpack(config) {
    config.module.rules.push(
      // https://github.com/Adorkable-forkable/create-react-app-typescript/commit/4324ef1c6de945c69f7588494fea6df198be19e7
      // Allows you to use two kinds of imports for SVG:
      // import logoUrl from './logo.svg'; gives you the URL.
      // import { ReactComponent as Logo } from './logo.svg'; gives you a component.
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              // @remove-on-eject-begin
              babelrc: false,
              presets: [require.resolve('babel-preset-react-app')],
              // @remove-on-eject-end
              cacheDirectory: true,
            },
          },
          {
            loader: '@svgr/webpack',
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    );

    if (CURRENT_ENV === ENVS.DEVELOPMENT) {
      config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');
      config.resolve.alias['react-dom'] = path.resolve(__dirname, '.', 'node_modules', 'react-dom');
      config.resolve.alias['@material-ui/core'] = path.resolve(__dirname, '.', 'node_modules', '@material-ui/core');
      config.resolve.alias['modules'] = path.resolve(__dirname, '.', 'node_modules', '@marketplace/ui-modules', 'src', 'modules');
      config.resolve.alias['themeNew'] = path.resolve(__dirname, '.', 'node_modules', '@marketplace/ui-modules', 'src', 'themeNew');
    }

    return config;
  },
  future: { webpack5: true },
});

