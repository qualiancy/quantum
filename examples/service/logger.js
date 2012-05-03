var tea = require('../..')
  , log = new tea.Logger('service-logger');

log.use(tea.service('ws://localhost:5000'));
log.init();

log.log('info', 'Tea please!');
log.info('This is info.');
log.debug('This is debug.');
log.notice('This is a notice.');
log.warn('This is a warning.', { code: 'testing' });
log.error('This is an error.');
log.crit('This is critical!!');
log.alert('This is an alert.');
log.emerg('This is an emergency.');

log.on('ready', function () {
  process.exit();
});
