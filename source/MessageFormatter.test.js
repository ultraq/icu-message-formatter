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
import MessageFormatter from './MessageFormatter';
import pluralTypeHandler from './pluralTypeHandler';
import selectTypeHandler from './selectTypeHandler';

/**
 * Tests for the ICU message formatter.
 */
describe('MessageFormatter', function() {

	describe('#format', function() {

		test('Basic string replacement', function() {
			let formatter = new MessageFormatter('en-NZ');
			let message = formatter.format('Hey {name}, that\'s gonna cost you!', {
				name: 'Emanuel'
			});
			expect(message).toBe('Hey Emanuel, that\'s gonna cost you!');
		});

		test('Options finding when containing nested types', function() {
			let locale = 'en-NZ';
			let selectSpy = jest.fn(selectTypeHandler);
			let formatter = new MessageFormatter(locale, {
				select: selectSpy
			});

			let values = {
				at: 'asap'
			};
			let message = formatter.format(
				'Hit me up {at, select, date {at {specificDate, date}} asap {as soon as possible}}',
				values
			);

			expect(selectSpy).toHaveBeenCalledWith(
				values.at,
				'date {at {specificDate, date}} asap {as soon as possible}',
				locale,
				values,
				expect.any(Function)
			);
			expect(message).toBe('Hit me up as soon as possible');
		});

		test('Replaces multiple instances of the same parameter', function() {
			let formatter = new MessageFormatter('en-NZ');
			let message = formatter.format('Hello {name} {name}!', {
				name: 'Emanuel'
			});
			expect(message).toBe('Hello Emanuel Emanuel!');
		});

		test('Returns empty strings for null/undefined message values', function() {
			let formatter = new MessageFormatter('en-NZ');
			[null, undefined].forEach(value => {
				let message = formatter.format(value);
				expect(message).toBe('');
			});
		});

		test('Lets falsey values in parameters through', function() {
			let formatter = new MessageFormatter('en-NZ');
			[0, false].forEach(value => {
				let message = formatter.format(`{param}`, {
					param: value
				});
				expect(message).toBe(value.toString());
			});
		});

		test('Plural inside select', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler,
				select: selectTypeHandler
			});
			let message = `{gender_of_host, select,
				female {{num_guests, plural,
					=0    {{host} does not give a party.}
					=1    {{host} invites {guest} to her party.}
					=2    {{host} invites {guest} and one other person to her party.}
					other {{host} invites {guest} and # other people to her party.}
				}}
				male {{num_guests, plural,
					=0    {{host} does not give a party.}
					=1    {{host} invites {guest} to his party.}
					=2    {{host} invites {guest} and one other person to his party.}
					other {{host} invites {guest} and # other people to his party.}
				}}
				other {{num_guests, plural,
					=0    {{host} does not give a party.}
					=1    {{host} invites {guest} to their party.}
					=2    {{host} invites {guest} and one other person to their party.}
					other {{host} invites {guest} and # other people to their party.}
				}}
			}`;

			expect(formatter.format(message, { 'gender_of_host': 'male', host: 'John', 'num_guests': 115, guest: 'you' })).toBe('John invites you and 115 other people to his party.');
			expect(formatter.format(message, { 'gender_of_host': 'female', host: 'John', 'num_guests': 1, guest: 'you' })).toBe('John invites you to her party.');
			expect(formatter.format(message, { 'gender_of_host': 'other', host: 'John', 'num_guests': 2, guest: 'you' })).toBe('John invites you and one other person to their party.');
			expect(formatter.format(message, { 'gender_of_host': 'other', host: 'John', 'num_guests': 12345, guest: 'you' })).toBe('John invites you and 12345 other people to their party.');
		});

		test('Select inside plural', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler,
				select: selectTypeHandler
			});

			let message = `{num_guests, plural,
				=0    {{host} does not give a party.}
				=1    {{gender_of_host, select,
					female {{host} invites {guest} to her party.}
					male   {{host} invites {guest} to his party.}
					other  {{host} invites {guest} to their party.}
				}}
				=2    {{gender_of_host, select,
					female {{host} invites {guest} and one other person to her party.}
					male   {{host} invites {guest} and one other person to his party.}
					other  {{host} invites {guest} and one other person to their party.}
				}}
				other {{gender_of_host, select,
					female {{host} invites {guest} and # other people to her party.}
					male   {{host} invites {guest} and # other people to his party.}
					other  {{host} invites {guest} and # other people to their party.}
				}}
			}`;

			expect(formatter.format(message, { 'gender_of_host': 'female', host: 'John', 'num_guests': 1, guest: 'you' })).toBe('John invites you to her party.');
			expect(formatter.format(message, { 'gender_of_host': 'other', host: 'John', 'num_guests': 2, guest: 'you' })).toBe('John invites you and one other person to their party.');

			// number sign only works in the immediately corresponding layer! Can't use a nested one.
			expect(formatter.format(message, { 'gender_of_host': 'male', host: 'John', 'num_guests': 115, guest: 'you' })).toBe('John invites you and # other people to his party.');
			expect(formatter.format(message, { 'gender_of_host': 'other', host: 'John', 'num_guests': 12345, guest: 'you' })).toBe('John invites you and # other people to their party.');
		});
	});

	describe('#rich', function() {
		test('Rich formatting works on simple string', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler,
				select: selectTypeHandler
			});

			let result = formatter.rich('simple text');

			expect(result).toStrictEqual(['simple text']);
		});

		test('Rich formatting applies default formatter to string with tags', function() {
			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler,
				select: selectTypeHandler
			});

			let result = formatter.rich('have a <a>link!</a>');

			expect(result).toStrictEqual(['have a ', '<a>link!</a>']);
		});

		test('Rich formatting applies custom formatter to string with tags', function() {
			const customFormatter = (tag, tags, contents) => {
				return { tag, contents };
			};

			let formatter = new MessageFormatter('en-NZ', {
				plural: pluralTypeHandler,
				select: selectTypeHandler
			}, customFormatter);

			let result = formatter.rich('have a <a>link!</a>');

			expect(result).toStrictEqual(['have a ', {contents: ['link!'], tag: 'a'}]);
		});
	});
});
