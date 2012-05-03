module.exports = function (logger, level, message, data, tokens) {
  var time = new Date(tokens.date).toUTCString();
  return tokens.namespace + ' [' + time + '] ' + level + ': ' + message + '\n';
};
