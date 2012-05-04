module.exports = function (logger, spec) {
  var time = new Date(spec.tokens.date).toUTCString()
    , ns = spec.tokens.namespace
    , lvl = spec.lvl
    , msg = spec.msg;

  return ns + ' [' + time + '] ' + lvl + ': ' + msg + '\n';
};
