/*!
 * Quantum - utilities
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module Dependancies
 */

var tty = require('tty')
  , Filtr = require('filtr');

/*!
 * isTTY (can support color)
 */

var istty = tty.isatty(1) && tty.isatty(2);

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
 * parseMessage (event)
 *
 * This will take a constructed event perform the following
 * replacements:
 *
 * - #{hello.universe} -> use `hello.universe` value from data
 * - ::namspace -> use token `namespace`. works for all tokens
 * - [string](color) -> to colorize the string for cli
 *
 * @param {Object} event
 * @return event modified
 * @api utilites
 */

utils.parseMessage = function (event) {
  event.msg = event.msg
    .replace(/#\{(.*?)\}/g, function (match, path) {
      return Filtr.getPathValue(path, event._).toString();
    })
    .replace(/::([\d\w]+)/g, function (match, token) {
      return event.tokens[token];
    })
    .replace(/\[(.*?)\]\((\w+)\)/g, function (match, str, color) {
      return utils.colorize(str, color);
    });

  return event;
};
