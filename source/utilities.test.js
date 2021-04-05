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
import { parseCases } from './utilities';

/**
 * Tests for the `parseCases` util.
 */
describe('parseCases', function() {
	describe('empty', function() {
		test('empty string', function() {
			let result = parseCases('');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({});
		});
	});

	describe('basic case support', function() {
		test('single case', function() {
			let result = parseCases('key {case string!}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({key: 'case string!'});
		});

		test('fails if cant close case', function() {
			expect(() => {
				parseCases('key1 {{case1}');
			}).toThrowError();
		});

		test('multiple cases', function() {
			let result = parseCases('key1 {case1} key2 {case2} key3 {case3}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with symbols', function() {
			let result = parseCases('=key1 {case1} &key2 {case2} key3 {case3}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ '=key1': 'case1', '&key2': 'case2', key3: 'case3' });
		});

		test('multiple cases with inconsistent whitespace', function() {
			let result = parseCases(`key1     {case1}  
            
            
    key2 {case2}
                                key3 {case3}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with minimal whitespace', function() {
			let result = parseCases(`key1{case1}key2{case2}key3{case3}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with complex bodies', function() {
			let result = parseCases(`key1     {{}{}{}{{{{}}}}}  
            
            
    key2 {=key1 {case1} &key2 {case2} key3 {case3}}
                                key3 {}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: '{}{}{}{{{{}}}}', key2: '=key1 {case1} &key2 {case2} key3 {case3}', key3: '' });
		});
	});

	describe('basic arg support', function() {
		test('single arg', function() {
			let result = parseCases('arg1');
			expect(result.args).toStrictEqual(['arg1']);
		});

		test('multiple args', function() {
			let result = parseCases('arg1 arg2 arg3');
			expect(result.args).toStrictEqual(['arg1', 'arg2', 'arg3']);
		});

		test('multiple args with inconsistent whitespace', function() {
			let result = parseCases(`arg1     
            
            
            arg2                    arg3`);
			expect(result.args).toStrictEqual(['arg1', 'arg2', 'arg3']);
		});
	});

	describe('arg and cases support', function() {
		test('multiple args and cases', function() {
			let result = parseCases(`
            offset:1 something:else
              =0    {{host} does not give a party.}
              =1    {{host} invites {guest} to her party.}
              =2    {{host} invites {guest} and one other person to her party.}
              other {{host} invites {guest} and # other people to her party.}
            `);

			expect(result.args).toStrictEqual(['offset:1', 'something:else']);
			expect(result.cases).toStrictEqual({
				'=0': '{host} does not give a party.',
				'=1': '{host} invites {guest} to her party.',
				'=2': '{host} invites {guest} and one other person to her party.',
				other: '{host} invites {guest} and # other people to her party.'
			});
		});
	});
});
