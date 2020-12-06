(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// https://d3js.org/d3-selection/ v1.4.2 Copyright 2020 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function create(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}

exports.clientPoint = point;
exports.create = create;
exports.creator = creator;
exports.customEvent = customEvent;
exports.local = local;
exports.matcher = matcher;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.style = styleValue;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;

Object.defineProperty(exports, '__esModule', { value: true });

}));

},{}],2:[function(require,module,exports){
const Sort = require("../sort/Sort");

class BubbleSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
bubble sort(거품 정렬)는 서로 인접한 두 원소를 검사하여 정렬하는 알고리즘입니다.
첫 번째 원소와 두 번째 원소, 두번째 원소와 세 번째 원소, ..., n-1번째 원소와 n번째 원소를 비교, 교환하며 정렬합니다.
1회전이 끝나면 가장 큰 원소는 맨 뒤로 이동하므로 다음 회전에서는 정렬에서 제외됩니다.
이를 반복할 때마다 정렬에서 제외되는 원소가 하나씩 늘어납니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
    this.drawPseudoCode(  
`
function bubbleSort(A, n) {
  for (let last = n; last <= 2; last--)
    for (let i = 1; i <= last - 1; i++)
      if (A[i] > A[i + 1])
        swap(A[i],A[i+1])
}`
    );
  }
  
  


  async sort() {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    this.isSortRunning = true;

    // 상태 저장 스택 초기화
    this.memetoStack = [];

    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());
    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;
    for (let i = 0; i < n - 1;) {
      for (let j = 0; j < n - i - 1;) {
        // 현재 선택된(정렬중인) 블록의 색을 Red로 바꿈
        blocks[j].setColorSelected();
        blocks[j + 1].setColorSelected();

       
        // 사용자가 다음 스텝으로 넘어가기 전 까지(this.continue() or this.step()) 기다림
        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });
          this.codeDefault();

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});
        
        const value1 = blocks[j].getValue();
        const value2 = blocks[j + 1].getValue();

        this.codeHighlight(5);
        this.setDescription(`${value1}과 ${value2} 비교`);
        // delay만큼 기다림
        await new Promise(resolve => setTimeout(resolve, this.delay));

        if (value1 > value2) {
          this.codeHighlight(6);
          this.setDescription(`${value1}과 ${value2} 변경`);
          // swap 함수로 두 블록의 위치를 바꿈; await은 swap 이 끝날 때 까지 기다리겠다는 의미
          await this.swap(blocks[j], blocks[j + 1]);
          // 두 블록의 위치가 바뀌었으므로 blocks을 업데이트
          this.refreshBlocks();
        }
        // 선택이 끝났으므로 블록의 색을 원래 색으로 바꿈
        blocks[j].setColorDefault();
        blocks[j + 1].setColorDefault();
        j+= 1;
      }
      // 정렬이 끝난 블록의 색을 Green으로 바꿈
      blocks[n - i - 1].setColorSorted();
      this.setDescription(`${blocks[n-i-1].getValue()} 블록 정렬 완료`);
      i += 1
    }
    blocks[0].setColorSorted();
    this.isSortRunning = false;
  }
}

module.exports = BubbleSort;

},{"../sort/Sort":8}],3:[function(require,module,exports){
const Sort = require("../sort/Sort");

class InsertionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
insert sort(삽입 정렬)는 원소를 이미 정렬된 배열 부분과 비교 하여, 자신의 위치를 찾아 삽입함으로써 정렬을 완성하는 알고리즘입니다.
기존의 정렬된 배열에서 삽입 될 부분을 찾았다면 그 위치에 원소를 삽입하기 위해 원소들을 한 칸씩 뒤로 이동시킵니다.
삽입정렬의 처음 key 값은 두 번째 원소로부터 시작합니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
    this.drawPseudoCode(
`
function insertionSort(A, n) {
  for (let i = 2; i <= n; i++) {
    let key = A[i]
    let j = 0
    while (j < i && A[j] < key)
      j++
    shift(A,j,i) 
    A[j] = key 
  }
}
`
    );
  }

  async sort() {

    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    this.isSortRunning = true;

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;

    blocks[0].setColorSorted();

    for (let i = 1; i < n;) {
      blocks[i].setColorSelected();

      let destIndex = i;

      const target = blocks[i].getValue();

      for (let j = 0; j < i;) {
        blocks[j].setColorSelected();

        this.setDescription(`${blocks[i].getValue()} 블록이 들어갈 위치를 탐색`);

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          this.codeDefault();
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});

        this.codeHighlight(6,7);

        await new Promise(resolve => setTimeout(resolve, this.delay));

        const value = blocks[j].getValue();

        blocks[j].setColorSorted();
        if (value > target) {
          destIndex = j;
          break;
        }
        j+=1;
      }
      if (i != destIndex) {
        this.codeHighlight(8);
        blocks[destIndex].setColorSelected();

        await this.shift(destIndex, i);

        this.codeHighlight(9);
        if (destIndex != 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex-1].getValue()} 블록과 ${blocks[destIndex].getValue()} 블록의 사이에 삽입`);
        else if (destIndex == 0)
          this.setDescription(`${blocks[i].getValue()} 블록을 ${blocks[destIndex].getValue()} 블록의 위치에 삽입`);

        await this.insertAt(blocks[i], destIndex);
        
        blocks[destIndex].setColorSorted();
      }
      else
        this.setDescription(`${blocks[i].getValue()} 블록의 위치 변경 없음`);
      blocks[i].setColorSorted();
      this.refreshBlocks();
      i += 1;
    }
    this.isSortRunning = false;
  }
}

module.exports = InsertionSort;

},{"../sort/Sort":8}],4:[function(require,module,exports){
const Sort = require("../sort/Sort");

class QuickSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
quick sort(퀵 정렬)는 기준점(pivot)을 기준으로 두 개의 분할된 부분 리스트를 정렬한 다음 합하여 전체가 정렬된 리스트가 되게 하는 알고리즘입니다.
분할 정복 알고리즘의 하나로, 평균적으로 매우 빠른 수행 속도를 자랑합니다.

평균 시간 복잡도 : T(n) = O(n * log(n))
`
    );
    this.drawPseudoCode(
`function quickSort(A, p, r) {
  if (p < r) {
    let q = partition(A, p, r)
    quickSort(A, p, q-1)
    quickSort(A, q+1, r)
  }
}
function partition(A, p, r) {
  let pivot = A[(p+r)/2)]
  let left = p;
  let right = r;
  do {
    while (A[left] < pivot) 
      left++
    while (A[right] > pivot) 
      right--
    if (left <= right) 
       swap(A[left--],A[right++])
  } while (left <= right)
  return right >= p ? right : p
}
`
    );
  }

  async sort(left = 0, right = this.blocks.length - 1) {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning) return;
    this.isSortRunning = true;

    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach((block) => block.setColorDefault());

    let blocks = this.blocks;
    let lstack = [];
    let rstack = [];

    lstack.push(left);
    rstack.push(right);

    while (lstack.length != 0) {
      let pl = (left = lstack.pop()); // 왼쪽 커서
      let pr = (right = rstack.pop()); // 오른쪽 커서
      let pivotIdx = Math.ceil((left + right) / 2);
      let pivot = blocks[pivotIdx]; // 피벗

      // 현재 알고리즘이 바라보는 블록들의 색 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorBoundary());
      // 피벗의 색 변경
      pivot.setColorPivot();
      
      this.codeHighlight(9);
      await this.sleep("50");

      do {
        while (blocks[pl].getValue() < pivot.getValue()) pl++;
        while (blocks[pr].getValue() > pivot.getValue()) pr--;

        blocks[pl].setColorSelected();
        blocks[pr].setColorSelected();
        // pl 또는 pr이 pivot과 겹쳐도 pivot의 색을 유지
        pivot.setColorPivot();

        this.codeHighlight(13,14,15,16)

        const { type, memento } = await this.wait();

        // 상태 복구
        if (type === "back") {
          ({ lstack, rstack, pl, pr, left, right, pivotIdx } = memento);
          pivot = blocks[pivotIdx];
          memento.blocks.forEach((prevBlock, index) => {
            const { color, xPosition, value, width } = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });
          continue;
        }

        // 현재 상태를 스택에 저장
        this.pushMemento({
          pl,
          pr,
          pivotIdx,
          left,
          right,
          lstack: [...lstack, pl],
          rstack: [...rstack, pr],
          blocks: [...blocks].map((block) => ({ ...block })),
        });

        if (pl <= pr) {
          this.codeHighlight(18);
          await this.swap(blocks[pl++], blocks[pr--]);
          // swap(blocks, pl++, pr--);
          this.refreshBlocks();
        }
        blocks[pl - 1].setColorBoundary();
        blocks[pr + 1].setColorBoundary();
      } while (pl <= pr);

      if (left < pr) {
        lstack.push(left);
        rstack.push(pr);
      }
      if (pl < right) {
        lstack.push(pl);
        rstack.push(right);
      }
      // 현재 알고리즘이 바라보는 블록들의 색을 원래대로 변경
      blocks
        .filter((_, idx) => left <= idx && idx <= right)
        .forEach((block) => block.setColorDefault());
    }
  }
}

module.exports = QuickSort;

},{"../sort/Sort":8}],5:[function(require,module,exports){
const Sort = require("../sort/Sort");

class SelectionSort extends Sort {
  // container:DOM, delay:Number, animationDelay:Number
  constructor(...args) {
    super(...args);
    this.drawDescription(
`
selection sort(선택 정렬)는 해당 순서에 원소를 넣을 위치는 이미 정해져 있고, 어떤 원소를 넣을지 선택하는 알고리즘입니다.
최소값을 탐색 후 그 값을 앞에서부터 배열하는 방식입니다.

평균 시간 복잡도 : T(n) = O(n<sup>2</sup>)
`
    );
    this.drawPseudoCode(  
 `
function selectionSort(A, n) {
  for(let i = 0; i < n-1; i++){
    min = i
    for(let j = i + 1; j < n; j++) {
      if(A[j] < A[min])
        min = j
    }
    if(min != i)
      swap(A[i],A[min])
  }
}
`   );
  }

  async sort() {
    // 이미 정렬중인 경우 바로 리턴
    if (this.isSortRunning)
      return;
    
    this.isSortRunning = true;
    
    // 상태 저장 스택 초기화
    this.memetoStack = [];
    // 블록 색상을 기본으로 변경
    this.blocks.forEach(block=>block.setColorDefault());

    // block들 가져오기
    let blocks = this.blocks;
    // block들의 총 개수
    const n = blocks.length;
    let min;

    for (let i = 0; i < n - 1;) {
      min = i;
      blocks[i].setColorSelected(); //i번째블럭 빨간색으로
      for (let j = i + 1; j < n;) {
        blocks[j].setColorSelected(); // i+1번부터n-1번까지의 블럭을 차례대로 빨간색으로
        

        const {type,memento} = await this.wait();
        // 이전 상태로 복구
        if (type === "back" && memento != null) {
          ({i,j} = memento);
          // TODO: 
          memento.blocks.forEach((prevBlock,index) => {
            const {color, xPosition,value,width} = prevBlock;
            const block = this.blocks[index];
            block.setValue(value);
            block.setWidth(width);
            block.setColor(color);
            block.setXPosition(xPosition);
          });
          this.codeDefault();

          continue;
        }
        // 상태 저장
        this.pushMemento({i,j,blocks:[...blocks].map(block=>({...block}))});
        this.codeHighlight(6);
        // delay만큼 기다림//
        await new Promise(resolve => setTimeout(resolve, this.delay));
        let value1 = blocks[min].getValue(); //변수 설정
        let value2 = blocks[j].getValue();
        if(j<n-1){
          let vcmp = blocks[j+1].getValue();
          this.setDescription(`${value1}과 ${vcmp} 비교`);
        }
        if (value1 >= value2) {
          this.setDescription(` 현재 최솟값 : ${value2}`);
          min = j;
          this.codeHighlight(7);
        }
        if (i != min && j == n - 1) {
          this.codeHighlight(9);
          this.setDescription(`최솟값과 현재 값을 교환한다`);
          await this.swap(blocks[min], blocks[i]); // 블럭 체인지
          this.codeHighlight(10);
          min = i; // min값초기화
          blocks[min].setColorDefault(); // 위치가 바뀌는 대상블록색깔 파란색으로
          this.refreshBlocks(); //두 블록의 위치가 바뀌었으므로 blocks를 업데이트
        }
        blocks[j].setColorDefault(); // 원래 색깔로 되돌리기
        j += 1;
      }
      blocks[i].setColorSorted();
      i += 1;
    }

    // 정렬이 끝났으므로 마지막 블록도 Green으로 색 변경
    blocks[n - 1].setColorSorted();

    this.isSortRunning = false;
  }
}
module.exports = SelectionSort;

},{"../sort/Sort":8}],6:[function(require,module,exports){
const Color = require('./Color');

class Block {
  // static factory method; value와 container를 이용해 Block 객체를 만든다
  static createNewBlock(value, container, blockWidth = 28, blockMargin = 2) {
    const blockCount = Array.from(container.children).filter(dom => dom.classList.contains('block')).length;
    const xPosition = blockCount * (blockWidth + blockMargin);

    return new Block(value, container, xPosition, blockWidth);
  }

  constructor(value, container, xPosition,  width,transitionDuration=200) {
    this.value = value;
    this.container = container;

    const block = document.createElement("div");
    block.classList.add("block");

    const blockLabel = document.createElement("label");
    blockLabel.classList.add("block__id");

    block.appendChild(blockLabel);
  
    this.dom = block;

    this.setValue(value);
    this.setColorDefault();
    this.setTransitionDuration(transitionDuration);
    this.setWidth(width);
    this.setXPosition(xPosition);

    // 화면에 블록 표시
    container.appendChild(block);
  }
  swapBlock(block) {
    const animationDelay = this.getTransitionDuration();
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          const nextOfTarget1 = this.dom.nextSibling;
          const nextOfTarget2 = block.dom.nextSibling;

          this.container.insertBefore(this.dom, nextOfTarget2);
          this.container.insertBefore(block.dom, nextOfTarget1);
          resolve();
        }, animationDelay);
      });
    });
  }

  insertBefore(block) {
    const animationDelay = this.getTransitionDuration();
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          this.container.insertBefore(this.dom, block.dom);
          resolve();
        }, animationDelay);
      });
    });
  }

  setTransitionDuration(millis) {
    this.transitionDuration = millis;
    this.dom.style.transitionDuration = `${this.transitionDuration}ms`;
  }

  getTransitionDuration() {
    // return Number(
    //   window.getComputedStyle(this.dom).transitionDuration.replace("s", 0)
    // );
    return this.transitionDuration;
  }

  setXPosition(x) {
    this.xPosition = x;
    this.dom.style.transform = `translateX(${this.xPosition}px)`;
  }

  getXPosition() {
    return this.xPosition;
    // const regExpTransX = /[\w]+\([ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?[\d]+[ ]?,[ ]?([\d]+)[ ]?,[ ]?[\d]+[ ]?\)/;
    // const transform = window.getComputedStyle(this.dom).transform;
    // return regExpTransX.exec(transform)[1];
  }

  setWidth(px) {
    this.width = px;
    this.dom.style.width = `${this.width}px`;
  }
  getWidth() {
    return this.width;
  }

  setColor(color) {
    this.color = color;
    this.dom.style.backgroundColor = color;
  }

  getColor() {
    return this.color;
  }

  // block을 선택된 블록의 색으로 바꾸는 함수
  setColorSelected() {
    this.color = Color.selected;
    this.dom.style.backgroundColor = this.color; //선택된 블록 : 빨강 -> 연보라
  }

  // block을 기본 블록의 색으로 바꾸는 함수
  setColorDefault() {
    this.color = Color.defaultColor;
    this.dom.style.backgroundColor = this.color; //기본 블록: 파랑 -> 연핑크
  }

  // block을 정렬이 끝난 블록의 색으로 바꾸는 함수
  setColorSorted() {
    this.color = Color.sorted;
    this.dom.style.backgroundColor = this.color; //정렬 끝난 블록: 그린(초록) -> 찐핑크
  }

  // block을 Pivot 블록의 색으로 바꾸는 함수
  setColorPivot() {
    this.color = Color.pivot;
    this.dom.style.backgroundColor = this.color; //피벗 블록 : 형광 핑크 ->  찐보라
  }

  // block을 경계를 나타내는 블록의 색으로 바꾸는 함수
  setColorBoundary() {
    this.color = Color.boundary;
    this.dom.style.backgroundColor = this.color; // 블럭 경계 : 보라 -> 노랑 
  }

  setValue(value){
    this.value = value;
    // 블록의 최대 높이는 컨테이너의 높이 - 24px
    const maxHight =
      Number(window.getComputedStyle(this.container).height.replace("px", "")) - 24;
    let blockHight = value * 3;
    this.dom.style.height = `${blockHight < maxHight ? blockHight : maxHight}px`;

    this.dom.firstChild.innerHTML = value;
  }

  // block의 value를 반환하는 함수
  getValue() {
    return this.value;
  }
}

