module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'airbnb-flow', 'plugin:flowtype/recommended'],
  plugins: ['react', 'jsx-a11y', 'import', 'flowtype'],
  env: {
    browser: true,
    node: true,
  },
  // prettier-ignore
  rules: {
    // ignore camel case for graphql backend
    'camelcase': 0,
    // for tooling purposes
    'no-underscore-dangle': 0,
    'react/jsx-filename-extension': 0,

    // proptypes are handled with flow
    'react/prop-types': 0,
    'linebreak-style': 0,
    'react/react-in-jsx-scope': 0,
    // because there is an error with SomeComponent/index.js pattern
    'import/no-named-as-default': 0,
    'no-tabs': 0,
    'no-shadow': 0,
    'max-len': 0,
    'jsx-a11y/html-has-lang': 0,
    'no-mixed-operators': 0,
    'arrow-parens': 0,
    'react/jsx-indent': 0,
    'no-param-reassign': 0,
    'no-confusing-arrow': 0,
    'react/jsx-indent-props': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/no-unescaped-entities': 0,
    indent: 0,
    'no-var': 0,
    'vars-on-top': 0,
    'block-scoped-var': 0,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
    'import/resolver': {
      'babel-module': {},
    },
  },
};
