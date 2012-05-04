module.exports = (process && process.env && process.env.TEA_COV)
  ? require('./lib-cov/tea')
  : require('./lib/tea');
