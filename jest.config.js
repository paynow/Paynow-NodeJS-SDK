/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};