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
import selectTypeHandler from './selectTypeHandler.js';

/**
 * Tests for the ICU message formatter.
 */
describe('MessageFormatter', function() {

	describe('#format', function() {

		test('Basic string replacement', function() {
			let formatter = new MessageFormatter();
			let message = formatter.format('Hey {name}, that\'s gonna cost you!', {
				name: 'Emanuel'
			}, 'en-NZ');
			expect(message).toBe('Hey Emanuel, that\'s gonna cost you!');
		});

		test('Options finding when containing nested types', function() {
			let selectSpy = jest.fn(selectTypeHandler);
			let formatter = new MessageFormatter({
				select: selectSpy
			});

			let values = {
				at: 'asap'
			};
			let locale = 'en-NZ';
			let message = formatter.format(
				'Hit me up {at, select, date {at {specificDate, date}} asap {as soon as possible}}',
				values,
				'en-NZ'
			);

			expect(selectSpy).toHaveBeenCalledWith(
				values.at,
				'date {at {specificDate, date}} asap {as soon as possible}',
				values,
				locale,
				expect.any(Function)
			);
			expect(message).toBe('Hit me up as soon as possible');
		});

		test('Replaces multiple instances of the same parameter', function() {
			let formatter = new MessageFormatter();
			let message = formatter.format('Hello {name} {name}!', {
				name: 'Emanuel'
			}, 'en-NZ');
			expect(message).toBe('Hello Emanuel Emanuel!');
		});

		test('Returns empty strings for null/undefined message values', function() {
			let formatter = new MessageFormatter();
			[null, undefined].forEach(value => {
				let message = formatter.format(value);
				expect(message).toBe('');
			});
		});

		test('Lets falsey values in parameters through', function() {
			let formatter = new MessageFormatter();
			[0, false].forEach(value => {
				let message = formatter.format(`{param}`, {
					param: value
				});
				expect(message).toBe(value.toString());
			});
		});
	});
});
