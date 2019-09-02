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

import {findClosingBracket, splitFormattedArgument} from './utilities.js';

/**
 * The main class for formatting messages.
 * 
 * @author Emanuel Rabina
 */
export default class MessageFormatter {

	/**
	 * Creates a new formatter that can work using any of the custom type handlers
	 * you register.
	 * 
	 * @param {Object} [typeHandlers={}]
	 *   Optional object where the keys are the names of the types to register,
	 *   their values being the functions that will return a nicely formatted
	 *   string for the data and locale they are given.
	 */
	constructor(typeHandlers = {}) {

		this.typeHandlers = typeHandlers;
	}

	/**
	 * Formats an ICU message syntax string using `values` for placeholder data
	 * and any currently-registered type handlers.
	 * 
	 * @param {String} message
	 * @param {Object} [values={}]
	 * @param {String} locale
	 * @return {String}
	 */
	format(message, values = {}, locale) {

		if (!message) {
			return '';
		}

		let result = message;

		let blockStartIndex = result.indexOf('{');
		while (blockStartIndex !== -1) {
			let blockEndIndex = findClosingBracket(result, blockStartIndex);
			if (blockEndIndex !== -1) {
				let block = result.substring(blockStartIndex, blockEndIndex + 1);
				if (block) {
					let [key, type, format] = splitFormattedArgument(block);
					let value = values[key];
					if (value === null || value === undefined) {
						value = '';
					}
					let typeHandler = type && this.typeHandlers[type];
					result = result.replace(block, typeHandler ?
						typeHandler(value, format, values, locale, this.format.bind(this)) :
						value
					);
				}
			}
			else {
				throw new Error(`Unbalanced curly braces in string: "${message}"`);
			}

			blockStartIndex = result.indexOf('{');
		}

		return result;
	}
}
