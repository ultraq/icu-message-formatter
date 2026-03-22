import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import {defineConfig} from 'rollup';

export default defineConfig({
	input: 'source/IcuMessageFormatter.ts',
	output: [
		{
			file: 'dist/icu-message-formatter.browser.min.js',
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		typescript(),
		nodeResolve({
			browser: true
		}),
		terser()
	],
	treeshake: {
		moduleSideEffects: false
	}
});
