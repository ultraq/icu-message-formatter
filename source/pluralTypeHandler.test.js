/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env jest */
import MessageFormatter from './MessageFormatter.js';
import pluralTypeHandler from './pluralTypeHandler.js';

/**
 * Tests for the `plural` handler.
 */
describe('pluralTypeHandler', function() {

	describe('Branch selection', function() {
		const formatter = new MessageFormatter({
			plural: pluralTypeHandler
		});
		const message = 'Stop thinking about {value, plural, one {that donut} other {those donuts}}';

		test('one', function() {
			let result = formatter.format(message, { value: 1 }, 'en-NZ');
			expect(result).toBe('Stop thinking about that donut');
		});

		test('other', function() {
			let result = formatter.format(message, { value: 2 }, 'en-NZ');
			expect(result).toBe('Stop thinking about those donuts');
		});
	});

	describe('Fallback of emitting the value', function() {
		const formatter = new MessageFormatter({
			plural: pluralTypeHandler
		});

		test('No matching branch', function() {
			let message = 'I have {cows, plural, one {a cow} two {some cows}}';
			let result = formatter.format(message, { cows: 7 }, 'en-NZ');
			expect(result).toBe('I have 7');
		});

		test('Keyword without branch', function() {
			let message = 'I have {cows, plural, other}';
			let result = formatter.format(message, { cows: 7 }, 'en-NZ');
			expect(result).toBe('I have 7');
		});
	});

	describe('Special # token', function() {
		const message = '{days, plural, one {# day} other {# days}}...';

		test('Emit value without a registered number handler', function() {
			let formatter = new MessageFormatter({
				plural: pluralTypeHandler
			});
			let result = formatter.format(message, { days: 7 }, 'en-NZ');
			expect(result).toBe('7 days...');
		});

		test('Use the registered number handler', function() {
			let numberTypeHandler = jest.fn((value, options, values, locale) => new Intl.NumberFormat(locale).format(value));
			let formatter = new MessageFormatter({
				number: numberTypeHandler,
				plural: pluralTypeHandler
			});
			let result = formatter.format(message, { days: 1000 }, 'en-NZ');
			expect(result).toBe('1,000 days...');
		});
	});
});