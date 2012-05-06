/*!
 * Quantum - utilities
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Main export
 */

var utils = module.exports = {};

/**
 * # colorize(str, color)
 *
 * Provides helper to frame string with fg color
 * for use in the cli.
 *
 * @param {String} string to colorize
 * @param {String} color
 * @api utilites
 */

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

/**
 * # highlight(str, color)
 *
 * Provides helper to frame string with bg color
 * for use in the cli.
 *
 * @param {String} string to colorize
 * @param {String} color
 * @api utilites
 */

utils.highlight = function (str, color) {
  var options = {
      red:      '\u001b[41m'
    , green:    '\u001b[42m'
    , yellow:   '\u001b[43m'
    , blue:     '\u001b[44m'
    , magenta:  '\u001b[45m'
    , cyan:     '\u001b[46m'
    , gray:     '\u001b[100m'
    , reset:    '\u001b[0m'
  };
  return options[color] + str + options.reset;
};

/**
 * # padBefore(str, width)
 *
 * Provides helper to frame string with spaces
 * before for use in the cli.
 *
 * @param {String} string to pad
 * @param {Number} width in characters
 * @api utilites
 */

utils.padBefore = function (str, width) {
  return Array(width - str.length).join(' ') + str;
};

/**
 * # padAfter(str, width)
 *
 * Provides helper to frame string with spaces
 * after for use in the cli.
 *
 * @param {String} string to pad
 * @param {Number} width in characters
 * @api utilites
 */

utils.padAfter = function (str, width) {
  return str + Array(width - str.length).join(' ');
};

/**
 * # mddir(path, mode, callback)
 *
 * Recursively create a folder structure given
 * a path. For use with the file transport.
 *
 * @param {String} path
 * @param {Number} file mode (0755 default)
 * @param {Function} callback
 * @api utilities
 */

utils.mkdir = function (_path, mode, callback) {
  var path = require('path')
    , fs = require('fs');

  if ('function' === typeof mode) {
    callback = mode;
    mode = 0755;
  }

  callback = callback || function () {};
  _path = path.resolve(_path);

  function _mkdir(p, next) {
    var _p = path.normalize(p).split('/');

    path.exists(p, function (exists) {
      if (!exists) {
        _mkdir(_p.slice(0, -1).join('/'), function (err) {
          if (err) next(err);
          fs.mkdir(p, mode, function () {
            next(null);
          });
        });
      } else {
        next(null);
      }
    });
  }

  _mkdir(_path, function(err) {
    if (err) callback(err);
    callback(null);
  });
};

/**
 * # isPathAbsolute
 *
 * Cross platform method to determin if a path
 * is absolute or relative.
 *
 * @param {String} path
 */

utils.isPathAbsolute = function (_path) {
  var abs = false;
  if ('/' == _path[0]) abs = true;
  if (':' == _path[1] && '\\' == _path[2]) abs = true;
  return abs;
};
