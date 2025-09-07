// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js','jsx','ts','tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',       // src 配下の TypeScript/TSX ファイルを対象
    '!src/**/*.test.{ts,tsx}', // テストファイルは除外
    '!src/main.tsx',           // エントリポイントなど必要に応じて除外
    '!src/vite-env.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90
    }
  }
};
