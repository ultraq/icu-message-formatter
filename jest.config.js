/** @type {import('jest').Config} */
const config = {
	collectCoverage: true,
	collectCoverageFrom: [
		'source/**/*.js'
	],
	coverageReporters: [
		'html',
		'lcov',
		'text-summary'
	],
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 80,
			functions: 80,
			lines: 80
		}
	},
	setupFiles: [
		'./jest.setup.js'
	]
};

export default config;
