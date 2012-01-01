var fs = require('fs')
  , join = require('path').join
  , Oath = require('oath')
  , utils = require('../utils');

module.exports = function (logger, spec) {
  var oath = new Oath()
    , stream;

  if (spec.stream) {
    stream = spec.stream;

    for (var name in logger.levels.levels) {
      bind(logger, name, stream, spec.reporter || 'json');
    }

    oath.resolve({ name: 'file' });
  } else if (spec.path) {

    utils.mkdir(spec.path, 0755, function (err) {
      if (err) oath.rejct({ name: 'file', err: err });
      var filename = logger.namespace + '.log'
        , path = join(spec.path, filename);

      stream = fs.createWriteStream(path, { flags: 'a' } );

      for (var name in logger.levels.levels) {
        bind(logger, name, stream, spec.reporter || 'json');
      }

      oath.resolve({ name: 'file', path: path });
    });

  }

  return oath.promise;
};

function bind(logger, lvl, stream, theme) {
  var stringify = require('../reporters/' + reporter);
  logger.on([ 'log', '*', lvl ], function (msg, data) {
    var str = stringify(logger, lvl, msg, data, logger.serializeTokens());
    stream.write(str);
  });
}
