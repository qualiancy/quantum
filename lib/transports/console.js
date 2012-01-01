var Oath = require('oath');

module.exports = function (logger, spec) {
  var oath = new Oath()
    , stream = process.stdout;

  spec = spec || {};

  for (var name in this.levels.levels) {
    bind(logger, name, stream, spec.theme || 'default');
  }

  oath.resolve({ name: 'console' });
  return oath.promise;
};

function bind(logger, lvl, stream, theme) {
  var stringify = require('../themes/' + theme);
  logger.on([ '*', lvl ], function (msg, data) {
    var str = stringify(logger, lvl, msg, data, logger.serializeTokens());
    stream.write(str);
  });
}