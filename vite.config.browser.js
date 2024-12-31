import {resolve} from 'path';

import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'source/IcuMessageFormatter.js'),
			formats: ['iife', 'es'],
			name: 'IcuMessageFormatter',
			fileName: (format, _entryName) => `icu-message-formatter.browser${format === 'es' ? '.es' : ''}.min.js`
		},
		emptyOutDir: false, // Assumption - browser build always follows the module one
		sourcemap: true
	}
});
