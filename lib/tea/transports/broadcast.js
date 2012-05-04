/*!
 * tea - broadcast transport
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var Promise = require('oath')
  , orchid = require('orchid');

/**
 * Broadcast (WS) logging transport. Uses websocket compliant client.
 * Recommend setting up tea.createService for proxying to storage.
 *
 *    log.use(tea.broadcast('ws://localhost:5000'));
 *    log.use(tea.broadcast('ws://localhost:5000, {
 *      levels: [ 'warn', 'crit', 'error' ]
 *    });
 *
 * Options
 * - levels {Array} only log these levels to the console (default is all)
 *
 * @param {Object} specification
 * @api middleware
 */

module.exports = function logBroadcast (address, spec) {
  spec = spec || {};

  return function logBroadcast (logger) {
    var defer = new Promise()
      , client = new orchid.Client(address);

    // wait for client to listen
    client.on('open', function () {
      var useLevels = spec.levels || Object.keys(logger.levels.levels);

      function sendEvent (event) {
        if (~useLevels.indexOf(event.level))
          client.emit([ 'tea', 'log' ], event);
      }

      defer.resolve({ type: 'write', write: sendEvent });
    });

    return defer.promise;
  };
};
