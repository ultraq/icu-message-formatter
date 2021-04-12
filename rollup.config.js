
import babel       from '@rollup/plugin-babel';
import commonjs    from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser }  from "rollup-plugin-terser";

export default {
	input: 'source/IcuMessageFormatter.js',
	output: [
		{
			file: `lib/icu-message-formatter.cjs.js`,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: `lib/icu-message-formatter.cjs.min.js`,
			format: 'cjs',
			plugins: [terser()]
		},
		{
			file: `lib/icu-message-formatter.es.js`,
			format: 'es',
			sourcemap: true
		},
		{
			file: `lib/icu-message-formatter.es.min.js`,
			format: 'es',
			plugins: [terser()]
		}
	],
	plugins: [
		babel({
			babelHelpers: 'runtime'
		}),
		commonjs(),
		nodeResolve(),
	],
	external: [
		/@babel\/runtime/,
		'@ultraq/array-utils',
		'@ultraq/function-utils'
	]
};
