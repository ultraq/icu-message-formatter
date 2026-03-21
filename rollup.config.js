import nodeResolve from '@rollup/plugin-node-resolve';
import {defineConfig} from 'rollup';

export default defineConfig({
	input: 'source/IcuMessageFormatter.js',
	output: [
		{
			file: 'dist/icu-message-formatter.js',
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		nodeResolve()
	],
	external: [
		'@ultraq/function-utils'
	],
	treeshake: {
		moduleSideEffects: false
	}
});
