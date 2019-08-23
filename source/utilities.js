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

/**
 * Finds the index of the matching closing curly bracket, including through
 * strings that could have nested brackets.
 * 
 * @param {String} string
 * @param {Number} fromIndex
 * @return {Number} The index of the matching closing bracket, or -1 if no
 *   closing bracket could be found.
 */
export function findClosingBracket(string, fromIndex) {
	let depth = 0;
	for (let i = fromIndex + 1; i < string.length; i++) {
		let char = string.charAt(i);
		if (char === '}') {
			if (depth === 0) {
				return i;
			}
			depth--;
		}
		else if (char === '{') {
			depth++;
		}
	}
	return -1;
}

/**
 * Split a `{key, type, format}` block into those 3 parts, taking into account
 * nested message syntax that can exist in the `format` part.
 * 
 * @param {String} block
 * @return {Array}
 *   An array with `key`, `type`, and `format` items in that order, if present
 *   in the formatted argument block.
 */
export function splitFormattedArgument(block) {
	return split(block.slice(1, -1), ',', 3);
}

/**
 * Like `String.prototype.split()` but where the limit parameter causes the
 * remainder of the string to be grouped together in a final entry.
 * 
 * @private
 * @param {String} string
 * @param {String} separator
 * @param {Number} limit
 * @param {Array} [accumulator=[]]
 * @return {Array}
 */
function split(string, separator, limit, accumulator = []) {
	if (!string) {
		return accumulator;
	}
	if (limit === 1) {
		accumulator.push(string);
		return accumulator;
	}
	let indexOfDelimiter = string.indexOf(separator);
	if (indexOfDelimiter === -1) {
		accumulator.push(string);
		return accumulator;
	}
	let head = string.substring(0, indexOfDelimiter).trim();
	let tail = string.substring(indexOfDelimiter + separator.length + 1).trim();
	accumulator.push(head);
	return split(tail, separator, limit - 1, accumulator);
}
