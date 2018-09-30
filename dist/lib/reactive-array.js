'use strict';

/* eslint-disable prefer-rest-params */
// https://github.com/ManuelDeLeon/ReactiveArray/

var hasProp = {}.hasOwnProperty;
var extend = function extend(child, parent) {
  for (var key in parent) {
    if (parent.hasOwnProperty(key) && hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  function Ctor() {
    this.constructor = child;
  }

  Ctor.prototype = parent.prototype;
  child.prototype = new Ctor();
  child.__super__ = parent.prototype;
  return child;
};

var ReactiveArray = function (superClass) {
  // eslint-disable-next-line no-use-before-define
  extend(ReactiveArray, superClass);

  var isArray = function isArray(obj) {
    return obj instanceof Array;
  };

  function ReactiveArray(p1, p2) {
    var dep = void 0;
    var item = void 0;
    var j = void 0;
    var len = void 0;
    var pause = void 0;
    dep = null;
    pause = false;
    this.changed = function () {
      if (dep && !pause) {
        return dep.changed();
      }
    };
    this.depend = function () {
      return dep.depend();
    };
    if (isArray(p1)) {
      for (j = 0, len = p1.length; j < len; j += 1) {
        item = p1[j];
        this.push(item);
      }
      dep = p2;
    } else {
      dep = p1;
    }
    if (!(dep instanceof Tracker.Dependency)) {
      dep = new Tracker.Dependency();
    }
    this.pause = function () {
      pause = true;
      return pause;
    };
    this.resume = function () {
      pause = false;
      return this.changed();
    };
  }

  ReactiveArray.prototype.array = function () {
    this.depend();
    return Array.prototype.slice.call(this);
  };

  ReactiveArray.prototype.list = function () {
    this.depend();
    return this;
  };

  ReactiveArray.prototype.depend = function () {
    this.depend();
    return this;
  };

  ReactiveArray.prototype.push = function () {
    var item = ReactiveArray.__super__.push.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.unshift = function () {
    var item = ReactiveArray.__super__.unshift.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.pop = function () {
    var item = ReactiveArray.__super__.pop.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.shift = function () {
    var item = ReactiveArray.__super__.shift.apply(this, arguments);
    this.changed();
    return item;
  };

  ReactiveArray.prototype.remove = function (valueOrPredicate) {
    var predicate = typeof valueOrPredicate === 'function' ? valueOrPredicate : function (value) {
      return value === valueOrPredicate;
    };
    var removedValues = [];
    var underlyingArray = this;
    var value = void 0;
    var i = 0;
    while (i < underlyingArray.length) {
      value = underlyingArray[i];
      if (predicate(value)) {
        removedValues.push(value);
        underlyingArray.splice(i, 1);
        i -= 1;
      }
      i += 1;
    }
    if (removedValues.length) {
      this.changed();
    }
    return removedValues;
  };

  ReactiveArray.prototype.clear = function () {
    while (this.length) {
      this.pop();
    }
    this.changed();
    return this;
  };

  ReactiveArray.prototype.concat = function () {
    var a = void 0;
    var j = void 0;
    var len = void 0;
    var ret = this.array();
    for (j = 0, len = arguments.length; j < len; j += 1) {
      a = arguments[j];
      if (a instanceof ReactiveArray) {
        ret = ret.concat(a.array());
      } else {
        ret = ret.concat(a);
      }
    }
    return new ReactiveArray(ret);
  };

  ReactiveArray.prototype.indexOf = function () {
    this.depend();
    return ReactiveArray.__super__.indexOf.apply(this, arguments);
  };

  ReactiveArray.prototype.join = function () {
    this.depend();
    return ReactiveArray.__super__.join.apply(this, arguments);
  };

  ReactiveArray.prototype.lastIndexOf = function () {
    this.depend();
    return ReactiveArray.__super__.lastIndexOf.apply(this, arguments);
  };

  ReactiveArray.prototype.reverse = function () {
    ReactiveArray.__super__.reverse.apply(this, arguments);
    this.changed();
    return this;
  };

  ReactiveArray.prototype.sort = function () {
    ReactiveArray.__super__.sort.apply(this, arguments);
    this.changed();
    return this;
  };

  ReactiveArray.prototype.splice = function () {
    var ret = ReactiveArray.__super__.splice.apply(this, arguments);
    this.changed();
    return ret;
  };

  return ReactiveArray;
}(Array);

// Set start point
BasMTR.ReactiveArray = ReactiveArray;
