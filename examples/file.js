var tea = require('..')
  , join = require('path').join
  , stream = require('fs').createWriteStream(join(__dirname, 'log.txt'), { flags: 'a' }); // flag a to `append`

var log = new tea.Logger({
    namespace: 'basic-logger'
  , levels: 'syslog'
  , transports: [
        { name: 'file'
        , stream: stream }
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