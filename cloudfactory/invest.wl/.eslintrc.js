module.exports = {
  root: true,
  extends: ['plugin:@effectivetrade/eslint-plugin-react-native-typescript/default'],
  rules: {
    camelcase: 'off',
    'no-shadow': 'off',
    curly: ['error', 'multi-line', 'consistent'],
    'no-unused-expressions': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'simple-import-sort/imports': 'off',
  },
  ignorePatterns: ['/android/*', '/ios/*', '/node_modules/*', '/node_modules.private/*', '/dist/*'],
};
