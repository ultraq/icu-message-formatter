import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import {defineConfig} from 'rollup';

export default defineConfig({
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
		nodeResolve()
	],
	external: [
		'@ultraq/function-utils'
	],
	treeshake: {
		moduleSideEffects: false
	}
});
