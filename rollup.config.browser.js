import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
	input: 'source/IcuMessageFormatter.js',
	output: [
		{
			file: 'dist/icu-message-formatter.browser.min.js',
			format: 'iife',
			name: 'IcuMessageFormatter',
			sourcemap: true
		},
		{
			file: 'dist/icu-message-formatter.browser.es.min.js',
			format: 'es',
			name: 'IcuMessageFormatter',
			sourcemap: true
		}
	],
	plugins: [
		commonjs(),
		babel({
			babelHelpers: 'bundled',
			skipPreflightCheck: true // See: https://github.com/rollup/plugins/issues/381#issuecomment-627215009
		}),
		nodeResolve({
			browser: true
		}),
		terser()
	],
	treeshake: {
		moduleSideEffects: false
	}
};
