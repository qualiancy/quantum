/*!
 * Quantum - npm theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * # npm theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, opts, cb) {
  var colorize = opts.colorize;
  var highlight = opts.highlight;
  var level = opts.level;
  var pr = opts.padRight;

  // keys
  var lvl = (obj.type.length <= 5)
      ? obj.type.toUpperCase()
      : obj.type.substring(0, 4).toUpperCase()
  var ns = obj.tokens.namespace
  var msg = opts.parse(obj.msg);

  // build result
  var res =
      highlight(ns, 'gray') + ' '
    + colorize(pr(lvl, 6), level.color) + ' '
    + colorize(msg, 'gray');

  cb(null, res);
};
