var tea = require('../..')
  , log = new tea.Logger('service-example');

log.use(tea.console());
log.init();

var service = tea.createService(log);

service.listen(5000, function () {
  log.info('Tea service started on port 5000');
});
