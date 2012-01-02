var tea = require('..')
  , join = require('path').join;

var log = new tea.Logger({
    namespace: 'file-logger'
  , levels: 'syslog'
  , transports: [
        { file: {
            path: join(__dirname) }
        }
    ]
});

log.log('info', 'Tea please!');
log.info('This is info.');
log.debug('This is debug.');
log.notice('This is a notice.');
log.warn('This is a warning.');
log.error('This is an error.');
log.crit('This is critical!!');
log.alert('This is an alert.');
log.emerg('This is an emergency.');