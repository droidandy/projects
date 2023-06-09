/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
  // watchFolders: [path.resolve(__dirname, '../../'), path.resolve(__dirname, '../')],
  transformer: {
    babelTransformerPath: require.resolve('react-native-typescript-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // resolver: {
  //   extraNodeModules: {
  //     '@invest.wl': path.resolve(__dirname, '../'),
  //   },
  // },
};
