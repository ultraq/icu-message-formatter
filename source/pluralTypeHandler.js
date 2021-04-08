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

import {parseCases} from './utilities.js';

let keyCounter = 0;

// All the special keywords that can be used in `plural` blocks for the various branches
const ONE   = 'one';
const OTHER = 'other';

/**
 * @private
 * @param {String} caseBody
 * @param {Number} value
 * @return {Object} {caseBody: string, numberValues: object}
 */
function replaceNumberSign(caseBody, value) {
	let i = 0;
	let output = '';
	let numBraces = 0;
	const numberValues = {};

	while (i < caseBody.length) {
		if (caseBody[i] === '#' && !numBraces) {
			let keyParam = `__hashToken${keyCounter++}`;
			output += `{${keyParam}, number}`;
			numberValues[keyParam] = value;
		}
		else {
			output += caseBody[i];
		}

		if (caseBody[i] === '{') {
			numBraces++;
		}
		else if (caseBody[i] === '}') {
			numBraces--;
		}

		i++;
	}

	return {
		caseBody: output,
		numberValues
	};
}

/**
 * Handler for `plural` statements within ICU message syntax strings.  Returns
 * a formatted string for the branch that closely matches the current value.
 * 
 * See https://formatjs.io/docs/core-concepts/icu-syntax#plural-format for more
 * details on how the `plural` statement works.
 * 
 * @param {Number|String} value
 * @param {String} matches
 * @param {String} locale
 * @param {String} values
 * @param {Function} format
 * @return {String}
 */
export default function pluralTypeHandler(value, matches = '', locale, values, format) {
	const keywordPossibilities = [];

	if (value === 1) {
		keywordPossibilities.push(ONE);
	}
	keywordPossibilities.push(`=${value}`, OTHER);

	const { cases } = parseCases(matches);

	for (let i = 0; i < keywordPossibilities.length; i++) {
		const keyword = keywordPossibilities[i];
		if (keyword in cases) {
			const { caseBody, numberValues } = replaceNumberSign(cases[keyword], value);
			return format(caseBody, {
				...values,
				...numberValues
			});
		}
	}

	return value;
}
