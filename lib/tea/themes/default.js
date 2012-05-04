var _ = require('../utils');

module.exports = function (logger, spec) {
  var color = logger.levels.colors[spec.lvl]
    , time = new Date(spec.tokens.date)
    , ns = spec.tokens.namespace
    , lvl = spec.lvl
    , msg = spec.msg

  var res =
      _.colorize(time.getHours()
        + ':' + time.getMinutes()
        + ':' + time.getSeconds(), 'gray')
    + ' [' + ns + '] '
    + _.colorize(_.padAfter(lvl, 10), color)
    + _.colorize(msg, 'gray')
    + '\n';

  return res;
};
