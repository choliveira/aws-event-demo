module.exports = {
  semi: true,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    },
    {
      files: '*.md',
      options: {
        tabWidth: 1
      }
    }
  ]
};
