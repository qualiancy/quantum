/*!
 * Quantum- console transport
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var Promise = require('oath');

/**
 * Console logging transport.
 *
 *    log.use(quantum.console());
 *    log.use(quantum.console({
 *        theme: 'npm'
 *      , levels: [ 'warn', 'crit', 'error' ]
 *    });
 *
 * Options
 * - theme {String} stylize the output (default is "default")
 * - levels {Array} only log these levels to the console (default is all)
 *
 * @param {Object} specification
 * @api middleware
 */

module.exports = function logConsole (spec) {
  spec = spec || {};
  var theme = 'function' === typeof spec.theme
    ? spec.theme
    : require('../themes')[spec.theme || 'default'];

  return function logConsole (logger) {
    var defer = new Promise()
      , stream = process.stdout
      , useLevels = spec.levels || null
      , excludeLevels = spec.exclude || [];

    function useLevel (event) {
      if (~excludeLevels.indexOf(event.level))
        return false;
      if (useLevels && !~useLevels.indexOf(event.level))
        return false;
      return true;
    }

    function writeConsole (event) {
      if (useLevel(event)) {
        var str = theme(logger, event);
        stream.write(str);
      }
    }

    defer.resolve({ type: 'write', write: writeConsole });
    return defer.promise;
  };
};
