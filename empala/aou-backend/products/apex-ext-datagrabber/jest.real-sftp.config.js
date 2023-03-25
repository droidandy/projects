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
    'real-sftp\/(.+)\\.test\\.ts$'
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  globalSetup: '<rootDir>/src/__tests__/real-sftp/global-setup.ts',
  testTimeout: 180_000
};
