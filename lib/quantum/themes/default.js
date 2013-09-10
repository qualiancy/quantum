/*!
 * Quantum - default theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * # default theme
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
  var ns = obj.tokens.namespace
  var lvl = obj.type
  var msg = opts.parse(obj.msg);
  var time = new Date(obj.tokens.timestamp)
  var hour = (time.getHours().toString().length == 1)
      ? '0' + time.getHours().toString()
      : time.getHours().toString()
  var minute = (time.getMinutes().toString().length == 1)
      ? '0' + time.getMinutes().toString()
      : time.getMinutes().toString()
  var second = (time.getSeconds().toString().length == 1)
      ? '0' + time.getSeconds().toString()
      : time.getSeconds().toString()

  // build result;
  var res = colorize(hour + ':' + minute + ':' + second, 'gray');
  res += ' [' + ns + '] ';
  res += colorize(pl(lvl, 10), level.color);
  res += colorize(msg, 'gray');

  // send back
  cb(null, res);
};
