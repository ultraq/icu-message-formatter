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

let pluralFormatter;

let keyCounter = 0;

// All the special keywords that can be used in `plural` blocks for the various branches
const ONE   = 'one';
const OTHER = 'other';

/**
 * @private
 * @param {string} caseBody
 * @param {number} value
 * @return {{caseBody: string, numberValues: object}}
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
 * @param {string} value
 * @param {string} matches
 * @param {string} locale
 * @param {FormatValues} values
 * @param {ProcessFunction} process
 * @return {any | any[]}
 */
export default function pluralTypeHandler(value, matches = '', locale, values, process) {
	const {args, cases} = parseCases(matches);

	let intValue = parseInt(value);

	args.forEach((arg) => {
		if (arg.startsWith('offset:')) {
			intValue -= parseInt(arg.slice('offset:'.length));
		}
	});

	const keywordPossibilities = [];

	if ('PluralRules' in Intl) {
		// Effectively memoize because instantiation of `Int.*` objects is expensive.
		if (pluralFormatter === undefined || pluralFormatter.resolvedOptions().locale !== locale) {
			pluralFormatter = new Intl.PluralRules(locale);
		}

		const pluralKeyword = pluralFormatter.select(intValue);

		// Other is always added last with least priority, so we don't want to add it here.
		if (pluralKeyword !== OTHER) {
			keywordPossibilities.push(pluralKeyword);
		}
	}
	if (intValue === 1) {
		keywordPossibilities.push(ONE);
	}
	keywordPossibilities.push(`=${intValue}`, OTHER);

	for (let i = 0; i < keywordPossibilities.length; i++) {
		const keyword = keywordPossibilities[i];
		if (keyword in cases) {
			const {caseBody, numberValues} = replaceNumberSign(cases[keyword], intValue);
			return process(caseBody, {
				...values,
				...numberValues
			});
		}
	}

	return value;
}
