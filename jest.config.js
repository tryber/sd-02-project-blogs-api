module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/jest.config.js/**',
    '!**/coverage/**',
    '!**/app/index.js**',
    '!**/env/index.js**',
    '!**/resource/database/**',
    '!**/resource/index.js**',
    '!**/resource/repositories/index.js**',
  ],
};