module.exports = Block;

},{"./Color":7}],7:[function(require,module,exports){


// 기본 블록 색상
const defaultColor = "#FF9FB3";

// 블록이 선택되었을 때 색상
const selected = "#B69AE7";

// 정렬이 끝난 블록의 색상
const sorted = "#FF6C77";

// Pivot 블록의 색상 (Quick Sort에서의 Pivot)
const pivot = "#9F70F1";

// Quick Sort에서 Partition 함수의 대상인 블록들의 색상
const boundary = "#F5E348";

module.exports = {
    defaultColor,
    selected,
    sorted,
    pivot,
    boundary
}
},{}],8:[function(require,module,exports){
const { touches } = require("d3-selection");
const Block = require("./Block");

// 이 클래스를 상속해서 sort 메소드 구현하기
class Sort {
  constructor(
    container,
    blocks = [],
    delay = 200,
    animationDelay = 250,
    blockWidth = 28,
    blockMargin = 2,
    description
  ) {
    // 정렬할 대상인 블록들
    this.blocks = blocks;
    // 블록을 시각화 할 컨테이너 DOM
    this.container = container;
    // 정렬 스텝 사이 딜레이
    this.delay = delay;
    // 정렬이 멈춘 상태
    this.isStop = false;
    // 블록의 너비
    this.blockWidth = blockWidth;
    // 블록 사이 간격
    this.blockMargin = blockMargin;

    this.description = description;

    // 정렬이 현재 실행중인 상태
    this.isSortRunning = false;

    // block 들의 애니메이션 딜레이를 설정
    this.setAnimationDelay(animationDelay);

    this.memetoStack = [];
  }

  // 수도 코드 문자열을 받아서 시각화 컨테이너 우측에 보여줌
  drawPseudoCode(pseudoCode) {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );
    // 기존에 있던 수도코드 삭제
    Array.from(pseudoCodeContainer.children).forEach((child) => child.remove());
    pseudoCodeContainer.innerHTML = "";

    // 줄별로
    pseudoCode.split("\n").map((line) => {
      pseudoCodeContainer.innerHTML += `<code>${line}</code>${"\n"}`;
    });
  }

  // 설명을 받아서 시각화 컨테이너 우측에 보여줌
  drawDescription(description) {
    const descriptionContainer = document.querySelector(
      ".description-container"
    );
    // 기존에 있던 설명 삭제
    Array.from(descriptionContainer.children).forEach((child) =>
      child.remove()
    );
    descriptionContainer.innerHTML = "";

    // 줄별로
    description.split("\n").map((line) => {
      descriptionContainer.innerHTML += `<div>${line}</div>${"\n"}`;
    });
  }

  // 추상 메소드
  sort() {}

  wait() {
    return new Promise((resolve) => {
      if (this.isStop) {
        // 현재 정렬 중지 상태라면 this.step을 통해 정렬을 시작하도록 설정
        this.resolve = resolve;
      } else {
        resolve({ type: "continue" });
      }
    });
  }

  stop() {
    this.isStop = true;
  }

  continue() {
    this.isStop = false;
    this.step();
  }

  step() {
    if (this.resolve != null && this.resolve != undefined) {
      this.resolve({ type: "step" });
      this.resolve = null;
    }
  }

  stepBack() {
    if (this.resolve != null && this.resolve != undefined) {
      if (this.memetoStack.length != 0) {
        this.resolve({
          type: "back",
          memento: this.memetoStack.pop(),
        });
        this.resolve = null;
      }
    }
  }

  // 시각화된 수도 코드의 하이라이트를 없앰
  codeDefault() {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );

    const children = pseudoCodeContainer.children;

    for (let i = 0; i < children.length; i++) {
      children[i].style.color = "";
    }
  }

  // 시각화된 수도 코드의 특정 줄을 하이라이트
  codeHighlight(...line) {
    const pseudoCodeContainer = document.querySelector(
      ".pseudo-code-container"
    );

    const children = pseudoCodeContainer.children;

    for (let i = 0; i < children.length; i++) {
      children[i].style.color = "";
    }

    for (let mango = 0; mango < line.length; mango++) {
      const codeElement = children[line[mango] - 1];
      codeElement.style.color = "#B69AE7";
    }
  }

  pushMemento(memento) {
    this.memetoStack.push(memento);
  }

  sleep(millis) {
    return new Promise((res) => setTimeout(res, millis));
  }

  shuffle() {
    this.setDescription("");

    let blocks = this.blocks;
    for (let i = blocks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 미만의 무작위 인덱스
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // 셔플
    }
    blocks.map((block, index) => {
      block.setColorDefault(); // 블록 색 초기화

      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const transX = index * (this.blockWidth + this.blockMargin);
      block.setXPosition(transX);
      this.container.insertBefore(block.dom, null); // 블록의 DOM을 컨테이너의 맨 끝으로 이동

      block.setTransitionDuration(prevDuration);
    });

    this.blocks = blocks;
  }

  // 현재 시각화되는 단계의 설명 설정
  // 시각화 컨테이너 하단에 표시됨
  setDescription(text) {
    if (this.description === undefined) {
      this.description = document.createElement("div");
      this.description.classList.add("sort-description");
      this.container.appendChild(this.description);
    }

    this.description.innerHTML = "";
    this.description.innerHTML = text;
  }

  setBlockWidth(blockWidth = this.blocks?.[0]?.getWidth(), blockMargin = 2) {
    this.blockWidth = blockWidth;
    this.blockMargin = blockMargin;
    // width:Number
    const blockCount = this.blocks.length;

    // 컨테이너 크기 넓히기
    this.container.style.width = blockCount * (blockWidth + blockMargin) + "px";

    // 블록 크기 바꾸기
    this.blocks.map((block, index) => {
      // 블록 애니메이션 속도를 0ms로 조정; 크기 변경을 즉각적으로 하기 위해
      const prevDuration = block.getTransitionDuration();
      block.setTransitionDuration(0);

      const newX = index * (blockWidth + blockMargin);
      block.setXPosition(newX);

      // 블록의 너비 조정
      block.setWidth(blockWidth);

      // 애니메이션 속도를 원래대로 조정
      block.setTransitionDuration(prevDuration);
    });
  }

  addBlock(blockValue) {
    // 블록 개수 제한
    if (this.blocks.length > 30) return;

    const block = Block.createNewBlock(
      blockValue,
      this.container,
      this.blockWidth,
      this.blockMargin
    );

    this.blocks.push(block);

    const containerWidth = this.blocks
      .map((b) => b.getWidth())
      .reduce(
        (containerWidth, blockWidth) =>
          containerWidth + this.blockMargin + blockWidth,
          0
      );
    this.container.style.width = `${containerWidth}px`;
  }

  removeBlock(blockValue) {
    if (blockValue instanceof String) blockValue = Number(blockValue);

    const targetIndex = this.blocks.findIndex(
      (block) => block.getValue() == blockValue
    );
    // 포함되었는지 확인
    // targetIndex가 -1이면 blockValue가 현재 블록들에 없는 값
    if (targetIndex == -1) return;

    // 삭제할 노드의 오른쪽에 있는 블록들 위치 한 칸 왼쪽으로 밀기
    for (let i = this.blocks.length - 1; i > targetIndex; i--) {
      const leftX = this.blocks[i - 1].getXPosition();
      this.blocks[i].setXPosition(leftX);
    }

    // this.blocks에서 삭제
    const targetBlock = this.blocks.splice(targetIndex, 1)[0];
    // DOM 삭제
    targetBlock.dom.remove();

    const containerWidth = this.blocks
      .map((b) => b.getWidth())
      .reduce(
        (containerWidth, blockWidth) =>
          containerWidth + this.blockMargin + blockWidth,
          0
      );
    this.container.style.width = `${containerWidth}px`;
  }

  setDelay(millis) {
    this.delay = millis;
  }

  setAnimationDelay(millis) {
    this.animationDelay = millis;
    this.blocks.forEach((block) =>
      block.setTransitionDuration(this.animationDelay)
    );
  }

  // this.blocks를 시각화되고있는 순서에 맞게 정렬하는 함수
  refreshBlocks() {
    const doms = Array.from(document.querySelectorAll(".block"));

    this.blocks.sort((b1, b2) => doms.indexOf(b1.dom) - doms.indexOf(b2.dom));
  }

  // target1과 tatget2의 위치를 바꿈
  // target1이 항상 target2보다 앞에 있어야 함
  async swap(block1, block2) {
    // block1: Block, block2: Block

    const x1 = block1.getXPosition();
    const x2 = block2.getXPosition();

    block1.setXPosition(x2);
    block2.setXPosition(x1);

    // 애니메이션이 끝나기를 기다림.
    await block1.swapBlock(block2);
  }

  // target을 destIndex 자리에 넣는 함수
  // target은 항상 destIndex보다 뒤에 있어야함
  async insertAt(block, destIndex) {
    const blocks = this.blocks;

    block.setXPosition(destIndex * (this.blockWidth + this.blockMargin));

    // 애니메이션이 끝나기를 기다림.
    await block.insertBefore(blocks[destIndex]);
  }

  // start 인덱스부터 end 인덱스까지 block 한 칸씩 미는 함수
  async shift(start, end) {
    const blocks = this.blocks;

    const betweens = blocks.filter((_, i) => start <= i && i < end);

    const xRest = betweens.map((b) => b.getXPosition());
    for (let i = 0; i < betweens.length - 1; i++) {
      betweens[i].setXPosition(xRest[i + 1]);
    }
    blocks[end - 1].setXPosition(blocks[end].getXPosition());

    await new Promise((res) =>
      setTimeout(res, blocks[0].getTransitionDuration())
    );
  }
}

module.exports = Sort;

},{"./Block":6,"d3-selection":1}],9:[function(require,module,exports){
const Block = require("../sort/Block");
const BubbleSort = require("../bubble-sort/BubbleSort");
const InsertionSort = require("../insertion-sort/InsertionSort");
const SelectionSort = require("../selection-sort/SelectionSort");
const QuickSort = require("../quick-sort/QuickSort");

// 정렬이 시각화 될 container
const container = document.querySelector(".data-container");

// 정렬 종류 Radio
const bubbleSortRadio = document.getElementById("bubble-sort-radio");
const insertionSortRadio = document.getElementById("insertion-sort-radio");
const selectionSortRadio = document.getElementById("selection-sort-radio");
const quickSortRadio = document.getElementById("quick-sort-radio");

// 애니메이션 딜레이 Range
const delayRange = document.getElementById("animation-delay-range");

// 애니메이션 딜레이 Input
const delayInput = document.getElementById("new-delay-input");
// 애니메이션 딜레이 Input Button
const delayInputBtn = document.getElementById("new-delay-input-btn");

// 시각화 블록 크기 Range
const sizeRange = document.getElementById("size-range");

// 사용자로부터 새로운 데이터를 입력받는 Input Text
const newDataInput = document.getElementById("new-data-input");
// 새로운 데이터를 추가하는 Button
const newDataAddBtn = document.getElementById("new-data-add-btn");
// 데이터를 삭제하는 Button
const newDataRemoveBtn = document.getElementById("new-data-remove-btn");

// 정렬 시작 Button
const sortBtn = document.getElementById("sort-btn");

// 정렬 중지 Button
const sortStopBtn = document.getElementById("sort-stop-btn");

// 정렬 진행 Button
const sortContinueBtn = document.getElementById("sort-continue-btn");

// 정렬 스텝 Button
const sortStepBtn = document.getElementById("sort-step-btn");

// 정렬 뒤로 스텝 Button
const sortStepBackBtn = document.getElementById("sort-step-back-btn");

// 블록 섞기 Button
const blockShuffleBtn = document.getElementById("block-shuffle-btn");

function generateUniqueValues(count = 20) {
  const values = [];
  while (values.length < count) {
    const value = Math.floor(Math.random() * 165 + 1);
    if (!values.includes(value)) {
      values.push(value);
    }
  }
  return values;
}

// Sort 알고리즘 클래스를 받아서 정렬을 시
const makeSortRadioOnchange = (SortAlgorithm) => () => {
  sort = new SortAlgorithm(
    sort.container,
    sort.blocks,
    sort.delay,
    sort.animationDelay,
    sort.blockWidth,
    sort.blockMargin,
    sort.description
  );
};

bubbleSortRadio.onchange = makeSortRadioOnchange(BubbleSort);
insertionSortRadio.onchange = makeSortRadioOnchange(InsertionSort);
selectionSortRadio.onchange = makeSortRadioOnchange(SelectionSort);
quickSortRadio.onchange = makeSortRadioOnchange(QuickSort);

let sort = new BubbleSort(container);
generateUniqueValues().forEach((value) => sort.addBlock(value));

delayRange.oninput = (e) => {
  const delay = Number(e.target.value);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);

  delayInput.value = Number(delayRange.max) + Number(delayRange.min) - delay; // delayInput과 값 동기화
};

// delayInput.oninput = e => {
//   const delay = Number(delayRange.max) - Number(e.target.value);

//   sort.setAnimationDelay(delay);
//   sort.setDelay(delay);
//   // delayRange와 값 동기화
//   delayRange.value = delay;
// }

delayInput.onkeydown = (e) => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // delayInputBtn에 click 이벤트 트리거
    delayInputBtn.click();
};
delayInputBtn.onclick = (e) => {
  // 입력값이 범위를 넘어서면 경계값으로 설정
  if (Number(delayInput.value) > Number(delayRange.max)) {
    delayInput.value = delayRange.max;
  } else if (Number(delayInput.value) < Number(delayRange.min)) {
    delayInput.value = delayRange.min;
  }

  const delay =
    Number(delayRange.max) + Number(delayRange.min) - Number(delayInput.value);
  sort.setAnimationDelay(delay);
  sort.setDelay(delay);
  // delayRange와 값 동기화
  delayRange.value = delay;
};

// TODO: Sort.setBlockWidth 완성한 뒤 size range의 invisible 풀기
sizeRange.onchange = (e) => {
  const size = Number(e.target.value);
  sort.setBlockWidth(size);
};

newDataInput.onkeydown = (e) => {
  // 엔터키를 누른 경우
  if (e.keyCode === 13)
    // newDataAddBtn에 click 이벤트 트리거
    newDataAddBtn.click();
};

newDataAddBtn.onclick = (e) => {
  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  sort.addBlock(value);

  newDataInput.value = "";
};

newDataRemoveBtn.onclick = (e) => {
  // 아무것도 입력하지 않았다면
  if (newDataInput.value == "") return;

  const value = Number(newDataInput.value);

  sort.removeBlock(value);

  newDataInput.value = "";
};

// 정렬 도중엔 Input들을 비활성화
function disableInputs() {
  bubbleSortRadio.disabled = true;
  insertionSortRadio.disabled = true;
  selectionSortRadio.disabled = true;
  quickSortRadio.disabled = true;

  sizeRange.disabled = true;
  sortBtn.disabled = true;
  newDataAddBtn.disabled = true;
  blockShuffleBtn.disabled = true;
}
// 정렬이 끝난 후 Input들을 활성화
function enableInputs() {
  bubbleSortRadio.disabled = false;
  insertionSortRadio.disabled = false;
  selectionSortRadio.disabled = false;
  quickSortRadio.disabled = false;

  sizeRange.disabled = false;
  sortBtn.disabled = false;
  newDataAddBtn.disabled = false;
  blockShuffleBtn.disabled = false;
}

sortBtn.onclick = (e) => {
  disableInputs(); // 정렬이 시작될 때 비활성화

  sort.sort().then(enableInputs);
};

sortStopBtn.onclick = (e) => {
  sort.stop();
};

sortContinueBtn.onclick = (e) => {
  sort.continue();
};

sortStepBtn.onclick = (e) => {
  sort.step();
};

sortStepBackBtn.onclick = (e) => {
  sort.stepBack();
};

