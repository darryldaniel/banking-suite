/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ["__tests__"],
    transform: {
        "^.+\\.(t|j)sx?$": "@swc/jest",
    },
    globalSetup: "./test-helpers/setup.ts"
};
