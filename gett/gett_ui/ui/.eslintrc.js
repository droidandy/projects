module.exports = {
  "parser": "babel-eslint",

  "extends": ["eslint:recommended", "plugin:react/recommended"],

  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "impliedStrict": true,
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },

  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true
  },

  "plugins": [
    "react"
  ],

  "globals": {
    "define": true,
    "__DEV__": true
  },

  "rules": {
    "strict": ["error", "global"],
    "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "caughtErrors": "none" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "warn",
    "camelcase": ["warn", { "properties": "always" }],
    "consistent-return": "off",
    "arrow-spacing": "warn",
    "arrow-parens": ["warn", "as-needed", { "requireForBlockBody": true }],
    "arrow-body-style": "off",
    "semi": ["warn", "always"],
    "no-confusing-arrow": "off",
    "no-constant-condition": "warn",
    "no-labels": "warn",
    "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 1 }],
    "func-style": "off",
    "quotes": ["warn", "single", "avoid-escape"],
    "jsx-quotes": ["warn", "prefer-double"],
    "keyword-spacing": "error",

    // ESLint-plugin-React
    // https://github.com/yannickcr/eslint-plugin-react

    "react/forbid-prop-types": ["warn", { "forbid": ["any"] }],
    "react/jsx-boolean-value": "warn",
    "react/jsx-closing-bracket-location": "off",
    "react/jsx-curly-spacing": ["warn", "always"],
    "react/jsx-first-prop-new-line": ["warn", "multiline"],
    "react/jsx-indent-props": "off",
    "react/jsx-key": "warn",
    "react/jsx-max-props-per-line": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-no-literals": "off",
    "react/jsx-pascal-case": "warn",
    "react/jsx-sort-prop-types": "off",
    "react/jsx-sort-props": "off",
    "react/jsx-tag-spacing": ["warn", { "beforeSelfClosing": "always" }],
    "react/jsx-wrap-multilines": "warn",
    "react/no-multi-comp": "warn",
    "react/no-set-state": "off",
    "react/no-unescaped-entities": "off",
    "react/prefer-es6-class": "warn",
    "react/prop-types": "warn",
    "react/self-closing-comp": "warn",
    "react/sort-comp": ["warn", {
      order: [
        'lifecycle',
        'everything-else',
        'rendering',
      ],
      groups: {
        lifecycle: [
          'displayName',
          'contextTypes',
          'propTypes',
          'defaultProps',
          'childContextTypes',
          'statics',
          'constructor',
          'getDefaultProps',
          'state',
          'getInitialState',
          'getChildContext',
          'getDerivedStateFromProps',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'getSnapshotBeforeUpdate',
          'componentDidUpdate',
          'componentDidCatch',
          'componentWillUnmount'
        ],
        rendering: [
          '/^render.+$/',
          'render'
        ]
      }
    }],
    "react/sort-prop-types": "off"
  }
};
