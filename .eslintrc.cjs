module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // ===== 关键规则 =====
    // 禁止直接引入 Element Plus
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['element-plus', 'element-plus/*'],
            message: '禁止直接引入 Element Plus，请使用 @my-repo/ui'
          },
          {
            group: ['screen-*'],
            message: '禁止跨项目直接引用，请将共享代码放在 packages/ 中'
          }
        ]
      }
    ],
    // Vue
    'vue/multi-word-component-names': 'off',
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    // 通用
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error'
  },
  overrides: [
  {
    files: ['packages/ui/**/*.{vue,ts,js}'],
    rules: {
      'no-restricted-imports': 'off'
    }
  },
  {
    files: ['apps/*/src/main.ts'],
    rules: {
      'no-restricted-imports': 'off'
    }
  }
]
}