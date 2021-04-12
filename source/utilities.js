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
 * Most branch-based type handlers are based around "cases".
 * For example, `select` and `plural` compare compare a value
 * to "case keys" to choose a subtranslation.
 * 
 * This util splits "matches" portions provided to the aforementioned
 * handlers into case strings, and extracts any prepended arguments
 * (for example, `plural` supports an `offset:n` argument used for
 * populating the magic `#` variable).
 * 
 * @param {String} string
 * @return {Object} The `cases` key points to a map of all cases.
 *                  The `arguments` key points to a list of prepended arguments.
 */
export function parseCases(string) {
	const isWhitespace = ch => /\s/.test(ch);

	const args = [];
	const cases = {};

	let currTermStart = 0;
	let latestTerm = null;
	let inTerm = false;

	let i = 0;
	while (i < string.length) {
		// Term ended
		if (inTerm && (isWhitespace(string[i]) || string[i] === '{')) {
			inTerm = false;
			latestTerm = string.slice(currTermStart, i);

			// We want to process the opening char again so the case will be properly registered.
			if (string[i] === '{') {
				i--;
			}
		}

		// New term
		else if (!inTerm && !isWhitespace(string[i])) {
			const caseBody = string[i] === '{';

			// If there's a previous term, we can either handle a whole
			// case, or add that as an argument.
			if (latestTerm && caseBody) {
				const branchEndIndex = findClosingBracket(string, i);

				if (branchEndIndex === -1) {
					throw new Error(`Unbalanced curly braces in string: "${string}"`);
				}

				cases[latestTerm] = string.slice(i + 1, branchEndIndex);  // Don't include the braces

				i = branchEndIndex; // Will be moved up where needed at end of loop.
				latestTerm = null;
			}
			else {
				if (latestTerm) {
					args.push(latestTerm);
					latestTerm = null;
				}

				inTerm = true;
				currTermStart = i;
			}
		}
		i++;
	}

	if (inTerm) {
		latestTerm = string.slice(currTermStart);
	}

	if (latestTerm) {
		args.push(latestTerm);
	}

	return {
		args,
		cases
	};
}

/**
 * Replaces rich tags with elements, as per a provided handler.
 * No spaces allowed in tag name, syntax MUST be <TAG_NAME>SOME_CONTENTS</TAG_NAME>.
 * Currently does not support tags with attributes.
 * Currently does not support self closing tags.
 * 
 * @param {String[]|any[]} message
 */
export function replaceRichTags(message, tags, handler) {
	const isHtmlTagChar = ch => /[a-zA-Z-_]/.test(ch);
	const result = [];

	for (let i = 0; i < message.length; i++) {
		const segment = message[i];
		if (typeof segment !== 'string') {
			result.push(segment);
			continue;
		}

		let j = 0;
		let currTagStart = null;
		let inTag = false

		let processedSegment = false;
		while (j < segment.length) {
			// Start of potential tag
			if (!inTag && segment[j] === '<') {
				currTagStart = j;
				inTag = true;
			}

			// Tag ended
			else if (inTag && segment[j] === '>') {
				const currTag = segment.slice(currTagStart + 1, j);
				const endingLocation = findClosingTag(message, currTag, i, j);

				if (!endingLocation) {
					throw new Error(`Unbalanced tags: no closing tag found for <${currTag}>`);
				}

				const entireTagInSegment = endingLocation.segmentIndex === i;
				const segmentContainingClosingTag = message[endingLocation.segmentIndex];

				const tagContents = [];

				if (entireTagInSegment) {
					tagContents.push(segment.slice(j + 1, endingLocation.segmentStart));
				} else {
					tagContents.push(segment.slice(j + 1));

					for (let k = i + 1; k < endingLocation.segmentIndex; k++) {
						tagContents.push(message[k]);
					}
					tagContents.push(segmentContainingClosingTag.slice(0, endingLocation.segmentStart));
				}

				result.push(segment.slice(0, currTagStart));

				result.push(handler(currTag, tags, replaceRichTags(tagContents.filter(s => s !== ''), tags, handler)));

				message.splice(endingLocation.segmentIndex + 1, 0, segmentContainingClosingTag.slice(endingLocation.segmentEnd + 1));

				processedSegment = true;

				// Will be advanced to the next segment at the end of the loop.
				i = endingLocation.segmentIndex;

				// We've spliced in any remainder of the current segment as the
				// next segment. We want to immediately advance to that.
				break;
			}

			// Not a valid tag, reset state.
			else if (inTag && !isHtmlTagChar(segment[j])) {
				currTagStart = null;
				inTag = false;
			}

			j++;
		}

		if (!processedSegment) {
			result.push(segment);
		}
	}

	return result.filter(s => s !== '');
}

/**
 * Finds the index of the matching closing tag, including through strings that
 * could have nested tags.
 */
function findClosingTag(message, tag, startIndex, startSegmentIndex) {
	const isHtmlTagChar = ch => /[a-zA-Z-_]/.test(ch);

	let depth = 1;

	for (let i = startIndex; i < message.length; i++) {
		const segment = message[i];

		if (typeof segment !== 'string') {
			continue;
		}

		let currTagIsClosing = false;
		let currTagStart = null;
		let inTag = false
		const startJ = i === startIndex ? startSegmentIndex : 0;
		for (let j = startJ; j < segment.length; j++) {
			// Start of tag
			if (!inTag && segment[j] === '<') {
				currTagStart = j;
				inTag = true;

				if (segment[j + 1] === '/') {
					currTagIsClosing = true;
					j++;
				}
			}

			// Tag ended
			else if (inTag && segment[j] === '>') {
				const currTag = segment.slice(currTagStart + 1 + currTagIsClosing, j);

				if (currTag === tag) {
					if (currTagIsClosing) {
						depth--;
					} else {
						depth++;
					}

					if (depth === 0) {
						return {
							segmentIndex: i,
							segmentStart: currTagStart,
							segmentEnd: j
						}
					}
				}

				currTagIsClosing = false;
				currTagStart = null;
				inTag = false;
			}

			// Not a valid tag, reset state.
			else if (inTag && !isHtmlTagChar(segment[j])) {
				currTagIsClosing = false;
				currTagStart = null;
				inTag = false;
			}
		}
	}
}

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
