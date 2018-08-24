module.exports = {
  'extends': ['standard', 'plugin:react/recommended', 'prettier'],
  'plugins': ['prettier', 'typescript'],
  'parser': 'typescript-eslint-parser',
  'rules': {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
    'no-undef': 0,
  },
  'settings': {
    'react': {
      'version': '16.2', // React version, default to the latest React stable release
    },
  }
}
