// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['transform-inline-environment-variables', { exclude: 'NODE_ENV' }],
    'transform-inline-function-name',
    [
      'module-resolver',
      {
        // root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          // алиасы для модулей
          '_boot': './src/boot',
          '_common': './src/common',
          '_system': './src/system',
          '_domain': './src/domain',
          '_view': './src/view',
          '@invest.wl': './..',
        },
      },
    ],
  ],
};
