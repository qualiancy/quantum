
var extend = require('tea-extend');
var join = require('path').join;
var refractory = require('refractory');
var roundabout = require('roundabout');
var transmute = require('transmute');

var load = refractory(module, '../themes');
var utils = require('../utils');

var DEFAULTS = {
    serialize: true
  , theme: 'json'
};

module.exports = function createThemeStream(createStream, argv) {
  var options = extend({}, DEFAULTS, argv[0] || {});
  var stream = roundabout();

  if (options.serialize) {
    var serialize = createStream('serialize');
    stream.use(serialize);
  }

  var theme = createTheme(options);
  stream.use(theme);

  return stream;
};

function createTheme(options) {
  var theme = load(options.theme);
  var util = utility(options);

  return transmute({
      writable: { objectMode: true, highWaterMark: 1 }
    , transform: transform(theme, util)
  });
}

function utility(options) {
  var util = {};

  // basics
  util.padRight = utils.padRight;
  util.padLeft = utils.padLeft;

  // parse message
  util.parse = function(str, colorize) {
    return utils.parseFormat(str, colorize);
  };

  // use colorizes
  util.colorize = function(str, color) {
    if (false === options.colorize) {
      return str;
    } else if ('function' === typeof options.colorize) {
      return options.colorize(str, color);
    } else {
      return utils.colorize(str, color);
    }
  };

  // use hightlights
  util.highlight = function(str, color) {
    if (false === options.colorize) {
      return str;
    } else if ('function' === typeof options.highlight) {
      return options.highlight(str, color);
    } else {
      return utils.highlight(str, color);
    }
  };

  return util;
}

function transform(theme, util) {
  return function themeTransform(obj, enc, cb) {
    theme(obj, util, function(err, string) {
      if (err) return cb(err);
      cb(null, string + '\n');
    });
  }
}
