
Changelog
=========

### 0.13.0
 - Minimum supported version of Node is now 18
 - Browser target in `.browserslistrc` file is now `defaults`, so the explicit
   `ie11` target has been removed and thus IE11 support has been dropped

### 0.12.0
 - Dropped support for Node 10
 - Use [`Intl.Pluralrules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
   to add support for all of the plural keywords when using the
   [`pluralTypeHandler`](https://github.com/ultraq/icu-message-formatter#pluraltypehandler)
   ([#13](https://github.com/ultraq/icu-message-formatter/pull/13))
