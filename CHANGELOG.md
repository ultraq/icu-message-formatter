
Changelog
=========

### 0.14.3
 - Fix "Default condition should be last one" webpack build error
	 ([#14](https://github.com/ultraq/icu-message-formatter/issues/14))

### 0.14.2
 - Fix types on the main exports too (tsc was being run over
   transpiled-for-browser code 🤦‍♂️)

### 0.14.1
 - Update generated types for some of the utility exports

### 0.14.0
 - On the road to making this pure ESM, the following internal changes have been
   made:
    - Added `"type": "module"` so ESM is now the default
    - Package outputs defined using an `exports` map w/ `import` pointing to the
      main source and `require` to a transpiled version of the source

### 0.13.0
 - Minimum supported version of Node is now 18
 - Browser target in `.browserslistrc` file is now `defaults`, so the explicit
   `ie11` target has been removed and thus IE11 support has been dropped
 - Type definitions are now included in this project

### 0.12.0
 - Dropped support for Node 10
 - Use [`Intl.Pluralrules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
   to add support for all of the plural keywords when using the
   [`pluralTypeHandler`](https://github.com/ultraq/icu-message-formatter#pluraltypehandler)
   ([#13](https://github.com/ultraq/icu-message-formatter/pull/13))
