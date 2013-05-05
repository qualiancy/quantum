global.chai = require('chai');
global.should = chai.should();

global.chai.use(require('chai-spies'));

global.quantum = require('../..');

/*!
 * Mock Streams
 */

global.MockWritable = require('./writable');
global.MockReadable = require('./readable');

function req (name) {
  return process.env.QUANTUM_COV
    ? require('../../lib-cov/quantum/' + name)
    : require('../../lib/quantum/' + name);
}

global.__quantum = {
    
}