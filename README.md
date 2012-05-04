# Tea 

> Transport independant console and JSON logging.

## Installation

Tea is available through [npm](http://npmjs.org).

      npm install tea

## Components

### Levels

Levels are defined by a string to numerical reference. Each level should also have a color associated
with it for use with a reporter that supports colorful output.

* Syslog
* CLI

### Transports

Transports are used to change where the logs are written.

#### Console

Console logging provides a number of themes to stylize the output.

```js
var log = new tea.Logger('my-app');

log.use(tea.console({ theme: 'default' });
log.init();

log.info('Hello Universe');
```

![Tea Console Themes](http://f.cl.ly/items/22230e0G0p0p1C0X4631/tea_themes.png)

#### File

File logging will stream log data to file in line-delimeted JSON format. 

```js
var log = new tea.Logger('my-app');

log.use(tea.file(__dirname + '/logs'));
log.init();

log.info('Hello Universe');
```

#### Broadcast

Broadcast logging will broadcast events through websockets. Tea also comes
with with a service so you can create my application that all broadcast to a 
single log collection service. More information below.

```js
var log = new tea.Logger('my-app');

log.use(tea.broadcast('ws://localhost:5000'));
log.init();

log.info('Hello Universe');
```

### Service

The Tea collection service is for use with the broadcast transport. The service
will proxy incoming log events to a new Tea logger. This will allow for multiple
logger collection by a single service.

The following example will proxy all incoming broadcasted log events to the 
file transport. 

```js
var log = nwe tea.Logger('tea-collector');

log.use(tea.file(__dirname + '/logs'));
log.init();

var service = tea.createService(log);
service.listen(5000, function (err) {
  if (err) throw err;
  log.info('Tea Collector started on port 5000');
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

Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>

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
