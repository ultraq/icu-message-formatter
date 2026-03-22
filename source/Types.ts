/*
 * Copyright 2026, Emanuel Rabina (http://www.ultraq.net.nz/)
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

export type FormatValues = Record<string, any>;
export type ProcessFunction = (message: string, values?: FormatValues) => any[];

/**
 * @param value
 *   The object which matched the key of the block being processed.
 * @param matches
 *   Any format options associated with the block being processed.
 * @param locale
 *   The locale to use for formatting.
 * @param values
 *   The object of placeholder data given to the original `format`/`process`
 *   call.
 * @param process
 *   The `process` function itself so that sub-messages can be processed by type
 *   handlers.
 */
export interface TypeHandler<TValue = any, TReturn = any | any[]> {
	(value: TValue, matches: string, locale: string, values: FormatValues, process: ProcessFunction): TReturn;
}

declare module '@ultraq/function-utils' {
	export function memoize<T extends (...args: any[]) => any>(fn: T): T;
}
