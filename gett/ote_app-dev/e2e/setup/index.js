require('@babel/register')({
  cache: false,
  presets: [
    [require.resolve('@babel/preset-env'), { targets: { node: 'current' }, useBuiltIns: 'entry' }]
  ],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.js', '.ios.js', '.android.js'],
        root: ['./'],
        alias: {
          testIDs: './e2e/testIDs'
        }
      }
    ]
  ]
});
require('@babel/polyfill');
