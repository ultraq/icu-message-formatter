import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {defineConfig} from 'rollup';

export default defineConfig({
	input: 'source/IcuMessageFormatter.js',
	output: [
		{
			file: 'dist/icu-message-formatter.browser.min.js',
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		nodeResolve({
			browser: true
		}),
		terser()
	],
	treeshake: {
		moduleSideEffects: false
	}
});
