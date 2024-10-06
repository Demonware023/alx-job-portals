module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser', // Use Babel parser for modern syntax
  parserOptions: {
    ecmaVersion: 2021, // Use the latest ECMAScript features
    sourceType: 'module', // Allow the use of imports
    ecmaFeatures: {
      jsx: true, // Enable JSX
    },
  },
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Optional if you're using TypeScript or want to skip prop validation
    'max-len': ['error', { code: 80 }], // Limit line length
  },
};
