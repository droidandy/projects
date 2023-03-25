module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  root: true,
  ignorePatterns: [
    '**/*.graphql',
    '**/*.json',
    '**/dist/**/*.*',
    '**/coverage/**/*.*',
    '**/__tests__/**/*.*',
    '**/src/types/gql-types.ts'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: ['./products/utils/tsconfig.json'],
  },
  plugins: ['prefer-arrow', 'import', '@typescript-eslint'],
  overrides: [
    {
      files: ['./**/*.ts', './*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['./products/core-be/**/*.ts'],
      parserOptions: {
        project: ['./products/core-be/tsconfig.json'],
      },
    },
    {
      files: ['./products/utils/**/*.ts'],
      parserOptions: {
        project: ['./products/utils/tsconfig.json'],
      },
    },
    {
      files: ['./products/test/**/*.ts'],
      parserOptions: {
        project: ['./products/test/tsconfig.json'],
      },
    },
    {
      files: ['./products/morningstar-datagrabber/**/*.ts', './products/morningstar-datagrabber/*.ts'],
      parserOptions: {
        project: ['./products/morningstar-datagrabber/tsconfig.json'],
      },
    },
    {
      files: ['./products/apex-ext-datagrabber/**/*.ts', './products/apex-ext-datagrabber/*.ts'],
      parserOptions: {
        project: ['./products/apex-ext-datagrabber/tsconfig.json'],
      },
    },
    {
      files: ['./products/ae-logos-datagrabber/**/*.ts', './products/ae-logos-datagrabber/*.ts'],
      parserOptions: {
        project: ['./products/ae-logos-datagrabber/tsconfig.json'],
      },
    },
  ],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    // from here
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/require-await': 'off',
    'no-plusplus': 'off',
    'import/no-relative-packages': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-classes-per-file': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'import/no-cycle': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    // ...till here - to remove
    'import/order': 'error',
    'max-len': ['error', { ignoreUrls: true, code: 160 }],
    'quotes': ['error', 'single']
  }
};
