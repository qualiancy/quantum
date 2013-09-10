
var inherits = require('util').inherits;
var Transform = require('stream').Transform;


var utils = require('../utils');
var themes = require('../themes');

module.exports = ThemeStream;

function ThemeStream(opts) {
  if (!(this instanceof ThemeStream)) return new ThemeStream(opts);
  Transform.call(this, { objectMode: true, highWaterMark: 1 });

  if ('string' === typeof opts) opts = { theme: opts };
  opts = opts || {};

  this._opts = {};
  this._opts.theme = opts.theme || 'default';
  this._opts.colors = opts.colors || true;
  this._opts.levelset = utils.levelsets(opts.levels);
}

inherits(ThemeStream, Transform);

ThemeStream.prototype._transform = function(obj, enc, cb) {
  var theme = this._opts.theme;
  var themize = 'string' === typeof theme ? themes[theme] : theme;

  if ('function' !== typeof themize) {
    var err = new Error('Theme not a function.');
    return cb(err);
  }

  var colors = this._opts.colors;
  var levelset = this._opts.levelset;

  var opts = {};
  opts.level = levelset.byName(obj.type);

  // handle bad level
  if (!opts.level) {
    var err = new Error('Level ' + opts.name + ' not in levelset.');
    return cb(err);
  }

  // use colorizes
  opts.colorize = function(str, color) {
    if (false === colors) {
      return str;
    } else if ('function' === typeof colors) {
      return colors(str, color);
    } else {
      return utils.colorize(str, color);
    }
  };

  // use hightlights
  opts.highlight = function(str, color) {
    if (false === colors) {
      return str;
    } else if ('function' === typeof colors) {
      return colors(str, color);
    } else {
      return utils.highlight(str, color);
    }
  };

  // few more
  opts.padRight = utils.padRight;
  opts.padLeft = utils.padLeft;

  // parse message
  opts.parse = function(str, colorize) {
    return utils.parseFormat(str, colorize);
  };

  // go!
  themize(obj, opts, function(err, message) {
    if (err) return cb(err);
    cb(null, message + '\n');
  });
};
