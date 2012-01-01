var utils = require('../utils');

module.exports = function (logger, level, message, data, tokens) {
  var color = logger.levels.colors[level];
  return utils.colorize(utils.padBefore('[' + level + '] ', 14), color) + message + '\n';
};