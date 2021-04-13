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
		const formatter = new MessageFormatter('en-NZ', {
			plural: pluralTypeHandler
		});
		const message = `Stop thinking about {value, plural,
			one {that donut}
			=2 {that delicious duo of donuts}
			=3 {that triumphant trio of donuts}
			other {those donuts}
		}`;

		test('=n', function() {
			let result = formatter.format(message, { value: 2 });
			expect(result).toBe('Stop thinking about that delicious duo of donuts');

			result = formatter.format(message, { value: 3 });
			expect(result).toBe('Stop thinking about that triumphant trio of donuts');
		});

		test('other', function() {
			let result = formatter.format(message, { value: 1000 });
			expect(result).toBe('Stop thinking about those donuts');
		});

		test('other fallback', function() {
			let result = formatter.format(message);
			expect(result).toBe('Stop thinking about those donuts');
		});
	});

	describe('Fallback of emitting the value', function() {
		const formatter = new MessageFormatter('en-NZ', {
			plural: pluralTypeHandler
		});

		test('No matching branch', function() {
			let message = 'I have {cows, plural, one {a cow} two {some cows}}';
			let result = formatter.format(message, { cows: 7 });
			expect(result).toBe('I have 7');
		});

		test('Keyword without branch', function() {
			let message = 'I have {cows, plural, other}';
			let result = formatter.format(message, { cows: 7 });
			expect(result).toBe('I have 7');
		});
	});

	describe('Special # token', function() {
		let message = '{days, plural, one {# day} other {# days}}...';

		test('Emit value without a registered number handler', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler
			});
			let result = formatter.format(message, { days: 7 });
			expect(result).toBe('7 days...');
		});

		test('Use the registered number handler', function() {
			let numberTypeHandler = jest.fn((value, options, values, locale) => new Intl.NumberFormat(locale).format(value));
			let formatter = new MessageFormatter('en-NZ', {
				number: numberTypeHandler,
				plural: pluralTypeHandler
			});
			let result = formatter.format(message, { days: 1000 });
			expect(result).toBe('1,000 days...');
		});

		test('Number signs for nested plurals doesnt apply top level count to inner sign', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler
			});
			let result = formatter.format(`{id, plural,
				other {ID: # {count, plural,
						other {Count: #}
					}}
			}`, { id: 5, count: 11 });
			expect(result).toBe('ID: 5 Count: 11');
		});
	});

	describe('Supports offset argument', function() {
		const formatter = new MessageFormatter('en-NZ', {
			plural: pluralTypeHandler
		});

		test('If unspecified, offset is null', function() {
			let message = '{days, plural, one {one day} =2 {two days} other {# days}}...';

			let result = formatter.format(message, { days: 5 });
			expect(result).toBe('5 days...');
		});

		test('Specified offset will be applied via =X branch', function() {
			let message = '{days, plural, offset:3 one {one day} =2 {two days} other {# days}}...';

			let result = formatter.format(message, { days: 5 });
			expect(result).toBe('two days...');
		});

		test('Specified offset will be applied via number sign', function() {
			let message = '{days, plural, offset:1 one {one day} =2 {two days} other {# days}}...';

			let result = formatter.format(message, { days: 5 });
			expect(result).toBe('4 days...');
		});

		test('Specified offset will be applied via `one` keyword', function() {
			let message = '{days, plural, offset:4 one {one day} =2 {two days} other {# days}}...';

			let result = formatter.format(message, { days: 5 });
			expect(result).toBe('one day...');
		});
	});

	describe('Empty matches', function() {
		test('No matching branch', function() {
			let result = pluralTypeHandler('some value');
			expect(result).toBe('some value');
		});
	});
});
