/*!
 * Quantum - utilities
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module Dependancies
 */

var properties = require('tea-properties');
var tty = require('tty');

/*!
 * isTTY (can support color)
 */

var istty = tty.isatty(1) && tty.isatty(2);


var levels = require('./levels');
var LevelSet = require('./levelset');

exports.levelsets = function (levelset) {
  if (!levelset) return levels['syslog'];

  if ('string' === typeof levelset) {
    levelset = levels[levelset];
  }

  if (!levelset || !(levelset instanceof LevelSet)) {
    var name = 'string' === typeof opts.levels ? opts.levels : 'undefined';
    var msg = 'LevelSet "' + name + '" not available.';
    throw new ReferenceError(msg);
  }

  return levelset;
}
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

exports.colorize = function(str, color) {
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

  if (!istty) {
    return str;
  } else {
    return options[color] + str + options.reset;
  }
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

exports.highlight = function(str, color) {
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

  if (!istty) {
    return str;
  } else {
    return options[color] + str + options.reset;
  }
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

exports.padRight = function(str, width) {
  var len = width - str.length;
  if (len < 1) len = 1
  return Array(len).join(' ') + str;
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

exports.padLeft = function(str, width) {
  var len = width - str.length;
  if (len < 1) len = 1
  return str + Array(len).join(' ');
};

exports.parseValues = function(msg, data) {
  return msg.replace(/#\{(.*?)\}/g, function(match, path) {
    var value = properties.get(data, path);
    return value.toString();
  });
};

exports.parseTokens = function(msg, tokens) {
  return msg.replace(/::([\d\w]+)/g, function(match, token) {
    var value = tokens[token];
    return value;
  });
};

exports.parseFormat = function(msg, fn) {
  return msg.replace(/\[(.*?)\]\((\w+)\)/g, function(match, str, color) {
    if (!fn) return str;
    return fn(str, color);
  });
};
