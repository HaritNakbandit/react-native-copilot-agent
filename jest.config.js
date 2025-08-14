module.exports = {
  preset: 'react-native',
  setupFiles: ["./jestSetupFile.js"],
  transformIgnorePatterns: [
    "node_modules/(?!(@react-native|react-native|@react-navigation)/)"
  ],
  moduleNameMapper: {
    '@react-navigation/native': '<rootDir>/__mocks__/@react-navigation/native.js'
  }
};
