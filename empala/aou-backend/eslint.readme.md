# Configuring ESLint

We use general ESLint settings for all child projects inside the `aou-backend`

The general ESLint config file is `<aou-backend root>/.eslintrc.js`
ESLint itself and plugins for it are installed in the root of `aou-backend`.

```shell
cd <path to aou-backend>
npm install
```

It is recommended to use Automatic ESLint Configuration in the IDE.

## Extending ESLint config in child project

You can extend ESLint settings in a child project by placing the `.eslintrc.js` file in the root of the child project.

For example, `<aou-backend root>/products/morningstar-datagrabber/.eslintrc.js`:

```js
module.exports = {
  ignorePatterns: ['**/src/types/gql-types.ts', '**/_misc/*.*'], // Disable scanning of specific files  
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    }
  ]
};
```

**Attention!** It is not recommended to change ESLint rules in child projects.
