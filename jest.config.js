/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/specs/*.+(ts|tsx|js)"],
  setupFilesAfterEnv: ['fp-ts-jest-matchers'],
  globals: {
    'ts-jest': {
      tsconfig : 'tsconfig.json',
      useESM: true
    }
  }
};