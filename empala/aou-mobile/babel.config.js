module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      'babel-plugin-styled-components',
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '~': './src',
            app: './src/app',
            atoms: './src/components/atoms',
            assets: './src/assets',
            services: './src/services',
          },
        },
      ],
    ],
  };
};
