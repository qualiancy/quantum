var extend = require('tea-extend');
var roundabout = require('roundabout');
var transmute = require('transmute');
var tty = require('tty');

var IS_TTY = tty.isatty(1) && tty.isatty(2);

var DEFAULTS = {
    serialize: true
  , stringify: true
  , theme: 'default'
};

module.exports = function createConsoleStream(createStream, argv) {
  var options = extend({}, DEFAULTS, argv[0] || {});
  var stream = roundabout();

  if (options.stringify) {
    var theme = extend({}, options, { colorize: IS_TTY });
    var stringify = createStream('theme', theme);
    stream.use(stringify);
  }

  stream.pipe(process.stdout);

  return stream;
};
