/*!
 * Quantum - simple theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var _ = require('../utils');

/**
 * # simple theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function (logger, event) {
  var color = logger._levels.colors[event.level]
    , lvl = event.level
    , msg = event.msg

  var res =
      _.colorize(_.padAfter(lvl + ':', 8), color)
    + ' '
    + msg
    + '\n';

  return res;
};
