var Oath = require('oath');

module.exports = function () {
  var oath = new Oath();

  for (var name in this.levels.levels) {
    bind(this, this.levels, name);
  }

  oath.resolve({ name: 'console' });
  return oath.promise;
};

function bind(logger, levels, lvl) {
  var color = levels.colors[lvl];
  logger.on([ '*', lvl ], function (msg) {
    var message = colorize(pad('[' + lvl + '] ', 12), color) + msg;
    console.log(message);
  });
}

function colorize(str, color) {
  var options = {
      'red': '\u001b[31m'
    , 'green': '\u001b[32m'
    , 'yellow': '\u001b[33m'
    , 'blue': '\u001b[34m'
    , 'magenta': '\u001b[35m'
    , 'cyan': '\u001b[36m'
    , 'gray': '\u001b[90m'
    , 'reset': '\u001b[0m'
  };
  return options[color] + str + options['reset'];
};

function pad(str, width) {
  return Array(width - str.length).join(' ') + str;
}