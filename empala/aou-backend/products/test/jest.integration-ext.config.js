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
    '**/integration/apex-extend/?(*.)+(test).ts'
  ],
  modulePathIgnorePatterns: [],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
