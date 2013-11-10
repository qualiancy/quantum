
var extend = require('tea-extend');
var facet = require('facet');
var os = require('os');

var only = extend.include('name', 'message', 'meta', 'level', 'ts', 'hostname', 'pid');

module.exports = Entry;

function Entry(name, level) {
  this.set('name', name);
  this.set('message', null);
  this.set('meta', {});
  this.set('level', level);
  this.set('ts', new Date().getTime());
  this.set('hostname', os.hostname());
  this.set('pid', process.pid);
}

facet(Entry.prototype);

Entry.prototype.message = function(msg) {
  if ('string' == typeof msg) {
    this.set('message', msg);
  } else if (msg) {
    this.set('subject', msg);
  }

  return this;
};

Entry.prototype.meta = function(meta) {
  this.set('meta', meta);
  return this;
};

Entry.prototype.toJSON = function() {
  return only(this.settings);
};
