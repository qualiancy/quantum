/*!
 * Quantum - broadcast transport
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var Promise = require('oath')
  , orchid = require('orchid');

/**
 * Broadcast (WS) logging transport. Uses websocket compliant client.
 * Recommend setting up quantum.createService for proxying to storage.
 *
 *    log.use(quantum.broadcast('ws://localhost:5000'));
 *    log.use(quantum.broadcast('ws://localhost:5000, {
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
      , client = new orchid.Client(address)
      , useLevels = spec.levels || null
      , excludeLevels = spec.exclude || []
      , active = false
      , sendQueue = [];

    function useLevel (event) {
      if (~excludeLevels.indexOf(event.level))
        return false;
      if (useLevels && !~useLevels.indexOf(event.level))
        return false;
      return true;
    }

    function sendEvent (event) {
      if (!active) return sendQueue.push(event);
      if (useLevel(event)) client.emit([ 'quantum', 'log' ], event);
    }

    // wait for client to listen
    client.on('open', function () {
      active = true;
      sendQueue.forEach(function (ev) { sendEvent(ev); });
    });

    defer.resolve({ type: 'write', write: sendEvent });
    return defer.promise;
  };
};
