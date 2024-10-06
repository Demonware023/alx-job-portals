module.exports = {
  presets: [
    '@babel/preset-env',  // Transpile ES6+ down to ES5
    '@babel/preset-react' // Transpile JSX and React
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties', // Support for class properties
    '@babel/plugin-transform-runtime' // Optimize code for reusability
  ]
};
