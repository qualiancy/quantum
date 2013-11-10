var extend = require('tea-extend');
var fs = require('fs');
var roundabout = require('roundable');
var transmute = require('transmute');

var DEFAULTS = {
    serialize: true
  , stringify: true
  , theme: 'json'
};

module.exports = function createFileStream(createStream, argv) {
  var options = extend({}, DEFAULTS, argv[1] || {});
  var path = argv[0];
  var stream = roundabout();

  if (!path || 'string' !== typeof path) {
    var err = new TypeError('filestream expected a stringed path as the first argument');
    return stream.emit('error', err);
  }

  if (options.stringify) {
    var theme = extend({}, options, { colorize: false });
    var stringify = createStream('theme', theme);
    stream.use(stringify);
  }

  var fd = fs.createWriteStream(options.path, { flags: 'r+' });
  stream.pipe(fd);

  return stream;
};
