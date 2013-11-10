/*!
 * Quantum - simple theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var levels = require('../levels');

/**
 * # simple theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, util, cb) {
  var colorize = util.colorize;
  var pl = util.padLeft;

  // keys
  var color = levels[obj.level][1];
  var name = levels[obj.level][0];
  var msg = util.parse(obj.message, colorize);

  // build result
  var res = ''
    + colorize(pl(name+ ':', 8), color)
    + ' ' + msg;

  // send back
  cb(null, res);
};
