
0.0.8 / 2012-01-22 
==================

  * cleaner transport loading
  * [refactor] using reporter loader, not lazy inline loading
  * git ignore vim swap files
  * added lazy loaders
  * mass renaming

0.0.7 / 2012-01-01
==================

  * logger emits ready when all transports loaded
  * optional filename for file transport
  * default reporter styling
  * examples match syslog levesl
  * cleanup syslog levels
  * file uses reporter

0.0.6 / 2012-01-01
==================

  * readme basics
  * added console highlight to utils
  * added default example, change file example ns
  * console logger uses npm reporter
  * changed default namespace
  * using terminology 'reporters'
  * readme
  * misspelling for ghlink in package.json. Closes #1
  * clean up json theme

0.0.5 / 2012-01-01
==================

  * queue empties itself on initialize
  * remove debuggin console.logs
  * json logger knows about namespace

0.0.4 / 2012-01-01
==================

  * file transport loads async
  * console works with new event array
  * logger queues messages if transports aren't fully loaded
  * utils for directory making

0.0.3 / 2012-01-01
==================

  * namespacing
  * transports use themes
  * moved display logic to 'themes'
  * cleaned up examples
  * added "tokens"
  * longer levels
  * moved utils to separate file

0.0.2 / 2011-12-27
==================

  * file example works with path
  * added oath to deps
  * transports conform to oath based loading
  * improved transport loader

0.0.1 / 2011-12-27
==================

  * added file transport
  * send specs of transport to transport loader
  * split examples
  * readme update
  * basic conforms to current api
  * improved loading of transports and levels
  * syslog levels don't conflict
  * console transport functional
  * basic example
  * core logger w/ lazy loading of levels and transports
  * empty transports
  * syslog levels
  * main exports
  * empty test
  * project init
