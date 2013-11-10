var loadStream = require('refractory')(module, '.');

module.exports = function createStream(name) {
  var argv = [].slice.call(arguments, 1);
  try {
  var stream = loadStream('quantum-stream-' + name, 'quantum-' + name, name);
  } catch (err) {
    console.log(err.paths);
    throw err;
  }
  return stream(createStream, argv);
};
