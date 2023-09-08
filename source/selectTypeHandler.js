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

const OTHER = 'other';

/**
 * Handler for `select` statements within ICU message syntax strings.  Returns
 * a formatted string for the branch that closely matches the current value.
 * 
 * See https://formatjs.io/docs/core-concepts/icu-syntax#select-format for more
 * details on how the `select` statement works.
 * 
 * @param {string} value
 * @param {string} matches
 * @param {string} locale
 * @param {FormatValues} values
 * @param {FormatFunction} format
 * @return {string}
 */
export default function selectTypeHandler(value, matches = '', locale, values, format) {
	const {cases} = parseCases(matches);

	if (value in cases) {
		return format(cases[value], values);
	}
	else if (OTHER in cases) {
		return format(cases[OTHER], values);
	}

	return value;
}
