
0.3.1 / 2012-06-30 
==================

  * permit custom functions as console themes

0.3.0 / 2012-06-30 
==================

  * Merge branch 'refactor/modulize'
  * file transport using fsagent for directory making
  * support template tags in messages
  * clones now use event proxy instead of copying over transports
  * add event emitter log transport
  * use supports object with handle function
  * cli colors only used when output is tty
  * clean up internals
  * remove all unnecissary transports/features
  * add sherlock dep

0.2.2 / 2012-06-06 
==================

  * cloning example
  * broadcast mounts synchronously

0.2.1 / 2012-05-24 
==================

  * bugs in the cli

0.2.0 / 2012-05-23 
==================

  * Merge branch 'refactor/cli'
  * refactor all cli options to use electron
  * start returns this
  * collect command using electron
  * begin rewrite with electron
  * reverting simple theme
  * start returns constructed instance
  * drop optimist

0.1.7 / 2012-05-18 
==================

  * modified simple theme

0.1.6 / 2012-05-16 
==================

  * allow for loggers to be cloned

0.1.5 / 2012-05-15 
==================

  * logger observers custom tokens

0.1.4 / 2012-05-15 
==================

  * simple theme (default w/o time and ns)
  * debug theme to display inspected json
  * adding json inspection (primative)

0.1.3 / 2012-05-07 
==================

  * make transports enumerable

0.1.2 / 2012-05-06 
==================

  * include transports exports for plugins
  * sigh

0.1.1 / 2012-05-06 
==================

  * improperly linked bin
  * readme updated

0.1.0 / 2012-05-06 
==================

  * test cov support
  * bin refactored as quantum
  * refactored examples with quantum
  * writeFile/broadcast transport was not writing correctly
  * [refactor] as quantum
  * improved api per transport for level filtering
  * cli watchFile // watchService
  * tests for all provided levels and custom levels
  * refactored logger to support chain levels api and custom level definitions
  * emitEvent also emits to [ 'event', level ] delimited event
  * refactored exporter to all for `tea` factory
  * added chai spies
  * added crud levels
  * added http levels
  * ocd
  * reapply window getgid/getuid compatibility fix
  * directory cleanup
  * transport file => writeFile
  * refactor transports to use new `initialize` queue style
  * read and write queues
  * Logger#init -> Logger#start
  * begin work on cli
  * util#isPathAbsolute to determine x-platform
  * improved display of time for default theme
  * [bug] Logger#emitEvent reference error
  * added test coverage support
  * improved gitignore
  * Logger#filter support
  * Logger#log is not Logger#write
  * no levelInt in event, and lvl as `level`
  * allow custom token definitions and don't include process tokens unless specified
  * using timestamp instead of date
  * readme update
  * console examples in one file
  * everything is commented
  * refactor themes to work with event object
  * refactor transports to work with event object
  * refactor logger to be have chain api and simply log event object
  * refactoring service constructor to be more node-server-like
  * renaming service middleware to broadcast
  * added clean theme
  * refactor reporters as `themes`
  * remove transports reference in Logger
  * update all examples to use new middleware style
  * refactor `service` transport for `use` loading
  * refactor `file` transport for `use` loading
  * refactor console transport for `use` loading
  * Logger parameters changed (namespace, opts)
  * refactoring logger for configure / use / middleware model
  * first tests
  * Logger#configure // Logger#use
  * added transport loaders as exportable 'middleware'
  * added mocha test opts

0.0.13 / 2012-05-03 
==================

  * service example
  * exposed createService to start service
  * added service service
  * added service transport
  * added orchid dep
  * added Logger#logEvent for json object logging
  * refactor tokens to single getter
  * default reporter shows time
  * test makefile
  * token date stores number

0.0.12 / 2012-04-22 
==================

  * Merge pull request #2 from domenic/patch-1
  * Don't call getgid/getuid unless they exist.

0.0.11 / 2012-01-26 
==================

  * added warn to cli levels

0.0.10 / 2012-01-26 
==================

  * added in my own levels for cli tools
  * spacing

0.0.9 / 2012-01-22 
==================

  * proper level binding
  * logger pulls transport list from 1) env 2) transports 3) console
  * logger refactor level binding

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
