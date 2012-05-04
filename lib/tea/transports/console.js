var Promise = require('oath');

module.exports = function logConsole (spec) {
  spec = spec || {};
  var theme = require('../themes')[spec.theme || 'default'];

  return function logConsole (logger) {
    var defer = new Promise()
      , stream = process.stdout
      , useLevels = spec.levels || Object.keys(logger.levels.levels);

    // mount the listeners
    useLevels.forEach(function (name) {
      logger.on([ 'log', '*', name ], function (event) {
        var str = theme(logger, event);
        stream.write(str);
      });
    });

    defer.resolve();
    return defer.promise;
  };
};
