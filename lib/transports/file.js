var fs = require('fs')
  , Oath = require('oath');

module.exports = function (logger, spec) {
  var oath = new Oath()
    , stream;
  console.log(spec);
  if (spec.stream) {
    stream = spec.stream;
  } else if (spec.path) {
    stream = fs.createWriteStream(spec.path, { flags: 'a' });
  }

  for (var name in this.levels.levels) {
    bind(this, this.levels, name, stream);
  }

  oath.resolve({ name: 'file' });
  return oath.promise;
};

function bind(logger, levels, lvl, stream) {
  logger.on([ '*', lvl ], function (msg) {
    var message = '[' + lvl + '] ' + msg + '\n';
    stream.write(message, 'utf8');
  });
}
