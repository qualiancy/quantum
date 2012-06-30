/*!
 * Quantum - emitter write transport
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var Drip = require('drip')
  , Promise = require('oath');

/**
 * Emitter logging transport.
 *
 *    log.use(quantum.console());
 *    log.use(quantum.console({
 *      levels: [ 'warn', 'crit', 'error' ]
 *    });
 *
 * Options
 * - levels {Array} only log these levels to the console (default is all)
 *
 * @param {Object} specification
 * @api middleware
 */

module.exports = function logEmitter (spec) {
  spec = spec || {};

  var emitter = new Drip();

  emitter.handle = function (logger) {
    var defer = new Promise()
      , useLevels = spec.levels || null
      , excludeLevels = spec.exclude || [];

    function useLevel (event) {
      if (~excludeLevels.indexOf(event.level)
      || (useLevels && !~useLevels.indexOf(event.level))) {
        return false;
      }

      return true;
    }

    function writeEmitter (event) {
      if (useLevel(event)) {
        emitter.emit('event', event);
      }
    }

    defer.resolve({ type: 'write', write: writeEmitter });
    return defer.promise;
  };

  return emitter;
};
