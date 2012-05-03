var Promise = require('oath');

module.exports = function (spec) {
  spec = spec || {};
  var theme = require('../themes')[spec.theme || 'default'];

  return function (logger) {
    var defer = new Promise()
      , stream = process.stdout
      , useLevels = spec.levels || Object.keys(logger.levels.levels);

    // mount the listeners
    useLevels.forEach(function (name) {
      logger.on([ 'log', '*', name ], function (msg, data, tokens) {
        var str = theme(logger, name, msg, data, tokens);
        stream.write(str);
      });
    });

    defer.resolve();
    return defer.promise;
  }
};
