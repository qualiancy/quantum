var Quantum = require('../..')
  , log = Quantum('service-logger');

log.use(Quantum.broadcast('ws://localhost:5000'));
log.start();

log.write('info', 'Tea please!');
log.info('This is info.');
log.debug('This is debug.');
log.notice('This is a notice.');
log.warn('This is a warning.', { code: 'testing' });
log.error('This is an error.');
log.crit('This is critical!!');
log.alert('This is an alert.');
log.emerg('This is an emergency.');

var logger = log.clone('service-clone').start();

logger.write('info', 'Tea please!');
logger.info('This is info.');
logger.debug('This is debug.');
logger.notice('This is a notice.');
logger.warn('This is a warning.', { code: 'testing' });
logger.error('This is an error.');
logger.crit('This is critical!!');
logger.alert('This is an alert.');
logger.emerg('This is an emergency.');

setTimeout(process.exit, 100);
