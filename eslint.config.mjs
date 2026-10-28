import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.cache/**',
      'public/**',
      'node_modules/**',
      'src/gatsby-types.d.ts',
      'src/components/CodeEditor/extensions/zephyr/language/build/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        __PATH_PREFIX__: 'readonly',
      },
    },
    settings: {react: {version: 'detect'}},
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {varsIgnorePattern: '^(React|_)', argsIgnorePattern: '^_'},
      ],
    },
  },
  {
    // Node/CommonJS config and script files legitimately use require().
    files: ['**/*.js', '**/*.cjs'],
    rules: {'@typescript-eslint/no-require-imports': 'off'},
  },
);
