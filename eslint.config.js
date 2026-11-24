// @ts-check
import {defineConfig} from 'eslint/config';
import myConfig from 'eslint-config-ultraq';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig({
	extends: [
		...myConfig,
		tseslint.configs.recommended
	],
	ignores: [
		'coverage/**/*',
		'dist/**/*'
	],
	languageOptions: {
		ecmaVersion: 2022,
		globals: {
			...globals.browser,
			...globals.node,
			...globals.vitest
		},
		sourceType: 'module'
	},
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		'jsdoc/require-param': 'off',
		'jsdoc/require-returns': 'off',
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns-type': 'off',
		'prefer-const': 'off'
	}
});
