import myConfig from 'eslint-config-ultraq';
import globals from 'globals';

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
	...myConfig,
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
		}
	}
];
