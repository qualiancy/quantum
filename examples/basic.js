var tea = require('..')
  , join = require('path').join;


var log = new tea.Logger({
    namespace: 'basic-logger'
  , levels: 'syslog'
  , transports: [
        'console'
      , { name: 'file'
        , path: join(__dirname, 'logs.log') }
    ]
});

log.log('Hello World');
log.info('This is info.');
log.debug('This is debug');
log.notice('this is a notice');
log.warning('this is a warning');
log.error('this is an error');
log.crit('This is critical!!');
log.alert('this is an alert');
log.emerg('this is an emergency');