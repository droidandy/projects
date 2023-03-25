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
  testRegex: [
    'mock-sftp\/(.+)\\.test\\.ts$'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
    '!src/types/**',
    '!src/util/**',
    '!src/lib/db.ts',
    '!src/lib/stat.ts',
    '!src/lib/token.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  globalSetup: '<rootDir>/src/__tests__/mock-sftp/global-setup.ts',
  testTimeout: 180_000
};
