// Node has an Intl object, but doesn't ship with any locale information, so we
// need to patch parts of it to work as it does in the browser.
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en-NZ';

import {jest} from '@jest/globals';

// Put Jest back on the global namespace for ESM mode
global.jest = jest;
