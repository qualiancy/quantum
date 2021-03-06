var Quantum = require('..')
  , log = Quantum('file-logger');

log.use(Quantum.writeFile(__dirname));
log.start();

log.write('info', 'Tea please!');
log.info('This is info.');
log.debug('This is debug.');
log.notice('This is a notice.');
log.warn('This is a warning.');
log.error('This is an error.');
log.crit('This is critical!!');
log.alert('This is an alert.');
log.emerg('This is an emergency.');
