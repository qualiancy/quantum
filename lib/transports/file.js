var fs = require('fs')
  , join = require('path').join
  , Oath = require('oath');

module.exports = function (logger, spec) {
  var oath = new Oath()
    , stream;

  if (spec.stream) {
    stream = spec.stream;
  } else if (spec.path) {
    stream = fs.createWriteStream(
        join(spec.path, logger.namespace + '.log')
      , { flags: 'a' } );
  }

  for (var name in logger.levels.levels) {
    bind(logger, name, stream, spec.theme || 'json');
  }

  oath.resolve({ name: 'file' });
  return oath.promise;
};

function bind(logger, lvl, stream, theme) {
  var stringify = require('../themes/' + theme);
  logger.on([ '*', lvl ], function (msg, data) {
    var str = stringify(logger, lvl, msg, data, logger.serializeTokens());
    stream.write(str);
  });
}
