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

import {findClosingBracket} from './utilities.js';

let keyCounter = 0;

// All the special keywords that can be used in `plural` blocks for the various
// branches.
const ONE   = 'one';
const OTHER = 'other';

/**
 * Handler for `plural` statements within ICU message syntax strings.  Returns
 * a formatted string for the branch that closely matches the current value.
 * 
 * See https://formatjs.io/docs/core-concepts/icu-syntax#plural-format for more
 * details on how the `plural` statement works.
 * 
 * @param {Number|String} value
 * @param {String} matches
 * @param {String} values
 * @param {String} locale
 * @param {Function} format
 * @return {String}
 */
export default function pluralTypeHandler(value, matches = '', values, locale, format) {

	let keyword;
	switch (value) {
		case 1:  keyword = ONE;   break;
		default: keyword = OTHER; break;
	}

	// TODO: Support the finding of "=X" branches

	let branchKeywordIndex = matches.indexOf(keyword);
	if (branchKeywordIndex !== -1) {
		let branchStartIndex = matches.indexOf('{', branchKeywordIndex + keyword.length) + 1;
		if (branchStartIndex !== -1) {
			let branchEndIndex = findClosingBracket(matches, branchStartIndex);
			if (branchEndIndex !== -1) {
				let branch = matches.substring(branchStartIndex, branchEndIndex);

				// Would have loved to use .includes, but IE11 support and don't want to
				// force consumers into including a polyfill
				if (branch.indexOf('#') !== -1) {
					let keyParam = keyCounter++;
					return format(branch.replace('#', `{${keyParam}, number}`), {
						...values,
						[keyParam]: value
					}, locale);
				}

				return format(branch, values, locale);
			}
		}
	}

	return value;
}
