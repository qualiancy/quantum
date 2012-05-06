/*!
 * Quantum - http levels definition
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Level Definition
 */

module.exports = {
    levels: {
        GET:          0
      , POST:         1
      , PUT:          2
      , HEAD:         3
      , DELETE:       4
      , OPTIONS:      5
      , TRACE:        6
      , COPY:         7
      , LOCK:         8
      , MKCOL:        9
      , MOVE:         10
      , PROPFIND:     11
      , PROPPATCH:    12
      , UNLOCK:       13
      , REPORT:       14
      , MKACTIVITY:   15
      , CHECKOUT:     16
      , MERGE:        17
      , MSEARCH:      18
      , NOTIFY:       19
    }

  ,  colors: {
        GET:          'green'
      , POST:         'blue'
      , PUT:          'magenta'
      , HEAD:         'yellow'
      , DELETE:       'red'
      , OPTIONS:      'yellow'
      , TRACE:        'blue'
      , COPY:         'cyan'
      , LOCK:         'gray'
      , MKCOL:        'gray'
      , MOVE:         'magenta'
      , PROPFIND:     'cyan'
      , PROPPATCH:    'blue'
      , UNLOCK:       'default'
      , REPORT:       'yellow'
      , MKACTIVITY:   'gray'
      , CHECKOUT:     'green'
      , MERGE:        'yellow'
      , MSEARCH:      'blue'
      , NOTIFY:       'cyan'
  }
}
