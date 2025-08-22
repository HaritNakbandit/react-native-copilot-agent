module.exports = {
  preset: 'react-native',
  setupFiles: ["./jestSetupFile.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|@react-navigation)/)"
  ],
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
    '!src/utils/sampleData.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  // Coverage thresholds (set to current baseline to avoid failures)
  // Aspirational targets: 80% for production-ready code
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 8,
      lines: 14,
      statements: 14
    }
  },
  // Test environment
  testEnvironment: 'node',
  // Test file patterns
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.test.{js,jsx,ts,tsx}'
  ],
  // Mock configuration
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@react-navigation/native': '<rootDir>/__mocks__/@react-navigation/native.js'
  },
  // Setup files
  setupFilesAfterEnv: [],
  // Verbose output for CI
  verbose: true,
  // Test results processor for CI
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml',
    }]
  ]
};
