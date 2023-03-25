module.exports = {
  roots: ['<rootDir>/app'],
  moduleDirectories: [
    'node_modules',
    'app',
  ],
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/app/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/*.test.(ts|tsx)'],
};
