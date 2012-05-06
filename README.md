# Quantum

> quantum - n. - A discrete quantity of energy proportional in magnitude to the frequency of the radiation it represents.

## Installation

Quantum is available through [npm](http://npmjs.org).

      npm install quantum

## Getting Started

### API

To get started using Quantum in your application, creata a new logger and tag it with a namespace. Before
logging anything you will need to select the log levels to be bound to your log instance, and indicate
any number of transports you wish you use. Here are a few examples.

```js
var quantum = require('quantum')
  , log = quantum('my-app');

// Basic console logging.

log
 .levels('syslog')
 .use(quantum.console({ theme: 'default' })
 .start();

// Environment based configuration.

log.configure('development', function () {
  log
    .use(quantum.console())
    .use(quantum.writeFile(__dirname + '/dev-logs'));
});

log.configure('production', function () {
  var logopts = { exclude: [ 'debug' ] };
  log
    .use(quantum.writeFile(__dirname + '/prod-logs', logopts))
    .use(quantum.broadcast('ws://logger.my-app.com', logopts));
});

log.start();

// Log something!

log.write('info', 'You really should know about this', { foo: 'bar' });
log.info('You really should know about this.', { foo: 'bar' });
```

### CLI Utility

The `quantum` command (when installed globally) allows for observation of ongoing logging activites. 
Use it to monitor currenting currning services or `tail` like behavior for JSON formatted log files.

    Quantum
    https://github.com/qualiancy/quantum

    quantum --help
       Show CLI help contents

    quantum --version
       Show the current version

    quantum watch service <options>
       Observe all log events on a quantum collection service
         -p, --port [8080] The port the collector is running on.
         -h, --host [localhost] The host the service is running on.
         -t, --theme [default] Console theme to display log events on. Use `none` to disable.
         -f, --file Save incoming log events to this file in JSON format.

    quantum watch file <options>
       Observe all log events on a quantum based json log file.
         -l, --levels [syslog] Levels used in the file. Ignored if theme is `json`
         -t, --theme [default] Console theme to display log events on.
         -f, --file Listen for log events on this file. Expected JSON format.

    quantum collect <options>
       Starts a Quantum collection service.
         -l, --levels [syslog] Levels to use. Recommended log nodes use the same.
         -p, --port [8080] The port the collector will listen on.
         -t, --theme [default] Console theme to display log events on. Use `none` to disable.
         -f, --file Save incoming log events to this file in JSON format.

## Components

### Levels

Levels are defined by a string to numerical reference. Each level should also have a color associated
with it for use with a reporter that supports colorful output.

- Syslog (default)
- CLI
- HTTP
- CRUD

By using levels, a number of helper methods are mounted ont

### Transports

Transports are used to change where the logs are written.

##### Console

Console logging provides a number of themes to stylize the output.

```js
var quantum = require('quantum')
  , log = new quantum.Logger('my-app');

log.use(quantum.console({ theme: 'default' });
log.start();

log.info('Hello Universe');
```

![Quantum Console Themes](http://f.cl.ly/items/22230e0G0p0p1C0X4631/tea_themes.png)

##### File

File logging will stream log data to file in line-delimeted JSON format. 

```js
var log = new quantum.Logger('my-app');

log.use(quantum.writeFile(__dirname + '/logs'));
log.start();

log.info('Hello Universe');
```

##### Broadcast

Broadcast logging will broadcast events through websockets. Quantum also comes
with with a service so you can create my application that all broadcast to a 
single log collection service. More information below.

```js
var log = new quantum.Logger('my-app');

log.use(quantum.broadcast('ws://localhost:5000'));
log.start();

log.info('Hello Universe');
```

##### Multiple transports

### Service

The Quantum collection service is for use with the broadcast transport. The service
will proxy incoming log events to a new Quantum logger. This will allow for multiple
logger collection by a single service.

The following example will proxy all incoming broadcasted log events to the 
file transport. 

```js
var log = nwe quantum.Logger('quantum-collector');

log.use(quantum.writeFile(__dirname + '/logs'));
log.init();

var service = quantum.createService(log);
service.listen(5000, function (err) {
  if (err) throw err;
  log.info('Quantum collecting on port 5000');
});
```

## Tests

Tests are writting in [Mocha](http://github.com/visionmedia/mocha) using 
the [Chai](http://chaijs.com) `should` BDD assertion library. Make sure you 
have that installed, clone this repo, install dependacies using `npm install`.

    $ make test

## Contributors

Interested in contributing? Fork to get started. Contact [@logicalparadox](http://github.com/logicalparadox) 
if you are interested in being regular contributor.

* Jake Luer ([Github: @logicalparadox](http://github.com/logicalparadox)) ([Twitter: @jakeluer](http://twitter.com/jakeluer)) ([Website](http://alogicalparadox.com))

## License

(The MIT License)

Copyright (c) 2012 Jake Luer <jake@qualiancy.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
