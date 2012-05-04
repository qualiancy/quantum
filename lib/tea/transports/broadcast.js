var Promise = require('oath')
  , orchid = require('orchid');

module.exports = function logBroadcast (address, spec) {
  spec = spec || {};

  return function logBroadcast (logger) {
    var defer = new Promise()
      , client = new orchid.Client(address);

    // wait for client to listen
    client.on('open', function () {
      var useLevels = spec.levels || Object.keys(logger.levels.levels);

      // mount listeners
      useLevels.forEach(function (name) {
        logger.on([ 'log', '*', name ], function (event) {
          client.emit([ 'tea', 'log' ], event);
        });
      });

      defer.resolve();
    });

    return defer.promise;
  };
};
