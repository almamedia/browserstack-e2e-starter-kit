/*
 * Expose all test suites as commonjs module object
 * =============================================================================
 * - implements https://www.npmjs.org/package/require-directory
 */
var requireDirectory = require('require-directory');
module.exports = requireDirectory(module);
