/*!
 * tea - default theme
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
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
  var color = logger.levels.colors[event.level]
    , time = new Date(event.tokens.timestamp)
    , ns = event.tokens.namespace
    , lvl = event.level
    , msg = event.msg

  var res =
      _.colorize(time.getHours()
        + ':' + time.getMinutes()
        + ':' + time.getSeconds(), 'gray')
    + ' [' + ns + '] '
    + _.colorize(_.padAfter(lvl, 10), color)
    + _.colorize(msg, 'gray')
    + '\n';

  return res;
};
