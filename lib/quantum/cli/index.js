/*!
 * Quantum - CLI
 * Copyright (c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var Drip = require('drip')
  , Quantum = require('../../quantum')
  , help = [];

/*!
 * Quick implementation for console coloring.
 *
 * @api private
 */

var colors = {
    'red': '\u001b[31m'
  , 'green': '\u001b[32m'
  , 'yellow': '\u001b[33m'
  , 'blue': '\u001b[34m'
  , 'magenta': '\u001b[35m'
  , 'cyan': '\u001b[36m'
  , 'gray': '\u001b[90m'
  , 'reset': '\u001b[0m'
};

Object
  .keys(colors)
  .forEach(function (color) {
    Object.defineProperty(String.prototype, color, {
      get: function () { return colors[color] + this + colors['reset']; }
    });
  });

/*!
 * Create our event driven CLI
 */

cli = new Drip({ delimeter: ' ' })

/**
 * Helper for registering help topics
 */

cli.register = function (_help) {
  help.push(_help);
};

/**
 * Display the help info
 */

cli.register({
    name: '--help'
  , description: 'Show CLI help contents'
});

cli.on('--help', function (args) {
  function l (s) {
    console.log('  ' + s);
  }

  function pad (str, width) {
    return Array(width - str.length).join(' ') + str;
  }

  l('');
  l('Quantum '.magenta + Quantum.version);
  l('https://github.com/qualiancy/quantum'.gray);
  l('');

  help.forEach(function (c) {
    l('quantum '.gray + c.name.green +
          ((c.commands) ? ' <command>'.magenta : '') +
          (c.options ?   ' <options>' :  ''));
    l(pad('', 4) + c.description.blue);

    if (c.options) {
      Object.keys(c.options).forEach(function (opt) {
        l(pad('', 6) + opt + ' ' + c.options[opt].gray);
      });
    }
    l('');
  });

  l('');

  process.exit();
});

/**
 * Quick print of version
 */

cli.register({
    name: '--version'
  , description: 'Show the current version'
});

cli.on('--version', function () {
  console.log(Quantum.version);
});

/*!
 * Load all the CLI submodules
 */

require('./watchService');
require('./watchFile');
require('./collect');

/*!
 * Main exports
 */

module.exports = function (command, args) {
  // if no command, check for basics
  if (command.length == 0) {
    if (args.v || args.version) command.push('--version');
    if (args.h || args.help) command.push('--help');
  }

  if (command.length == 0) console.log('Try `--help` option.');
  cli.emit(command, args);
};
