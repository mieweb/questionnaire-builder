import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {       "ignores": [
        "**/dist/**",
        "**/build/**",
        "**/.docusaurus/**",
        "**/vite.config.*.timestamp*",
        "**/vitest.config.*.timestamp*"
      ] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
  },
  {
    files: ['scripts/**/*.js', '**/vite.config*.js', 'apps/mieweb-forms-docs/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/questionnaireRenderer-blaze.js'],
    languageOptions: {
      globals: {
        Template: 'readonly',
        Blaze: 'readonly',
        HTML: 'readonly',
      },
    },
  },
  {
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['**/icons.jsx'],
    rules: {
      'react/display-name': 'off',
      'react/prop-types': 'off',
    },
  },
]
