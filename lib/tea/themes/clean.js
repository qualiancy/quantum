/*!
 * tea - clean theme
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
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
  var time = new Date(event.tokens.date).toUTCString()
    , ns = event.tokens.namespace
    , lvl = event.lvl
    , msg = event.msg;

  return ns + ' [' + time + '] ' + lvl + ': ' + msg + '\n';
};
