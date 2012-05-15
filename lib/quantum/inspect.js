var _ = require('./utils');
//
// hande cyclical references
// https://github.com/hij1nx/cdir/blob/master/cdir.js
//
if (typeof JSON.decycle !== 'function') {
  JSON.decycle = function decycle (object) {

    var objects = [],
        paths = [];

    return (function derez (value, path) {

      var name, nu;

      switch (typeof value) {
        case 'object':

          if (!value) {
            return null;
          }

          for (var i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return '[Circular]';
            }
          }

          objects.push(value);
          paths.push(path);

          if (Object.prototype.toString.apply(value) === '[object Array]') {
            nu = [];
            for (var i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']');
            }
          }
          else {

            nu = {};
            for (name in value) {
              nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
            }
          }
          return nu;
        default:
          return value;
        break;
        }

    }(object, '[Curcular]'));
  };
}

function getType (o) {
  if (typeof o === 'string'
      || typeof o === 'number'
      || typeof o === 'boolean'
      || typeof o === 'function')
    return typeof o;
  else if (({}).toString.call(o) === '[object RegExp]')
    return 'regexp';
  else if (Array.isArray(o))
    return 'array';
  else if (typeof o === 'undefined')
    return 'undefined';
  else if (({}).toString.call(o) === '[object Null]')
    return 'null';
  else if (({}).toString.call(o) === '[object Object]')
    return 'object';
};

function ws (d) {
  return Array(d + 2).join('  ');
}

module.exports = function (obj, opts) {
  var meta = []
    , seed = -1;

  var buildMeta = function buildMeta (depth, node, desc) {
    var type = getType(node);
    seed++;

    switch (type) {
      case 'object':
        meta.push({
            description: 'Object'
          , key: desc
          , depth: depth
          , index: seed
          , node: node
          , type: type
        });

        depth++;
        for (var key in node) {
          buildMeta(depth, node[key], key);
        }

        break;
      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
      case 'null':
      case 'regexp':
        meta.push({
            description: node
          , key: desc
          , node: node
          , depth: depth
          , index: seed
          , type: type
        });

        break;
      case 'array':
        meta.push({
            description: 'Array'
          , key: desc
          , depth: depth
          , seed: seed
          , node: node
          , type: type
        });

        depth++;
        node.forEach(function (item, index) {
          buildMeta(depth, item, index);
        });
        break;
    }
  };

  var dobj = JSON.decycle(obj);
  buildMeta(0, dobj);

  return {
    colorize: function () {
      var buf = '';
      meta.forEach(function (line) {
        var delim = (~['object', 'array'].indexOf(line.type))
            ? '▾ '
            : ''
          , desc = line.description;

        if ('string' === line.type) desc = _.colorize('"' + desc + '"', 'green');
        if ('number' === line.type) desc = _.colorize(desc, 'magenta');
        if ('boolean' === line.type) desc = _.colorize(desc, 'cyan');

        var print = ('undefined' !== typeof line.key)
            ? _.colorize(line.key + ': ', 'gray')
              + delim + _.colorize(desc, 'blue')
            : delim + _.colorize(desc, 'blue');
        buf += ws(line.depth) + print + '\n';
      });
      return buf;
    }
  }
};
