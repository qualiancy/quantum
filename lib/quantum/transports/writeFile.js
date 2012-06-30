/*!
 * Quantum- file transport
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var fs = require('fsagent')
  , join = require('path').join
  , Promise = require('oath');

/**
 * File logging transport.
 *
 *    log.use(quantum.console(__dirname));
 *    log.use(quantum.console(__dirname + '/logs', {
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
  var theme = require('../themes')[spec.theme || 'json'];

  return function logFile (logger) {
    var defer = new Promise();

    // recursively make directories to log file
    fs.mkdirp(path, 0755, function (err) {
      if (err) return defer.reject(err);
      var filename = spec.filename || logger._opts.namespace + '.log'
        , file = join(path, filename)
        , stream = fs.createWriteStream(file, { flags: 'a' } )
        , useLevels = spec.levels || null
        , excludeLevels = spec.exclude || [];

      function useLevel (event) {
        if (~excludeLevels.indexOf(event.level))
          return false;
        if (useLevels && !~useLevels.indexOf(event.level))
          return false;
        return true;
      }

      function writeFile (event) {
        if (useLevel(event)) {
          var str = theme(logger, event);
          stream.write(str);
        }
      }

      defer.resolve({ type: 'write', write: writeFile });
    });

    return defer.promise;
  };
};
