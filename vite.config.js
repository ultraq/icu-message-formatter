import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'source/IcuMessageFormatter.js'),
			formats: ['cjs', 'es'],
			fileName: 'icu-message-formatter'
		},
		minify: false,
		sourcemap: true,
		rollupOptions: {
			external: [
				'@ultraq/function-utils'
			]
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.js'],
		coverage: {
			enabled: true
		}
	}
});
