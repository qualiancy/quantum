var _ = require('../utils');

module.exports = function (logger, level, message, data, tokens) {
  var color = logger.levels.colors[level];
  return _.colorize('[' + logger.namespace + '] ', 'gray') + _.colorize(_.padAfter(level, 10), color) + message + '\n';
};