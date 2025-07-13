import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		setupFiles: ['./vitest.setup.js'],
		coverage: {
			enabled: true
		}
	}
});
