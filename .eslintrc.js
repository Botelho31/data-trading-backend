module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prefer-destructuring': 'off',
    'func-names': 'off',
    'max-len': 'off',
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'no-useless-escape': 'off',
    'linebreak-style': 'off',
  },
};
