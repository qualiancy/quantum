module.exports = function (spec) {
  var stream = spec.stream;
  console.log(stream);
  for (var name in this.levels.levels) {
    bind(this, this.levels, name, stream);
  }
};

function bind(logger, levels, lvl,stream) {
  logger.on([ '*', lvl ], function (msg) {
    var message = '[' + lvl + '] ' + msg + '\n';
    stream.write(message, 'utf8');
  });
}
