/*!
 * Quantum - default theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

var levels = require('../levels');

/**
 * # default theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, util, cb) {
  var colorize = util.colorize;
  var pl = util.padLeft;

  // keys
  var ns = obj.name
  var color = levels[obj.level][1];
  var level = levels[obj.level][0]
  var msg = util.parse(obj.message);

  // time
  var time = new Date(obj.ts)
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
  res += colorize(pl(level, 10), color);
  res += colorize(msg, 'gray');

  // send back
  cb(null, res);
};
