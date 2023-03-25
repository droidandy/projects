module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html', 'cobertura'],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
    '!src/test-utils/**'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  modulePathIgnorePatterns: [],
  testMatch: [
    '**/?(*.)+(test)\\.ts'
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
