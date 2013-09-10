/*!
 * Quantum - clean theme
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * # clean theme
 *
 * @param {Logger} logger
 * @param {Object} event
 * @api theme
 */

module.exports = function(obj, opts, cb) {
  var time = new Date(obj.tokens.timestamp).toUTCString();
  var ns = obj.tokens.namespace;
  var lvl = obj.type;
  var msg = opts.parse(obj.msg);
  var res = ns + ' [' + time + '] ' + lvl + ': ' + msg;
  cb(null, res);
};
