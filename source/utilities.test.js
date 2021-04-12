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
import { parseCases, replaceRichTags } from './utilities';

/**
 * Tests for the `parseCases` util.
 */
describe('parseCases', function () {
	describe('empty', function () {
		test('empty string', function () {
			let result = parseCases('');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({});
		});
	});

	describe('basic case support', function () {
		test('single case', function () {
			let result = parseCases('key {case string!}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key: 'case string!' });
		});

		test('fails if cant close case', function () {
			expect(() => {
				parseCases('key1 {{case1}');
			}).toThrowError();
		});

		test('multiple cases', function () {
			let result = parseCases('key1 {case1} key2 {case2} key3 {case3}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with symbols', function () {
			let result = parseCases('=key1 {case1} &key2 {case2} key3 {case3}');
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ '=key1': 'case1', '&key2': 'case2', key3: 'case3' });
		});

		test('multiple cases with inconsistent whitespace', function () {
			let result = parseCases(`key1     {case1}  
            
            
    key2 {case2}
                                key3 {case3}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with minimal whitespace', function () {
			let result = parseCases(`key1{case1}key2{case2}key3{case3}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: 'case1', key2: 'case2', key3: 'case3' });
		});

		test('multiple cases with complex bodies', function () {
			let result = parseCases(`key1     {{}{}{}{{{{}}}}}  
            
            
    key2 {=key1 {case1} &key2 {case2} key3 {case3}}
                                key3 {}`);
			expect(result.args).toStrictEqual([]);
			expect(result.cases).toStrictEqual({ key1: '{}{}{}{{{{}}}}', key2: '=key1 {case1} &key2 {case2} key3 {case3}', key3: '' });
		});
	});

	describe('basic arg support', function () {
		test('single arg', function () {
			let result = parseCases('arg1');
			expect(result.args).toStrictEqual(['arg1']);
		});

		test('multiple args', function () {
			let result = parseCases('arg1 arg2 arg3');
			expect(result.args).toStrictEqual(['arg1', 'arg2', 'arg3']);
		});

		test('multiple args with inconsistent whitespace', function () {
			let result = parseCases(`arg1     
            
            
            arg2                    arg3`);
			expect(result.args).toStrictEqual(['arg1', 'arg2', 'arg3']);
		});
	});

	describe('arg and cases support', function () {
		test('multiple args and cases', function () {
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

describe('replaceRichTags', function () {
	const replaceWithObject = (tag, tags, contents) => {
		return { tag, contents };
	};
	
	describe('No tags', function () {
		test('Doesnt change single empty string', function () {
			let result = replaceRichTags(["no tags here!"], {}, replaceWithObject);

			expect(result).toStrictEqual(['no tags here!']);
		})

		test('Doesnt change multiple empty strings', function () {
			let result = replaceRichTags(["no", "tags", "here!"], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 'here!']);
		})
	})

	describe('Invalid tags', function () {
		test('No spaces in tags', function () {
			let result;

			result = replaceRichTags(["<a >Hello!</a>"], {}, replaceWithObject);
			expect(result).toStrictEqual(["<a >Hello!</a>"]);

			result = replaceRichTags(["< a>Hello!</a>"], {}, replaceWithObject);
			expect(result).toStrictEqual(["< a>Hello!</a>"]);
		})
	
		test('No attributes', function () {
			let result = replaceRichTags(["<a src='hello world'>Hello!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual(["<a src='hello world'>Hello!</a>"]);
		})

		test('No self-closing tags', function () {
			let result = replaceRichTags(["Hello World <br />"], {}, replaceWithObject);

			expect(result).toStrictEqual(["Hello World <br />"]);
		})

		test('Errors when tag unclosed', function () {
			expect(() => {
				replaceRichTags(["<a>Hello!"], {}, replaceWithObject);
			}).toThrowError();
		});

		test('Doesnt change multiple empty strings', function () {
			let result = replaceRichTags(["no", "tags", "here!"], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 'here!']);
		})

		test('Passes through non-string segments', function () {

			let result = replaceRichTags(["no", "tags", 42, "here!"], {}, replaceWithObject);

			expect(result).toStrictEqual(['no', 'tags', 42, 'here!']);
		})
	})

	describe('Single tag', function () {
		test('Replaces simple tag', function () {
			let result = replaceRichTags(["<a>Hello!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello!'], tag: 'a' }]);
		});

		test('Replaces simple tag with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello!</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello!'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});

		test('Replaces simple tag in consecutive segments', function () {
			let result = replaceRichTags(["<a>Hello", "world</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }]);
		});

		test('Replaces simple tag in consecutive segments with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello", "world</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});

		test('Replaces simple tag in disconnected segments', function () {
			let result = replaceRichTags(["<a>Hello", "beautiful", "world</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'beautiful', 'world'], tag: 'a' }]);
		});

		test('Replaces simple tag in disconnected segments with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello", "beautiful", "world</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});

		test('includes non-string contents', function () {
			let result = replaceRichTags(["<a>Hello, ", 42, " world</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello, ', 42, ' world'], tag: 'a' }]);
		});
	})

	describe('disjoint tags', function () {
		test('Replaces disjoint tags', function () {
			let result = replaceRichTags(["<a>Hello!</a> <a>Hello 2!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello!'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello!</a> <a>Hello 2!</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello!'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});

		test('Replaces disjoint tags, one split one not', function () {
			let result = replaceRichTags(["<a>Hello", "world</a> <a>Hello 2!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags, one split one not in consecutive segments with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello", "world</a> <a>Hello 2!</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello 2!'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});

		test('Replaces disjoint tags, both split', function () {
			let result = replaceRichTags(["<a>Hello", "world</a> <a>Hello", " 2!</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello', ' 2!'], tag: 'a' }]);
		});

		test('Replaces disjoint tags, both split in consecutive segments with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello", "world</a> <a>Hello", " 2!</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'world'], tag: 'a' }, ' ', { contents: ['Hello', ' 2!'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});


		test('Replaces disjoint tags in disconnected segments', function () {
			let result = replaceRichTags(["<a>Hello", "beautiful", "world</a><a>", "Pizza", "is", "good", "</a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, { contents: ['Pizza', 'is', 'good'], tag: 'a' }]);
		});

		test('Replaces disjoint tags in disconnected segments with surrounding text', function () {
			let result = replaceRichTags(["Some Prefix <a>Hello", "beautiful", "world</a><a>", "Pizza", "is", "good", "</a> Some Suffix", "Next Segment"], {}, replaceWithObject);

			expect(result).toStrictEqual(['Some Prefix ', { contents: ['Hello', 'beautiful', 'world'], tag: 'a' }, { contents: ['Pizza', 'is', 'good'], tag: 'a' }, ' Some Suffix', "Next Segment"]);
		});
	});

	describe('nested tags', function () {
		test('nested different tags', function () {
			let result = replaceRichTags(["<a><b>Hello!</b></a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: [{ contents: ['Hello!'], tag: 'b' }], tag: 'a' }]);
		});

		test('nested different tags with surrounding text', function () {
			let result = replaceRichTags(["PreOuter<a>PreInner<b>Hello!</b>PostInner</a>PostOuter"], {}, replaceWithObject);

			expect(result).toStrictEqual(['PreOuter', { contents: ['PreInner', { contents: ['Hello!'], tag: 'b' }, 'PostInner'], tag: 'a' }, 'PostOuter']);
		});

		test('nested same tags', function () {
			let result = replaceRichTags(["<a><a>Hello!</a></a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: [{ contents: ['Hello!'], tag: 'a' }], tag: 'a' }]);
		});

		test('nested same tags with surrounding text', function () {
			let result = replaceRichTags(["PreOuter<a>PreInner<a>Hello!</a>PostInner</a>PostOuter"], {}, replaceWithObject);

			expect(result).toStrictEqual(['PreOuter', { contents: ['PreInner', { contents: ['Hello!'], tag: 'a' }, 'PostInner'], tag: 'a' }, 'PostOuter']);
		});

		test('nested invalid inner ignored', function () {
			let result = replaceRichTags(["<a>< b>Hello!</b></a>"], {}, replaceWithObject);

			expect(result).toStrictEqual([{ contents: ['< b>Hello!</b>'], tag: 'a' }]);
		});
	});
});
