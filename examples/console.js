var quantum = require('..');
var log = quantum('console');

log.pipe('theme', { theme: 'default' }).pipe(process.stdout);

log.debug('hello debug');
log.info('hello info');
log.warn('hello warn');
log.error('hello error');
log.fatal('hello fatal');
