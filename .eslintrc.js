module.exports = {
  extends: [
    'airbnb-typescript',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:promise/recommended',
    'plugin:compat/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  env: {
    browser: true,
    es6: true
  },
  globals: {
    JSX: true,
    React: true
  },
  overrides: [
    {
        files: ["**/*.tsx"],
        rules: {
            "react/prop-types": 0
        }
    }
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    /*
     * 'off' or 0 - turn the rule off
     * 'warn' or 1 - turn the rule on as a warning (doesn't affect exit code)
     * 'error' or 2 - turn the rule on as an error (exit code is 1 when triggered)
     */
    // eslint-disable-next-line global-require
    ...require('./config/eslint_rules'),
    'import/extensions': 0,
    // temp silence of cyclic dependencies
    'import/no-cycle': 1
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./config/config.eslint.js')
      }
    },
    react: {
      version: 'detect'
    }
  }
};