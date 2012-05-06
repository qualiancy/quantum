module.exports = (process && process.env && process.env.QUANTUM_COV)
  ? require('./lib-cov/quantum')
  : require('./lib/quantum');
