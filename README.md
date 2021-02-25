
ICU Message Formatter
=====================

[![Build Status](https://travis-ci.com/ultraq/icu-message-formatter.svg?branch=main)](https://travis-ci.com/ultraq/icu-message-formatter)
[![Coverage Status](https://coveralls.io/repos/github/ultraq/icu-message-formatter/badge.svg?branch=main)](https://coveralls.io/github/ultraq/icu-message-formatter?branch=main)
[![npm](https://img.shields.io/npm/v/@ultraq/icu-message-formatter.svg?maxAge=3600)](https://www.npmjs.com/package/@ultraq/icu-message-formatter)
[![Bundlephobia minified size](https://img.shields.io/bundlephobia/min/@ultraq/icu-message-formatter)](https://bundlephobia.com/result?p=@ultraq/icu-message-formatter)

Format [ICU message syntax strings](https://formatjs.io/docs/core-concepts/icu-syntax)
from supplied parameters and your own configurable types.

This is a low-level API alternative to string formatting libraries like
`intl-messageformat` (the underlying formatting library behind `react-intl`)
which often blow out bundle sizes because of the sheer amount of formatting
capabilities included by default.  With this library, you add/configure your own
formatters to keep your bundle size as light as it can possibly be.

Out of the box, the only formatting this library does is basic replacement of
`{tokens}` with strings.  Some features are part of this library, but must
explicitly be configured.  Everything else is BYO formatter (some examples
below).


Installation
------------

```
npm install @ultraq/icu-message-formatter
```


Usage
-----

Create a new `MessageFormatter` instance and configure it with any type handlers
that you know you'll encounter in your format strings.  Then, call `format` to
process whatever string and data you throw at it for the locale you want it in:

```javascript
import {MessageFormatter} from '@ultraq/icu-message-formatter';
import {toCurrencyString} from 'my-custom-currency-library';

let formatter = new MessageFormatter({
  currency: ({value, currency}, options, locale, values) => toCurrencyString(value, currency, locale)
});

let message = formatter.format('Hey {name}, that\'s gonna cost you {amount, currency}!', 'en-NZ', {
  name: 'Emanuel',
  amount: {
    value: 2,
    currency: 'GBP'
  }
});

console.log(message); // "Hey Emanuel, that's gonna cost you £2.00!"
```


API
---

### MessageFormatter

```javascript
import {MessageFormatter} from '@ultraq/icu-message-formatter';
```

The main class for formatting messages.

#### new MessageFormatter(typeHandlers = {})

Creates a new formatter that can work using any of the custom type handlers you
register.

 - **typeHandlers**: optional object where the keys are the names of the types
   to register, their values being the functions that will return a nicely
   formatted string for the data and locale they are given.  Type handlers are
   passed 5 parameters:
    - the object which matched the key of the block being processed
    - any format options associated with the block being processed
    - the locale to use for formatting
    - the object of placeholder data given to the original `format` call
    - and the `format` function itself (see below) so that sub-messages can be
      processed by type handlers

#### format(message, locale, values = {})

Formats an ICU message syntax string using `values` for placeholder data and any
currently-registered type handlers.

 - **message**: the ICU message string to format
 - **locale**: the locale to use for formatting
 - **values**: object of placeholder data to fill out the message

#### process(message, locale, values = {})

Process an ICU message syntax string using `values` for placeholder data and any
currently-registered type handlers.  The result of this method is an array of
the component parts after they have been processed in turn by their own type
handlers.  This raw output is useful for other renderers, eg: React where
components can be used instead of being forced to return raw strings.

 - **message**: the ICU message string to format
 - **locale**: the locale to use for formatting
 - **values**: object of placeholder data to fill out the message


### Type handlers available in this library

### pluralTypeHandler

```javascript
import {pluralTypeHandler} from '@ultraq/icu-message-formatter';
```

Handler for `plural` statements within ICU message syntax strings.  See
https://formatjs.io/docs/core-concepts/icu-syntax#plural-format for more details
on how the `plural` statement works.

For the special `#` placeholder, it will be processed as if it were
`{key, number}`, using the `number` handler that has been registered with the
current message formatter instance.  If none has been registered, then the
fallback behaviour will be invoked (which is to emit the value of `key`).

#### selectTypeHandler

```javascript
import {selectTypeHandler} from '@ultraq/icu-message-formatter';
```

Handler for `select` statements within ICU message syntax strings.  See
https://formatjs.io/docs/core-concepts/icu-syntax#select-format for more details
on how the `select` statement works.


### Other exported utilities

#### findClosingBracket(string, fromIndex)

```javascript
import {findClosingBracket} from '@ultraq/icu-message-formatter';
```

Finds the index of the next closing curly bracket, `}`, including in strings
that could have nested brackets.  Returns the index of the matching closing
bracket, or -1 if no closing bracket could be found.

 - **string**:
 - **fromIndex**:

#### splitFormattedArgument(block)

```javascript
import {splitFormattedArgument} from '@ultraq/icu-message-formatter';
```

Split a `{key, type, format}` block into those 3 parts, taking into account
nested message syntax that can exist in the `format` part.  Returns an array
with `key`, `type`, and `format` items in that order, if present in the
formatted argument block.

 - **block**:
