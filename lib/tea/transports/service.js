var Promise = require('oath')
  , orchid = require('orchid');

module.exports = function (address, spec) {
  spec = spec || {};
  var theme = require('../themes')['json'];

  return function (logger) {
    var defer = new Promise()
      , client = new orchid.Client(address);

    // wait for client to listen
    client.on('open', function () {
      var useLevels = spec.levels || Object.keys(logger.levels.levels);

      // mount listeners
      useLevels.forEach(function (name) {
        logger.on([ 'log', '*', name ], function (msg, data, tokens) {
          var str = theme(logger, name, msg, data, tokens)
            , obj = JSON.parse(str);
          client.emit([ 'tea', 'log' ], obj);
        });
      });

      defer.resolve({ name: 'service' });
    });

    return defer.promise;
  }
};