blockShuffleBtn.onclick = (e) => {
  sort.shuffle();
};

},{"../bubble-sort/BubbleSort":2,"../insertion-sort/InsertionSort":3,"../quick-sort/QuickSort":4,"../selection-sort/SelectionSort":5,"../sort/Block":6}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTQuMTMuMS9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9kMy1zZWxlY3Rpb24vZGlzdC9kMy1zZWxlY3Rpb24uanMiLCJzcmMvYnViYmxlLXNvcnQvQnViYmxlU29ydC5qcyIsInNyYy9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0LmpzIiwic3JjL3F1aWNrLXNvcnQvUXVpY2tTb3J0LmpzIiwic3JjL3NlbGVjdGlvbi1zb3J0L1NlbGVjdGlvblNvcnQuanMiLCJzcmMvc29ydC9CbG9jay5qcyIsInNyYy9zb3J0L0NvbG9yLmpzIiwic3JjL3NvcnQvU29ydC5qcyIsInNyYy9zb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzc5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIGh0dHBzOi8vZDNqcy5vcmcvZDMtc2VsZWN0aW9uLyB2MS40LjIgQ29weXJpZ2h0IDIwMjAgTWlrZSBCb3N0b2NrXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xudHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG50eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbihnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwuZDMgPSBnbG9iYWwuZDMgfHwge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgeGh0bWwgPSBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIjtcblxudmFyIG5hbWVzcGFjZXMgPSB7XG4gIHN2ZzogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICB4aHRtbDogeGh0bWwsXG4gIHhsaW5rOiBcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIixcbiAgeG1sOiBcImh0dHA6Ly93d3cudzMub3JnL1hNTC8xOTk4L25hbWVzcGFjZVwiLFxuICB4bWxuczogXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3htbG5zL1wiXG59O1xuXG5mdW5jdGlvbiBuYW1lc3BhY2UobmFtZSkge1xuICB2YXIgcHJlZml4ID0gbmFtZSArPSBcIlwiLCBpID0gcHJlZml4LmluZGV4T2YoXCI6XCIpO1xuICBpZiAoaSA+PSAwICYmIChwcmVmaXggPSBuYW1lLnNsaWNlKDAsIGkpKSAhPT0gXCJ4bWxuc1wiKSBuYW1lID0gbmFtZS5zbGljZShpICsgMSk7XG4gIHJldHVybiBuYW1lc3BhY2VzLmhhc093blByb3BlcnR5KHByZWZpeCkgPyB7c3BhY2U6IG5hbWVzcGFjZXNbcHJlZml4XSwgbG9jYWw6IG5hbWV9IDogbmFtZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckluaGVyaXQobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5vd25lckRvY3VtZW50LFxuICAgICAgICB1cmkgPSB0aGlzLm5hbWVzcGFjZVVSSTtcbiAgICByZXR1cm4gdXJpID09PSB4aHRtbCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJID09PSB4aHRtbFxuICAgICAgICA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlModXJpLCBuYW1lKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRvckZpeGVkKGZ1bGxuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vd25lckRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdG9yKG5hbWUpIHtcbiAgdmFyIGZ1bGxuYW1lID0gbmFtZXNwYWNlKG5hbWUpO1xuICByZXR1cm4gKGZ1bGxuYW1lLmxvY2FsXG4gICAgICA/IGNyZWF0b3JGaXhlZFxuICAgICAgOiBjcmVhdG9ySW5oZXJpdCkoZnVsbG5hbWUpO1xufVxuXG5mdW5jdGlvbiBub25lKCkge31cblxuZnVuY3Rpb24gc2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID09IG51bGwgPyBub25lIDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9zZWxlY3Qoc2VsZWN0KSB7XG4gIGlmICh0eXBlb2Ygc2VsZWN0ICE9PSBcImZ1bmN0aW9uXCIpIHNlbGVjdCA9IHNlbGVjdG9yKHNlbGVjdCk7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBtID0gZ3JvdXBzLmxlbmd0aCwgc3ViZ3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzdWJncm91cCA9IHN1Ymdyb3Vwc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgc3Vibm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiAoc3Vibm9kZSA9IHNlbGVjdC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkpIHtcbiAgICAgICAgaWYgKFwiX19kYXRhX19cIiBpbiBub2RlKSBzdWJub2RlLl9fZGF0YV9fID0gbm9kZS5fX2RhdGFfXztcbiAgICAgICAgc3ViZ3JvdXBbaV0gPSBzdWJub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG5cbmZ1bmN0aW9uIGVtcHR5KCkge1xuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIHNlbGVjdG9yQWxsKHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWxlY3RvciA9PSBudWxsID8gZW1wdHkgOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3NlbGVjdEFsbChzZWxlY3QpIHtcbiAgaWYgKHR5cGVvZiBzZWxlY3QgIT09IFwiZnVuY3Rpb25cIikgc2VsZWN0ID0gc2VsZWN0b3JBbGwoc2VsZWN0KTtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzdWJncm91cHMgPSBbXSwgcGFyZW50cyA9IFtdLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzdWJncm91cHMucHVzaChzZWxlY3QuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCkpO1xuICAgICAgICBwYXJlbnRzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oc3ViZ3JvdXBzLCBwYXJlbnRzKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcihzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hlcyhzZWxlY3Rvcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9maWx0ZXIobWF0Y2gpIHtcbiAgaWYgKHR5cGVvZiBtYXRjaCAhPT0gXCJmdW5jdGlvblwiKSBtYXRjaCA9IG1hdGNoZXIobWF0Y2gpO1xuXG4gIGZvciAodmFyIGdyb3VwcyA9IHRoaXMuX2dyb3VwcywgbSA9IGdyb3Vwcy5sZW5ndGgsIHN1Ymdyb3VwcyA9IG5ldyBBcnJheShtKSwgaiA9IDA7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgbiA9IGdyb3VwLmxlbmd0aCwgc3ViZ3JvdXAgPSBzdWJncm91cHNbal0gPSBbXSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmICgobm9kZSA9IGdyb3VwW2ldKSAmJiBtYXRjaC5jYWxsKG5vZGUsIG5vZGUuX19kYXRhX18sIGksIGdyb3VwKSkge1xuICAgICAgICBzdWJncm91cC5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKHN1Ymdyb3VwcywgdGhpcy5fcGFyZW50cyk7XG59XG5cbmZ1bmN0aW9uIHNwYXJzZSh1cGRhdGUpIHtcbiAgcmV0dXJuIG5ldyBBcnJheSh1cGRhdGUubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2VudGVyKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9lbnRlciB8fCB0aGlzLl9ncm91cHMubWFwKHNwYXJzZSksIHRoaXMuX3BhcmVudHMpO1xufVxuXG5mdW5jdGlvbiBFbnRlck5vZGUocGFyZW50LCBkYXR1bSkge1xuICB0aGlzLm93bmVyRG9jdW1lbnQgPSBwYXJlbnQub3duZXJEb2N1bWVudDtcbiAgdGhpcy5uYW1lc3BhY2VVUkkgPSBwYXJlbnQubmFtZXNwYWNlVVJJO1xuICB0aGlzLl9uZXh0ID0gbnVsbDtcbiAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB0aGlzLl9fZGF0YV9fID0gZGF0dW07XG59XG5cbkVudGVyTm9kZS5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBFbnRlck5vZGUsXG4gIGFwcGVuZENoaWxkOiBmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gdGhpcy5fcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZCwgdGhpcy5fbmV4dCk7IH0sXG4gIGluc2VydEJlZm9yZTogZnVuY3Rpb24oY2hpbGQsIG5leHQpIHsgcmV0dXJuIHRoaXMuX3BhcmVudC5pbnNlcnRCZWZvcmUoY2hpbGQsIG5leHQpOyB9LFxuICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOyB9LFxuICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbihzZWxlY3RvcikgeyByZXR1cm4gdGhpcy5fcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpOyB9XG59O1xuXG5mdW5jdGlvbiBjb25zdGFudCh4KSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geDtcbiAgfTtcbn1cblxudmFyIGtleVByZWZpeCA9IFwiJFwiOyAvLyBQcm90ZWN0IGFnYWluc3Qga2V5cyBsaWtlIOKAnF9fcHJvdG9fX+KAnS5cblxuZnVuY3Rpb24gYmluZEluZGV4KHBhcmVudCwgZ3JvdXAsIGVudGVyLCB1cGRhdGUsIGV4aXQsIGRhdGEpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgbm9kZSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoO1xuXG4gIC8vIFB1dCBhbnkgbm9uLW51bGwgbm9kZXMgdGhhdCBmaXQgaW50byB1cGRhdGUuXG4gIC8vIFB1dCBhbnkgbnVsbCBub2RlcyBpbnRvIGVudGVyLlxuICAvLyBQdXQgYW55IHJlbWFpbmluZyBkYXRhIGludG8gZW50ZXIuXG4gIGZvciAoOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBQdXQgYW55IG5vbi1udWxsIG5vZGVzIHRoYXQgZG9u4oCZdCBmaXQgaW50byBleGl0LlxuICBmb3IgKDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAobm9kZSA9IGdyb3VwW2ldKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYmluZEtleShwYXJlbnQsIGdyb3VwLCBlbnRlciwgdXBkYXRlLCBleGl0LCBkYXRhLCBrZXkpIHtcbiAgdmFyIGksXG4gICAgICBub2RlLFxuICAgICAgbm9kZUJ5S2V5VmFsdWUgPSB7fSxcbiAgICAgIGdyb3VwTGVuZ3RoID0gZ3JvdXAubGVuZ3RoLFxuICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAga2V5VmFsdWVzID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKSxcbiAgICAgIGtleVZhbHVlO1xuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBub2RlLlxuICAvLyBJZiBtdWx0aXBsZSBub2RlcyBoYXZlIHRoZSBzYW1lIGtleSwgdGhlIGR1cGxpY2F0ZXMgYXJlIGFkZGVkIHRvIGV4aXQuXG4gIGZvciAoaSA9IDA7IGkgPCBncm91cExlbmd0aDsgKytpKSB7XG4gICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAga2V5VmFsdWVzW2ldID0ga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgICBpZiAoa2V5VmFsdWUgaW4gbm9kZUJ5S2V5VmFsdWUpIHtcbiAgICAgICAgZXhpdFtpXSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGtleSBmb3IgZWFjaCBkYXR1bS5cbiAgLy8gSWYgdGhlcmUgYSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleSwgam9pbiBhbmQgYWRkIGl0IHRvIHVwZGF0ZS5cbiAgLy8gSWYgdGhlcmUgaXMgbm90IChvciB0aGUga2V5IGlzIGEgZHVwbGljYXRlKSwgYWRkIGl0IHRvIGVudGVyLlxuICBmb3IgKGkgPSAwOyBpIDwgZGF0YUxlbmd0aDsgKytpKSB7XG4gICAga2V5VmFsdWUgPSBrZXlQcmVmaXggKyBrZXkuY2FsbChwYXJlbnQsIGRhdGFbaV0sIGksIGRhdGEpO1xuICAgIGlmIChub2RlID0gbm9kZUJ5S2V5VmFsdWVba2V5VmFsdWVdKSB7XG4gICAgICB1cGRhdGVbaV0gPSBub2RlO1xuICAgICAgbm9kZS5fX2RhdGFfXyA9IGRhdGFbaV07XG4gICAgICBub2RlQnlLZXlWYWx1ZVtrZXlWYWx1ZV0gPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbnRlcltpXSA9IG5ldyBFbnRlck5vZGUocGFyZW50LCBkYXRhW2ldKTtcbiAgICB9XG4gIH1cblxuICAvLyBBZGQgYW55IHJlbWFpbmluZyBub2RlcyB0aGF0IHdlcmUgbm90IGJvdW5kIHRvIGRhdGEgdG8gZXhpdC5cbiAgZm9yIChpID0gMDsgaSA8IGdyb3VwTGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoKG5vZGUgPSBncm91cFtpXSkgJiYgKG5vZGVCeUtleVZhbHVlW2tleVZhbHVlc1tpXV0gPT09IG5vZGUpKSB7XG4gICAgICBleGl0W2ldID0gbm9kZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2RhdGEodmFsdWUsIGtleSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgZGF0YSA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGogPSAtMTtcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oZCkgeyBkYXRhWysral0gPSBkOyB9KTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBiaW5kID0ga2V5ID8gYmluZEtleSA6IGJpbmRJbmRleCxcbiAgICAgIHBhcmVudHMgPSB0aGlzLl9wYXJlbnRzLFxuICAgICAgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwiZnVuY3Rpb25cIikgdmFsdWUgPSBjb25zdGFudCh2YWx1ZSk7XG5cbiAgZm9yICh2YXIgbSA9IGdyb3Vwcy5sZW5ndGgsIHVwZGF0ZSA9IG5ldyBBcnJheShtKSwgZW50ZXIgPSBuZXcgQXJyYXkobSksIGV4aXQgPSBuZXcgQXJyYXkobSksIGogPSAwOyBqIDwgbTsgKytqKSB7XG4gICAgdmFyIHBhcmVudCA9IHBhcmVudHNbal0sXG4gICAgICAgIGdyb3VwID0gZ3JvdXBzW2pdLFxuICAgICAgICBncm91cExlbmd0aCA9IGdyb3VwLmxlbmd0aCxcbiAgICAgICAgZGF0YSA9IHZhbHVlLmNhbGwocGFyZW50LCBwYXJlbnQgJiYgcGFyZW50Ll9fZGF0YV9fLCBqLCBwYXJlbnRzKSxcbiAgICAgICAgZGF0YUxlbmd0aCA9IGRhdGEubGVuZ3RoLFxuICAgICAgICBlbnRlckdyb3VwID0gZW50ZXJbal0gPSBuZXcgQXJyYXkoZGF0YUxlbmd0aCksXG4gICAgICAgIHVwZGF0ZUdyb3VwID0gdXBkYXRlW2pdID0gbmV3IEFycmF5KGRhdGFMZW5ndGgpLFxuICAgICAgICBleGl0R3JvdXAgPSBleGl0W2pdID0gbmV3IEFycmF5KGdyb3VwTGVuZ3RoKTtcblxuICAgIGJpbmQocGFyZW50LCBncm91cCwgZW50ZXJHcm91cCwgdXBkYXRlR3JvdXAsIGV4aXRHcm91cCwgZGF0YSwga2V5KTtcblxuICAgIC8vIE5vdyBjb25uZWN0IHRoZSBlbnRlciBub2RlcyB0byB0aGVpciBmb2xsb3dpbmcgdXBkYXRlIG5vZGUsIHN1Y2ggdGhhdFxuICAgIC8vIGFwcGVuZENoaWxkIGNhbiBpbnNlcnQgdGhlIG1hdGVyaWFsaXplZCBlbnRlciBub2RlIGJlZm9yZSB0aGlzIG5vZGUsXG4gICAgLy8gcmF0aGVyIHRoYW4gYXQgdGhlIGVuZCBvZiB0aGUgcGFyZW50IG5vZGUuXG4gICAgZm9yICh2YXIgaTAgPSAwLCBpMSA9IDAsIHByZXZpb3VzLCBuZXh0OyBpMCA8IGRhdGFMZW5ndGg7ICsraTApIHtcbiAgICAgIGlmIChwcmV2aW91cyA9IGVudGVyR3JvdXBbaTBdKSB7XG4gICAgICAgIGlmIChpMCA+PSBpMSkgaTEgPSBpMCArIDE7XG4gICAgICAgIHdoaWxlICghKG5leHQgPSB1cGRhdGVHcm91cFtpMV0pICYmICsraTEgPCBkYXRhTGVuZ3RoKTtcbiAgICAgICAgcHJldmlvdXMuX25leHQgPSBuZXh0IHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlID0gbmV3IFNlbGVjdGlvbih1cGRhdGUsIHBhcmVudHMpO1xuICB1cGRhdGUuX2VudGVyID0gZW50ZXI7XG4gIHVwZGF0ZS5fZXhpdCA9IGV4aXQ7XG4gIHJldHVybiB1cGRhdGU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9leGl0KCkge1xuICByZXR1cm4gbmV3IFNlbGVjdGlvbih0aGlzLl9leGl0IHx8IHRoaXMuX2dyb3Vwcy5tYXAoc3BhcnNlKSwgdGhpcy5fcGFyZW50cyk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9qb2luKG9uZW50ZXIsIG9udXBkYXRlLCBvbmV4aXQpIHtcbiAgdmFyIGVudGVyID0gdGhpcy5lbnRlcigpLCB1cGRhdGUgPSB0aGlzLCBleGl0ID0gdGhpcy5leGl0KCk7XG4gIGVudGVyID0gdHlwZW9mIG9uZW50ZXIgPT09IFwiZnVuY3Rpb25cIiA/IG9uZW50ZXIoZW50ZXIpIDogZW50ZXIuYXBwZW5kKG9uZW50ZXIgKyBcIlwiKTtcbiAgaWYgKG9udXBkYXRlICE9IG51bGwpIHVwZGF0ZSA9IG9udXBkYXRlKHVwZGF0ZSk7XG4gIGlmIChvbmV4aXQgPT0gbnVsbCkgZXhpdC5yZW1vdmUoKTsgZWxzZSBvbmV4aXQoZXhpdCk7XG4gIHJldHVybiBlbnRlciAmJiB1cGRhdGUgPyBlbnRlci5tZXJnZSh1cGRhdGUpLm9yZGVyKCkgOiB1cGRhdGU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9tZXJnZShzZWxlY3Rpb24pIHtcblxuICBmb3IgKHZhciBncm91cHMwID0gdGhpcy5fZ3JvdXBzLCBncm91cHMxID0gc2VsZWN0aW9uLl9ncm91cHMsIG0wID0gZ3JvdXBzMC5sZW5ndGgsIG0xID0gZ3JvdXBzMS5sZW5ndGgsIG0gPSBNYXRoLm1pbihtMCwgbTEpLCBtZXJnZXMgPSBuZXcgQXJyYXkobTApLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwMCA9IGdyb3VwczBbal0sIGdyb3VwMSA9IGdyb3VwczFbal0sIG4gPSBncm91cDAubGVuZ3RoLCBtZXJnZSA9IG1lcmdlc1tqXSA9IG5ldyBBcnJheShuKSwgbm9kZSwgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgIGlmIChub2RlID0gZ3JvdXAwW2ldIHx8IGdyb3VwMVtpXSkge1xuICAgICAgICBtZXJnZVtpXSA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IGogPCBtMDsgKytqKSB7XG4gICAgbWVyZ2VzW2pdID0gZ3JvdXBzMFtqXTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU2VsZWN0aW9uKG1lcmdlcywgdGhpcy5fcGFyZW50cyk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9vcmRlcigpIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAtMSwgbSA9IGdyb3Vwcy5sZW5ndGg7ICsraiA8IG07KSB7XG4gICAgZm9yICh2YXIgZ3JvdXAgPSBncm91cHNbal0sIGkgPSBncm91cC5sZW5ndGggLSAxLCBuZXh0ID0gZ3JvdXBbaV0sIG5vZGU7IC0taSA+PSAwOykge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBpZiAobmV4dCAmJiBub2RlLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5leHQpIF4gNCkgbmV4dC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShub2RlLCBuZXh0KTtcbiAgICAgICAgbmV4dCA9IG5vZGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9zb3J0KGNvbXBhcmUpIHtcbiAgaWYgKCFjb21wYXJlKSBjb21wYXJlID0gYXNjZW5kaW5nO1xuXG4gIGZ1bmN0aW9uIGNvbXBhcmVOb2RlKGEsIGIpIHtcbiAgICByZXR1cm4gYSAmJiBiID8gY29tcGFyZShhLl9fZGF0YV9fLCBiLl9fZGF0YV9fKSA6ICFhIC0gIWI7XG4gIH1cblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIG0gPSBncm91cHMubGVuZ3RoLCBzb3J0Z3JvdXBzID0gbmV3IEFycmF5KG0pLCBqID0gMDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBuID0gZ3JvdXAubGVuZ3RoLCBzb3J0Z3JvdXAgPSBzb3J0Z3JvdXBzW2pdID0gbmV3IEFycmF5KG4pLCBub2RlLCBpID0gMDsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkge1xuICAgICAgICBzb3J0Z3JvdXBbaV0gPSBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0Z3JvdXAuc29ydChjb21wYXJlTm9kZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFNlbGVjdGlvbihzb3J0Z3JvdXBzLCB0aGlzLl9wYXJlbnRzKS5vcmRlcigpO1xufVxuXG5mdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9jYWxsKCkge1xuICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMF07XG4gIGFyZ3VtZW50c1swXSA9IHRoaXM7XG4gIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fbm9kZXMoKSB7XG4gIHZhciBub2RlcyA9IG5ldyBBcnJheSh0aGlzLnNpemUoKSksIGkgPSAtMTtcbiAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkgeyBub2Rlc1srK2ldID0gdGhpczsgfSk7XG4gIHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX25vZGUoKSB7XG5cbiAgZm9yICh2YXIgZ3JvdXBzID0gdGhpcy5fZ3JvdXBzLCBqID0gMCwgbSA9IGdyb3Vwcy5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICBmb3IgKHZhciBncm91cCA9IGdyb3Vwc1tqXSwgaSA9IDAsIG4gPSBncm91cC5sZW5ndGg7IGkgPCBuOyArK2kpIHtcbiAgICAgIHZhciBub2RlID0gZ3JvdXBbaV07XG4gICAgICBpZiAobm9kZSkgcmV0dXJuIG5vZGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9zaXplKCkge1xuICB2YXIgc2l6ZSA9IDA7XG4gIHRoaXMuZWFjaChmdW5jdGlvbigpIHsgKytzaXplOyB9KTtcbiAgcmV0dXJuIHNpemU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9lbXB0eSgpIHtcbiAgcmV0dXJuICF0aGlzLm5vZGUoKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2VhY2goY2FsbGJhY2spIHtcblxuICBmb3IgKHZhciBncm91cHMgPSB0aGlzLl9ncm91cHMsIGogPSAwLCBtID0gZ3JvdXBzLmxlbmd0aDsgaiA8IG07ICsraikge1xuICAgIGZvciAodmFyIGdyb3VwID0gZ3JvdXBzW2pdLCBpID0gMCwgbiA9IGdyb3VwLmxlbmd0aCwgbm9kZTsgaSA8IG47ICsraSkge1xuICAgICAgaWYgKG5vZGUgPSBncm91cFtpXSkgY2FsbGJhY2suY2FsbChub2RlLCBub2RlLl9fZGF0YV9fLCBpLCBncm91cCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmUobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dHJSZW1vdmVOUyhmdWxsbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGVOUyhmdWxsbmFtZS5zcGFjZSwgZnVsbG5hbWUubG9jYWwpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyQ29uc3RhbnQobmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0ckNvbnN0YW50TlMoZnVsbG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdmFsdWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICBlbHNlIHRoaXMuc2V0QXR0cmlidXRlKG5hbWUsIHYpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhdHRyRnVuY3Rpb25OUyhmdWxsbmFtZSwgdmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciB2ID0gdmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodiA9PSBudWxsKSB0aGlzLnJlbW92ZUF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCk7XG4gICAgZWxzZSB0aGlzLnNldEF0dHJpYnV0ZU5TKGZ1bGxuYW1lLnNwYWNlLCBmdWxsbmFtZS5sb2NhbCwgdik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9hdHRyKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBmdWxsbmFtZSA9IG5hbWVzcGFjZShuYW1lKTtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMubm9kZSgpO1xuICAgIHJldHVybiBmdWxsbmFtZS5sb2NhbFxuICAgICAgICA/IG5vZGUuZ2V0QXR0cmlidXRlTlMoZnVsbG5hbWUuc3BhY2UsIGZ1bGxuYW1lLmxvY2FsKVxuICAgICAgICA6IG5vZGUuZ2V0QXR0cmlidXRlKGZ1bGxuYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0clJlbW92ZU5TIDogYXR0clJlbW92ZSkgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgID8gKGZ1bGxuYW1lLmxvY2FsID8gYXR0ckZ1bmN0aW9uTlMgOiBhdHRyRnVuY3Rpb24pXG4gICAgICA6IChmdWxsbmFtZS5sb2NhbCA/IGF0dHJDb25zdGFudE5TIDogYXR0ckNvbnN0YW50KSkpKGZ1bGxuYW1lLCB2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Vmlldyhub2RlKSB7XG4gIHJldHVybiAobm9kZS5vd25lckRvY3VtZW50ICYmIG5vZGUub3duZXJEb2N1bWVudC5kZWZhdWx0VmlldykgLy8gbm9kZSBpcyBhIE5vZGVcbiAgICAgIHx8IChub2RlLmRvY3VtZW50ICYmIG5vZGUpIC8vIG5vZGUgaXMgYSBXaW5kb3dcbiAgICAgIHx8IG5vZGUuZGVmYXVsdFZpZXc7IC8vIG5vZGUgaXMgYSBEb2N1bWVudFxufVxuXG5mdW5jdGlvbiBzdHlsZVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KG5hbWUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUNvbnN0YW50KG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdHlsZS5zZXRQcm9wZXJ0eShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHlsZUZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICh2ID09IG51bGwpIHRoaXMuc3R5bGUucmVtb3ZlUHJvcGVydHkobmFtZSk7XG4gICAgZWxzZSB0aGlzLnN0eWxlLnNldFByb3BlcnR5KG5hbWUsIHYsIHByaW9yaXR5KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3N0eWxlKG5hbWUsIHZhbHVlLCBwcmlvcml0eSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDFcbiAgICAgID8gdGhpcy5lYWNoKCh2YWx1ZSA9PSBudWxsXG4gICAgICAgICAgICA/IHN0eWxlUmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICAgID8gc3R5bGVGdW5jdGlvblxuICAgICAgICAgICAgOiBzdHlsZUNvbnN0YW50KShuYW1lLCB2YWx1ZSwgcHJpb3JpdHkgPT0gbnVsbCA/IFwiXCIgOiBwcmlvcml0eSkpXG4gICAgICA6IHN0eWxlVmFsdWUodGhpcy5ub2RlKCksIG5hbWUpO1xufVxuXG5mdW5jdGlvbiBzdHlsZVZhbHVlKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKVxuICAgICAgfHwgZGVmYXVsdFZpZXcobm9kZSkuZ2V0Q29tcHV0ZWRTdHlsZShub2RlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKG5hbWUpO1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eVJlbW92ZShuYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBkZWxldGUgdGhpc1tuYW1lXTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcHJvcGVydHlDb25zdGFudChuYW1lLCB2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBwcm9wZXJ0eUZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHYgPT0gbnVsbCkgZGVsZXRlIHRoaXNbbmFtZV07XG4gICAgZWxzZSB0aGlzW25hbWVdID0gdjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3Byb3BlcnR5KG5hbWUsIHZhbHVlKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMVxuICAgICAgPyB0aGlzLmVhY2goKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHByb3BlcnR5UmVtb3ZlIDogdHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHByb3BlcnR5RnVuY3Rpb25cbiAgICAgICAgICA6IHByb3BlcnR5Q29uc3RhbnQpKG5hbWUsIHZhbHVlKSlcbiAgICAgIDogdGhpcy5ub2RlKClbbmFtZV07XG59XG5cbmZ1bmN0aW9uIGNsYXNzQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcudHJpbSgpLnNwbGl0KC9efFxccysvKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NMaXN0KG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NMaXN0IHx8IG5ldyBDbGFzc0xpc3Qobm9kZSk7XG59XG5cbmZ1bmN0aW9uIENsYXNzTGlzdChub2RlKSB7XG4gIHRoaXMuX25vZGUgPSBub2RlO1xuICB0aGlzLl9uYW1lcyA9IGNsYXNzQXJyYXkobm9kZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuQ2xhc3NMaXN0LnByb3RvdHlwZSA9IHtcbiAgYWRkOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpIDwgMCkge1xuICAgICAgdGhpcy5fbmFtZXMucHVzaChuYW1lKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGkgPSB0aGlzLl9uYW1lcy5pbmRleE9mKG5hbWUpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHRoaXMuX25hbWVzLnNwbGljZShpLCAxKTtcbiAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy5fbmFtZXMuam9pbihcIiBcIikpO1xuICAgIH1cbiAgfSxcbiAgY29udGFpbnM6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjbGFzc2VkQWRkKG5vZGUsIG5hbWVzKSB7XG4gIHZhciBsaXN0ID0gY2xhc3NMaXN0KG5vZGUpLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gIHdoaWxlICgrK2kgPCBuKSBsaXN0LmFkZChuYW1lc1tpXSk7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZWRSZW1vdmUobm9kZSwgbmFtZXMpIHtcbiAgdmFyIGxpc3QgPSBjbGFzc0xpc3Qobm9kZSksIGkgPSAtMSwgbiA9IG5hbWVzLmxlbmd0aDtcbiAgd2hpbGUgKCsraSA8IG4pIGxpc3QucmVtb3ZlKG5hbWVzW2ldKTtcbn1cblxuZnVuY3Rpb24gY2xhc3NlZFRydWUobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRBZGQodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRmFsc2UobmFtZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNsYXNzZWRSZW1vdmUodGhpcywgbmFtZXMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VkRnVuY3Rpb24obmFtZXMsIHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAodmFsdWUuYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IGNsYXNzZWRBZGQgOiBjbGFzc2VkUmVtb3ZlKSh0aGlzLCBuYW1lcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9jbGFzc2VkKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBuYW1lcyA9IGNsYXNzQXJyYXkobmFtZSArIFwiXCIpO1xuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHZhciBsaXN0ID0gY2xhc3NMaXN0KHRoaXMubm9kZSgpKSwgaSA9IC0xLCBuID0gbmFtZXMubGVuZ3RoO1xuICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoIWxpc3QuY29udGFpbnMobmFtZXNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gdGhpcy5lYWNoKCh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgPyBjbGFzc2VkRnVuY3Rpb24gOiB2YWx1ZVxuICAgICAgPyBjbGFzc2VkVHJ1ZVxuICAgICAgOiBjbGFzc2VkRmFsc2UpKG5hbWVzLCB2YWx1ZSkpO1xufVxuXG5mdW5jdGlvbiB0ZXh0UmVtb3ZlKCkge1xuICB0aGlzLnRleHRDb250ZW50ID0gXCJcIjtcbn1cblxuZnVuY3Rpb24gdGV4dENvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRleHRDb250ZW50ID0gdmFsdWU7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRleHRGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHYgPSB2YWx1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX3RleHQodmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IHRleHRSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IHRleHRGdW5jdGlvblxuICAgICAgICAgIDogdGV4dENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLnRleHRDb250ZW50O1xufVxuXG5mdW5jdGlvbiBodG1sUmVtb3ZlKCkge1xuICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG59XG5cbmZ1bmN0aW9uIGh0bWxDb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaHRtbEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhbHVlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB2ID09IG51bGwgPyBcIlwiIDogdjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2h0bWwodmFsdWUpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGhcbiAgICAgID8gdGhpcy5lYWNoKHZhbHVlID09IG51bGxcbiAgICAgICAgICA/IGh0bWxSZW1vdmUgOiAodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgICA/IGh0bWxGdW5jdGlvblxuICAgICAgICAgIDogaHRtbENvbnN0YW50KSh2YWx1ZSkpXG4gICAgICA6IHRoaXMubm9kZSgpLmlubmVySFRNTDtcbn1cblxuZnVuY3Rpb24gcmFpc2UoKSB7XG4gIGlmICh0aGlzLm5leHRTaWJsaW5nKSB0aGlzLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQodGhpcyk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9yYWlzZSgpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaChyYWlzZSk7XG59XG5cbmZ1bmN0aW9uIGxvd2VyKCkge1xuICBpZiAodGhpcy5wcmV2aW91c1NpYmxpbmcpIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodGhpcywgdGhpcy5wYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fbG93ZXIoKSB7XG4gIHJldHVybiB0aGlzLmVhY2gobG93ZXIpO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fYXBwZW5kKG5hbWUpIHtcbiAgdmFyIGNyZWF0ZSA9IHR5cGVvZiBuYW1lID09PSBcImZ1bmN0aW9uXCIgPyBuYW1lIDogY3JlYXRvcihuYW1lKTtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFwcGVuZENoaWxkKGNyZWF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbnN0YW50TnVsbCgpIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9pbnNlcnQobmFtZSwgYmVmb3JlKSB7XG4gIHZhciBjcmVhdGUgPSB0eXBlb2YgbmFtZSA9PT0gXCJmdW5jdGlvblwiID8gbmFtZSA6IGNyZWF0b3IobmFtZSksXG4gICAgICBzZWxlY3QgPSBiZWZvcmUgPT0gbnVsbCA/IGNvbnN0YW50TnVsbCA6IHR5cGVvZiBiZWZvcmUgPT09IFwiZnVuY3Rpb25cIiA/IGJlZm9yZSA6IHNlbGVjdG9yKGJlZm9yZSk7XG4gIHJldHVybiB0aGlzLnNlbGVjdChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRCZWZvcmUoY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHNlbGVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IG51bGwpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICBpZiAocGFyZW50KSBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9yZW1vdmUoKSB7XG4gIHJldHVybiB0aGlzLmVhY2gocmVtb3ZlKTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lU2hhbGxvdygpIHtcbiAgdmFyIGNsb25lID0gdGhpcy5jbG9uZU5vZGUoZmFsc2UpLCBwYXJlbnQgPSB0aGlzLnBhcmVudE5vZGU7XG4gIHJldHVybiBwYXJlbnQgPyBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCB0aGlzLm5leHRTaWJsaW5nKSA6IGNsb25lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fY2xvbmVEZWVwKCkge1xuICB2YXIgY2xvbmUgPSB0aGlzLmNsb25lTm9kZSh0cnVlKSwgcGFyZW50ID0gdGhpcy5wYXJlbnROb2RlO1xuICByZXR1cm4gcGFyZW50ID8gcGFyZW50Lmluc2VydEJlZm9yZShjbG9uZSwgdGhpcy5uZXh0U2libGluZykgOiBjbG9uZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0aW9uX2Nsb25lKGRlZXApIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KGRlZXAgPyBzZWxlY3Rpb25fY2xvbmVEZWVwIDogc2VsZWN0aW9uX2Nsb25lU2hhbGxvdyk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9kYXR1bSh2YWx1ZSkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgPyB0aGlzLnByb3BlcnR5KFwiX19kYXRhX19cIiwgdmFsdWUpXG4gICAgICA6IHRoaXMubm9kZSgpLl9fZGF0YV9fO1xufVxuXG52YXIgZmlsdGVyRXZlbnRzID0ge307XG5cbmV4cG9ydHMuZXZlbnQgPSBudWxsO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBpZiAoIShcIm9ubW91c2VlbnRlclwiIGluIGVsZW1lbnQpKSB7XG4gICAgZmlsdGVyRXZlbnRzID0ge21vdXNlZW50ZXI6IFwibW91c2VvdmVyXCIsIG1vdXNlbGVhdmU6IFwibW91c2VvdXRcIn07XG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyQ29udGV4dExpc3RlbmVyKGxpc3RlbmVyLCBpbmRleCwgZ3JvdXApIHtcbiAgbGlzdGVuZXIgPSBjb250ZXh0TGlzdGVuZXIobGlzdGVuZXIsIGluZGV4LCBncm91cCk7XG4gIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciByZWxhdGVkID0gZXZlbnQucmVsYXRlZFRhcmdldDtcbiAgICBpZiAoIXJlbGF0ZWQgfHwgKHJlbGF0ZWQgIT09IHRoaXMgJiYgIShyZWxhdGVkLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKHRoaXMpICYgOCkpKSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNvbnRleHRMaXN0ZW5lcihsaXN0ZW5lciwgaW5kZXgsIGdyb3VwKSB7XG4gIHJldHVybiBmdW5jdGlvbihldmVudDEpIHtcbiAgICB2YXIgZXZlbnQwID0gZXhwb3J0cy5ldmVudDsgLy8gRXZlbnRzIGNhbiBiZSByZWVudHJhbnQgKGUuZy4sIGZvY3VzKS5cbiAgICBleHBvcnRzLmV2ZW50ID0gZXZlbnQxO1xuICAgIHRyeSB7XG4gICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHRoaXMuX19kYXRhX18sIGluZGV4LCBncm91cCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGV4cG9ydHMuZXZlbnQgPSBldmVudDA7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZXMpIHtcbiAgcmV0dXJuIHR5cGVuYW1lcy50cmltKCkuc3BsaXQoL158XFxzKy8pLm1hcChmdW5jdGlvbih0KSB7XG4gICAgdmFyIG5hbWUgPSBcIlwiLCBpID0gdC5pbmRleE9mKFwiLlwiKTtcbiAgICBpZiAoaSA+PSAwKSBuYW1lID0gdC5zbGljZShpICsgMSksIHQgPSB0LnNsaWNlKDAsIGkpO1xuICAgIHJldHVybiB7dHlwZTogdCwgbmFtZTogbmFtZX07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBvblJlbW92ZSh0eXBlbmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9uID0gdGhpcy5fX29uO1xuICAgIGlmICghb24pIHJldHVybjtcbiAgICBmb3IgKHZhciBqID0gMCwgaSA9IC0xLCBtID0gb24ubGVuZ3RoLCBvOyBqIDwgbTsgKytqKSB7XG4gICAgICBpZiAobyA9IG9uW2pdLCAoIXR5cGVuYW1lLnR5cGUgfHwgby50eXBlID09PSB0eXBlbmFtZS50eXBlKSAmJiBvLm5hbWUgPT09IHR5cGVuYW1lLm5hbWUpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG8udHlwZSwgby5saXN0ZW5lciwgby5jYXB0dXJlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9uWysraV0gPSBvO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKytpKSBvbi5sZW5ndGggPSBpO1xuICAgIGVsc2UgZGVsZXRlIHRoaXMuX19vbjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gb25BZGQodHlwZW5hbWUsIHZhbHVlLCBjYXB0dXJlKSB7XG4gIHZhciB3cmFwID0gZmlsdGVyRXZlbnRzLmhhc093blByb3BlcnR5KHR5cGVuYW1lLnR5cGUpID8gZmlsdGVyQ29udGV4dExpc3RlbmVyIDogY29udGV4dExpc3RlbmVyO1xuICByZXR1cm4gZnVuY3Rpb24oZCwgaSwgZ3JvdXApIHtcbiAgICB2YXIgb24gPSB0aGlzLl9fb24sIG8sIGxpc3RlbmVyID0gd3JhcCh2YWx1ZSwgaSwgZ3JvdXApO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGg7IGogPCBtOyArK2opIHtcbiAgICAgIGlmICgobyA9IG9uW2pdKS50eXBlID09PSB0eXBlbmFtZS50eXBlICYmIG8ubmFtZSA9PT0gdHlwZW5hbWUubmFtZSkge1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyLCBvLmNhcHR1cmUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoby50eXBlLCBvLmxpc3RlbmVyID0gbGlzdGVuZXIsIG8uY2FwdHVyZSA9IGNhcHR1cmUpO1xuICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHR5cGVuYW1lLnR5cGUsIGxpc3RlbmVyLCBjYXB0dXJlKTtcbiAgICBvID0ge3R5cGU6IHR5cGVuYW1lLnR5cGUsIG5hbWU6IHR5cGVuYW1lLm5hbWUsIHZhbHVlOiB2YWx1ZSwgbGlzdGVuZXI6IGxpc3RlbmVyLCBjYXB0dXJlOiBjYXB0dXJlfTtcbiAgICBpZiAoIW9uKSB0aGlzLl9fb24gPSBbb107XG4gICAgZWxzZSBvbi5wdXNoKG8pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25fb24odHlwZW5hbWUsIHZhbHVlLCBjYXB0dXJlKSB7XG4gIHZhciB0eXBlbmFtZXMgPSBwYXJzZVR5cGVuYW1lcyh0eXBlbmFtZSArIFwiXCIpLCBpLCBuID0gdHlwZW5hbWVzLmxlbmd0aCwgdDtcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICB2YXIgb24gPSB0aGlzLm5vZGUoKS5fX29uO1xuICAgIGlmIChvbikgZm9yICh2YXIgaiA9IDAsIG0gPSBvbi5sZW5ndGgsIG87IGogPCBtOyArK2opIHtcbiAgICAgIGZvciAoaSA9IDAsIG8gPSBvbltqXTsgaSA8IG47ICsraSkge1xuICAgICAgICBpZiAoKHQgPSB0eXBlbmFtZXNbaV0pLnR5cGUgPT09IG8udHlwZSAmJiB0Lm5hbWUgPT09IG8ubmFtZSkge1xuICAgICAgICAgIHJldHVybiBvLnZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIG9uID0gdmFsdWUgPyBvbkFkZCA6IG9uUmVtb3ZlO1xuICBpZiAoY2FwdHVyZSA9PSBudWxsKSBjYXB0dXJlID0gZmFsc2U7XG4gIGZvciAoaSA9IDA7IGkgPCBuOyArK2kpIHRoaXMuZWFjaChvbih0eXBlbmFtZXNbaV0sIHZhbHVlLCBjYXB0dXJlKSk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBjdXN0b21FdmVudChldmVudDEsIGxpc3RlbmVyLCB0aGF0LCBhcmdzKSB7XG4gIHZhciBldmVudDAgPSBleHBvcnRzLmV2ZW50O1xuICBldmVudDEuc291cmNlRXZlbnQgPSBleHBvcnRzLmV2ZW50O1xuICBleHBvcnRzLmV2ZW50ID0gZXZlbnQxO1xuICB0cnkge1xuICAgIHJldHVybiBsaXN0ZW5lci5hcHBseSh0aGF0LCBhcmdzKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBleHBvcnRzLmV2ZW50ID0gZXZlbnQwO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQobm9kZSwgdHlwZSwgcGFyYW1zKSB7XG4gIHZhciB3aW5kb3cgPSBkZWZhdWx0Vmlldyhub2RlKSxcbiAgICAgIGV2ZW50ID0gd2luZG93LkN1c3RvbUV2ZW50O1xuXG4gIGlmICh0eXBlb2YgZXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ZW50ID0gbmV3IGV2ZW50KHR5cGUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnQgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBpZiAocGFyYW1zKSBldmVudC5pbml0RXZlbnQodHlwZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKSwgZXZlbnQuZGV0YWlsID0gcGFyYW1zLmRldGFpbDtcbiAgICBlbHNlIGV2ZW50LmluaXRFdmVudCh0eXBlLCBmYWxzZSwgZmFsc2UpO1xuICB9XG5cbiAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hDb25zdGFudCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkaXNwYXRjaEV2ZW50KHRoaXMsIHR5cGUsIHBhcmFtcyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRnVuY3Rpb24odHlwZSwgcGFyYW1zKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGlzcGF0Y2hFdmVudCh0aGlzLCB0eXBlLCBwYXJhbXMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbl9kaXNwYXRjaCh0eXBlLCBwYXJhbXMpIHtcbiAgcmV0dXJuIHRoaXMuZWFjaCgodHlwZW9mIHBhcmFtcyA9PT0gXCJmdW5jdGlvblwiXG4gICAgICA/IGRpc3BhdGNoRnVuY3Rpb25cbiAgICAgIDogZGlzcGF0Y2hDb25zdGFudCkodHlwZSwgcGFyYW1zKSk7XG59XG5cbnZhciByb290ID0gW251bGxdO1xuXG5mdW5jdGlvbiBTZWxlY3Rpb24oZ3JvdXBzLCBwYXJlbnRzKSB7XG4gIHRoaXMuX2dyb3VwcyA9IGdyb3VwcztcbiAgdGhpcy5fcGFyZW50cyA9IHBhcmVudHM7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTZWxlY3Rpb24oW1tkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRdXSwgcm9vdCk7XG59XG5cblNlbGVjdGlvbi5wcm90b3R5cGUgPSBzZWxlY3Rpb24ucHJvdG90eXBlID0ge1xuICBjb25zdHJ1Y3RvcjogU2VsZWN0aW9uLFxuICBzZWxlY3Q6IHNlbGVjdGlvbl9zZWxlY3QsXG4gIHNlbGVjdEFsbDogc2VsZWN0aW9uX3NlbGVjdEFsbCxcbiAgZmlsdGVyOiBzZWxlY3Rpb25fZmlsdGVyLFxuICBkYXRhOiBzZWxlY3Rpb25fZGF0YSxcbiAgZW50ZXI6IHNlbGVjdGlvbl9lbnRlcixcbiAgZXhpdDogc2VsZWN0aW9uX2V4aXQsXG4gIGpvaW46IHNlbGVjdGlvbl9qb2luLFxuICBtZXJnZTogc2VsZWN0aW9uX21lcmdlLFxuICBvcmRlcjogc2VsZWN0aW9uX29yZGVyLFxuICBzb3J0OiBzZWxlY3Rpb25fc29ydCxcbiAgY2FsbDogc2VsZWN0aW9uX2NhbGwsXG4gIG5vZGVzOiBzZWxlY3Rpb25fbm9kZXMsXG4gIG5vZGU6IHNlbGVjdGlvbl9ub2RlLFxuICBzaXplOiBzZWxlY3Rpb25fc2l6ZSxcbiAgZW1wdHk6IHNlbGVjdGlvbl9lbXB0eSxcbiAgZWFjaDogc2VsZWN0aW9uX2VhY2gsXG4gIGF0dHI6IHNlbGVjdGlvbl9hdHRyLFxuICBzdHlsZTogc2VsZWN0aW9uX3N0eWxlLFxuICBwcm9wZXJ0eTogc2VsZWN0aW9uX3Byb3BlcnR5LFxuICBjbGFzc2VkOiBzZWxlY3Rpb25fY2xhc3NlZCxcbiAgdGV4dDogc2VsZWN0aW9uX3RleHQsXG4gIGh0bWw6IHNlbGVjdGlvbl9odG1sLFxuICByYWlzZTogc2VsZWN0aW9uX3JhaXNlLFxuICBsb3dlcjogc2VsZWN0aW9uX2xvd2VyLFxuICBhcHBlbmQ6IHNlbGVjdGlvbl9hcHBlbmQsXG4gIGluc2VydDogc2VsZWN0aW9uX2luc2VydCxcbiAgcmVtb3ZlOiBzZWxlY3Rpb25fcmVtb3ZlLFxuICBjbG9uZTogc2VsZWN0aW9uX2Nsb25lLFxuICBkYXR1bTogc2VsZWN0aW9uX2RhdHVtLFxuICBvbjogc2VsZWN0aW9uX29uLFxuICBkaXNwYXRjaDogc2VsZWN0aW9uX2Rpc3BhdGNoXG59O1xuXG5mdW5jdGlvbiBzZWxlY3Qoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIlxuICAgICAgPyBuZXcgU2VsZWN0aW9uKFtbZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcildXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW1tzZWxlY3Rvcl1dLCByb290KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlKG5hbWUpIHtcbiAgcmV0dXJuIHNlbGVjdChjcmVhdG9yKG5hbWUpLmNhbGwoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSk7XG59XG5cbnZhciBuZXh0SWQgPSAwO1xuXG5mdW5jdGlvbiBsb2NhbCgpIHtcbiAgcmV0dXJuIG5ldyBMb2NhbDtcbn1cblxuZnVuY3Rpb24gTG9jYWwoKSB7XG4gIHRoaXMuXyA9IFwiQFwiICsgKCsrbmV4dElkKS50b1N0cmluZygzNik7XG59XG5cbkxvY2FsLnByb3RvdHlwZSA9IGxvY2FsLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IExvY2FsLFxuICBnZXQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgaWQgPSB0aGlzLl87XG4gICAgd2hpbGUgKCEoaWQgaW4gbm9kZSkpIGlmICghKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpKSByZXR1cm47XG4gICAgcmV0dXJuIG5vZGVbaWRdO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKG5vZGUsIHZhbHVlKSB7XG4gICAgcmV0dXJuIG5vZGVbdGhpcy5fXSA9IHZhbHVlO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcy5fIGluIG5vZGUgJiYgZGVsZXRlIG5vZGVbdGhpcy5fXTtcbiAgfSxcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl87XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHNvdXJjZUV2ZW50KCkge1xuICB2YXIgY3VycmVudCA9IGV4cG9ydHMuZXZlbnQsIHNvdXJjZTtcbiAgd2hpbGUgKHNvdXJjZSA9IGN1cnJlbnQuc291cmNlRXZlbnQpIGN1cnJlbnQgPSBzb3VyY2U7XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBwb2ludChub2RlLCBldmVudCkge1xuICB2YXIgc3ZnID0gbm9kZS5vd25lclNWR0VsZW1lbnQgfHwgbm9kZTtcblxuICBpZiAoc3ZnLmNyZWF0ZVNWR1BvaW50KSB7XG4gICAgdmFyIHBvaW50ID0gc3ZnLmNyZWF0ZVNWR1BvaW50KCk7XG4gICAgcG9pbnQueCA9IGV2ZW50LmNsaWVudFgsIHBvaW50LnkgPSBldmVudC5jbGllbnRZO1xuICAgIHBvaW50ID0gcG9pbnQubWF0cml4VHJhbnNmb3JtKG5vZGUuZ2V0U2NyZWVuQ1RNKCkuaW52ZXJzZSgpKTtcbiAgICByZXR1cm4gW3BvaW50LngsIHBvaW50LnldO1xuICB9XG5cbiAgdmFyIHJlY3QgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICByZXR1cm4gW2V2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSBub2RlLmNsaWVudExlZnQsIGV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIG5vZGUuY2xpZW50VG9wXTtcbn1cblxuZnVuY3Rpb24gbW91c2Uobm9kZSkge1xuICB2YXIgZXZlbnQgPSBzb3VyY2VFdmVudCgpO1xuICBpZiAoZXZlbnQuY2hhbmdlZFRvdWNoZXMpIGV2ZW50ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gIHJldHVybiBwb2ludChub2RlLCBldmVudCk7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbChzZWxlY3Rvcikge1xuICByZXR1cm4gdHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiXG4gICAgICA/IG5ldyBTZWxlY3Rpb24oW2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXSwgW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudF0pXG4gICAgICA6IG5ldyBTZWxlY3Rpb24oW3NlbGVjdG9yID09IG51bGwgPyBbXSA6IHNlbGVjdG9yXSwgcm9vdCk7XG59XG5cbmZ1bmN0aW9uIHRvdWNoKG5vZGUsIHRvdWNoZXMsIGlkZW50aWZpZXIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBpZGVudGlmaWVyID0gdG91Y2hlcywgdG91Y2hlcyA9IHNvdXJjZUV2ZW50KCkuY2hhbmdlZFRvdWNoZXM7XG5cbiAgZm9yICh2YXIgaSA9IDAsIG4gPSB0b3VjaGVzID8gdG91Y2hlcy5sZW5ndGggOiAwLCB0b3VjaDsgaSA8IG47ICsraSkge1xuICAgIGlmICgodG91Y2ggPSB0b3VjaGVzW2ldKS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXR1cm4gcG9pbnQobm9kZSwgdG91Y2gpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiB0b3VjaGVzKG5vZGUsIHRvdWNoZXMpIHtcbiAgaWYgKHRvdWNoZXMgPT0gbnVsbCkgdG91Y2hlcyA9IHNvdXJjZUV2ZW50KCkudG91Y2hlcztcblxuICBmb3IgKHZhciBpID0gMCwgbiA9IHRvdWNoZXMgPyB0b3VjaGVzLmxlbmd0aCA6IDAsIHBvaW50cyA9IG5ldyBBcnJheShuKTsgaSA8IG47ICsraSkge1xuICAgIHBvaW50c1tpXSA9IHBvaW50KG5vZGUsIHRvdWNoZXNbaV0pO1xuICB9XG5cbiAgcmV0dXJuIHBvaW50cztcbn1cblxuZXhwb3J0cy5jbGllbnRQb2ludCA9IHBvaW50O1xuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGU7XG5leHBvcnRzLmNyZWF0b3IgPSBjcmVhdG9yO1xuZXhwb3J0cy5jdXN0b21FdmVudCA9IGN1c3RvbUV2ZW50O1xuZXhwb3J0cy5sb2NhbCA9IGxvY2FsO1xuZXhwb3J0cy5tYXRjaGVyID0gbWF0Y2hlcjtcbmV4cG9ydHMubW91c2UgPSBtb3VzZTtcbmV4cG9ydHMubmFtZXNwYWNlID0gbmFtZXNwYWNlO1xuZXhwb3J0cy5uYW1lc3BhY2VzID0gbmFtZXNwYWNlcztcbmV4cG9ydHMuc2VsZWN0ID0gc2VsZWN0O1xuZXhwb3J0cy5zZWxlY3RBbGwgPSBzZWxlY3RBbGw7XG5leHBvcnRzLnNlbGVjdGlvbiA9IHNlbGVjdGlvbjtcbmV4cG9ydHMuc2VsZWN0b3IgPSBzZWxlY3RvcjtcbmV4cG9ydHMuc2VsZWN0b3JBbGwgPSBzZWxlY3RvckFsbDtcbmV4cG9ydHMuc3R5bGUgPSBzdHlsZVZhbHVlO1xuZXhwb3J0cy50b3VjaCA9IHRvdWNoO1xuZXhwb3J0cy50b3VjaGVzID0gdG91Y2hlcztcbmV4cG9ydHMud2luZG93ID0gZGVmYXVsdFZpZXc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbn0pKTtcbiIsImNvbnN0IFNvcnQgPSByZXF1aXJlKFwiLi4vc29ydC9Tb3J0XCIpO1xuXG5jbGFzcyBCdWJibGVTb3J0IGV4dGVuZHMgU29ydCB7XG4gIC8vIGNvbnRhaW5lcjpET00sIGRlbGF5Ok51bWJlciwgYW5pbWF0aW9uRGVsYXk6TnVtYmVyXG4gIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICBzdXBlciguLi5hcmdzKTtcbiAgICB0aGlzLmRyYXdEZXNjcmlwdGlvbihcbmBcbmJ1YmJsZSBzb3J0KOqxsO2SiCDsoJXroKwp64qUIOyEnOuhnCDsnbjsoJHtlZwg65GQIOybkOyGjOulvCDqsoDsgqztlZjsl6wg7KCV66Cs7ZWY64qUIOyVjOqzoOumrOymmOyeheuLiOuLpC5cbuyyqyDrsojsp7gg7JuQ7IaM7JmAIOuRkCDrsojsp7gg7JuQ7IaMLCDrkZDrsojsp7gg7JuQ7IaM7JmAIOyEuCDrsojsp7gg7JuQ7IaMLCAuLi4sIG4tMeuyiOynuCDsm5DshozsmYAgbuuyiOynuCDsm5Dshozrpbwg67mE6rWQLCDqtZDtmZjtlZjrqbAg7KCV66Cs7ZWp64uI64ukLlxuMe2ajOyghOydtCDrgZ3rgpjrqbQg6rCA7J6lIO2BsCDsm5DshozripQg66eoIOuSpOuhnCDsnbTrj5ntlZjrr4DroZwg64uk7J2MIO2ajOyghOyXkOyEnOuKlCDsoJXroKzsl5DshJwg7KCc7Jm465Cp64uI64ukLlxu7J2066W8IOuwmOuzte2VoCDrlYzrp4jri6Qg7KCV66Cs7JeQ7IScIOygnOyZuOuQmOuKlCDsm5DshozqsIAg7ZWY64KY7JSpIOuKmOyWtOuCqeuLiOuLpC5cblxu7Y+J6regIOyLnOqwhCDrs7XsnqHrj4QgOiBUKG4pID0gTyhuPHN1cD4yPC9zdXA+KVxuYFxuICAgICk7XG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZSggIFxuYFxuZnVuY3Rpb24gYnViYmxlU29ydChBLCBuKSB7XG4gIGZvciAobGV0IGxhc3QgPSBuOyBsYXN0IDw9IDI7IGxhc3QtLSlcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBsYXN0IC0gMTsgaSsrKVxuICAgICAgaWYgKEFbaV0gPiBBW2kgKyAxXSlcbiAgICAgICAgc3dhcChBW2ldLEFbaSsxXSlcbn1gXG4gICAgKTtcbiAgfVxuICBcbiAgXG5cblxuICBhc3luYyBzb3J0KCkge1xuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG5cbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG5cbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuIC0gaSAtIDE7KSB7XG4gICAgICAgIC8vIO2YhOyerCDshKDtg53rkJwo7KCV66Cs7KSR7J24KSDruJTroZ3snZgg7IOJ7J2EIFJlZOuhnCDrsJTqv4hcbiAgICAgICAgYmxvY2tzW2pdLnNldENvbG9yU2VsZWN0ZWQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgICBcbiAgICAgICAgLy8g7IKs7Jqp7J6Q6rCAIOuLpOydjCDsiqTthZ3snLzroZwg64SY7Ja06rCA6riwIOyghCDquYzsp4AodGhpcy5jb250aW51ZSgpIG9yIHRoaXMuc3RlcCgpKSDquLDri6TrprxcbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgICh7aSxqfSA9IG1lbWVudG8pO1xuICAgICAgICAgIC8vIFRPRE86IFxuICAgICAgICAgIG1lbWVudG8uYmxvY2tzLmZvckVhY2goKHByZXZCbG9jayxpbmRleCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qge2NvbG9yLCB4UG9zaXRpb24sdmFsdWUsd2lkdGh9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmNvZGVEZWZhdWx0KCk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB2YWx1ZTEgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgY29uc3QgdmFsdWUyID0gYmxvY2tzW2ogKyAxXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg1KTtcbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHt2YWx1ZTF96rO8ICR7dmFsdWUyfSDruYTqtZBgKTtcbiAgICAgICAgLy8gZGVsYXnrp4ztgbwg6riw64uk66a8XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCB0aGlzLmRlbGF5KSk7XG5cbiAgICAgICAgaWYgKHZhbHVlMSA+IHZhbHVlMikge1xuICAgICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg2KTtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2YWx1ZTJ9IOuzgOqyvWApO1xuICAgICAgICAgIC8vIHN3YXAg7ZWo7IiY66GcIOuRkCDruJTroZ3snZgg7JyE7LmY66W8IOuwlOq/iDsgYXdhaXTsnYAgc3dhcCDsnbQg64Gd64KgIOuVjCDquYzsp4Ag6riw64uk66as6rKg64uk64qUIOydmOuvuFxuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3Nbal0sIGJsb2Nrc1tqICsgMV0pO1xuICAgICAgICAgIC8vIOuRkCDruJTroZ3snZgg7JyE7LmY6rCAIOuwlOuAjOyXiOycvOuvgOuhnCBibG9ja3PsnYQg7JeF642w7J207Yq4XG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8g7ISg7YOd7J20IOuBneuCrOycvOuvgOuhnCDruJTroZ3snZgg7IOJ7J2EIOybkOuemCDsg4nsnLzroZwg67CU6r+IXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgYmxvY2tzW2ogKyAxXS5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICAgICAgais9IDE7XG4gICAgICB9XG4gICAgICAvLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnYQgR3JlZW7snLzroZwg67CU6r+IXG4gICAgICBibG9ja3NbbiAtIGkgLSAxXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3Nbbi1pLTFdLmdldFZhbHVlKCl9IOu4lOuhnSDsoJXroKwg7JmE66OMYCk7XG4gICAgICBpICs9IDFcbiAgICB9XG4gICAgYmxvY2tzWzBdLnNldENvbG9yU29ydGVkKCk7XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWJibGVTb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIEluc2VydGlvblNvcnQgZXh0ZW5kcyBTb3J0IHtcbiAgLy8gY29udGFpbmVyOkRPTSwgZGVsYXk6TnVtYmVyLCBhbmltYXRpb25EZWxheTpOdW1iZXJcbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuZHJhd0Rlc2NyaXB0aW9uKFxuYFxuaW5zZXJ0IHNvcnQo7IK97J6FIOygleugrCnripQg7JuQ7IaM66W8IOydtOuvuCDsoJXroKzrkJwg67Cw7Je0IOu2gOu2hOqzvCDruYTqtZAg7ZWY7JesLCDsnpDsi6DsnZgg7JyE7LmY66W8IOywvuyVhCDsgr3snoXtlajsnLzroZzsjagg7KCV66Cs7J2EIOyZhOyEse2VmOuKlCDslYzqs6DrpqzsppjsnoXri4jri6QuXG7quLDsobTsnZgg7KCV66Cs65CcIOuwsOyXtOyXkOyEnCDsgr3snoUg65CgIOu2gOu2hOydhCDssL7slZjri6TrqbQg6re4IOychOy5mOyXkCDsm5Dshozrpbwg7IK97J6F7ZWY6riwIOychO2VtCDsm5Dshozrk6TsnYQg7ZWcIOy5uOyUqSDrkqTroZwg7J2064+Z7Iuc7YK164uI64ukLlxu7IK97J6F7KCV66Cs7J2YIOyymOydjCBrZXkg6rCS7J2AIOuRkCDrsojsp7gg7JuQ7IaM66Gc67aA7YSwIOyLnOyeke2VqeuLiOuLpC5cblxu7Y+J6regIOyLnOqwhCDrs7XsnqHrj4QgOiBUKG4pID0gTyhuPHN1cD4yPC9zdXA+KVxuYFxuICAgICk7XG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZShcbmBcbmZ1bmN0aW9uIGluc2VydGlvblNvcnQoQSwgbikge1xuICBmb3IgKGxldCBpID0gMjsgaSA8PSBuOyBpKyspIHtcbiAgICBsZXQga2V5ID0gQVtpXVxuICAgIGxldCBqID0gMFxuICAgIHdoaWxlIChqIDwgaSAmJiBBW2pdIDwga2V5KVxuICAgICAgaisrXG4gICAgc2hpZnQoQSxqLGkpIFxuICAgIEFbal0gPSBrZXkgXG4gIH1cbn1cbmBcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcblxuICAgIC8vIOydtOuvuCDsoJXroKzspJHsnbgg6rK97JqwIOuwlOuhnCDrpqzthLRcbiAgICBpZiAodGhpcy5pc1NvcnRSdW5uaW5nKVxuICAgICAgcmV0dXJuO1xuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IHRydWU7XG5cbiAgICAvLyDsg4Htg5wg7KCA7J6lIOyKpO2DnSDstIjquLDtmZRcbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gICAgLy8g67iU66GdIOyDieyDgeydhCDquLDrs7jsnLzroZwg67OA6rK9XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaChibG9jaz0+YmxvY2suc2V0Q29sb3JEZWZhdWx0KCkpO1xuXG4gICAgLy8gYmxvY2vrk6Qg6rCA7KC47Jik6riwXG4gICAgbGV0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuICAgIC8vIGJsb2Nr65Ok7J2YIOy0nSDqsJzsiJhcbiAgICBjb25zdCBuID0gYmxvY2tzLmxlbmd0aDtcblxuICAgIGJsb2Nrc1swXS5zZXRDb2xvclNvcnRlZCgpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBuOykge1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yU2VsZWN0ZWQoKTtcblxuICAgICAgbGV0IGRlc3RJbmRleCA9IGk7XG5cbiAgICAgIGNvbnN0IHRhcmdldCA9IGJsb2Nrc1tpXS5nZXRWYWx1ZSgpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7KSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J20IOuTpOyWtOqwiCDsnITsuZjrpbwg7YOQ7IOJYCk7XG5cbiAgICAgICAgY29uc3Qge3R5cGUsbWVtZW50b30gPSBhd2FpdCB0aGlzLndhaXQoKTtcbiAgICAgICAgLy8g7J207KCEIOyDge2DnOuhnCDrs7XqtaxcbiAgICAgICAgaWYgKHR5cGUgPT09IFwiYmFja1wiICYmIG1lbWVudG8gIT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29kZURlZmF1bHQoKTtcbiAgICAgICAgICAoe2ksan0gPSBtZW1lbnRvKTtcbiAgICAgICAgICAvLyBUT0RPOiBcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHtjb2xvciwgeFBvc2l0aW9uLHZhbHVlLHdpZHRofSA9IHByZXZCbG9jaztcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5ibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgYmxvY2suc2V0VmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgYmxvY2suc2V0V2lkdGgod2lkdGgpO1xuICAgICAgICAgICAgYmxvY2suc2V0Q29sb3IoY29sb3IpO1xuICAgICAgICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyDsg4Htg5wg7KCA7J6lXG4gICAgICAgIHRoaXMucHVzaE1lbWVudG8oe2ksaixibG9ja3M6Wy4uLmJsb2Nrc10ubWFwKGJsb2NrPT4oey4uLmJsb2NrfSkpfSk7XG5cbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDYsNyk7XG5cbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHRoaXMuZGVsYXkpKTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IGJsb2Nrc1tqXS5nZXRWYWx1ZSgpO1xuXG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgICBpZiAodmFsdWUgPiB0YXJnZXQpIHtcbiAgICAgICAgICBkZXN0SW5kZXggPSBqO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGorPTE7XG4gICAgICB9XG4gICAgICBpZiAoaSAhPSBkZXN0SW5kZXgpIHtcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDgpO1xuICAgICAgICBibG9ja3NbZGVzdEluZGV4XS5zZXRDb2xvclNlbGVjdGVkKCk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5zaGlmdChkZXN0SW5kZXgsIGkpO1xuXG4gICAgICAgIHRoaXMuY29kZUhpZ2hsaWdodCg5KTtcbiAgICAgICAgaWYgKGRlc3RJbmRleCAhPSAwKVxuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydhCAke2Jsb2Nrc1tkZXN0SW5kZXgtMV0uZ2V0VmFsdWUoKX0g67iU66Gd6rO8ICR7YmxvY2tzW2Rlc3RJbmRleF0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOyCrOydtOyXkCDsgr3snoVgKTtcbiAgICAgICAgZWxzZSBpZiAoZGVzdEluZGV4ID09IDApXG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihgJHtibG9ja3NbaV0uZ2V0VmFsdWUoKX0g67iU66Gd7J2EICR7YmxvY2tzW2Rlc3RJbmRleF0uZ2V0VmFsdWUoKX0g67iU66Gd7J2YIOychOy5mOyXkCDsgr3snoVgKTtcblxuICAgICAgICBhd2FpdCB0aGlzLmluc2VydEF0KGJsb2Nrc1tpXSwgZGVzdEluZGV4KTtcbiAgICAgICAgXG4gICAgICAgIGJsb2Nrc1tkZXN0SW5kZXhdLnNldENvbG9yU29ydGVkKCk7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCR7YmxvY2tzW2ldLmdldFZhbHVlKCl9IOu4lOuhneydmCDsnITsuZgg67OA6rK9IOyXhuydjGApO1xuICAgICAgYmxvY2tzW2ldLnNldENvbG9yU29ydGVkKCk7XG4gICAgICB0aGlzLnJlZnJlc2hCbG9ja3MoKTtcbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnNlcnRpb25Tb3J0O1xuIiwiY29uc3QgU29ydCA9IHJlcXVpcmUoXCIuLi9zb3J0L1NvcnRcIik7XG5cbmNsYXNzIFF1aWNrU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXG5gXG5xdWljayBzb3J0KO2AtSDsoJXroKwp64qUIOq4sOykgOygkChwaXZvdCnsnYQg6riw7KSA7Jy866GcIOuRkCDqsJzsnZgg67aE7ZWg65CcIOu2gOu2hCDrpqzsiqTtirjrpbwg7KCV66Cs7ZWcIOuLpOydjCDtlantlZjsl6wg7KCE7LK06rCAIOygleugrOuQnCDrpqzsiqTtirjqsIAg65CY6rKMIO2VmOuKlCDslYzqs6DrpqzsppjsnoXri4jri6QuXG7rtoTtlaAg7KCV67O1IOyVjOqzoOumrOymmOydmCDtlZjrgpjroZwsIO2Pieq3oOyggeycvOuhnCDrp6TsmrAg67mg66W4IOyImO2WiSDsho3rj4Trpbwg7J6Q656R7ZWp64uI64ukLlxuXG7tj4nqt6Ag7Iuc6rCEIOuzteyeoeuPhCA6IFQobikgPSBPKG4gKiBsb2cobikpXG5gXG4gICAgKTtcbiAgICB0aGlzLmRyYXdQc2V1ZG9Db2RlKFxuYGZ1bmN0aW9uIHF1aWNrU29ydChBLCBwLCByKSB7XG4gIGlmIChwIDwgcikge1xuICAgIGxldCBxID0gcGFydGl0aW9uKEEsIHAsIHIpXG4gICAgcXVpY2tTb3J0KEEsIHAsIHEtMSlcbiAgICBxdWlja1NvcnQoQSwgcSsxLCByKVxuICB9XG59XG5mdW5jdGlvbiBwYXJ0aXRpb24oQSwgcCwgcikge1xuICBsZXQgcGl2b3QgPSBBWyhwK3IpLzIpXVxuICBsZXQgbGVmdCA9IHA7XG4gIGxldCByaWdodCA9IHI7XG4gIGRvIHtcbiAgICB3aGlsZSAoQVtsZWZ0XSA8IHBpdm90KSBcbiAgICAgIGxlZnQrK1xuICAgIHdoaWxlIChBW3JpZ2h0XSA+IHBpdm90KSBcbiAgICAgIHJpZ2h0LS1cbiAgICBpZiAobGVmdCA8PSByaWdodCkgXG4gICAgICAgc3dhcChBW2xlZnQtLV0sQVtyaWdodCsrXSlcbiAgfSB3aGlsZSAobGVmdCA8PSByaWdodClcbiAgcmV0dXJuIHJpZ2h0ID49IHAgPyByaWdodCA6IHBcbn1cbmBcbiAgICApO1xuICB9XG5cbiAgYXN5bmMgc29ydChsZWZ0ID0gMCwgcmlnaHQgPSB0aGlzLmJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgLy8g7J2066+4IOygleugrOykkeyduCDqsr3smrAg67CU66GcIOumrO2EtFxuICAgIGlmICh0aGlzLmlzU29ydFJ1bm5pbmcpIHJldHVybjtcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgLy8g7IOB7YOcIOyggOyepSDsiqTtg50g7LSI6riw7ZmUXG4gICAgdGhpcy5tZW1ldG9TdGFjayA9IFtdO1xuICAgIC8vIOu4lOuhnSDsg4nsg4HsnYQg6riw67O47Jy866GcIOuzgOqyvVxuICAgIHRoaXMuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG5cbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgbGV0IGxzdGFjayA9IFtdO1xuICAgIGxldCByc3RhY2sgPSBbXTtcblxuICAgIGxzdGFjay5wdXNoKGxlZnQpO1xuICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcblxuICAgIHdoaWxlIChsc3RhY2subGVuZ3RoICE9IDApIHtcbiAgICAgIGxldCBwbCA9IChsZWZ0ID0gbHN0YWNrLnBvcCgpKTsgLy8g7Jm87Kq9IOy7pOyEnFxuICAgICAgbGV0IHByID0gKHJpZ2h0ID0gcnN0YWNrLnBvcCgpKTsgLy8g7Jik66W47Kq9IOy7pOyEnFxuICAgICAgbGV0IHBpdm90SWR4ID0gTWF0aC5jZWlsKChsZWZ0ICsgcmlnaHQpIC8gMik7XG4gICAgICBsZXQgcGl2b3QgPSBibG9ja3NbcGl2b3RJZHhdOyAvLyDtlLzrspdcblxuICAgICAgLy8g7ZiE7J6sIOyVjOqzoOumrOymmOydtCDrsJTrnbzrs7TripQg67iU66Gd65Ok7J2YIOyDiSDrs4Dqsr1cbiAgICAgIGJsb2Nrc1xuICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGxlZnQgPD0gaWR4ICYmIGlkeCA8PSByaWdodClcbiAgICAgICAgLmZvckVhY2goKGJsb2NrKSA9PiBibG9jay5zZXRDb2xvckJvdW5kYXJ5KCkpO1xuICAgICAgLy8g7ZS867KX7J2YIOyDiSDrs4Dqsr1cbiAgICAgIHBpdm90LnNldENvbG9yUGl2b3QoKTtcbiAgICAgIFxuICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDkpO1xuICAgICAgYXdhaXQgdGhpcy5zbGVlcChcIjUwXCIpO1xuXG4gICAgICBkbyB7XG4gICAgICAgIHdoaWxlIChibG9ja3NbcGxdLmdldFZhbHVlKCkgPCBwaXZvdC5nZXRWYWx1ZSgpKSBwbCsrO1xuICAgICAgICB3aGlsZSAoYmxvY2tzW3ByXS5nZXRWYWx1ZSgpID4gcGl2b3QuZ2V0VmFsdWUoKSkgcHItLTtcblxuICAgICAgICBibG9ja3NbcGxdLnNldENvbG9yU2VsZWN0ZWQoKTtcbiAgICAgICAgYmxvY2tzW3ByXS5zZXRDb2xvclNlbGVjdGVkKCk7XG4gICAgICAgIC8vIHBsIOuYkOuKlCBwcuydtCBwaXZvdOqzvCDqsrnss5Drj4QgcGl2b3TsnZgg7IOJ7J2EIOycoOyngFxuICAgICAgICBwaXZvdC5zZXRDb2xvclBpdm90KCk7XG5cbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDEzLDE0LDE1LDE2KVxuXG4gICAgICAgIGNvbnN0IHsgdHlwZSwgbWVtZW50byB9ID0gYXdhaXQgdGhpcy53YWl0KCk7XG5cbiAgICAgICAgLy8g7IOB7YOcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIpIHtcbiAgICAgICAgICAoeyBsc3RhY2ssIHJzdGFjaywgcGwsIHByLCBsZWZ0LCByaWdodCwgcGl2b3RJZHggfSA9IG1lbWVudG8pO1xuICAgICAgICAgIHBpdm90ID0gYmxvY2tzW3Bpdm90SWR4XTtcbiAgICAgICAgICBtZW1lbnRvLmJsb2Nrcy5mb3JFYWNoKChwcmV2QmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGNvbG9yLCB4UG9zaXRpb24sIHZhbHVlLCB3aWR0aCB9ID0gcHJldkJsb2NrO1xuICAgICAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICBibG9jay5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICBibG9jay5zZXRXaWR0aCh3aWR0aCk7XG4gICAgICAgICAgICBibG9jay5zZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBibG9jay5zZXRYUG9zaXRpb24oeFBvc2l0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIO2YhOyerCDsg4Htg5zrpbwg7Iqk7YOd7JeQIOyggOyepVxuICAgICAgICB0aGlzLnB1c2hNZW1lbnRvKHtcbiAgICAgICAgICBwbCxcbiAgICAgICAgICBwcixcbiAgICAgICAgICBwaXZvdElkeCxcbiAgICAgICAgICBsZWZ0LFxuICAgICAgICAgIHJpZ2h0LFxuICAgICAgICAgIGxzdGFjazogWy4uLmxzdGFjaywgcGxdLFxuICAgICAgICAgIHJzdGFjazogWy4uLnJzdGFjaywgcHJdLFxuICAgICAgICAgIGJsb2NrczogWy4uLmJsb2Nrc10ubWFwKChibG9jaykgPT4gKHsgLi4uYmxvY2sgfSkpLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocGwgPD0gcHIpIHtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoMTgpO1xuICAgICAgICAgIGF3YWl0IHRoaXMuc3dhcChibG9ja3NbcGwrK10sIGJsb2Nrc1twci0tXSk7XG4gICAgICAgICAgLy8gc3dhcChibG9ja3MsIHBsKyssIHByLS0pO1xuICAgICAgICAgIHRoaXMucmVmcmVzaEJsb2NrcygpO1xuICAgICAgICB9XG4gICAgICAgIGJsb2Nrc1twbCAtIDFdLnNldENvbG9yQm91bmRhcnkoKTtcbiAgICAgICAgYmxvY2tzW3ByICsgMV0uc2V0Q29sb3JCb3VuZGFyeSgpO1xuICAgICAgfSB3aGlsZSAocGwgPD0gcHIpO1xuXG4gICAgICBpZiAobGVmdCA8IHByKSB7XG4gICAgICAgIGxzdGFjay5wdXNoKGxlZnQpO1xuICAgICAgICByc3RhY2sucHVzaChwcik7XG4gICAgICB9XG4gICAgICBpZiAocGwgPCByaWdodCkge1xuICAgICAgICBsc3RhY2sucHVzaChwbCk7XG4gICAgICAgIHJzdGFjay5wdXNoKHJpZ2h0KTtcbiAgICAgIH1cbiAgICAgIC8vIO2YhOyerCDslYzqs6DrpqzsppjsnbQg67CU652867O064qUIOu4lOuhneuTpOydmCDsg4nsnYQg7JuQ656Y64yA66GcIOuzgOqyvVxuICAgICAgYmxvY2tzXG4gICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gbGVmdCA8PSBpZHggJiYgaWR4IDw9IHJpZ2h0KVxuICAgICAgICAuZm9yRWFjaCgoYmxvY2spID0+IGJsb2NrLnNldENvbG9yRGVmYXVsdCgpKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBRdWlja1NvcnQ7XG4iLCJjb25zdCBTb3J0ID0gcmVxdWlyZShcIi4uL3NvcnQvU29ydFwiKTtcblxuY2xhc3MgU2VsZWN0aW9uU29ydCBleHRlbmRzIFNvcnQge1xuICAvLyBjb250YWluZXI6RE9NLCBkZWxheTpOdW1iZXIsIGFuaW1hdGlvbkRlbGF5Ok51bWJlclxuICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy5kcmF3RGVzY3JpcHRpb24oXG5gXG5zZWxlY3Rpb24gc29ydCjshKDtg50g7KCV66CsKeuKlCDtlbTri7kg7Iic7ISc7JeQIOybkOyGjOulvCDrhKPsnYQg7JyE7LmY64qUIOydtOuvuCDsoJXtlbTsoLgg7J6I6rOgLCDslrTrlqQg7JuQ7IaM66W8IOuEo+ydhOyngCDshKDtg53tlZjripQg7JWM6rOg66as7KaY7J6F64uI64ukLlxu7LWc7IaM6rCS7J2EIO2DkOyDiSDtm4Qg6re4IOqwkuydhCDslZ7sl5DshJzrtoDthLAg67Cw7Je07ZWY64qUIOuwqeyLneyeheuLiOuLpC5cblxu7Y+J6regIOyLnOqwhCDrs7XsnqHrj4QgOiBUKG4pID0gTyhuPHN1cD4yPC9zdXA+KVxuYFxuICAgICk7XG4gICAgdGhpcy5kcmF3UHNldWRvQ29kZSggIFxuIGBcbmZ1bmN0aW9uIHNlbGVjdGlvblNvcnQoQSwgbikge1xuICBmb3IobGV0IGkgPSAwOyBpIDwgbi0xOyBpKyspe1xuICAgIG1pbiA9IGlcbiAgICBmb3IobGV0IGogPSBpICsgMTsgaiA8IG47IGorKykge1xuICAgICAgaWYoQVtqXSA8IEFbbWluXSlcbiAgICAgICAgbWluID0galxuICAgIH1cbiAgICBpZihtaW4gIT0gaSlcbiAgICAgIHN3YXAoQVtpXSxBW21pbl0pXG4gIH1cbn1cbmAgICApO1xuICB9XG5cbiAgYXN5bmMgc29ydCgpIHtcbiAgICAvLyDsnbTrr7gg7KCV66Cs7KSR7J24IOqyveyasCDrsJTroZwg66as7YS0XG4gICAgaWYgKHRoaXMuaXNTb3J0UnVubmluZylcbiAgICAgIHJldHVybjtcbiAgICBcbiAgICB0aGlzLmlzU29ydFJ1bm5pbmcgPSB0cnVlO1xuICAgIFxuICAgIC8vIOyDge2DnCDsoIDsnqUg7Iqk7YOdIOy0iOq4sO2ZlFxuICAgIHRoaXMubWVtZXRvU3RhY2sgPSBbXTtcbiAgICAvLyDruJTroZ0g7IOJ7IOB7J2EIOq4sOuzuOycvOuhnCDrs4Dqsr1cbiAgICB0aGlzLmJsb2Nrcy5mb3JFYWNoKGJsb2NrPT5ibG9jay5zZXRDb2xvckRlZmF1bHQoKSk7XG5cbiAgICAvLyBibG9ja+uTpCDqsIDsoLjsmKTquLBcbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgLy8gYmxvY2vrk6TsnZgg7LSdIOqwnOyImFxuICAgIGNvbnN0IG4gPSBibG9ja3MubGVuZ3RoO1xuICAgIGxldCBtaW47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG4gLSAxOykge1xuICAgICAgbWluID0gaTtcbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNlbGVjdGVkKCk7IC8vaeuyiOynuOu4lOufrSDruajqsITsg4nsnLzroZxcbiAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG47KSB7XG4gICAgICAgIGJsb2Nrc1tqXS5zZXRDb2xvclNlbGVjdGVkKCk7IC8vIGkrMeuyiOu2gO2EsG4tMeuyiOq5jOyngOydmCDruJTrn63snYQg7LCo66GA64yA66GcIOu5qOqwhOyDieycvOuhnFxuICAgICAgICBcblxuICAgICAgICBjb25zdCB7dHlwZSxtZW1lbnRvfSA9IGF3YWl0IHRoaXMud2FpdCgpO1xuICAgICAgICAvLyDsnbTsoIQg7IOB7YOc66GcIOuzteq1rFxuICAgICAgICBpZiAodHlwZSA9PT0gXCJiYWNrXCIgJiYgbWVtZW50byAhPSBudWxsKSB7XG4gICAgICAgICAgKHtpLGp9ID0gbWVtZW50byk7XG4gICAgICAgICAgLy8gVE9ETzogXG4gICAgICAgICAgbWVtZW50by5ibG9ja3MuZm9yRWFjaCgocHJldkJsb2NrLGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7Y29sb3IsIHhQb3NpdGlvbix2YWx1ZSx3aWR0aH0gPSBwcmV2QmxvY2s7XG4gICAgICAgICAgICBjb25zdCBibG9jayA9IHRoaXMuYmxvY2tzW2luZGV4XTtcbiAgICAgICAgICAgIGJsb2NrLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFdpZHRoKHdpZHRoKTtcbiAgICAgICAgICAgIGJsb2NrLnNldENvbG9yKGNvbG9yKTtcbiAgICAgICAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih4UG9zaXRpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuY29kZURlZmF1bHQoKTtcblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIOyDge2DnCDsoIDsnqVcbiAgICAgICAgdGhpcy5wdXNoTWVtZW50byh7aSxqLGJsb2NrczpbLi4uYmxvY2tzXS5tYXAoYmxvY2s9Pih7Li4uYmxvY2t9KSl9KTtcbiAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDYpO1xuICAgICAgICAvLyBkZWxheeunjO2BvCDquLDri6TrprwvL1xuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgdGhpcy5kZWxheSkpO1xuICAgICAgICBsZXQgdmFsdWUxID0gYmxvY2tzW21pbl0uZ2V0VmFsdWUoKTsgLy/rs4DsiJgg7ISk7KCVXG4gICAgICAgIGxldCB2YWx1ZTIgPSBibG9ja3Nbal0uZ2V0VmFsdWUoKTtcbiAgICAgICAgaWYoajxuLTEpe1xuICAgICAgICAgIGxldCB2Y21wID0gYmxvY2tzW2orMV0uZ2V0VmFsdWUoKTtcbiAgICAgICAgICB0aGlzLnNldERlc2NyaXB0aW9uKGAke3ZhbHVlMX3qs7wgJHt2Y21wfSDruYTqtZBgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUxID49IHZhbHVlMikge1xuICAgICAgICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oYCDtmITsnqwg7LWc7Iaf6rCSIDogJHt2YWx1ZTJ9YCk7XG4gICAgICAgICAgbWluID0gajtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoNyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgIT0gbWluICYmIGogPT0gbiAtIDEpIHtcbiAgICAgICAgICB0aGlzLmNvZGVIaWdobGlnaHQoOSk7XG4gICAgICAgICAgdGhpcy5zZXREZXNjcmlwdGlvbihg7LWc7Iaf6rCS6rO8IO2YhOyerCDqsJLsnYQg6rWQ7ZmY7ZWc64ukYCk7XG4gICAgICAgICAgYXdhaXQgdGhpcy5zd2FwKGJsb2Nrc1ttaW5dLCBibG9ja3NbaV0pOyAvLyDruJTrn60g7LK07J247KeAXG4gICAgICAgICAgdGhpcy5jb2RlSGlnaGxpZ2h0KDEwKTtcbiAgICAgICAgICBtaW4gPSBpOyAvLyBtaW7qsJLstIjquLDtmZRcbiAgICAgICAgICBibG9ja3NbbWluXS5zZXRDb2xvckRlZmF1bHQoKTsgLy8g7JyE7LmY6rCAIOuwlOuAjOuKlCDrjIDsg4HruJTroZ3sg4nquZQg7YyM656A7IOJ7Jy866GcXG4gICAgICAgICAgdGhpcy5yZWZyZXNoQmxvY2tzKCk7IC8v65GQIOu4lOuhneydmCDsnITsuZjqsIAg67CU64CM7JeI7Jy866+A66GcIGJsb2Nrc+ulvCDsl4XrjbDsnbTtirhcbiAgICAgICAgfVxuICAgICAgICBibG9ja3Nbal0uc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOybkOuemCDsg4nquZTroZwg65CY64+M66as6riwXG4gICAgICAgIGogKz0gMTtcbiAgICAgIH1cbiAgICAgIGJsb2Nrc1tpXS5zZXRDb2xvclNvcnRlZCgpO1xuICAgICAgaSArPSAxO1xuICAgIH1cblxuICAgIC8vIOygleugrOydtCDrgZ3rgqzsnLzrr4DroZwg66eI7KeA66eJIOu4lOuhneuPhCBHcmVlbuycvOuhnCDsg4kg67OA6rK9XG4gICAgYmxvY2tzW24gLSAxXS5zZXRDb2xvclNvcnRlZCgpO1xuXG4gICAgdGhpcy5pc1NvcnRSdW5uaW5nID0gZmFsc2U7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gU2VsZWN0aW9uU29ydDtcbiIsImNvbnN0IENvbG9yID0gcmVxdWlyZSgnLi9Db2xvcicpO1xuXG5jbGFzcyBCbG9jayB7XG4gIC8vIHN0YXRpYyBmYWN0b3J5IG1ldGhvZDsgdmFsdWXsmYAgY29udGFpbmVy66W8IOydtOyaqe2VtCBCbG9jayDqsJ3ssrTrpbwg66eM65Og64ukXG4gIHN0YXRpYyBjcmVhdGVOZXdCbG9jayh2YWx1ZSwgY29udGFpbmVyLCBibG9ja1dpZHRoID0gMjgsIGJsb2NrTWFyZ2luID0gMikge1xuICAgIGNvbnN0IGJsb2NrQ291bnQgPSBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZHJlbikuZmlsdGVyKGRvbSA9PiBkb20uY2xhc3NMaXN0LmNvbnRhaW5zKCdibG9jaycpKS5sZW5ndGg7XG4gICAgY29uc3QgeFBvc2l0aW9uID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuXG4gICAgcmV0dXJuIG5ldyBCbG9jayh2YWx1ZSwgY29udGFpbmVyLCB4UG9zaXRpb24sIGJsb2NrV2lkdGgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IodmFsdWUsIGNvbnRhaW5lciwgeFBvc2l0aW9uLCAgd2lkdGgsdHJhbnNpdGlvbkR1cmF0aW9uPTIwMCkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnN0IGJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBibG9jay5jbGFzc0xpc3QuYWRkKFwiYmxvY2tcIik7XG5cbiAgICBjb25zdCBibG9ja0xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICAgIGJsb2NrTGFiZWwuY2xhc3NMaXN0LmFkZChcImJsb2NrX19pZFwiKTtcblxuICAgIGJsb2NrLmFwcGVuZENoaWxkKGJsb2NrTGFiZWwpO1xuICBcbiAgICB0aGlzLmRvbSA9IGJsb2NrO1xuXG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5zZXRDb2xvckRlZmF1bHQoKTtcbiAgICB0aGlzLnNldFRyYW5zaXRpb25EdXJhdGlvbih0cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgIHRoaXMuc2V0V2lkdGgod2lkdGgpO1xuICAgIHRoaXMuc2V0WFBvc2l0aW9uKHhQb3NpdGlvbik7XG5cbiAgICAvLyDtmZTrqbTsl5Ag67iU66GdIO2RnOyLnFxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChibG9jayk7XG4gIH1cbiAgc3dhcEJsb2NrKGJsb2NrKSB7XG4gICAgY29uc3QgYW5pbWF0aW9uRGVsYXkgPSB0aGlzLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBuZXh0T2ZUYXJnZXQxID0gdGhpcy5kb20ubmV4dFNpYmxpbmc7XG4gICAgICAgICAgY29uc3QgbmV4dE9mVGFyZ2V0MiA9IGJsb2NrLmRvbS5uZXh0U2libGluZztcblxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZSh0aGlzLmRvbSwgbmV4dE9mVGFyZ2V0Mik7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbmV4dE9mVGFyZ2V0MSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9LCBhbmltYXRpb25EZWxheSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGluc2VydEJlZm9yZShibG9jaykge1xuICAgIGNvbnN0IGFuaW1hdGlvbkRlbGF5ID0gdGhpcy5nZXRUcmFuc2l0aW9uRHVyYXRpb24oKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKHRoaXMuZG9tLCBibG9jay5kb20pO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVsYXkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRUcmFuc2l0aW9uRHVyYXRpb24obWlsbGlzKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uRHVyYXRpb24gPSBtaWxsaXM7XG4gICAgdGhpcy5kb20uc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gYCR7dGhpcy50cmFuc2l0aW9uRHVyYXRpb259bXNgO1xuICB9XG5cbiAgZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkge1xuICAgIC8vIHJldHVybiBOdW1iZXIoXG4gICAgLy8gICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoXCJzXCIsIDApXG4gICAgLy8gKTtcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uRHVyYXRpb247XG4gIH1cblxuICBzZXRYUG9zaXRpb24oeCkge1xuICAgIHRoaXMueFBvc2l0aW9uID0geDtcbiAgICB0aGlzLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3RoaXMueFBvc2l0aW9ufXB4KWA7XG4gIH1cblxuICBnZXRYUG9zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMueFBvc2l0aW9uO1xuICAgIC8vIGNvbnN0IHJlZ0V4cFRyYW5zWCA9IC9bXFx3XStcXChbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/W1xcZF0rWyBdPyxbIF0/KFtcXGRdKylbIF0/LFsgXT9bXFxkXStbIF0/XFwpLztcbiAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRvbSkudHJhbnNmb3JtO1xuICAgIC8vIHJldHVybiByZWdFeHBUcmFuc1guZXhlYyh0cmFuc2Zvcm0pWzFdO1xuICB9XG5cbiAgc2V0V2lkdGgocHgpIHtcbiAgICB0aGlzLndpZHRoID0gcHg7XG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcbiAgfVxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfVxuXG4gIHNldENvbG9yKGNvbG9yKSB7XG4gICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yO1xuICB9XG5cbiAgZ2V0Q29sb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sb3I7XG4gIH1cblxuICAvLyBibG9ja+ydhCDshKDtg53rkJwg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yU2VsZWN0ZWQoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnNlbGVjdGVkO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7ISg7YOd65CcIOu4lOuhnSA6IOu5qOqwlSAtPiDsl7Drs7TrnbxcbiAgfVxuXG4gIC8vIGJsb2Nr7J2EIOq4sOuzuCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JEZWZhdWx0KCkge1xuICAgIHRoaXMuY29sb3IgPSBDb2xvci5kZWZhdWx0Q29sb3I7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy/quLDrs7gg67iU66GdOiDtjIzrnpEgLT4g7Jew7ZWR7YGsXG4gIH1cblxuICAvLyBibG9ja+ydhCDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsnLzroZwg67CU6r6464qUIO2VqOyImFxuICBzZXRDb2xvclNvcnRlZCgpIHtcbiAgICB0aGlzLmNvbG9yID0gQ29sb3Iuc29ydGVkO1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7KCV66CsIOuBneuCnCDruJTroZ06IOq3uOumsCjstIjroZ0pIC0+IOywkO2Vke2BrFxuICB9XG5cbiAgLy8gYmxvY2vsnYQgUGl2b3Qg67iU66Gd7J2YIOyDieycvOuhnCDrsJTqvrjripQg7ZWo7IiYXG4gIHNldENvbG9yUGl2b3QoKSB7XG4gICAgdGhpcy5jb2xvciA9IENvbG9yLnBpdm90O1xuICAgIHRoaXMuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7IC8v7ZS867KXIOu4lOuhnSA6IO2Yleq0kSDtlZHtgawgLT4gIOywkOuztOudvFxuICB9XG5cbiAgLy8gYmxvY2vsnYQg6rK96rOE66W8IOuCmO2DgOuCtOuKlCDruJTroZ3snZgg7IOJ7Jy866GcIOuwlOq+uOuKlCDtlajsiJhcbiAgc2V0Q29sb3JCb3VuZGFyeSgpIHtcbiAgICB0aGlzLmNvbG9yID0gQ29sb3IuYm91bmRhcnk7XG4gICAgdGhpcy5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjsgLy8g67iU65+tIOqyveqzhCA6IOuztOudvCAtPiDrhbjrnpEgXG4gIH1cblxuICBzZXRWYWx1ZSh2YWx1ZSl7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIC8vIOu4lOuhneydmCDstZzrjIAg64aS7J2064qUIOy7qO2FjOydtOuEiOydmCDrhpLsnbQgLSAyNHB4XG4gICAgY29uc3QgbWF4SGlnaHQgPVxuICAgICAgTnVtYmVyKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpKSAtIDI0O1xuICAgIGxldCBibG9ja0hpZ2h0ID0gdmFsdWUgKiAzO1xuICAgIHRoaXMuZG9tLnN0eWxlLmhlaWdodCA9IGAke2Jsb2NrSGlnaHQgPCBtYXhIaWdodCA/IGJsb2NrSGlnaHQgOiBtYXhIaWdodH1weGA7XG5cbiAgICB0aGlzLmRvbS5maXJzdENoaWxkLmlubmVySFRNTCA9IHZhbHVlO1xuICB9XG5cbiAgLy8gYmxvY2vsnZggdmFsdWXrpbwg67CY7ZmY7ZWY64qUIO2VqOyImFxuICBnZXRWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrO1xuIiwiXG5cbi8vIOq4sOuzuCDruJTroZ0g7IOJ7IOBXG5jb25zdCBkZWZhdWx0Q29sb3IgPSBcIiNGRjlGQjNcIjtcblxuLy8g67iU66Gd7J20IOyEoO2DneuQmOyXiOydhCDrlYwg7IOJ7IOBXG5jb25zdCBzZWxlY3RlZCA9IFwiI0I2OUFFN1wiO1xuXG4vLyDsoJXroKzsnbQg64Gd64KcIOu4lOuhneydmCDsg4nsg4FcbmNvbnN0IHNvcnRlZCA9IFwiI0ZGNkM3N1wiO1xuXG4vLyBQaXZvdCDruJTroZ3snZgg7IOJ7IOBIChRdWljayBTb3J07JeQ7ISc7J2YIFBpdm90KVxuY29uc3QgcGl2b3QgPSBcIiM5RjcwRjFcIjtcblxuLy8gUXVpY2sgU29ydOyXkOyEnCBQYXJ0aXRpb24g7ZWo7IiY7J2YIOuMgOyDgeyduCDruJTroZ3rk6TsnZgg7IOJ7IOBXG5jb25zdCBib3VuZGFyeSA9IFwiI0Y1RTM0OFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkZWZhdWx0Q29sb3IsXG4gICAgc2VsZWN0ZWQsXG4gICAgc29ydGVkLFxuICAgIHBpdm90LFxuICAgIGJvdW5kYXJ5XG59IiwiY29uc3QgeyB0b3VjaGVzIH0gPSByZXF1aXJlKFwiZDMtc2VsZWN0aW9uXCIpO1xuY29uc3QgQmxvY2sgPSByZXF1aXJlKFwiLi9CbG9ja1wiKTtcblxuLy8g7J20IO2BtOuemOyKpOulvCDsg4Hsho3tlbTshJwgc29ydCDrqZTshozrk5wg6rWs7ZiE7ZWY6riwXG5jbGFzcyBTb3J0IHtcbiAgY29uc3RydWN0b3IoXG4gICAgY29udGFpbmVyLFxuICAgIGJsb2NrcyA9IFtdLFxuICAgIGRlbGF5ID0gMjAwLFxuICAgIGFuaW1hdGlvbkRlbGF5ID0gMjUwLFxuICAgIGJsb2NrV2lkdGggPSAyOCxcbiAgICBibG9ja01hcmdpbiA9IDIsXG4gICAgZGVzY3JpcHRpb25cbiAgKSB7XG4gICAgLy8g7KCV66Cs7ZWgIOuMgOyDgeyduCDruJTroZ3rk6RcbiAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAvLyDruJTroZ3snYQg7Iuc6rCB7ZmUIO2VoCDsu6jthYzsnbTrhIggRE9NXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgLy8g7KCV66CsIOyKpO2FnSDsgqzsnbQg65Sc66CI7J20XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIC8vIOygleugrOydtCDrqYjstpgg7IOB7YOcXG4gICAgdGhpcy5pc1N0b3AgPSBmYWxzZTtcbiAgICAvLyDruJTroZ3snZgg64SI67mEXG4gICAgdGhpcy5ibG9ja1dpZHRoID0gYmxvY2tXaWR0aDtcbiAgICAvLyDruJTroZ0g7IKs7J20IOqwhOqyqVxuICAgIHRoaXMuYmxvY2tNYXJnaW4gPSBibG9ja01hcmdpbjtcblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcblxuICAgIC8vIOygleugrOydtCDtmITsnqwg7Iuk7ZaJ7KSR7J24IOyDge2DnFxuICAgIHRoaXMuaXNTb3J0UnVubmluZyA9IGZhbHNlO1xuXG4gICAgLy8gYmxvY2sg65Ok7J2YIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbTrpbwg7ISk7KCVXG4gICAgdGhpcy5zZXRBbmltYXRpb25EZWxheShhbmltYXRpb25EZWxheSk7XG5cbiAgICB0aGlzLm1lbWV0b1N0YWNrID0gW107XG4gIH1cblxuICAvLyDsiJjrj4Qg7L2U65OcIOusuOyekOyXtOydhCDrsJvslYTshJwg7Iuc6rCB7ZmUIOy7qO2FjOydtOuEiCDsmrDsuKHsl5Ag67O07Jes7KSMXG4gIGRyYXdQc2V1ZG9Db2RlKHBzZXVkb0NvZGUpIHtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiXG4gICAgKTtcbiAgICAvLyDquLDsobTsl5Ag7J6I642YIOyImOuPhOy9lOuTnCDsgq3soJxcbiAgICBBcnJheS5mcm9tKHBzZXVkb0NvZGVDb250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkKSA9PiBjaGlsZC5yZW1vdmUoKSk7XG4gICAgcHNldWRvQ29kZUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLy8g7KSE67OE66GcXG4gICAgcHNldWRvQ29kZS5zcGxpdChcIlxcblwiKS5tYXAoKGxpbmUpID0+IHtcbiAgICAgIHBzZXVkb0NvZGVDb250YWluZXIuaW5uZXJIVE1MICs9IGA8Y29kZT4ke2xpbmV9PC9jb2RlPiR7XCJcXG5cIn1gO1xuICAgIH0pO1xuICB9XG5cbiAgLy8g7ISk66qF7J2EIOuwm+yVhOyEnCDsi5zqsIHtmZQg7Luo7YWM7J2064SIIOyasOy4oeyXkCDrs7Tsl6zspIxcbiAgZHJhd0Rlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgY29uc3QgZGVzY3JpcHRpb25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgXCIuZGVzY3JpcHRpb24tY29udGFpbmVyXCJcbiAgICApO1xuICAgIC8vIOq4sOyhtOyXkCDsnojrjZgg7ISk66qFIOyCreygnFxuICAgIEFycmF5LmZyb20oZGVzY3JpcHRpb25Db250YWluZXIuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkKSA9PlxuICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICApO1xuICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvLyDspITrs4TroZxcbiAgICBkZXNjcmlwdGlvbi5zcGxpdChcIlxcblwiKS5tYXAoKGxpbmUpID0+IHtcbiAgICAgIGRlc2NyaXB0aW9uQ29udGFpbmVyLmlubmVySFRNTCArPSBgPGRpdj4ke2xpbmV9PC9kaXY+JHtcIlxcblwifWA7XG4gICAgfSk7XG4gIH1cblxuICAvLyDstpTsg4Eg66mU7IaM65OcXG4gIHNvcnQoKSB7fVxuXG4gIHdhaXQoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1N0b3ApIHtcbiAgICAgICAgLy8g7ZiE7J6sIOygleugrCDspJHsp4Ag7IOB7YOc652866m0IHRoaXMuc3RlcOydhCDthrXtlbQg7KCV66Cs7J2EIOyLnOyeke2VmOuPhOuhnSDshKTsoJVcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoeyB0eXBlOiBcImNvbnRpbnVlXCIgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaXNTdG9wID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnRpbnVlKCkge1xuICAgIHRoaXMuaXNTdG9wID0gZmFsc2U7XG4gICAgdGhpcy5zdGVwKCk7XG4gIH1cblxuICBzdGVwKCkge1xuICAgIGlmICh0aGlzLnJlc29sdmUgIT0gbnVsbCAmJiB0aGlzLnJlc29sdmUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnJlc29sdmUoeyB0eXBlOiBcInN0ZXBcIiB9KTtcbiAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RlcEJhY2soKSB7XG4gICAgaWYgKHRoaXMucmVzb2x2ZSAhPSBudWxsICYmIHRoaXMucmVzb2x2ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLm1lbWV0b1N0YWNrLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgIHRoaXMucmVzb2x2ZSh7XG4gICAgICAgICAgdHlwZTogXCJiYWNrXCIsXG4gICAgICAgICAgbWVtZW50bzogdGhpcy5tZW1ldG9TdGFjay5wb3AoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVzb2x2ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8g7Iuc6rCB7ZmU65CcIOyImOuPhCDsvZTrk5zsnZgg7ZWY7J2065287J207Yq466W8IOyXhuyVsFxuICBjb2RlRGVmYXVsdCgpIHtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiXG4gICAgKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gcHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gXCJcIjtcbiAgICB9XG4gIH1cblxuICAvLyDsi5zqsIHtmZTrkJwg7IiY64+EIOy9lOuTnOydmCDtirnsoJUg7KSE7J2EIO2VmOydtOudvOydtO2KuFxuICBjb2RlSGlnaGxpZ2h0KC4uLmxpbmUpIHtcbiAgICBjb25zdCBwc2V1ZG9Db2RlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgIFwiLnBzZXVkby1jb2RlLWNvbnRhaW5lclwiXG4gICAgKTtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0gcHNldWRvQ29kZUNvbnRhaW5lci5jaGlsZHJlbjtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkcmVuW2ldLnN0eWxlLmNvbG9yID0gXCJcIjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBtYW5nbyA9IDA7IG1hbmdvIDwgbGluZS5sZW5ndGg7IG1hbmdvKyspIHtcbiAgICAgIGNvbnN0IGNvZGVFbGVtZW50ID0gY2hpbGRyZW5bbGluZVttYW5nb10gLSAxXTtcbiAgICAgIGNvZGVFbGVtZW50LnN0eWxlLmNvbG9yID0gXCIjQjY5QUU3XCI7XG4gICAgfVxuICB9XG5cbiAgcHVzaE1lbWVudG8obWVtZW50bykge1xuICAgIHRoaXMubWVtZXRvU3RhY2sucHVzaChtZW1lbnRvKTtcbiAgfVxuXG4gIHNsZWVwKG1pbGxpcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzKSA9PiBzZXRUaW1lb3V0KHJlcywgbWlsbGlzKSk7XG4gIH1cblxuICBzaHVmZmxlKCkge1xuICAgIHRoaXMuc2V0RGVzY3JpcHRpb24oXCJcIik7XG5cbiAgICBsZXQgYmxvY2tzID0gdGhpcy5ibG9ja3M7XG4gICAgZm9yIChsZXQgaSA9IGJsb2Nrcy5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgICBsZXQgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpOyAvLyAwIOydtOyDgSBpIOuvuOunjOydmCDrrLTsnpHsnIQg7J24642x7IqkXG4gICAgICBbYmxvY2tzW2ldLCBibG9ja3Nbal1dID0gW2Jsb2Nrc1tqXSwgYmxvY2tzW2ldXTsgLy8g7IWU7ZSMXG4gICAgfVxuICAgIGJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgYmxvY2suc2V0Q29sb3JEZWZhdWx0KCk7IC8vIOu4lOuhnSDsg4kg7LSI6riw7ZmUXG5cbiAgICAgIGNvbnN0IHByZXZEdXJhdGlvbiA9IGJsb2NrLmdldFRyYW5zaXRpb25EdXJhdGlvbigpO1xuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKDApO1xuXG4gICAgICBjb25zdCB0cmFuc1ggPSBpbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKTtcbiAgICAgIGJsb2NrLnNldFhQb3NpdGlvbih0cmFuc1gpO1xuICAgICAgdGhpcy5jb250YWluZXIuaW5zZXJ0QmVmb3JlKGJsb2NrLmRvbSwgbnVsbCk7IC8vIOu4lOuhneydmCBET03snYQg7Luo7YWM7J2064SI7J2YIOunqCDrgZ3snLzroZwg7J2064+ZXG5cbiAgICAgIGJsb2NrLnNldFRyYW5zaXRpb25EdXJhdGlvbihwcmV2RHVyYXRpb24pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ibG9ja3MgPSBibG9ja3M7XG4gIH1cblxuICAvLyDtmITsnqwg7Iuc6rCB7ZmU65CY64qUIOuLqOqzhOydmCDshKTrqoUg7ISk7KCVXG4gIC8vIOyLnOqwge2ZlCDsu6jthYzsnbTrhIgg7ZWY64uo7JeQIO2RnOyLnOuQqFxuICBzZXREZXNjcmlwdGlvbih0ZXh0KSB7XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJzb3J0LWRlc2NyaXB0aW9uXCIpO1xuICAgICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5kZXNjcmlwdGlvbi5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gdGV4dDtcbiAgfVxuXG4gIHNldEJsb2NrV2lkdGgoYmxvY2tXaWR0aCA9IHRoaXMuYmxvY2tzPy5bMF0/LmdldFdpZHRoKCksIGJsb2NrTWFyZ2luID0gMikge1xuICAgIHRoaXMuYmxvY2tXaWR0aCA9IGJsb2NrV2lkdGg7XG4gICAgdGhpcy5ibG9ja01hcmdpbiA9IGJsb2NrTWFyZ2luO1xuICAgIC8vIHdpZHRoOk51bWJlclxuICAgIGNvbnN0IGJsb2NrQ291bnQgPSB0aGlzLmJsb2Nrcy5sZW5ndGg7XG5cbiAgICAvLyDsu6jthYzsnbTrhIgg7YGs6riwIOuEk+2eiOq4sFxuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYmxvY2tDb3VudCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pICsgXCJweFwiO1xuXG4gICAgLy8g67iU66GdIO2BrOq4sCDrsJTqvrjquLBcbiAgICB0aGlzLmJsb2Nrcy5tYXAoKGJsb2NrLCBpbmRleCkgPT4ge1xuICAgICAgLy8g67iU66GdIOyVoOuLiOuplOydtOyFmCDsho3rj4TrpbwgMG1z66GcIOyhsOyglTsg7YGs6riwIOuzgOqyveydhCDsponqsIHsoIHsnLzroZwg7ZWY6riwIOychO2VtFxuICAgICAgY29uc3QgcHJldkR1cmF0aW9uID0gYmxvY2suZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCk7XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24oMCk7XG5cbiAgICAgIGNvbnN0IG5ld1ggPSBpbmRleCAqIChibG9ja1dpZHRoICsgYmxvY2tNYXJnaW4pO1xuICAgICAgYmxvY2suc2V0WFBvc2l0aW9uKG5ld1gpO1xuXG4gICAgICAvLyDruJTroZ3snZgg64SI67mEIOyhsOyglVxuICAgICAgYmxvY2suc2V0V2lkdGgoYmxvY2tXaWR0aCk7XG5cbiAgICAgIC8vIOyVoOuLiOuplOydtOyFmCDsho3rj4Trpbwg7JuQ656Y64yA66GcIOyhsOyglVxuICAgICAgYmxvY2suc2V0VHJhbnNpdGlvbkR1cmF0aW9uKHByZXZEdXJhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBhZGRCbG9jayhibG9ja1ZhbHVlKSB7XG4gICAgLy8g67iU66GdIOqwnOyImCDsoJztlZxcbiAgICBpZiAodGhpcy5ibG9ja3MubGVuZ3RoID4gMzApIHJldHVybjtcblxuICAgIGNvbnN0IGJsb2NrID0gQmxvY2suY3JlYXRlTmV3QmxvY2soXG4gICAgICBibG9ja1ZhbHVlLFxuICAgICAgdGhpcy5jb250YWluZXIsXG4gICAgICB0aGlzLmJsb2NrV2lkdGgsXG4gICAgICB0aGlzLmJsb2NrTWFyZ2luXG4gICAgKTtcblxuICAgIHRoaXMuYmxvY2tzLnB1c2goYmxvY2spO1xuXG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSB0aGlzLmJsb2Nrc1xuICAgICAgLm1hcCgoYikgPT4gYi5nZXRXaWR0aCgpKVxuICAgICAgLnJlZHVjZShcbiAgICAgICAgKGNvbnRhaW5lcldpZHRoLCBibG9ja1dpZHRoKSA9PlxuICAgICAgICAgIGNvbnRhaW5lcldpZHRoICsgdGhpcy5ibG9ja01hcmdpbiArIGJsb2NrV2lkdGgsXG4gICAgICAgICAgMFxuICAgICAgKTtcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGAke2NvbnRhaW5lcldpZHRofXB4YDtcbiAgfVxuXG4gIHJlbW92ZUJsb2NrKGJsb2NrVmFsdWUpIHtcbiAgICBpZiAoYmxvY2tWYWx1ZSBpbnN0YW5jZW9mIFN0cmluZykgYmxvY2tWYWx1ZSA9IE51bWJlcihibG9ja1ZhbHVlKTtcblxuICAgIGNvbnN0IHRhcmdldEluZGV4ID0gdGhpcy5ibG9ja3MuZmluZEluZGV4KFxuICAgICAgKGJsb2NrKSA9PiBibG9jay5nZXRWYWx1ZSgpID09IGJsb2NrVmFsdWVcbiAgICApO1xuICAgIC8vIO2PrO2VqOuQmOyXiOuKlOyngCDtmZXsnbhcbiAgICAvLyB0YXJnZXRJbmRleOqwgCAtMeydtOuptCBibG9ja1ZhbHVl6rCAIO2YhOyerCDruJTroZ3rk6Tsl5Ag7JeG64qUIOqwklxuICAgIGlmICh0YXJnZXRJbmRleCA9PSAtMSkgcmV0dXJuO1xuXG4gICAgLy8g7IKt7KCc7ZWgIOuFuOuTnOydmCDsmKTrpbjsqr3sl5Ag7J6I64qUIOu4lOuhneuTpCDsnITsuZgg7ZWcIOy5uCDsmbzsqr3snLzroZwg67CA6riwXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuYmxvY2tzLmxlbmd0aCAtIDE7IGkgPiB0YXJnZXRJbmRleDsgaS0tKSB7XG4gICAgICBjb25zdCBsZWZ0WCA9IHRoaXMuYmxvY2tzW2kgLSAxXS5nZXRYUG9zaXRpb24oKTtcbiAgICAgIHRoaXMuYmxvY2tzW2ldLnNldFhQb3NpdGlvbihsZWZ0WCk7XG4gICAgfVxuXG4gICAgLy8gdGhpcy5ibG9ja3Psl5DshJwg7IKt7KCcXG4gICAgY29uc3QgdGFyZ2V0QmxvY2sgPSB0aGlzLmJsb2Nrcy5zcGxpY2UodGFyZ2V0SW5kZXgsIDEpWzBdO1xuICAgIC8vIERPTSDsgq3soJxcbiAgICB0YXJnZXRCbG9jay5kb20ucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IHRoaXMuYmxvY2tzXG4gICAgICAubWFwKChiKSA9PiBiLmdldFdpZHRoKCkpXG4gICAgICAucmVkdWNlKFxuICAgICAgICAoY29udGFpbmVyV2lkdGgsIGJsb2NrV2lkdGgpID0+XG4gICAgICAgICAgY29udGFpbmVyV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luICsgYmxvY2tXaWR0aCxcbiAgICAgICAgICAwXG4gICAgICApO1xuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gYCR7Y29udGFpbmVyV2lkdGh9cHhgO1xuICB9XG5cbiAgc2V0RGVsYXkobWlsbGlzKSB7XG4gICAgdGhpcy5kZWxheSA9IG1pbGxpcztcbiAgfVxuXG4gIHNldEFuaW1hdGlvbkRlbGF5KG1pbGxpcykge1xuICAgIHRoaXMuYW5pbWF0aW9uRGVsYXkgPSBtaWxsaXM7XG4gICAgdGhpcy5ibG9ja3MuZm9yRWFjaCgoYmxvY2spID0+XG4gICAgICBibG9jay5zZXRUcmFuc2l0aW9uRHVyYXRpb24odGhpcy5hbmltYXRpb25EZWxheSlcbiAgICApO1xuICB9XG5cbiAgLy8gdGhpcy5ibG9ja3Prpbwg7Iuc6rCB7ZmU65CY6rOg7J6I64qUIOyInOyEnOyXkCDrp57qsowg7KCV66Cs7ZWY64qUIO2VqOyImFxuICByZWZyZXNoQmxvY2tzKCkge1xuICAgIGNvbnN0IGRvbXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmxvY2tcIikpO1xuXG4gICAgdGhpcy5ibG9ja3Muc29ydCgoYjEsIGIyKSA9PiBkb21zLmluZGV4T2YoYjEuZG9tKSAtIGRvbXMuaW5kZXhPZihiMi5kb20pKTtcbiAgfVxuXG4gIC8vIHRhcmdldDHqs7wgdGF0Z2V0MuydmCDsnITsuZjrpbwg67CU6r+IXG4gIC8vIHRhcmdldDHsnbQg7ZWt7IOBIHRhcmdldDLrs7Tri6Qg7JWe7JeQIOyeiOyWtOyVvCDtlahcbiAgYXN5bmMgc3dhcChibG9jazEsIGJsb2NrMikge1xuICAgIC8vIGJsb2NrMTogQmxvY2ssIGJsb2NrMjogQmxvY2tcblxuICAgIGNvbnN0IHgxID0gYmxvY2sxLmdldFhQb3NpdGlvbigpO1xuICAgIGNvbnN0IHgyID0gYmxvY2syLmdldFhQb3NpdGlvbigpO1xuXG4gICAgYmxvY2sxLnNldFhQb3NpdGlvbih4Mik7XG4gICAgYmxvY2syLnNldFhQb3NpdGlvbih4MSk7XG5cbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICBhd2FpdCBibG9jazEuc3dhcEJsb2NrKGJsb2NrMik7XG4gIH1cblxuICAvLyB0YXJnZXTsnYQgZGVzdEluZGV4IOyekOumrOyXkCDrhKPripQg7ZWo7IiYXG4gIC8vIHRhcmdldOydgCDtla3sg4EgZGVzdEluZGV467O064ukIOuSpOyXkCDsnojslrTslbztlahcbiAgYXN5bmMgaW5zZXJ0QXQoYmxvY2ssIGRlc3RJbmRleCkge1xuICAgIGNvbnN0IGJsb2NrcyA9IHRoaXMuYmxvY2tzO1xuXG4gICAgYmxvY2suc2V0WFBvc2l0aW9uKGRlc3RJbmRleCAqICh0aGlzLmJsb2NrV2lkdGggKyB0aGlzLmJsb2NrTWFyZ2luKSk7XG5cbiAgICAvLyDslaDri4jrqZTsnbTshZjsnbQg64Gd64KY6riw66W8IOq4sOuLpOumvC5cbiAgICBhd2FpdCBibG9jay5pbnNlcnRCZWZvcmUoYmxvY2tzW2Rlc3RJbmRleF0pO1xuICB9XG5cbiAgLy8gc3RhcnQg7J24642x7Iqk67aA7YSwIGVuZCDsnbjrjbHsiqTquYzsp4AgYmxvY2sg7ZWcIOy5uOyUqSDrr7jripQg7ZWo7IiYXG4gIGFzeW5jIHNoaWZ0KHN0YXJ0LCBlbmQpIHtcbiAgICBjb25zdCBibG9ja3MgPSB0aGlzLmJsb2NrcztcblxuICAgIGNvbnN0IGJldHdlZW5zID0gYmxvY2tzLmZpbHRlcigoXywgaSkgPT4gc3RhcnQgPD0gaSAmJiBpIDwgZW5kKTtcblxuICAgIGNvbnN0IHhSZXN0ID0gYmV0d2VlbnMubWFwKChiKSA9PiBiLmdldFhQb3NpdGlvbigpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJldHdlZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgYmV0d2VlbnNbaV0uc2V0WFBvc2l0aW9uKHhSZXN0W2kgKyAxXSk7XG4gICAgfVxuICAgIGJsb2Nrc1tlbmQgLSAxXS5zZXRYUG9zaXRpb24oYmxvY2tzW2VuZF0uZ2V0WFBvc2l0aW9uKCkpO1xuXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlcykgPT5cbiAgICAgIHNldFRpbWVvdXQocmVzLCBibG9ja3NbMF0uZ2V0VHJhbnNpdGlvbkR1cmF0aW9uKCkpXG4gICAgKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnQ7XG4iLCJjb25zdCBCbG9jayA9IHJlcXVpcmUoXCIuLi9zb3J0L0Jsb2NrXCIpO1xuY29uc3QgQnViYmxlU29ydCA9IHJlcXVpcmUoXCIuLi9idWJibGUtc29ydC9CdWJibGVTb3J0XCIpO1xuY29uc3QgSW5zZXJ0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9pbnNlcnRpb24tc29ydC9JbnNlcnRpb25Tb3J0XCIpO1xuY29uc3QgU2VsZWN0aW9uU29ydCA9IHJlcXVpcmUoXCIuLi9zZWxlY3Rpb24tc29ydC9TZWxlY3Rpb25Tb3J0XCIpO1xuY29uc3QgUXVpY2tTb3J0ID0gcmVxdWlyZShcIi4uL3F1aWNrLXNvcnQvUXVpY2tTb3J0XCIpO1xuXG4vLyDsoJXroKzsnbQg7Iuc6rCB7ZmUIOuQoCBjb250YWluZXJcbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGF0YS1jb250YWluZXJcIik7XG5cbi8vIOygleugrCDsooXrpZggUmFkaW9cbmNvbnN0IGJ1YmJsZVNvcnRSYWRpbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnViYmxlLXNvcnQtcmFkaW9cIik7XG5jb25zdCBpbnNlcnRpb25Tb3J0UmFkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluc2VydGlvbi1zb3J0LXJhZGlvXCIpO1xuY29uc3Qgc2VsZWN0aW9uU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3Rpb24tc29ydC1yYWRpb1wiKTtcbmNvbnN0IHF1aWNrU29ydFJhZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJxdWljay1zb3J0LXJhZGlvXCIpO1xuXG4vLyDslaDri4jrqZTsnbTshZgg65Sc66CI7J20IFJhbmdlXG5jb25zdCBkZWxheVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbmltYXRpb24tZGVsYXktcmFuZ2VcIik7XG5cbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXRcbmNvbnN0IGRlbGF5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1kZWxheS1pbnB1dFwiKTtcbi8vIOyVoOuLiOuplOydtOyFmCDrlJzroIjsnbQgSW5wdXQgQnV0dG9uXG5jb25zdCBkZWxheUlucHV0QnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGVsYXktaW5wdXQtYnRuXCIpO1xuXG4vLyDsi5zqsIHtmZQg67iU66GdIO2BrOq4sCBSYW5nZVxuY29uc3Qgc2l6ZVJhbmdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaXplLXJhbmdlXCIpO1xuXG4vLyDsgqzsmqnsnpDroZzrtoDthLAg7IOI66Gc7Jq0IOuNsOydtO2EsOulvCDsnoXroKXrsJvripQgSW5wdXQgVGV4dFxuY29uc3QgbmV3RGF0YUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1pbnB1dFwiKTtcbi8vIOyDiOuhnOyatCDrjbDsnbTthLDrpbwg7LaU6rCA7ZWY64qUIEJ1dHRvblxuY29uc3QgbmV3RGF0YUFkZEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWRhdGEtYWRkLWJ0blwiKTtcbi8vIOuNsOydtO2EsOulvCDsgq3soJztlZjripQgQnV0dG9uXG5jb25zdCBuZXdEYXRhUmVtb3ZlQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZGF0YS1yZW1vdmUtYnRuXCIpO1xuXG4vLyDsoJXroKwg7Iuc7J6RIEJ1dHRvblxuY29uc3Qgc29ydEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1idG5cIik7XG5cbi8vIOygleugrCDspJHsp4AgQnV0dG9uXG5jb25zdCBzb3J0U3RvcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdG9wLWJ0blwiKTtcblxuLy8g7KCV66CsIOynhO2WiSBCdXR0b25cbmNvbnN0IHNvcnRDb250aW51ZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1jb250aW51ZS1idG5cIik7XG5cbi8vIOygleugrCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29ydC1zdGVwLWJ0blwiKTtcblxuLy8g7KCV66CsIOuSpOuhnCDsiqTthZ0gQnV0dG9uXG5jb25zdCBzb3J0U3RlcEJhY2tCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvcnQtc3RlcC1iYWNrLWJ0blwiKTtcblxuLy8g67iU66GdIOyEnuq4sCBCdXR0b25cbmNvbnN0IGJsb2NrU2h1ZmZsZUJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmxvY2stc2h1ZmZsZS1idG5cIik7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlVW5pcXVlVmFsdWVzKGNvdW50ID0gMjApIHtcbiAgY29uc3QgdmFsdWVzID0gW107XG4gIHdoaWxlICh2YWx1ZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2NSArIDEpO1xuICAgIGlmICghdmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWVzO1xufVxuXG4vLyBTb3J0IOyVjOqzoOumrOymmCDtgbTrnpjsiqTrpbwg67Cb7JWE7IScIOygleugrOydhCDsi5xcbmNvbnN0IG1ha2VTb3J0UmFkaW9PbmNoYW5nZSA9IChTb3J0QWxnb3JpdGhtKSA9PiAoKSA9PiB7XG4gIHNvcnQgPSBuZXcgU29ydEFsZ29yaXRobShcbiAgICBzb3J0LmNvbnRhaW5lcixcbiAgICBzb3J0LmJsb2NrcyxcbiAgICBzb3J0LmRlbGF5LFxuICAgIHNvcnQuYW5pbWF0aW9uRGVsYXksXG4gICAgc29ydC5ibG9ja1dpZHRoLFxuICAgIHNvcnQuYmxvY2tNYXJnaW4sXG4gICAgc29ydC5kZXNjcmlwdGlvblxuICApO1xufTtcblxuYnViYmxlU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEJ1YmJsZVNvcnQpO1xuaW5zZXJ0aW9uU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKEluc2VydGlvblNvcnQpO1xuc2VsZWN0aW9uU29ydFJhZGlvLm9uY2hhbmdlID0gbWFrZVNvcnRSYWRpb09uY2hhbmdlKFNlbGVjdGlvblNvcnQpO1xucXVpY2tTb3J0UmFkaW8ub25jaGFuZ2UgPSBtYWtlU29ydFJhZGlvT25jaGFuZ2UoUXVpY2tTb3J0KTtcblxubGV0IHNvcnQgPSBuZXcgQnViYmxlU29ydChjb250YWluZXIpO1xuZ2VuZXJhdGVVbmlxdWVWYWx1ZXMoKS5mb3JFYWNoKCh2YWx1ZSkgPT4gc29ydC5hZGRCbG9jayh2YWx1ZSkpO1xuXG5kZWxheVJhbmdlLm9uaW5wdXQgPSAoZSkgPT4ge1xuICBjb25zdCBkZWxheSA9IE51bWJlcihlLnRhcmdldC52YWx1ZSk7XG4gIHNvcnQuc2V0QW5pbWF0aW9uRGVsYXkoZGVsYXkpO1xuICBzb3J0LnNldERlbGF5KGRlbGF5KTtcblxuICBkZWxheUlucHV0LnZhbHVlID0gTnVtYmVyKGRlbGF5UmFuZ2UubWF4KSArIE51bWJlcihkZWxheVJhbmdlLm1pbikgLSBkZWxheTsgLy8gZGVsYXlJbnB1dOqzvCDqsJIg64+Z6riw7ZmUXG59O1xuXG4vLyBkZWxheUlucHV0Lm9uaW5wdXQgPSBlID0+IHtcbi8vICAgY29uc3QgZGVsYXkgPSBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpIC0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcblxuLy8gICBzb3J0LnNldEFuaW1hdGlvbkRlbGF5KGRlbGF5KTtcbi8vICAgc29ydC5zZXREZWxheShkZWxheSk7XG4vLyAgIC8vIGRlbGF5UmFuZ2XsmYAg6rCSIOuPmeq4sO2ZlFxuLy8gICBkZWxheVJhbmdlLnZhbHVlID0gZGVsYXk7XG4vLyB9XG5cbmRlbGF5SW5wdXQub25rZXlkb3duID0gKGUpID0+IHtcbiAgLy8g7JeU7YSw7YKk66W8IOuIhOuluCDqsr3smrBcbiAgaWYgKGUua2V5Q29kZSA9PT0gMTMpXG4gICAgLy8gZGVsYXlJbnB1dEJ0buyXkCBjbGljayDsnbTrsqTtirgg7Yq466as6rGwXG4gICAgZGVsYXlJbnB1dEJ0bi5jbGljaygpO1xufTtcbmRlbGF5SW5wdXRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gIC8vIOyeheugpeqwkuydtCDrspTsnITrpbwg64SY7Ja07ISc66m0IOqyveqzhOqwkuycvOuhnCDshKTsoJVcbiAgaWYgKE51bWJlcihkZWxheUlucHV0LnZhbHVlKSA+IE51bWJlcihkZWxheVJhbmdlLm1heCkpIHtcbiAgICBkZWxheUlucHV0LnZhbHVlID0gZGVsYXlSYW5nZS5tYXg7XG4gIH0gZWxzZSBpZiAoTnVtYmVyKGRlbGF5SW5wdXQudmFsdWUpIDwgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSkge1xuICAgIGRlbGF5SW5wdXQudmFsdWUgPSBkZWxheVJhbmdlLm1pbjtcbiAgfVxuXG4gIGNvbnN0IGRlbGF5ID1cbiAgICBOdW1iZXIoZGVsYXlSYW5nZS5tYXgpICsgTnVtYmVyKGRlbGF5UmFuZ2UubWluKSAtIE51bWJlcihkZWxheUlucHV0LnZhbHVlKTtcbiAgc29ydC5zZXRBbmltYXRpb25EZWxheShkZWxheSk7XG4gIHNvcnQuc2V0RGVsYXkoZGVsYXkpO1xuICAvLyBkZWxheVJhbmdl7JmAIOqwkiDrj5nquLDtmZRcbiAgZGVsYXlSYW5nZS52YWx1ZSA9IGRlbGF5O1xufTtcblxuLy8gVE9ETzogU29ydC5zZXRCbG9ja1dpZHRoIOyZhOyEse2VnCDrkqQgc2l6ZSByYW5nZeydmCBpbnZpc2libGUg7ZKA6riwXG5zaXplUmFuZ2Uub25jaGFuZ2UgPSAoZSkgPT4ge1xuICBjb25zdCBzaXplID0gTnVtYmVyKGUudGFyZ2V0LnZhbHVlKTtcbiAgc29ydC5zZXRCbG9ja1dpZHRoKHNpemUpO1xufTtcblxubmV3RGF0YUlucHV0Lm9ua2V5ZG93biA9IChlKSA9PiB7XG4gIC8vIOyXlO2EsO2CpOulvCDriITrpbgg6rK97JqwXG4gIGlmIChlLmtleUNvZGUgPT09IDEzKVxuICAgIC8vIG5ld0RhdGFBZGRCdG7sl5AgY2xpY2sg7J2067Kk7Yq4IO2KuOumrOqxsFxuICAgIG5ld0RhdGFBZGRCdG4uY2xpY2soKTtcbn07XG5cbm5ld0RhdGFBZGRCdG4ub25jbGljayA9IChlKSA9PiB7XG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xuXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XG5cbiAgc29ydC5hZGRCbG9jayh2YWx1ZSk7XG5cbiAgbmV3RGF0YUlucHV0LnZhbHVlID0gXCJcIjtcbn07XG5cbm5ld0RhdGFSZW1vdmVCdG4ub25jbGljayA9IChlKSA9PiB7XG4gIC8vIOyVhOustOqyg+uPhCDsnoXroKXtlZjsp4Ag7JWK7JWY64uk66m0XG4gIGlmIChuZXdEYXRhSW5wdXQudmFsdWUgPT0gXCJcIikgcmV0dXJuO1xuXG4gIGNvbnN0IHZhbHVlID0gTnVtYmVyKG5ld0RhdGFJbnB1dC52YWx1ZSk7XG5cbiAgc29ydC5yZW1vdmVCbG9jayh2YWx1ZSk7XG5cbiAgbmV3RGF0YUlucHV0LnZhbHVlID0gXCJcIjtcbn07XG5cbi8vIOygleugrCDrj4TspJHsl5QgSW5wdXTrk6TsnYQg67mE7Zmc7ISx7ZmUXG5mdW5jdGlvbiBkaXNhYmxlSW5wdXRzKCkge1xuICBidWJibGVTb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBzZWxlY3Rpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICBxdWlja1NvcnRSYWRpby5kaXNhYmxlZCA9IHRydWU7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gdHJ1ZTtcbiAgc29ydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIG5ld0RhdGFBZGRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSB0cnVlO1xufVxuLy8g7KCV66Cs7J20IOuBneuCnCDtm4QgSW5wdXTrk6TsnYQg7Zmc7ISx7ZmUXG5mdW5jdGlvbiBlbmFibGVJbnB1dHMoKSB7XG4gIGJ1YmJsZVNvcnRSYWRpby5kaXNhYmxlZCA9IGZhbHNlO1xuICBpbnNlcnRpb25Tb3J0UmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgc2VsZWN0aW9uU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG4gIHF1aWNrU29ydFJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgc2l6ZVJhbmdlLmRpc2FibGVkID0gZmFsc2U7XG4gIHNvcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgbmV3RGF0YUFkZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICBibG9ja1NodWZmbGVCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbn1cblxuc29ydEJ0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgZGlzYWJsZUlucHV0cygpOyAvLyDsoJXroKzsnbQg7Iuc7J6R65CgIOuVjCDruYTtmZzshLHtmZRcblxuICBzb3J0LnNvcnQoKS50aGVuKGVuYWJsZUlucHV0cyk7XG59O1xuXG5zb3J0U3RvcEJ0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgc29ydC5zdG9wKCk7XG59O1xuXG5zb3J0Q29udGludWVCdG4ub25jbGljayA9IChlKSA9PiB7XG4gIHNvcnQuY29udGludWUoKTtcbn07XG5cbnNvcnRTdGVwQnRuLm9uY2xpY2sgPSAoZSkgPT4ge1xuICBzb3J0LnN0ZXAoKTtcbn07XG5cbnNvcnRTdGVwQmFja0J0bi5vbmNsaWNrID0gKGUpID0+IHtcbiAgc29ydC5zdGVwQmFjaygpO1xufTtcblxuYmxvY2tTaHVmZmxlQnRuLm9uY2xpY2sgPSAoZSkgPT4ge1xuICBzb3J0LnNodWZmbGUoKTtcbn07XG4iXX0=
