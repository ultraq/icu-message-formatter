/* eslint-env node */
'use strict'; // eslint-disable-line

// Node has an Intl object, but doesn't ship with any locale information, so we
// need to patch parts of it to work as it does in the browser.
require('@formatjs/intl-numberformat/polyfill');
require('@formatjs/intl-numberformat/locale-data/en-NZ');
