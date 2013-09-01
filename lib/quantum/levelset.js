

module.exports = LevelSet;

function LevelSet(name) {
  this.name = name;
  this.levels = [];
}

LevelSet.prototype.push = function(name, color) {
  var id = this.levels.length;
  var level = { id: id };
  level.name = name;
  level.color = color;
  this.levels.push(level);
  return this;
};

LevelSet.prototype.byId = function(id) {
  return this.levels.filter(function(level) {
    return level.id === id;
  })[0] || null;
};

LevelSet.prototype.byName = function(name) {
  return this.levels.filter(function(level) {
    return level.name === name;
  })[0] || null;
};

LevelSet.prototype.mount = function(logger) {
  this.levels.forEach(function(level) {
    logger[level.name] = function() {
      var args = [].slice.call(arguments);
      this.log.apply(logger, [ level.name ].concat(args));
      return this;
    };
  });

  return logger;
};
