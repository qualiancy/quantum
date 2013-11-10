var loadStream = require('refractory')(module, '.');

module.exports = function createStream(name) {
  var argv = [].slice.call(arguments, 1);
  var stream = loadStream('quantum-stream-' + name, 'quantum-' + name, name);
  return stream(createStream, argv);
};
