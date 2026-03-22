// @ts-check
import {defineConfig} from 'eslint/config';
import myConfig from 'eslint-config-ultraq';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	...myConfig,
	tseslint.configs.recommended,
	{
		ignores: [
			'coverage/**/*',
			'dist/**/*'
		]
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.browser,
				...globals.node,
				...globals.vitest
			},
			sourceType: 'module'
		},
		settings: {
			'import/resolver': 'eslint-import-resolver-typescript'
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'jsdoc/require-param': 'off',
			'jsdoc/require-returns': 'off',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-type': 'off',
			'prefer-const': 'off'
		}
	}
]);
