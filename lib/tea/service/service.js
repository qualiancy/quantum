/*!
 * tea - Service Dedicated Client
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependances
 */

var orchid = require('orchid');

/**
 * Export is an extened constructor of an orchid
 * client with events bound for each expected event
 * from the broadcast middleware.
 *
 * @api private
 */

module.exports = orchid.Client.extend({

    name: 'tea-service'

  , events: {
        'tea::log': 'logEvent'
    }

  , initialize: function () {

    }

  , logEvent: function (obj) {
      this._emit('log', obj);
    }

});
