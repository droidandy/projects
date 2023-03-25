module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: [
    '\\.test\\.ts$'
  ],
  testTimeout: 50000,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
