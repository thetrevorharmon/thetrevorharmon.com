module.exports = {
  presets: [
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['>0.5%', 'not ie 11', 'not op_mini all', 'not samsung 4'],
        },
      },
    ],
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
  plugins: [
    [
      'prismjs',
      {
        languages: ['javascript', 'css', 'markup', 'g4'],
        plugins: ['line-numbers'],
        theme: 'okaidia',
      },
    ],
    [
      '@babel/plugin-proposal-private-property-in-object',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-private-methods',
      {
        loose: true,
      },
    ],
  ],
};
