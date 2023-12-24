// Node has an Intl object, but doesn't ship with any locale information, so we
// need to patch parts of it to work as it does in the browser.
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en-NZ';
