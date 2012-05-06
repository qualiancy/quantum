/*!
 * Quantum - default theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var _ = require('../utils');

/**
 * # default theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function (logger, event) {
  var color = logger._levels.colors[event.level]
    , time = new Date(event.tokens.timestamp)
    , hour = (time.getHours().toString().length == 1)
      ? '0' + time.getHours().toString()
      : time.getHours().toString()
    , minute = (time.getMinutes().toString().length == 1)
      ? '0' + time.getMinutes().toString()
      : time.getMinutes().toString()
    , second = (time.getSeconds().toString().length == 1)
      ? '0' + time.getSeconds().toString()
      : time.getSeconds().toString()
    , ns = event.tokens.namespace
    , lvl = event.level
    , msg = event.msg

  var res =
      _.colorize(hour
        + ':' + minute
        + ':' + second, 'gray')
    + ' [' + ns + '] '
    + _.colorize(_.padAfter(lvl, 10), color)
    + _.colorize(msg, 'gray')
    + '\n';

  return res;
};
