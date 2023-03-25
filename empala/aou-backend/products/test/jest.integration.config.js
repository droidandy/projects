module.exports = {
  testEnvironment: 'node',

  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '**/integration/core-be/?(*.)+(test).ts'
  ],
  modulePathIgnorePatterns: [],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
