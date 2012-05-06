/*!
 * Quantum - syslog levels definition
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

module.exports = {
    levels: {
        debug:        0
      , info:         1
      , notice:       2
      , warn:         3
      , error:        4
      , crit:         5
      , alert:        6
      , emerg:        7
    }

  , colors: {
        debug:        'blue'
      , info:         'green'
      , notice:       'yellow'
      , warn:         'red'
      , error:        'red'
      , crit:         'red'
      , alert:        'yellow'
      , emerg:        'red'
    }
};
