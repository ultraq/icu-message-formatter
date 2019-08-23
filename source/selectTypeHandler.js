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

const OTHER = 'other';

/**
 * Handler for `select` statements within ICU message syntax strings.  Returns
 * a formatted string for the branch that closely matches the current value.
 * 
 * See https://formatjs.io/guides/message-syntax/#select-format for more details
 * on how the `select` statement works.
 * 
 * @param {String} value
 * @param {String} matches
 * @param {String} values
 * @param {String} locale
 * @param {Function} format
 * @return {String}
 */
export default function selectTypeHandler(value, matches = '', values, locale, format) {

	// Use the value branch or the 'other' branch
	let keyword = value;
	let branchKeywordIndex = matches.indexOf(keyword);
	if (branchKeywordIndex === -1) {
		branchKeywordIndex = matches.indexOf(OTHER);
		if (branchKeywordIndex === -1) {
			return value;
		}
	}

	let branchStartIndex = matches.indexOf('{', branchKeywordIndex + keyword.length) + 1;
	if (branchStartIndex !== -1) {
		let branchEndIndex = findClosingBracket(matches, branchStartIndex);
		if (branchEndIndex !== -1) {
			let branch = matches.substring(branchStartIndex, branchEndIndex);
			return format(branch, values, locale);
		}
	}

	return value;
}
