/*!
 * tea - file transport
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fs')
  , join = require('path').join
  , Promise = require('oath')
  , _ = require('../utils');

/**
 * File logging transport.
 *
 *    log.use(tea.console(__dirname));
 *    log.use(tea.console(__dirname + '/logs', {
 *        theme: 'json'
 *      , levels: [ 'warn', 'crit', 'error' ]
 *    });
 *
 * Options
 * - theme {String} stylize the output (default is "json")
 * - levels {Array} only log these levels to the console (default is all)
 *
 * @param {Object} specification
 * @api middleware
 */

module.exports = function logFile (path, spec) {
  spec = spec || {};
  var theme = require('../themes')[spec.reporter || 'json'];

  return function logFile (logger) {
    var defer = new Promise();

    // recursively make directories to log file
    _.mkdir(path, 0755, function (err) {
      if (err) return defer.reject(err);
      var filename = spec.filename || logger.namespace + '.log'
        , file = join(path, filename)
        , stream = fs.createWriteStream(file, { flags: 'a' } )
        , useLevels = spec.levels || Object.keys(logger.levels.levels);

      function writeFile (event) {
        if (~useLevels.indexOf(event.level)) {
          var str = theme(logger, event);
          stream.write(str);
        }
      }

      defer.resolve({ type: 'write', write: writeFile });
    });

    return defer.promise;
  };
};
