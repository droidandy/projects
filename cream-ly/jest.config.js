const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  verbose: true,
  bail: true,
  preset: "ts-jest/presets/js-with-babel",
  transform: {
    // "^.+\\.js$": "babel-jest",
    "^.+\\.(j|t)s$": "ts-jest",
  },
  rootDir: compilerOptions.baseUrl,
  testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
  testURL: "http://localhost/",
  moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/src/scripts/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/src/scripts/__mocks__/fileMock.js",
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    //"^@Components/(.*)$": ["<rootDir>/src/scripts/react-components/$1"],
  },
  resetMocks: false,
  setupFilesAfterEnv: [
    "jest-enzyme",
    "jest-localstorage-mock",
    "./jest.setup.fetch",
  ],
  testEnvironment: "enzyme",
  testEnvironmentOptions: {
    enzymeAdapter: "react16",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleDirectories: ["node_modules"],

  /* moduleNameMapper: {
    "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/src/",
    }),
  }, */
};
