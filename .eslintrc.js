module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [ 
    'eslint:recommended', 
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  plugins: [ 'vue', '@typescript-eslint' ],
  rules: { 
    indent: [ 'error',2 ],
    quotes: [ 'error', 'single' ],
    semi: [ 'error', 'never' ],
    'linebreak-style': [ 'error','unix' ],
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': [ 'error', { singleline: 4, multiline: 2, }, ],
    'vue/html-closing-bracket-newline': [
      'error', { singleline: 'never', multiline: 'never', }, 
    ],
    'no-multi-spaces': ['error'],
  },
  globals: { 
    computed: 'readonly',
    inject: 'readonly',
    module: 'readonly',
    reactive: 'readonly',
    ref: 'readonly',
    watchEffect: 'readonly',
    onMounted: 'readonly',
    useHead: 'readonly',
    useRouter: 'readonly',
    useRoute: 'readonly'
  }
}
  