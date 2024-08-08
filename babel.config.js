module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'auto',
      },
    ],
  ],
  plugins: [
    // '@babel/plugin-transform-modules-amd',
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-proposal-class-properties',
  ],
};
