/*!
 * Quantum - debug theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var _ = require('../utils')
  , inspect = require('../inspect');

/**
 * # default theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function (logger, event) {
  var color = logger._levels.colors[event.level]
    , ns = event.tokens.namespace
    , lvl = event.level
    , msg = event.msg

  var res = inspect(event).colorize() + '\n';

  return res;
};
