/*!
 * tea - npm theme
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var _ = require('../utils');

/**
 * # npm theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function (logger, event) {
  var color = logger.levels.colors[event.lvl]
    , lvl = (event.lvl.length <= 5)
      ? event.lvl.toUpperCase()
      : event.lvl.substring(0, 4).toUpperCase()
    , ns = event.tokens.namespace
    , msg = event.msg;

  var res =
      _.highlight(ns, 'gray') + ' '
    + _.colorize(_.padAfter(lvl, 8), color)
    + _.colorize(msg, 'gray')
    + '\n';

  return res;
};
