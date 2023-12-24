import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
	input: 'source/IcuMessageFormatter.js',
	output: [
		{
			file: 'dist/icu-message-formatter.js',
			format: 'es',
			sourcemap: true
		},
		{
			file: 'dist/icu-message-formatter.cjs',
			format: 'cjs',
			sourcemap: true
		}
	],
	plugins: [
		commonjs(),
		babel({
			babelHelpers: 'runtime'
		}),
		nodeResolve()
	],
	external: [
		/@babel\/runtime/,
		'@ultraq/function-utils'
	],
	treeshake: {
		moduleSideEffects: false
	}
};
