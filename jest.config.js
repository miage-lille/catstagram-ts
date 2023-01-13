/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/specs/*.spec.ts'],
  setupFilesAfterEnv: ['fp-ts-jest-matchers'],
};
