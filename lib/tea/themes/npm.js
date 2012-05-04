var _ = require('../utils');

module.exports = function (logger, spec) {
  var color = logger.levels.colors[spec.lvl]
    , lvl = (spec.lvl.length <= 5)
      ? spec.lvl.toUpperCase()
      : spec.lvl.substring(0, 4).toUpperCase()
    , ns = spec.tokens.namespace
    , msg = spec.msg;

  var res =
      _.highlight(ns, 'gray') + ' '
    + _.colorize(_.padAfter(lvl, 8), color)
    + _.colorize(msg, 'gray')
    + '\n';

  return res;
};
