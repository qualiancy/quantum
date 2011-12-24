var tea = require('..');


var log = new tea.Logger({
    namespace: 'basic-logger'
  , transports: [
        { name: 'console'
        , levels: 'syslog' }
      , { name: 'file'
        , levels: 'syslog'
        , path: __dirname + '/logs.log' }
    ]
});


console.log(log);

log.log('Hello World');