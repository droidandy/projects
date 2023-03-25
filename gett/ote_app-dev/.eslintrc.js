const pkg = require('./package.json')

const reactVersion = () => {
  if (pkg.dependencies && pkg.dependencies.react) {
    return { version: pkg.dependencies.react.replace(/[^0-9.]/g, '') }
  }
  if (pkg.devDependencies && pkg.devDependencies.react) {
    return { version: pkg.devDependencies.react.replace(/[^0-9.]/g, '') }
  }
}

module.exports = {
  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base'
  ],

  env: {
    browser: true,
    es6: true
  },

  plugins: ['react', 'react-native', 'babel'],

  rules: {
    'arrow-body-style': [1, 'as-needed'],
    'class-methods-use-this': [2, { exceptMethods: ['render', 'componentDidMount'] }],
    'comma-dangle': [2, 'never'],
    'jsx-quotes': [2, 'prefer-double'],
    'lines-between-class-members': [1, 'always'],
    'max-len': [1, { code: 120, ignorePattern: 'd=\"[^\"]*\"' }],
    'no-shadow': 0,
    'no-bitwise': 0,
    'object-curly-newline': 0,
    'prefer-destructuring': 0,
    'react/display-name': 0,
    'react/sort-prop-types': [1, {
      ignoreCase: true,
      sortShapeProp: true,
    }],
    //temp
    'react/jsx-no-bind': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,

    'operator-linebreak': ['error', 'after', { overrides: { "?": "before", ":": "before" } }]
  },

  settings: {
    react: {
      ...reactVersion()
    }
  }
};
