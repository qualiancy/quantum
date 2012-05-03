var Promise = require('oath')
  , reporters = require('../reporters');

module.exports = function (spec) {
  spec = spec || {};

  return function (logger) {
    var defer = new Promise()
      , stream = process.stdout
      , useLevels = spec.levels || Object.keys(logger.levels.levels)
      , stringify = reporters[spec.theme || 'default'];

    // mount the listeners
    useLevels.forEach(function (name) {
      logger.on([ 'log', '*', name ], function (msg, data, tokens) {
        var str = stringify(logger, name, msg, data, tokens);
        stream.write(str);
      });
    });

    defer.resolve();
    return defer.promise;
  }
};
