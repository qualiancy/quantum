var Quantum = require('..');

console.log('');

var logger = Quantum('my-app');
logger.use(Quantum.console());
logger.start();

var log = logger.clone('my-clone').start();

log.debug('this is a test');
