module.exports = function (logger, level, message, data, tokens) {
  var res = {};

  res.level = logger.levels.levels[level];
  res.levelStr = level;
  res.date = tokens.date;
  res.message = message;
  res.data = data;

  delete tokens.date;

  res.tokens = tokens;

  return JSON.stringify(res) + '\n';
};