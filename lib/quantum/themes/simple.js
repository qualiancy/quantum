/*!
 * Quantum - simple theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * # simple theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, opts, cb) {
  var colorize = opts.colorize;
  var level = opts.level;
  var pl = opts.padLeft;

  // keys
  var lvl = obj.type;
  var msg = opts.parse(obj.msg, colorize);

  // build result
  var res =
      colorize(pl(lvl + ':', 8), level.color)
    + ' ' + msg;

  // send back
  cb(null, res);
};
