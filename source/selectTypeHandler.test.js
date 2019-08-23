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
 * Tests for the `select` handler.
 */
describe('selectTypeHandler', function() {

	const formatter = new MessageFormatter({
		select: selectTypeHandler
	});

	describe('Branch selection', function() {
		let message = '{mood, select, happy {Good} sad {bad} other {Ambivalent}} morning';

		test('Explicit branch', function() {
			let result = formatter.format(message, { mood: 'happy' }, 'en-NZ');
			expect(result).toBe('Good morning');
		});

		test('Fallback branch', function() {
			let result = formatter.format(message, { mood: 'angry' }, 'en-NZ');
			expect(result).toBe('Ambivalent morning');
		});
	});

	describe('Fallback of emitting the value', function() {

		test('No matching branch', function() {
			let message = 'I am feeling {mood, select, happy {good}}';
			let result = formatter.format(message, { mood: 'ambivalent' }, 'en-NZ');
			expect(result).toBe('I am feeling ambivalent');
		});
	});
});
