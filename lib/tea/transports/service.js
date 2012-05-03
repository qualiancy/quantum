var Promise = require('oath')
  , orchid = require('orchid')
  , json = require('../reporters')['json'];

module.exports = function (address, spec) {
  spec = spec || {};

  return function (logger) {
    var defer = new Promise()
      , client = new orchid.Client(address);

    // wait for client to listen
    client.on('open', function () {
      var useLevels = spec.levels || Object.keys(logger.levels.levels);

      // mount listeners
      useLevels.forEach(function (name) {
        logger.on([ 'log', '*', name ], function (msg, data, tokens) {
          var obj = JSON.parse(json(logger, name, msg, data, tokens));
          client.emit([ 'tea', 'log' ], obj);
        });
      });

      defer.resolve({ name: 'service' });
    });

    return defer.promise;
  }
};
