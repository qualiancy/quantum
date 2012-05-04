/*!
 * tea - console transport
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var Promise = require('oath');

/**
 * Console logging transport.
 *
 *    log.use(tea.console());
 *    log.use(tea.console({
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
  var theme = require('../themes')[spec.theme || 'default'];

  return function logConsole (logger) {
    var defer = new Promise()
      , stream = process.stdout
      , useLevels = spec.levels || Object.keys(logger.levels.levels);

    // mount the listeners
    useLevels.forEach(function (name) {
      logger.on([ 'log', '*', name ], function (event) {
        var str = theme(logger, event);
        stream.write(str);
      });
    });

    defer.resolve();
    return defer.promise;
  };
};
