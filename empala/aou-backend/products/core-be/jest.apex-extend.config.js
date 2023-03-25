module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html', 'cobertura'],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
  ],
  collectCoverageFrom: [
    'src/apex-extend/trade/apex-error-code-converter.ts',
    'src/apex-extend/onboarding/*.ts',
    'src/models/order.ts',
    'src/models/portfolio.ts',
    'src/resolvers/portfolio.ts',
    'src/resolvers/trade.ts',
    'src/resolvers/onboarding.ts',
    'src/results/place-order.ts',
    'src/results/application-status.ts',
    'src/results/create-application.ts',
    'src/utils/apex-token-manager.ts',
    'src/utils/axios-adapter.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  modulePathIgnorePatterns: [],
  testMatch: [
    '**/?(*.)+(test\\.apex-extend)\\.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  globalSetup: '<rootDir>/src/test-utils/setup-tests.withdb.ts',
  testTimeout: 30000,
};
