module.exports = {
  // Tells eslint this is a top-level configuration, and to ignore any others it finds above this config.
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': 'error',
    'max-len': [2, { code: 120 }],
    'no-console': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off'
  },
  settings: {
    'import/core-modules': ['aws-sdk']
  }
};
