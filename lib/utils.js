
var utils = module.exports = {};

utils.colorize = function (str, color) {
  var options = {
      red:      '\u001b[31m'
    , green:    '\u001b[32m'
    , yellow:   '\u001b[33m'
    , blue:     '\u001b[34m'
    , magenta:  '\u001b[35m'
    , cyan:     '\u001b[36m'
    , gray:     '\u001b[90m'
    , reset:    '\u001b[0m'
  };
  return options[color] + str + options.reset;
};

utils.padBefore = function (str, width) {
  return Array(width - str.length).join(' ') + str;
};

utils.padAfter = function (str, width) {
  return str + Array(width - str.length).join(' ');
};