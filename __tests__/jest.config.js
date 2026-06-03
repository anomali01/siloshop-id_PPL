/**
 * jest.config.js
 * Konfigurasi Jest untuk Unit Testing dan Integration Testing
 * Letakkan file ini di ROOT folder project (siloshop-id/)
 */

const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Arahkan ke folder root Next.js project
  dir: "./",
});

const customJestConfig = {
  // Setup environment
  testEnvironment: "node",

  // Pola file test yang akan dijalankan
  testMatch: [
    "**/__tests__/unit/**/*.test.js",
    "**/__tests__/integration/**/*.test.js",
  ],

  // Abaikan folder ini
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "**/__tests__/system/", // system test pakai Playwright, bukan Jest
  ],

  // Module path aliases (sesuaikan dengan next.config.js / jsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Tampilkan coverage jika dijalankan dengan --coverage
  collectCoverageFrom: [
    "app/api/**/*.js",
    "lib/features/**/*.js",
    "middlewares/**/*.js",
    "inngest/**/*.js",
    "!**/*.config.js",
    "!**/node_modules/**",
  ],

  // Verbose output supaya mudah dibaca
  verbose: true,
};

module.exports = createJestConfig(customJestConfig);
