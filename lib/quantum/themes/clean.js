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

module.exports = function (logger, event) {
  var time = new Date(event.tokens.timestamp).toUTCString()
    , ns = event.tokens.namespace
    , lvl = event.level
    , msg = event.msg;

  return ns + ' [' + time + '] ' + lvl + ': ' + msg + '\n';
};
