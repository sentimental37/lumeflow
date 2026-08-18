import {
  isPlatformBrowser
} from "./chunk-IKTWKBK6.js";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  ViewEncapsulation,
  __spreadProps,
  __spreadValues,
  inject,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵattribute,
  ɵɵdefineComponent
} from "./chunk-P3QISR6Z.js";

// ../../node_modules/@dagrejs/dagre/dist/dagre.esm.js
var Te = Object.defineProperty;
var In = (e, n, t) => n in e ? Te(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t;
var Sn = (e, n) => {
  for (var t in n) Te(e, t, { get: n[t], enumerable: true });
};
var je = (e, n, t) => In(e, typeof n != "symbol" ? n + "" : n, t);
var ie = {};
Sn(ie, { Graph: () => T, alg: () => H });
var Mn = Object.defineProperty;
var Se = (e, n) => {
  for (var t in n) Mn(e, t, { get: n[t], enumerable: true });
};
var Q = class {
  constructor(e) {
    this._isDirected = true, this._isMultigraph = false, this._isCompound = false, this._nodes = {}, this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {}, this._nodeCount = 0, this._edgeCount = 0, this._defaultNodeLabelFn = () => {
    }, this._defaultEdgeLabelFn = () => {
    }, e && (this._isDirected = "directed" in e ? e.directed : true, this._isMultigraph = "multigraph" in e ? e.multigraph : false, this._isCompound = "compound" in e ? e.compound : false), this._isCompound && (this._parent = {}, this._children = {}, this._children["\0"] = {});
  }
  isDirected() {
    return this._isDirected;
  }
  isMultigraph() {
    return this._isMultigraph;
  }
  isCompound() {
    return this._isCompound;
  }
  setGraph(e) {
    return this._label = e, this;
  }
  graph() {
    return this._label;
  }
  setDefaultNodeLabel(e) {
    return typeof e != "function" ? this._defaultNodeLabelFn = () => e : this._defaultNodeLabelFn = e, this;
  }
  nodeCount() {
    return this._nodeCount;
  }
  nodes() {
    return Object.keys(this._nodes);
  }
  sources() {
    return this.nodes().filter((e) => Object.keys(this._in[e]).length === 0);
  }
  sinks() {
    return this.nodes().filter((e) => Object.keys(this._out[e]).length === 0);
  }
  setNodes(e, n) {
    return e.forEach((t) => {
      n !== void 0 ? this.setNode(t, n) : this.setNode(t);
    }), this;
  }
  setNode(e, n) {
    return e in this._nodes ? (arguments.length > 1 && (this._nodes[e] = n), this) : (this._nodes[e] = arguments.length > 1 ? n : this._defaultNodeLabelFn(e), this._isCompound && (this._parent[e] = "\0", this._children[e] = {}, this._children["\0"][e] = true), this._in[e] = {}, this._preds[e] = {}, this._out[e] = {}, this._sucs[e] = {}, ++this._nodeCount, this);
  }
  node(e) {
    return this._nodes[e];
  }
  hasNode(e) {
    return e in this._nodes;
  }
  removeNode(e) {
    if (e in this._nodes) {
      let n = (t) => this.removeEdge(this._edgeObjs[t]);
      delete this._nodes[e], this._isCompound && (this._removeFromParentsChildList(e), delete this._parent[e], this.children(e).forEach((t) => {
        this.setParent(t);
      }), delete this._children[e]), Object.keys(this._in[e]).forEach(n), delete this._in[e], delete this._preds[e], Object.keys(this._out[e]).forEach(n), delete this._out[e], delete this._sucs[e], --this._nodeCount;
    }
    return this;
  }
  setParent(e, n) {
    if (!this._isCompound) throw new Error("Cannot set parent in a non-compound graph");
    if (n === void 0) n = "\0";
    else {
      n += "";
      for (let t = n; t !== void 0; t = this.parent(t)) if (t === e) throw new Error("Setting " + n + " as parent of " + e + " would create a cycle");
      this.setNode(n);
    }
    return this.setNode(e), this._removeFromParentsChildList(e), this._parent[e] = n, this._children[n][e] = true, this;
  }
  parent(e) {
    if (this._isCompound) {
      let n = this._parent[e];
      if (n !== "\0") return n;
    }
  }
  children(e = "\0") {
    if (this._isCompound) {
      let n = this._children[e];
      if (n) return Object.keys(n);
    } else {
      if (e === "\0") return this.nodes();
      if (this.hasNode(e)) return [];
    }
    return [];
  }
  predecessors(e) {
    let n = this._preds[e];
    if (n) return Object.keys(n);
  }
  successors(e) {
    let n = this._sucs[e];
    if (n) return Object.keys(n);
  }
  neighbors(e) {
    let n = this.predecessors(e);
    if (n) {
      let t = new Set(n), r = this.successors(e);
      if (r) for (let o of r) t.add(o);
      return Array.from(t.values());
    }
  }
  isLeaf(e) {
    var n;
    let t;
    return this.isDirected() ? t = this.successors(e) : t = this.neighbors(e), ((n = t == null ? void 0 : t.length) != null ? n : 0) === 0;
  }
  filterNodes(e) {
    let n = new this.constructor({ directed: this._isDirected, multigraph: this._isMultigraph, compound: this._isCompound });
    n.setGraph(this.graph()), Object.entries(this._nodes).forEach(([o, i]) => {
      e(o) && n.setNode(o, i);
    }), Object.values(this._edgeObjs).forEach((o) => {
      n.hasNode(o.v) && n.hasNode(o.w) && n.setEdge(o, this.edge(o));
    });
    let t = {}, r = (o) => {
      let i = this.parent(o);
      return !i || n.hasNode(i) ? (t[o] = i, i) : i in t ? t[i] : r(i);
    };
    return this._isCompound && n.nodes().forEach((o) => n.setParent(o, r(o))), n;
  }
  setDefaultEdgeLabel(e) {
    return typeof e != "function" ? this._defaultEdgeLabelFn = () => e : this._defaultEdgeLabelFn = e, this;
  }
  edgeCount() {
    return this._edgeCount;
  }
  edges() {
    return Object.values(this._edgeObjs);
  }
  setPath(e, n) {
    return e.reduce((t, r) => (n !== void 0 ? this.setEdge(t, r, n) : this.setEdge(t, r), r)), this;
  }
  setEdge(e, n, t, r) {
    let o, i, s, a, l = false;
    typeof e == "object" && e !== null && "v" in e ? (o = e.v, i = e.w, s = e.name, arguments.length === 2 && (a = n, l = true)) : (o = e, i = n, s = r, arguments.length > 2 && (a = t, l = true)), o = "" + o, i = "" + i, s !== void 0 && (s = "" + s);
    let u = z(this._isDirected, o, i, s);
    if (u in this._edgeLabels) return l && (this._edgeLabels[u] = a), this;
    if (s !== void 0 && !this._isMultigraph) throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(o), this.setNode(i), this._edgeLabels[u] = l ? a : this._defaultEdgeLabelFn(o, i, s);
    let d = Pn(this._isDirected, o, i, s);
    return o = d.v, i = d.w, Object.freeze(d), this._edgeObjs[u] = d, Re(this._preds[i], o), Re(this._sucs[o], i), this._in[i][u] = d, this._out[o][u] = d, this._edgeCount++, this;
  }
  edge(e, n, t) {
    let r = arguments.length === 1 ? oe(this._isDirected, e) : z(this._isDirected, e, n, t);
    return this._edgeLabels[r];
  }
  edgeAsObj(e, n, t) {
    let r = arguments.length === 1 ? this.edge(e) : this.edge(e, n, t);
    return typeof r != "object" || r === null ? { label: r } : r;
  }
  hasEdge(e, n, t) {
    return (arguments.length === 1 ? oe(this._isDirected, e) : z(this._isDirected, e, n, t)) in this._edgeLabels;
  }
  removeEdge(e, n, t) {
    let r = arguments.length === 1 ? oe(this._isDirected, e) : z(this._isDirected, e, n, t), o = this._edgeObjs[r];
    if (o) {
      let i = o.v, s = o.w;
      delete this._edgeLabels[r], delete this._edgeObjs[r], Ie(this._preds[s], i), Ie(this._sucs[i], s), delete this._in[s][r], delete this._out[i][r], this._edgeCount--;
    }
    return this;
  }
  inEdges(e, n) {
    return this.isDirected() ? this.filterEdges(this._in[e], e, n) : this.nodeEdges(e, n);
  }
  outEdges(e, n) {
    return this.isDirected() ? this.filterEdges(this._out[e], e, n) : this.nodeEdges(e, n);
  }
  nodeEdges(e, n) {
    if (e in this._nodes) return this.filterEdges(__spreadValues(__spreadValues({}, this._in[e]), this._out[e]), e, n);
  }
  _removeFromParentsChildList(e) {
    delete this._children[this._parent[e]][e];
  }
  filterEdges(e, n, t) {
    if (!e) return;
    let r = Object.values(e);
    return t ? r.filter((o) => o.v === n && o.w === t || o.v === t && o.w === n) : r;
  }
};
function Re(e, n) {
  e[n] ? e[n]++ : e[n] = 1;
}
function Ie(e, n) {
  e[n] !== void 0 && !--e[n] && delete e[n];
}
function z(e, n, t, r) {
  let o = "" + n, i = "" + t;
  if (!e && o > i) {
    let s = o;
    o = i, i = s;
  }
  return o + "" + i + "" + (r === void 0 ? "\0" : r);
}
function Pn(e, n, t, r) {
  let o = "" + n, i = "" + t;
  if (!e && o > i) {
    let a = o;
    o = i, i = a;
  }
  let s = { v: o, w: i };
  return r && (s.name = r), s;
}
function oe(e, n) {
  return z(e, n.v, n.w, n.name);
}
var Fn = {};
Se(Fn, { read: () => Yn, write: () => An });
function An(e) {
  let n = { options: { directed: e.isDirected(), multigraph: e.isMultigraph(), compound: e.isCompound() }, nodes: Vn(e), edges: Dn(e) }, t = e.graph();
  return t !== void 0 && (n.value = structuredClone(t)), n;
}
function Vn(e) {
  return e.nodes().map((n) => {
    let t = e.node(n), r = e.parent(n), o = { v: n };
    return t !== void 0 && (o.value = t), r !== void 0 && (o.parent = r), o;
  });
}
function Dn(e) {
  return e.edges().map((n) => {
    let t = e.edge(n), r = { v: n.v, w: n.w };
    return n.name !== void 0 && (r.name = n.name), t !== void 0 && (r.value = t), r;
  });
}
function Yn(e) {
  let n = new Q(e.options);
  return e.value !== void 0 && n.setGraph(e.value), e.nodes.forEach((t) => {
    n.setNode(t.v, t.value), t.parent && n.setParent(t.v, t.parent);
  }), e.edges.forEach((t) => {
    n.setEdge({ v: t.v, w: t.w, name: t.name }, t.value);
  }), n;
}
var H = {};
Se(H, { CycleException: () => K, bellmanFord: () => Me, components: () => Xn, dijkstra: () => J, dijkstraAll: () => qn, findCycles: () => $n, floydWarshall: () => Jn, isAcyclic: () => Qn, postorder: () => et, preorder: () => nt, prim: () => tt, shortestPaths: () => rt, tarjan: () => Fe, topsort: () => Ae });
var Wn = () => 1;
function Me(e, n, t, r) {
  return Bn(e, String(n), t || Wn, r || function(o) {
    var i;
    return (i = e.outEdges(o)) != null ? i : [];
  });
}
function Bn(e, n, t, r) {
  let o = {}, i, s = 0, a = e.nodes(), l = function(c) {
    let f = o[c.v], h = o[c.w];
    if (!f || !h) return;
    let p = t(c);
    f.distance + p < h.distance && (o[c.w] = { distance: f.distance + p, predecessor: c.v }, i = true);
  }, u = function() {
    a.forEach(function(c) {
      r(c).forEach(function(f) {
        let h = f.v === c ? f.v : f.w, p = h === f.v ? f.w : f.v;
        l({ v: h, w: p });
      });
    });
  };
  a.forEach(function(c) {
    let f = c === n ? 0 : Number.POSITIVE_INFINITY;
    o[c] = { distance: f, predecessor: "" };
  });
  let d = a.length;
  for (let c = 1; c < d && (i = false, s++, u(), !!i); c++) ;
  if (s === d - 1 && (i = false, u(), i)) throw new Error("The graph contains a negative weight cycle");
  return o;
}
function Xn(e) {
  let n = {}, t = [], r;
  function o(i) {
    var s, a;
    i in n || (n[i] = true, r.push(i), (s = e.successors(i)) == null || s.forEach(o), (a = e.predecessors(i)) == null || a.forEach(o));
  }
  return e.nodes().forEach(function(i) {
    r = [], o(i), r.length && t.push(r);
  }), t;
}
var Pe = class {
  constructor() {
    this._arr = [], this._keyIndices = {};
  }
  size() {
    return this._arr.length;
  }
  keys() {
    return this._arr.map((e) => e.key);
  }
  has(e) {
    return e in this._keyIndices;
  }
  priority(e) {
    let n = this._keyIndices[e];
    if (n !== void 0) return this._arr[n].priority;
  }
  min() {
    if (this.size() === 0) throw new Error("Queue underflow");
    return this._arr[0].key;
  }
  add(e, n) {
    let t = this._keyIndices, r = String(e);
    if (!(r in t)) {
      let o = this._arr, i = o.length;
      return t[r] = i, o.push({ key: r, priority: n }), this._decrease(i), true;
    }
    return false;
  }
  removeMin() {
    if (this.size() === 0) throw new Error("Queue underflow");
    this._swap(0, this._arr.length - 1);
    let e = this._arr.pop();
    return delete this._keyIndices[e.key], this._heapify(0), e.key;
  }
  decrease(e, n) {
    let t = this._keyIndices[e];
    if (t === void 0) throw new Error(`Key not found: ${e}`);
    let r = this._arr[t].priority;
    if (n > r) throw new Error(`New priority is greater than current priority. Key: ${e} Old: ${r} New: ${n}`);
    this._arr[t].priority = n, this._decrease(t);
  }
  _heapify(e) {
    let n = this._arr, t = 2 * e, r = t + 1, o = e;
    t < n.length && (o = n[t].priority < n[o].priority ? t : o, r < n.length && (o = n[r].priority < n[o].priority ? r : o), o !== e && (this._swap(e, o), this._heapify(o)));
  }
  _decrease(e) {
    let n = this._arr, t = n[e].priority, r;
    for (; e !== 0 && (r = e >> 1, !(n[r].priority < t)); ) this._swap(e, r), e = r;
  }
  _swap(e, n) {
    let t = this._arr, r = this._keyIndices, o = t[e], i = t[n];
    t[e] = i, t[n] = o, r[i.key] = e, r[o.key] = n;
  }
};
var zn = () => 1;
function J(e, n, t, r) {
  let o = function(i) {
    var s;
    return (s = e.outEdges(i)) != null ? s : [];
  };
  return Hn(e, String(n), t || zn, r || o);
}
function Hn(e, n, t, r) {
  let o = {}, i = new Pe(), s, a, l = function(u) {
    let d = u.v !== s ? u.v : u.w, c = o[d];
    if (!c) return;
    let f = t(u), h = a.distance + f;
    if (f < 0) throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + u + " Weight: " + f);
    h < c.distance && (c.distance = h, c.predecessor = s, i.decrease(d, h));
  };
  for (e.nodes().forEach(function(u) {
    let d = u === n ? 0 : Number.POSITIVE_INFINITY;
    o[u] = { distance: d, predecessor: "" }, i.add(u, d);
  }); i.size() > 0; ) {
    s = i.removeMin();
    let u = o[s];
    if (!u || u.distance === Number.POSITIVE_INFINITY) break;
    a = u, r(s).forEach(l);
  }
  return o;
}
function qn(e, n, t) {
  return e.nodes().reduce(function(r, o) {
    return r[o] = J(e, o, n, t), r;
  }, {});
}
function Fe(e) {
  let n = 0, t = [], r = {}, o = [];
  function i(s) {
    var a;
    let l = r[s] = { onStack: true, lowlink: n, index: n++ };
    if (t.push(s), (a = e.successors(s)) == null || a.forEach(function(u) {
      if (u in r) {
        let d = r[u];
        d != null && d.onStack && (l.lowlink = Math.min(l.lowlink, d.index));
      } else {
        i(u);
        let d = r[u];
        d && (l.lowlink = Math.min(l.lowlink, d.lowlink));
      }
    }), l.lowlink === l.index) {
      let u = [], d;
      do {
        d = t.pop();
        let c = r[d];
        c && (c.onStack = false), u.push(d);
      } while (s !== d);
      o.push(u);
    }
  }
  return e.nodes().forEach(function(s) {
    s in r || i(s);
  }), o;
}
function $n(e) {
  return Fe(e).filter(function(n) {
    var t;
    let r = n[0];
    return r ? n.length > 1 || n.length === 1 && ((t = e.outEdges(r, r)) != null ? t : []).length > 0 : false;
  });
}
var Un = () => 1;
function Jn(e, n, t) {
  return Kn(e, n || Un, t || function(r) {
    var o;
    return (o = e.outEdges(r)) != null ? o : [];
  });
}
function Kn(e, n, t) {
  let r = {}, o = e.nodes();
  return o.forEach(function(i) {
    let s = {};
    r[i] = s, s[i] = { distance: 0, predecessor: "" }, o.forEach(function(a) {
      i !== a && (s[a] = { distance: Number.POSITIVE_INFINITY, predecessor: "" });
    }), t(i).forEach(function(a) {
      let l = a.v === i ? a.w : a.v, u = n(a);
      s[l] = { distance: u, predecessor: i };
    });
  }), o.forEach(function(i) {
    let s = r[i];
    s && o.forEach(function(a) {
      let l = r[a];
      l && o.forEach(function(u) {
        let d = l[i], c = s[u], f = l[u];
        if (d && c && f) {
          let h = d.distance + c.distance;
          h < f.distance && (f.distance = h, f.predecessor = c.predecessor);
        }
      });
    });
  }), r;
}
var K = class extends Error {
  constructor(e) {
    super(e), this.name = "CycleException";
  }
};
function Ae(e) {
  let n = {}, t = {}, r = [];
  function o(i) {
    var s;
    if (i in t) throw new K();
    i in n || (t[i] = true, n[i] = true, (s = e.predecessors(i)) == null || s.forEach(o), delete t[i], r.push(i));
  }
  if (e.sinks().forEach(o), Object.keys(n).length !== e.nodeCount()) throw new K();
  return r;
}
function Qn(e) {
  try {
    Ae(e);
  } catch (n) {
    if (n instanceof K) return false;
    throw n;
  }
  return true;
}
function Zn(e, n, t, r, o) {
  Array.isArray(n) || (n = [n]);
  let i = ((a) => {
    var l;
    return (l = e.isDirected() ? e.successors(a) : e.neighbors(a)) != null ? l : [];
  }), s = {};
  return n.forEach(function(a) {
    if (!e.hasNode(a)) throw new Error("Graph does not have node: " + a);
    o = Ve(e, a, t === "post", s, i, r, o);
  }), o;
}
function Ve(e, n, t, r, o, i, s) {
  return n in r || (r[n] = true, t || (s = i(s, n)), o(n).forEach(function(a) {
    s = Ve(e, a, t, r, o, i, s);
  }), t && (s = i(s, n))), s;
}
function De(e, n, t) {
  return Zn(e, n, t, function(r, o) {
    return r.push(o), r;
  }, []);
}
function et(e, n) {
  return De(e, n, "post");
}
function nt(e, n) {
  return De(e, n, "pre");
}
function tt(e, n) {
  var t;
  let r = new Q(), o = {}, i = new Pe(), s;
  function a(d) {
    let c = d.v === s ? d.w : d.v, f = i.priority(c);
    if (f !== void 0) {
      let h = n(d);
      h < f && (o[c] = s, i.decrease(c, h));
    }
  }
  if (e.nodeCount() === 0) return r;
  e.nodes().forEach(function(d) {
    i.add(d, Number.POSITIVE_INFINITY), r.setNode(d);
  });
  let l = e.nodes()[0];
  l !== void 0 && i.decrease(l, 0);
  let u = false;
  for (; i.size() > 0; ) {
    if (s = i.removeMin(), s in o) r.setEdge(s, o[s]);
    else {
      if (u) throw new Error("Input graph is not connected: " + e);
      u = true;
    }
    (t = e.nodeEdges(s)) == null || t.forEach(a);
  }
  return r;
}
function rt(e, n, t, r) {
  return ot(e, n, t, r != null ? r : ((o) => {
    var i;
    return (i = e.outEdges(o)) != null ? i : [];
  }));
}
function ot(e, n, t, r) {
  if (t === void 0) return J(e, n, t, r);
  let o = false, i = e.nodes();
  for (let s = 0; s < i.length; s++) {
    let a = i[s];
    if (a === void 0) continue;
    let l = r(a);
    for (let u = 0; u < l.length; u++) {
      let d = l[u];
      if (!d) continue;
      let c = d.v === a ? d.v : d.w, f = c === d.v ? d.w : d.v;
      t({ v: c, w: f }) < 0 && (o = true);
    }
    if (o) return Me(e, n, t, r);
  }
  return J(e, n, t, r);
}
var T = Q;
function M(e, n, t, r) {
  let o = r;
  for (; e.hasNode(o); ) o = $(r);
  return t.dummy = n, e.setNode(o, t), o;
}
function Ye(e) {
  let n = new T().setGraph(e.graph());
  return e.nodes().forEach((t) => n.setNode(t, e.node(t))), e.edges().forEach((t) => {
    let r = n.edge(t.v, t.w) || { weight: 0, minlen: 1 }, o = e.edge(t);
    n.setEdge(t.v, t.w, { weight: r.weight + o.weight, minlen: Math.max(r.minlen, o.minlen) });
  }), n;
}
function Z(e) {
  let n = new T({ multigraph: e.isMultigraph() }).setGraph(e.graph());
  return e.nodes().forEach((t) => {
    e.children(t).length || n.setNode(t, e.node(t));
  }), e.edges().forEach((t) => {
    n.setEdge(t, e.edge(t));
  }), n;
}
function se(e, n) {
  let t = e.x, r = e.y, o = n.x - t, i = n.y - r, s = e.width / 2, a = e.height / 2;
  if (!o && !i) throw new Error("Not possible to find intersection inside of the rectangle");
  let l, u;
  return Math.abs(i) * s > Math.abs(o) * a ? (i < 0 && (a = -a), l = a * o / i, u = a) : (o < 0 && (s = -s), l = s, u = s * i / o), { x: t + l, y: r + u };
}
function P(e) {
  let n = A(de(e) + 1).map(() => []);
  return e.nodes().forEach((t) => {
    let r = e.node(t), o = r.rank;
    o !== void 0 && (n[o] || (n[o] = []), n[o][r.order] = t);
  }), n;
}
function We(e) {
  let n = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MAX_VALUE : o;
  }), t = R(Math.min, n);
  e.nodes().forEach((r) => {
    let o = e.node(r);
    Object.hasOwn(o, "rank") && (o.rank -= t);
  });
}
function Be(e) {
  let n = e.nodes().map((s) => e.node(s).rank).filter((s) => s !== void 0), t = R(Math.min, n), r = [];
  e.nodes().forEach((s) => {
    let a = e.node(s).rank - t;
    r[a] || (r[a] = []), r[a].push(s);
  });
  let o = 0, i = e.graph().nodeRankFactor;
  Array.from(r).forEach((s, a) => {
    s === void 0 && a % i !== 0 ? --o : s !== void 0 && o && s.forEach((l) => e.node(l).rank += o);
  });
}
function ae(e, n, t, r) {
  let o = { width: 0, height: 0 };
  return arguments.length >= 4 && (o.rank = t, o.order = r), M(e, "border", o, n);
}
function it(e, n = Xe) {
  let t = [];
  for (let r = 0; r < e.length; r += n) {
    let o = e.slice(r, r + n);
    t.push(o);
  }
  return t;
}
var Xe = 65535;
function R(e, n) {
  if (n.length > Xe) {
    let t = it(n);
    return e(...t.map((r) => e(...r)));
  } else return e(...n);
}
function de(e) {
  let t = e.nodes().map((r) => {
    let o = e.node(r).rank;
    return o === void 0 ? Number.MIN_VALUE : o;
  });
  return R(Math.max, t);
}
function ze(e, n) {
  let t = { lhs: [], rhs: [] };
  return e.forEach((r) => {
    n(r) ? t.lhs.push(r) : t.rhs.push(r);
  }), t;
}
function le(e, n) {
  let t = Date.now();
  try {
    return n();
  } finally {
    console.log(e + " time: " + (Date.now() - t) + "ms");
  }
}
function q(e, n) {
  return n();
}
var st = 0;
function $(e) {
  let n = ++st;
  return e + ("" + n);
}
function A(e, n, t = 1) {
  n == null && (n = e, e = 0);
  let r = (i) => i < n;
  t < 0 && (r = (i) => n < i);
  let o = [];
  for (let i = e; r(i); i += t) o.push(i);
  return o;
}
function B(e, n) {
  let t = {};
  for (let r of n) e[r] !== void 0 && (t[r] = e[r]);
  return t;
}
function X(e, n) {
  let t;
  return typeof n == "string" ? t = (r) => r[n] : t = n, Object.entries(e).reduce((r, [o, i]) => (r[o] = t(i, o), r), {});
}
function He(e, n) {
  return e.reduce((t, r, o) => (t[r] = n[o], t), {});
}
var D = "\0";
function ee(e, n, t) {
  var u, d, c, f, h, p;
  if (!(e && n && t && n.dummy === "edge" && t.dummy === "edge" && n.edgeObj && t.edgeObj && e[n.edgeObj.v] && e[t.edgeObj.v] && e[n.edgeObj.w] && e[t.edgeObj.w])) return 0;
  let r = true;
  n.edgeObj.w === t.edgeObj.w && (r = false);
  let o = r ? (d = (u = e[n.edgeObj.v]) == null ? void 0 : u.rank) != null ? d : NaN + 1 : (f = (c = e[n.edgeObj.w]) == null ? void 0 : c.rank) != null ? f : NaN - 1, i = Object.entries(e).find((E) => {
    var y, L;
    return ((y = E[1].edgeObj) == null ? void 0 : y.v) === n.edgeObj.v && ((L = E[1].edgeObj) == null ? void 0 : L.w) === n.edgeObj.w && E[1].rank === o;
  }), s = Object.entries(e).find((E) => {
    var y, L;
    return ((y = E[1].edgeObj) == null ? void 0 : y.v) === t.edgeObj.v && ((L = E[1].edgeObj) == null ? void 0 : L.w) === t.edgeObj.w && E[1].rank === o;
  });
  if (!i || !s) return 0;
  let a = (h = i[1].order) != null ? h : NaN, l = (p = s[1].order) != null ? p : NaN;
  return isNaN(a - l) ? 0 : a - l;
}
var ue = "3.1.1";
var ce = class {
  constructor() {
    je(this, "_sentinel");
    let n = {};
    n._next = n._prev = n, this._sentinel = n;
  }
  dequeue() {
    let n = this._sentinel, t = n._prev;
    if (t !== n) return qe(t), t;
  }
  enqueue(n) {
    let t = this._sentinel;
    n._prev && n._next && qe(n), n._next = t._next, t._next._prev = n, t._next = n, n._prev = t;
  }
  toString() {
    let n = [], t = this._sentinel, r = t._prev;
    for (; r !== t; ) n.push(JSON.stringify(r, at)), r = r._prev;
    return "[" + n.join(", ") + "]";
  }
};
function qe(e) {
  e._prev._next = e._next, e._next._prev = e._prev, delete e._next, delete e._prev;
}
function at(e, n) {
  if (e !== "_next" && e !== "_prev") return n;
}
var $e = ce;
var dt = () => 1;
function be(e, n) {
  if (e.nodeCount() <= 1) return [];
  let t = ut(e, n || dt);
  return lt(t.graph, t.buckets, t.zeroIdx).flatMap((o) => e.outEdges(o.v, o.w) || []);
}
function lt(e, n, t) {
  var a;
  let r = [], o = n[n.length - 1], i = n[0], s;
  for (; e.nodeCount(); ) {
    for (; s = i.dequeue(); ) fe(e, n, t, s);
    for (; s = o.dequeue(); ) fe(e, n, t, s);
    if (e.nodeCount()) {
      for (let l = n.length - 2; l > 0; --l) if (s = (a = n[l]) == null ? void 0 : a.dequeue(), s) {
        r = r.concat(fe(e, n, t, s, true) || []);
        break;
      }
    }
  }
  return r;
}
function fe(e, n, t, r, o) {
  let i = [], s = o ? i : void 0;
  return (e.inEdges(r.v) || []).forEach((a) => {
    let l = e.edge(a), u = e.node(a.v);
    o && i.push({ v: a.v, w: a.w }), u.out -= l, he(n, t, u);
  }), (e.outEdges(r.v) || []).forEach((a) => {
    let l = e.edge(a), u = a.w, d = e.node(u);
    d.in -= l, he(n, t, d);
  }), e.removeNode(r.v), s;
}
function ut(e, n) {
  let t = new T(), r = 0, o = 0;
  e.nodes().forEach((a) => {
    t.setNode(a, { v: a, in: 0, out: 0 });
  }), e.edges().forEach((a) => {
    let l = t.edge(a.v, a.w) || 0, u = n(a), d = l + u;
    t.setEdge(a.v, a.w, d);
    let c = t.node(a.v), f = t.node(a.w);
    o = Math.max(o, c.out += u), r = Math.max(r, f.in += u);
  });
  let i = ct(o + r + 3).map(() => new $e()), s = r + 1;
  return t.nodes().forEach((a) => {
    he(i, s, t.node(a));
  }), { graph: t, buckets: i, zeroIdx: s };
}
function he(e, n, t) {
  var r, o, i;
  t.out ? t.in ? (i = e[t.out - t.in + n]) == null || i.enqueue(t) : (o = e[e.length - 1]) == null || o.enqueue(t) : (r = e[0]) == null || r.enqueue(t);
}
function ct(e) {
  let n = [];
  for (let t = 0; t < e; t++) n.push(t);
  return n;
}
function Ue(e, n) {
  (e.graph().acyclicer === "greedy" ? be(e, r(e)) : ft(e, n != null ? n : null)).forEach((o) => {
    let i = e.edge(o);
    e.removeEdge(o), i.forwardName = o.name, i.reversed = true, e.setEdge(o.w, o.v, i, $("rev"));
  });
  function r(o) {
    return (i) => o.edge(i).weight;
  }
}
function ft(e, n) {
  let t = [], r = {}, o = {};
  function i(l) {
    Object.hasOwn(o, l) || (o[l] = true, r[l] = true, e.outEdges(l).forEach((u) => {
      Object.hasOwn(r, u.w) ? t.push(u) : i(u.w);
    }), delete r[l]);
  }
  function s(l) {
    var u;
    Object.hasOwn(o, l) || (o[l] = true, r[l] = true, (u = e.outEdges(l)) == null || u.forEach((d) => {
      var c, f;
      Object.hasOwn(r, d.w) || ((c = n.node(l)) == null ? void 0 : c.rank) > ((f = n.node(d.w)) == null ? void 0 : f.rank) && ht(e, d.w, d) ? t.push(d) : s(d.w);
    }), delete r[l]);
  }
  let a = i;
  return n && typeof n.node == "function" && (a = s), e.sources().forEach(a), e.nodes().forEach(a), t;
}
function Je(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (t.reversed) {
      e.removeEdge(n);
      let r = t.forwardName;
      delete t.reversed, delete t.forwardName, e.setEdge(n.w, n.v, t, r);
    }
  });
}
function ht(e, n, t) {
  let r = /* @__PURE__ */ new Set();
  function o(i) {
    var s;
    if (e.sources().includes(i)) return true;
    r.add(i);
    for (let a of (s = e.inEdges(i)) != null ? s : []) if (!(a.v === t.v && a.w === t.w) && !r.has(a.v) && o(a.v)) return true;
    return false;
  }
  return o(n);
}
function Ke(e) {
  e.graph().dummyChains = [], e.edges().forEach((n) => gt(e, n));
}
function gt(e, n) {
  let t = n.v, r = e.node(t).rank, o = n.w, i = e.node(o).rank, s = n.name, a = e.edge(n), l = a.labelRank;
  if (i === r + 1) return;
  e.removeEdge(n);
  let u, d, c;
  for (c = 0, ++r; r < i; ++c, ++r) a.points = [], d = { width: 0, height: 0, edgeLabel: a, edgeObj: n, rank: r }, u = M(e, "edge", d, "_d"), r === l && (d.width = a.width, d.height = a.height, d.dummy = "edge-label", d.labelpos = a.labelpos), e.setEdge(t, u, { weight: a.weight }, s), c === 0 && e.graph().dummyChains.push(u), t = u;
  e.setEdge(t, o, { weight: a.weight }, s);
}
function Qe(e) {
  e.graph().dummyChains.forEach((n) => {
    let t = e.node(n), r = t.edgeLabel, o;
    for (e.setEdge(t.edgeObj, r); t.dummy; ) o = e.successors(n)[0], e.removeNode(n), r.points.push({ x: t.x, y: t.y }), t.dummy === "edge-label" && (r.x = t.x, r.y = t.y, r.width = t.width, r.height = t.height), n = o, t = e.node(n);
  });
}
function U(e) {
  let n = {};
  function t(r) {
    let o = e.node(r);
    if (Object.hasOwn(n, r)) return o.rank;
    n[r] = true;
    let i = e.outEdges(r), s = i ? i.map((l) => l == null ? Number.POSITIVE_INFINITY : t(l.w) - e.edge(l).minlen) : [], a = R(Math.min, s);
    return a === Number.POSITIVE_INFINITY && (a = 0), o.rank = a;
  }
  e.sources().forEach(t);
}
function V(e, n) {
  return e.node(n.w).rank - e.node(n.v).rank - e.edge(n).minlen;
}
var ne = mt;
function mt(e) {
  let n = new T({ directed: false }), t = e.nodes();
  if (t.length === 0) throw new Error("Graph must have at least one node");
  let r = t[0], o = e.nodeCount();
  n.setNode(r, {});
  let i, s;
  for (; Et(n, e) < o && (i = Lt(n, e), !!i); ) s = n.hasNode(i.v) ? V(e, i) : -V(e, i), yt(n, e, s);
  return n;
}
function Et(e, n) {
  function t(r) {
    let o = n.nodeEdges(r);
    o && o.forEach((i) => {
      let s = i.v, a = r === s ? i.w : s;
      !e.hasNode(a) && !V(n, i) && (e.setNode(a, {}), e.setEdge(r, a, {}), t(a));
    });
  }
  return e.nodes().forEach(t), e.nodeCount();
}
function Lt(e, n) {
  return n.edges().reduce((r, o) => {
    let i = Number.POSITIVE_INFINITY;
    return e.hasNode(o.v) !== e.hasNode(o.w) && (i = V(n, o)), i < r[0] ? [i, o] : r;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function yt(e, n, t) {
  e.nodes().forEach((r) => n.node(r).rank += t);
}
var { preorder: wt, postorder: Nt } = H;
var en = Y;
Y.initLowLimValues = pe;
Y.initCutValues = ge;
Y.calcCutValue = nn;
Y.leaveEdge = rn;
Y.enterEdge = on;
Y.exchangeEdges = sn;
function Y(e) {
  e = Ye(e), U(e);
  let n = ne(e);
  pe(n), ge(n, e);
  let t, r;
  for (; t = rn(n); ) r = on(n, e, t), sn(n, e, t, r);
}
function ge(e, n) {
  let t = Nt(e, e.nodes());
  t = t.slice(0, t.length - 1), t.forEach((r) => Gt(e, n, r));
}
function Gt(e, n, t) {
  let o = e.node(t).parent, i = e.edge(t, o);
  i.cutvalue = nn(e, n, t);
}
function nn(e, n, t) {
  let o = e.node(t).parent, i = true, s = n.edge(t, o), a = 0;
  s || (i = false, s = n.edge(o, t)), a = s.weight;
  let l = n.nodeEdges(t);
  return l && l.forEach((u) => {
    let d = u.v === t, c = d ? u.w : u.v;
    if (c !== o) {
      let f = d === i, h = n.edge(u).weight;
      if (a += f ? h : -h, kt(e, t, c)) {
        let E = e.edge(t, c).cutvalue;
        a += f ? -E : E;
      }
    }
  }), a;
}
function pe(e, n) {
  arguments.length < 2 && (n = e.nodes()[0]), tn(e, {}, 1, n);
}
function tn(e, n, t, r, o) {
  let i = t, s = e.node(r);
  n[r] = true;
  let a = e.neighbors(r);
  return a && a.forEach((l) => {
    Object.hasOwn(n, l) || (t = tn(e, n, t, l, r));
  }), s.low = i, s.lim = t++, o ? s.parent = o : delete s.parent, t;
}
function rn(e) {
  return e.edges().find((n) => e.edge(n).cutvalue < 0);
}
function on(e, n, t) {
  let r = t.v, o = t.w;
  n.hasEdge(r, o) || (r = t.w, o = t.v);
  let i = e.node(r), s = e.node(o), a = i, l = false;
  return i.lim > s.lim && (a = s, l = true), n.edges().filter((d) => l === Ze(e, e.node(d.v), a) && l !== Ze(e, e.node(d.w), a)).reduce((d, c) => V(n, c) < V(n, d) ? c : d);
}
function sn(e, n, t, r) {
  let o = t.v, i = t.w;
  e.removeEdge(o, i), e.setEdge(r.v, r.w, {}), pe(e), ge(e, n), vt(e, n);
}
function vt(e, n) {
  let t = e.nodes().find((o) => !e.node(o).parent);
  if (!t) return;
  let r = wt(e, [t]);
  r = r.slice(1), r.forEach((o) => {
    let s = e.node(o).parent, a = n.edge(o, s), l = false;
    a || (a = n.edge(s, o), l = true), n.node(o).rank = n.node(s).rank + (l ? a.minlen : -a.minlen);
  });
}
function kt(e, n, t) {
  return e.hasEdge(n, t);
}
function Ze(e, n, t) {
  return t.low <= n.lim && n.lim <= t.lim;
}
var dn = xt;
function xt(e) {
  let n = e.graph().ranker;
  if (typeof n == "function") return n(e);
  switch (n) {
    case "network-simplex":
      an(e);
      break;
    case "tight-tree":
      Ot(e);
      break;
    case "longest-path":
      _t(e);
      break;
    case "none":
      break;
    default:
      an(e);
  }
}
var _t = U;
function Ot(e) {
  U(e), ne(e);
}
function an(e) {
  en(e);
}
var ln = Ct;
function Ct(e) {
  let n = jt(e), t = e.graph();
  if (!Array.isArray(t.dummyChains)) return;
  t.dummyChains.forEach((o) => {
    let i = e.node(o), s = i.edgeObj, a = Tt(e, n, s.v, s.w), l = a.path, u = a.lca, d = 0, c = l[d], f = true;
    for (; o !== s.w; ) {
      if (i = e.node(o), f) {
        for (; (c = l[d]) !== u && e.node(c).maxRank < i.rank; ) d++;
        c === u && (f = false);
      }
      if (!f) {
        for (; d < l.length - 1 && e.node(l[d + 1]).minRank <= i.rank; ) d++;
        c = l[d];
      }
      c !== void 0 && e.setParent(o, c), o = e.successors(o)[0];
    }
  });
}
function Tt(e, n, t, r) {
  let o = [], i = [], s = Math.min(n[t].low, n[r].low), a = Math.max(n[t].lim, n[r].lim), l;
  l = t;
  do
    l = e.parent(l), o.push(l);
  while (l && (n[l].low > s || a > n[l].lim));
  let u = l, d = r;
  for (; (d = e.parent(d)) !== u; ) i.push(d);
  return { path: o.concat(i.reverse()), lca: u };
}
function jt(e) {
  let n = {}, t = 0;
  function r(o) {
    let i = t;
    e.children(o).forEach(r), n[o] = { low: i, lim: t++ };
  }
  return e.children(D).forEach(r), n;
}
function un(e) {
  let n = M(e, "root", {}, "_root"), t = Rt(e), r = Object.values(t), o = R(Math.max, r) - 1, i = 2 * o + 1;
  e.graph().nestingRoot = n, e.edges().forEach((a) => e.edge(a).minlen *= i);
  let s = It(e) + 1;
  e.children(D).forEach((a) => {
    cn(e, n, i, s, o, t, a);
  }), e.graph().nodeRankFactor = i;
}
function cn(e, n, t, r, o, i, s) {
  var c;
  let a = e.children(s);
  if (!a.length) {
    s !== n && e.setEdge(n, s, { weight: 0, minlen: t });
    return;
  }
  let l = ae(e, "_bt"), u = ae(e, "_bb"), d = e.node(s);
  e.setParent(l, s), d.borderTop = l, e.setParent(u, s), d.borderBottom = u, a.forEach((f) => {
    var b;
    cn(e, n, t, r, o, i, f);
    let h = e.node(f), p = h.borderTop ? h.borderTop : f, E = h.borderBottom ? h.borderBottom : f, y = h.borderTop ? r : 2 * r, L = p !== E ? 1 : o - ((b = i[s]) != null ? b : 0) + 1;
    e.setEdge(l, p, { weight: y, minlen: L, nestingEdge: true }), e.setEdge(E, u, { weight: y, minlen: L, nestingEdge: true });
  }), e.parent(s) || e.setEdge(n, l, { weight: 0, minlen: o + ((c = i[s]) != null ? c : 0) });
}
function Rt(e) {
  let n = {};
  function t(r, o) {
    let i = e.children(r);
    i && i.length && i.forEach((s) => t(s, o + 1)), n[r] = o;
  }
  return e.children(D).forEach((r) => t(r, 1)), n;
}
function It(e) {
  return e.edges().reduce((n, t) => n + e.edge(t).weight, 0);
}
function fn(e) {
  let n = e.graph();
  e.removeNode(n.nestingRoot), delete n.nestingRoot, e.edges().forEach((t) => {
    e.edge(t).nestingEdge && e.removeEdge(t);
  });
}
var bn = Mt;
function Mt(e) {
  function n(t) {
    let r = e.children(t), o = e.node(t);
    if (r.length && r.forEach(n), o && Object.hasOwn(o, "minRank")) {
      o.borderLeft = [], o.borderRight = [];
      for (let i = o.minRank, s = o.maxRank + 1; i < s; ++i) hn(e, "borderLeft", "_bl", t, o, i), hn(e, "borderRight", "_br", t, o, i);
    }
  }
  e.children(D).forEach(n);
}
function hn(e, n, t, r, o, i) {
  let s = { width: 0, height: 0, rank: i, borderType: n }, a = o[n][i - 1], l = M(e, "border", s, t);
  o[n][i] = l, e.setParent(l, r), a && e.setEdge(a, l, { weight: 1 });
}
function pn(e) {
  var t;
  let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
  (n === "lr" || n === "rl") && En(e);
}
function mn(e) {
  var t;
  let n = (t = e.graph().rankdir) == null ? void 0 : t.toLowerCase();
  (n === "bt" || n === "rl") && Pt(e), (n === "lr" || n === "rl") && (Ft(e), En(e));
}
function En(e) {
  e.nodes().forEach((n) => gn(e.node(n))), e.edges().forEach((n) => gn(e.edge(n)));
}
function gn(e) {
  let n = e.width;
  e.width = e.height, e.height = n;
}
function Pt(e) {
  e.nodes().forEach((n) => me(e.node(n))), e.edges().forEach((n) => {
    var r;
    let t = e.edge(n);
    (r = t.points) == null || r.forEach(me), Object.hasOwn(t, "y") && me(t);
  });
}
function me(e) {
  e.y = -e.y;
}
function Ft(e) {
  e.nodes().forEach((n) => Ee(e.node(n))), e.edges().forEach((n) => {
    var r;
    let t = e.edge(n);
    (r = t.points) == null || r.forEach(Ee), Object.hasOwn(t, "x") && Ee(t);
  });
}
function Ee(e) {
  let n = e.x;
  e.x = e.y, e.y = n;
}
function Le(e, n = null) {
  let t = {}, r = e.nodes().filter((d) => !e.children(d).length), o = r.map((d) => e.node(d).rank), i = R(Math.max, o), s = A(i + 1).map(() => []);
  function a(d) {
    if (t[d]) return;
    t[d] = true;
    let c = e.node(d);
    s[c.rank].push(d);
    let f = e.successors(d);
    f && [...f].sort((p, E) => u(p, E)).forEach(a);
  }
  r.sort((d, c) => e.node(d).rank - e.node(c).rank).forEach(a);
  function u(d, c) {
    let f = e.node(d), h = e.node(c);
    return ee(n, f, h);
  }
  return s;
}
function ye(e, n) {
  let t = 0;
  for (let r = 1; r < n.length; ++r) t += Vt(e, n[r - 1], n[r]);
  return t;
}
function Vt(e, n, t) {
  let r = He(t, t.map((u, d) => d)), o = n.flatMap((u) => {
    let d = e.outEdges(u);
    return d ? d.map((c) => ({ pos: r[c.w], weight: e.edge(c).weight })).sort((c, f) => c.pos - f.pos) : [];
  }), i = 1;
  for (; i < t.length; ) i <<= 1;
  let s = 2 * i - 1;
  i -= 1;
  let a = new Array(s).fill(0), l = 0;
  return o.forEach((u) => {
    let d = u.pos + i;
    a[d] += u.weight;
    let c = 0;
    for (; d > 0; ) d % 2 && (c += a[d + 1]), d = d - 1 >> 1, a[d] += u.weight;
    l += u.weight * c;
  }), l;
}
function we(e, n = []) {
  return n.map((t) => {
    let r = e.inEdges(t);
    if (!r || !r.length) return { v: t };
    {
      let o = r.reduce((i, s) => {
        let a = e.edge(s), l = e.node(s.v);
        return { sum: i.sum + a.weight * l.order, weight: i.weight + a.weight };
      }, { sum: 0, weight: 0 });
      return { v: t, barycenter: o.sum / o.weight, weight: o.weight };
    }
  });
}
function Ne(e, n) {
  let t = {};
  e.forEach((o, i) => {
    let s = { indegree: 0, in: [], out: [], vs: [o.v], i };
    o.barycenter !== void 0 && (s.barycenter = o.barycenter, s.weight = o.weight), t[o.v] = s;
  }), n.edges().forEach((o) => {
    let i = t[o.v], s = t[o.w];
    i !== void 0 && s !== void 0 && (s.indegree++, i.out.push(s));
  });
  let r = Object.values(t).filter((o) => !o.indegree);
  return Dt(r);
}
function Dt(e) {
  let n = [];
  function t(o) {
    return (i) => {
      i.merged || (i.barycenter === void 0 || o.barycenter === void 0 || i.barycenter >= o.barycenter) && Yt(o, i);
    };
  }
  function r(o) {
    return (i) => {
      i.in.push(o), --i.indegree === 0 && e.push(i);
    };
  }
  for (; e.length; ) {
    let o = e.pop();
    n.push(o), o.in.reverse().forEach(t(o)), o.out.forEach(r(o));
  }
  return n.filter((o) => !o.merged).map((o) => B(o, ["vs", "i", "barycenter", "weight"]));
}
function Yt(e, n) {
  let t = 0, r = 0;
  e.weight && (t += e.barycenter * e.weight, r += e.weight), n.weight && (t += n.barycenter * n.weight, r += n.weight), e.vs = n.vs.concat(e.vs), e.barycenter = t / r, e.weight = r, e.i = Math.min(n.i, e.i), n.merged = true;
}
function Ge(e, n, t, r, o) {
  let i = {}, s = null, a = null, l = o;
  typeof n == "boolean" ? (l = n, i = {}) : n && (i = n, s = t != null ? t : null, a = r != null ? r : null);
  let u = ze(e, (L) => Object.hasOwn(L, "barycenter")), d = u.lhs, c = u.rhs.sort((L, b) => b.i - L.i), f = [], h = 0, p = 0, E = 0;
  d.sort(Wt(a, s, !!l));
  for (let [L, b] of Object.entries(i)) {
    let g = d.findIndex((m) => m.vs[0] === L);
    d.splice(g + 1, 0, b);
  }
  E = Ln(f, c, E), d.forEach((L) => {
    E += L.vs.length, f.push(L.vs), h += L.barycenter * L.weight, p += L.weight, E = Ln(f, c, E);
  });
  let y = { vs: f.flat(1) };
  return p && (y.barycenter = h / p, y.weight = p), y;
}
function Ln(e, n, t) {
  let r;
  for (; n.length && (r = n[n.length - 1]).i <= t; ) n.pop(), e.push(r.vs), t++;
  return t;
}
function Wt(e, n, t) {
  return (r, o) => {
    if (r.barycenter < o.barycenter) return -1;
    if (r.barycenter > o.barycenter) return 1;
    if (e && (typeof r.vs[0] == "string" || typeof o.vs[0] == "string")) {
      let i = e.node(r.vs[0]), s = e.node(o.vs[0]), a = ee(n, i, s);
      if (a !== 0) return a;
    }
    return t ? o.i - r.i : r.i - o.i;
  };
}
function te(e, n, t, r, o) {
  var L, b, g, m, w, k, _, C, j, I, S;
  let i = null, s = o;
  typeof r == "boolean" ? (s = r, i = null) : r !== void 0 && (i = r);
  let a = e.children(n), l = e.node(n), u = l ? l.borderLeft : void 0, d = l ? l.borderRight : void 0, c = {};
  u && (a = a.filter((G) => G !== u && G !== d));
  let f = we(e, a);
  f.forEach((G) => {
    if (e.children(G.v).length) {
      let { result: x } = te(e, G.v, t, i, s);
      c[G.v] = x, Object.hasOwn(x, "barycenter") && Xt(G, x);
    }
  });
  let h = Ne(f, t);
  Bt(h, c);
  let p = {}, E = false;
  for (let G = 0; G < h.length; G++) for (let x = G + 1; x < h.length; x++) if (!(!h[G] || !h[x] || !((L = h[G]) != null && L.barycenter) || !((b = h[x]) != null && b.barycenter)) && ((g = h[G]) == null ? void 0 : g.barycenter) === h[x].barycenter) {
    let v = (w = (m = h[G]) == null ? void 0 : m.vs[0]) != null ? w : "", N = (_ = (k = h[x]) == null ? void 0 : k.vs[0]) != null ? _ : "", O = e.node(v), W = e.node(N);
    if (O.dummy === "edge" && W.dummy === "edge" && ((C = O.edgeObj) == null ? void 0 : C.v) === ((j = W.edgeObj) == null ? void 0 : j.v) && ((I = O.edgeObj) == null ? void 0 : I.w) === ((S = W.edgeObj) == null ? void 0 : S.w)) if (O.edgeLabel.reversed) {
      p[N] = h[G], h.splice(G, 1), G--;
      break;
    } else p[v] = h[x], h.splice(x, 1), x--;
    else E = true;
  }
  let y = Ge(h, p, i, e, s);
  if (u && d) {
    y.vs = [u, y.vs, d].flat(1);
    let G = e.predecessors(u);
    if (G && G.length) {
      let x = e.node(G[0]), v = e.predecessors(d), N = e.node(v[0]);
      Object.hasOwn(y, "barycenter") || (y.barycenter = 0, y.weight = 0), y.barycenter = (y.barycenter * y.weight + x.order + N.order) / (y.weight + 2), y.weight += 2;
    }
  }
  return Object.defineProperty(y, "result", { value: y, enumerable: false, configurable: true, writable: true }), Object.defineProperty(y, "usedBias", { value: E, enumerable: false, configurable: true, writable: true }), y;
}
function Bt(e, n) {
  e.forEach((t) => {
    t.vs = t.vs.flatMap((r) => n[r] ? n[r].vs : r);
  });
}
function Xt(e, n) {
  e.barycenter !== void 0 ? (e.barycenter = (e.barycenter * e.weight + n.barycenter * n.weight) / (e.weight + n.weight), e.weight += n.weight) : (e.barycenter = n.barycenter, e.weight = n.weight);
}
function ve(e, n, t, r) {
  r || (r = e.nodes());
  let o = zt(e), i = new T({ compound: true }).setGraph({ root: o }).setDefaultNodeLabel((s) => e.node(s));
  return r.forEach((s) => {
    let a = e.node(s), l = e.parent(s);
    if (a.rank === n || a.minRank <= n && n <= a.maxRank) {
      i.setNode(s), i.setParent(s, l || o);
      let u = e[t](s);
      u && u.forEach((d) => {
        let c = d.v === s ? d.w : d.v, f = i.edge(c, s), h = f !== void 0 ? f.weight : 0;
        i.setEdge(c, s, { weight: e.edge(d).weight + h });
      }), Object.hasOwn(a, "minRank") && i.setNode(s, { borderLeft: a.borderLeft[n], borderRight: a.borderRight[n] });
    }
  }), i;
}
function zt(e) {
  let n;
  for (; e.hasNode(n = $("_root")); ) ;
  return n;
}
function ke(e, n, t) {
  let r = {}, o;
  t.forEach((i) => {
    let s = e.parent(i), a, l;
    for (; s; ) {
      if (a = e.parent(s), a ? (l = r[a], r[a] = s) : (l = o, o = s), l && l !== s) {
        n.setEdge(l, s);
        return;
      }
      s = a;
    }
  });
}
function re(e, n = {}, t = null) {
  if (typeof n.customOrder == "function") {
    n.customOrder(e, re);
    return;
  }
  let r = de(e), o = yn(e, A(1, r + 1), "inEdges"), i = yn(e, A(r - 1, -1, -1), "outEdges"), s = Le(e, t);
  if (wn(e, s), n.disableOptimalOrderHeuristic) return;
  let a = Number.POSITIVE_INFINITY, l, u = n.constraints || [];
  for (let d = 0, c = 0; c < 4; ++d, ++c) {
    Ht(d % 2 ? o : i, d % 4 >= 2, u, t), s = P(e);
    let f = ye(e, s);
    f < a ? (c = 0, l = Object.assign({}, s), a = f) : f === a && (l = structuredClone(s));
  }
  wn(e, l);
}
function yn(e, n, t) {
  let r = /* @__PURE__ */ new Map(), o = (i, s) => {
    r.has(i) || r.set(i, []), r.get(i).push(s);
  };
  for (let i of e.nodes()) {
    let s = e.node(i);
    if (typeof s.rank == "number" && o(s.rank, i), typeof s.minRank == "number" && typeof s.maxRank == "number") for (let a = s.minRank; a <= s.maxRank; a++) a !== s.rank && o(a, i);
  }
  return n.map(function(i) {
    return ve(e, i, t, r.get(i) || []);
  });
}
function Ht(e, n, t, r) {
  let o = true, i = new T();
  e.forEach(function(s) {
    t.forEach((d) => i.setEdge(d.left, d.right));
    let a = s.graph().root, { result: l, usedBias: u } = te(s, a, i, r, o);
    n && u && (o = !o), l.vs.forEach((d, c) => s.node(d).order = c), ke(s, i, l.vs);
  });
}
function wn(e, n) {
  Object.values(n).forEach((t) => t.forEach((r, o) => e.node(r).order = o));
}
function qt(e, n) {
  let t = {};
  function r(o, i) {
    let s = 0, a = 0, l = o.length, u = i[i.length - 1];
    return i.forEach((d, c) => {
      let f = Ut(e, d), h = f ? e.node(f).order : l;
      (f || d === u) && (i.slice(a, c + 1).forEach((p) => {
        let E = e.predecessors(p);
        E && E.forEach((y) => {
          let L = e.node(y), b = L.order;
          (b < s || h < b) && !(L.dummy && e.node(p).dummy) && Gn(t, y, p);
        });
      }), a = c + 1, s = h);
    }), i;
  }
  return n.length && n.reduce(r), t;
}
function $t(e, n) {
  let t = {};
  function r(i, s, a, l, u) {
    A(s, a).forEach((d) => {
      let c = i[d];
      if (c !== void 0 && e.node(c).dummy) {
        let f = e.predecessors(c);
        f && f.forEach((h) => {
          if (h === void 0) return;
          let p = e.node(h);
          p.dummy && (p.order < l || p.order > u) && Gn(t, h, c);
        });
      }
    });
  }
  function o(i, s) {
    let a = -1, l = -1, u = 0;
    return s.forEach((d, c) => {
      if (e.node(d).dummy === "border") {
        let f = e.predecessors(d);
        if (f && f.length) {
          let h = f[0];
          if (h === void 0) return;
          l = e.node(h).order, r(s, u, c, a, l), u = c, a = l;
        }
      }
      r(s, u, s.length, l, i.length);
    }), s;
  }
  return n.length && n.reduce(o), t;
}
function Ut(e, n) {
  if (e.node(n).dummy) {
    let t = e.predecessors(n);
    if (t) return t.find((r) => e.node(r).dummy);
  }
}
function Gn(e, n, t) {
  if (n > t) {
    let o = n;
    n = t, t = o;
  }
  let r = e[n];
  r || (e[n] = r = {}), r[t] = true;
}
function Jt(e, n, t) {
  if (n > t) {
    let o = n;
    n = t, t = o;
  }
  let r = e[n];
  return r !== void 0 && Object.hasOwn(r, t);
}
function Kt(e, n, t, r, o) {
  let i = {}, s = {}, a = {};
  return n.forEach((l) => {
    l.forEach((u, d) => {
      i[u] = u, s[u] = u, a[u] = d;
    });
  }), n.forEach((l) => {
    let u = -1, d = -1, c = false, f = l, h = l.findIndex((p) => (o == null ? void 0 : o.includes(p)) || Nn(p, e, o));
    h > 0 && (f = [l[h], ...l.slice(0, h), ...l.slice(h + 1)], c = true), f.forEach((p) => {
      var y;
      let E = r(p);
      if (E && E.length) {
        o != null && o.includes(p) && (E = E.filter((g) => Nn(g, e, o)));
        let L = E.sort((g, m) => {
          let w = a[g], k = a[m];
          return (w !== void 0 ? w : 0) - (k !== void 0 ? k : 0);
        }), b = (L.length - 1) / 2;
        for (let g = Math.floor(b), m = Math.ceil(b); g <= m; ++g) {
          let w = L[g];
          if (w === void 0) continue;
          let k = a[w];
          if (k !== void 0 && s[p] === p && u < k && a[w] !== d && !Jt(t, p, w)) {
            let _ = i[w];
            _ !== void 0 && (s[w] = p, s[p] = i[p] = _, u = k, c && (u = -1, d = (y = a[w]) != null ? y : -1, c = false));
          }
        }
      }
    });
  }), { root: i, align: s };
}
function Qt(e, n, t, r, o = false) {
  let i = {}, s = Zt(e, n, t, o), a = o ? "borderLeft" : "borderRight";
  function l(h, p) {
    let E = s.nodes().slice(), y = {}, L = E.pop();
    for (; L; ) {
      if (y[L]) h(L);
      else {
        y[L] = true, E.push(L);
        for (let b of p(L)) E.push(b);
      }
      L = E.pop();
    }
  }
  function u(h) {
    let p = s.inEdges(h);
    p ? i[h] = p.reduce((E, y) => {
      var g;
      let L = (g = i[y.v]) != null ? g : 0, b = s.edge(y);
      return Math.max(E, L + (b !== void 0 ? b : 0));
    }, 0) : i[h] = 0;
  }
  function d(h) {
    let p = s.outEdges(h), E = Number.POSITIVE_INFINITY;
    p && (E = p.reduce((L, b) => {
      let g = i[b.w], m = s.edge(b);
      return Math.min(L, (g !== void 0 ? g : 0) - (m !== void 0 ? m : 0));
    }, Number.POSITIVE_INFINITY));
    let y = e.node(h);
    E !== Number.POSITIVE_INFINITY && y.borderType !== a && (i[h] = Math.max(i[h] !== void 0 ? i[h] : 0, E));
  }
  function c(h) {
    return s.predecessors(h) || [];
  }
  function f(h) {
    return s.successors(h) || [];
  }
  return l(u, c), l(d, f), Object.keys(r).forEach((h) => {
    var E;
    let p = t[h];
    p !== void 0 && (i[h] = (E = i[p]) != null ? E : 0);
  }), i;
}
function Zt(e, n, t, r) {
  let o = new T(), i = e.graph(), s = rr(i.nodesep, i.edgesep, r);
  return n.forEach((a) => {
    let l;
    a.forEach((u) => {
      let d = t[u];
      if (d !== void 0) {
        if (o.setNode(d), l !== void 0) {
          let c = t[l];
          if (c !== void 0) {
            let f = o.edge(c, d);
            o.setEdge(c, d, Math.max(s(e, u, l), f || 0));
          }
        }
        l = u;
      }
    });
  }), o;
}
function er(e, n) {
  return Object.values(n).reduce((t, r) => {
    let o = Number.NEGATIVE_INFINITY, i = Number.POSITIVE_INFINITY;
    Object.entries(r).forEach(([a, l]) => {
      let u = or(e, a) / 2;
      o = Math.max(l + u, o), i = Math.min(l - u, i);
    });
    let s = o - i;
    return s < t[0] && (t = [s, r]), t;
  }, [Number.POSITIVE_INFINITY, null])[1];
}
function nr(e, n) {
  let t = Object.values(n), r = R(Math.min, t), o = R(Math.max, t);
  ["u", "d"].forEach((i) => {
    ["l", "r"].forEach((s) => {
      let a = i + s, l = e[a];
      if (!l || l === n) return;
      let u = Object.values(l), d = r - R(Math.min, u);
      s !== "l" && (d = o - R(Math.max, u)), d && (e[a] = X(l, (c) => c + d));
    });
  });
}
function tr(e, n = void 0) {
  let t = e.ul;
  return t ? X(t, (r, o) => {
    var s, a;
    if (n) {
      let l = n.toLowerCase(), u = e[l];
      if (u && u[o] !== void 0) return u[o];
    }
    let i = Object.values(e).map((l) => {
      let u = l[o];
      return u !== void 0 ? u : 0;
    }).sort((l, u) => l - u);
    return (((s = i[1]) != null ? s : 0) + ((a = i[2]) != null ? a : 0)) / 2;
  }) : {};
}
function vn(e, n) {
  let t = P(e), r = Object.assign(qt(e, t), $t(e, t)), o = {}, i;
  ["u", "d"].forEach((a) => {
    i = a === "u" ? t : Object.values(t).reverse(), ["l", "r"].forEach((l) => {
      l === "r" && (i = i.map((f) => Object.values(f).reverse()));
      let d = Kt(e, i, r, (f) => (a === "u" ? e.predecessors(f) : e.successors(f)) || [], n), c = Qt(e, i, d.root, d.align, l === "r");
      l === "r" && (c = X(c, (f) => -f)), o[a + l] = c;
    });
  });
  let s = er(e, o);
  return nr(o, s), tr(o, e.graph().align);
}
function rr(e, n, t) {
  return (r, o, i) => {
    let s = r.node(o), a = r.node(i), l = 0, u;
    if (l += s.width / 2, Object.hasOwn(s, "labelpos")) switch (s.labelpos.toLowerCase()) {
      case "l":
        u = -s.width / 2;
        break;
      case "r":
        u = s.width / 2;
        break;
    }
    if (u && (l += t ? u : -u), u = void 0, l += (s.dummy ? n : e) / 2, l += (a.dummy ? n : e) / 2, l += a.width / 2, Object.hasOwn(a, "labelpos")) switch (a.labelpos.toLowerCase()) {
      case "l":
        u = a.width / 2;
        break;
      case "r":
        u = -a.width / 2;
        break;
    }
    return u && (l += t ? u : -u), l;
  };
}
function or(e, n) {
  return e.node(n).width;
}
function Nn(e, n, t) {
  var s;
  if (!t) return false;
  let r = (s = n.node(e)) == null ? void 0 : s.edgeObj;
  if (!r || n.node(e).edgeLabel.reversed) return false;
  let o = t.indexOf(r == null ? void 0 : r.v), i = t.indexOf(r == null ? void 0 : r.w);
  return o !== -1 && i !== -1 && o === (i + 1) % t.length || o === (i - 1) % t.length;
}
function kn(e, n) {
  e = Z(e), ir(e), Object.entries(vn(e, n)).forEach(([t, r]) => e.node(t).x = r);
}
function ir(e) {
  let n = P(e), t = e.graph(), r = t.ranksep, o = t.rankalign, i = 0;
  n.forEach((s) => {
    let a = s.reduce((l, u) => {
      var c;
      let d = (c = e.node(u).height) != null ? c : 0;
      return l > d ? l : d;
    }, 0);
    s.forEach((l) => {
      let u = e.node(l);
      o === "top" ? u.y = i + u.height / 2 : o === "bottom" ? u.y = i + a - u.height / 2 : u.y = i + a / 2;
    }), i += a + r;
  });
}
var xn = /* @__PURE__ */ new WeakMap();
function Oe(e, n = {}) {
  return Rn(e, q, n), e;
}
function _n(e, n, t) {
  let r = n;
  for (; r !== void 0; ) {
    let o = e.parent(r);
    if (o === t) return r;
    r = o;
  }
}
function Rn(e, n, t) {
  var L;
  let r = e.nodes().filter((b) => e.children(b).length), o = {};
  r.forEach((b) => {
    let g = e.node(b);
    if (g && g.rankdir) {
      let m = new T({ multigraph: true, compound: true });
      m.setGraph({ rankdir: g.rankdir });
      let w = e.children(b);
      w.forEach((v) => {
        let N = __spreadValues({}, e.node(v));
        m.setNode(v, N);
        let O = e.parent(v);
        O && O !== b && w.includes(O) && m.setParent(v, O);
      });
      let k = /* @__PURE__ */ new Set();
      e.edges().forEach((v) => {
        let N = _n(e, v.v, b), O = _n(e, v.w, b);
        if (N && O && N !== O) {
          let W = `${N}\0${O}`;
          k.has(W) || (k.add(W), m.setEdge(N, O, __spreadValues({}, e.edge(v))));
        }
      }), Rn(m, n, t);
      let _ = jn(m);
      On(_, n, t, null), Cn(m, _);
      let C = 1 / 0, j = 1 / 0, I = -1 / 0, S = -1 / 0;
      m.nodes().forEach((v) => {
        if (v === b) return;
        let N = m.node(v);
        N && typeof N.x == "number" && typeof N.y == "number" && typeof N.width == "number" && typeof N.height == "number" && (C = Math.min(C, N.x - N.width / 2), I = Math.max(I, N.x + N.width / 2), j = Math.min(j, N.y - N.height / 2), S = Math.max(S, N.y + N.height / 2));
      }), (!isFinite(C) || !isFinite(j) || !isFinite(I) || !isFinite(S)) && (C = j = 0, I = S = 0);
      let G = I - C, x = S - j;
      o[b] = { minX: C, minY: j, maxX: I, maxY: S, width: G, height: x, offsetX: C, offsetY: j }, g._dagreClusterSubgraph = m;
    }
  });
  let i = [], s = (b) => {
    let g = [], m = (e.children(b) || []).filter((w) => w !== b);
    for (; m.length > 0; ) {
      let w = m.shift();
      g.push(w), (e.children(w) || []).filter((k) => k !== w).forEach((k) => m.push(k));
    }
    return g;
  }, a = /* @__PURE__ */ new Map();
  r.forEach((b) => {
    let g = e.node(b);
    g && g.rankdir && o[b] && a.set(b, (e.children(b) || []).filter((m) => m !== b));
  });
  let l = new Set([...a.values()].flat()), u = /* @__PURE__ */ new Map();
  a.forEach((b, g) => {
    l.has(g) || u.set(g, s(g));
  });
  let d = new Set([...u.values()].flat()), c = (b) => {
    for (let [g, m] of u) if (m.includes(b)) return g;
    return b;
  }, f = [];
  e.edges().forEach((b) => {
    (d.has(b.v) || d.has(b.w)) && f.push({ edge: b, label: e.edge(b) });
  });
  let h = /* @__PURE__ */ new Map();
  d.forEach((b) => {
    let g = e.parent(b);
    h.set(b, typeof g == "string" ? g : void 0);
  }), u.forEach((b, g) => {
    let m = e.node(g), w = [];
    b.forEach((C) => {
      let j = e.node(C);
      j && (w.push({ id: C, node: j, parent: h.get(C) }), e.removeNode(C));
    });
    let k = f.filter(({ edge: C }) => b.includes(C.v) || b.includes(C.w)), _ = o[g];
    m && (i.push({ clusterId: g, subgraph: m._dagreClusterSubgraph, bounds: _, children: b, removedNodes: w, removedEdges: k }), m.width = _.width, m.height = _.height);
  });
  let p = /* @__PURE__ */ new Set();
  f.forEach(({ edge: b, label: g }) => {
    let m = c(b.v), w = c(b.w);
    if (m !== w && e.hasNode(m) && e.hasNode(w)) {
      let k = `${m}\0${w}`;
      p.has(k) || (p.add(k), e.setEdge(m, w, __spreadProps(__spreadValues({}, g), { width: 0, height: 0 })));
    }
  });
  let E = jn(e), y = On(E, n, t, (L = xn.get(e)) != null ? L : null);
  xn.set(e, y), Cn(e, E), p.forEach((b) => {
    let g = b.indexOf("\0"), m = b.slice(0, g), w = b.slice(g + 1);
    e.hasEdge(m, w) && e.removeEdge(m, w);
  }), i.forEach(({ clusterId: b, subgraph: g, bounds: m, removedNodes: w, removedEdges: k }) => {
    var G, x;
    let _ = e.node(b), C = (G = _ == null ? void 0 : _.x) != null ? G : 0, j = (x = _ == null ? void 0 : _.y) != null ? x : 0, I = (m.minX + m.maxX) / 2, S = (m.minY + m.maxY) / 2;
    w.forEach(({ id: v, node: N, parent: O }) => {
      e.setNode(v, N), O !== void 0 && e.setParent(v, O);
    }), k.forEach(({ edge: v, label: N }) => {
      e.setEdge(v, N);
    }), g.nodes().forEach((v) => {
      if (v === b) return;
      let N = g.node(v), O = e.node(v);
      O && N && typeof N.x == "number" && typeof N.y == "number" && (O.x = C + (N.x - I), O.y = j + (N.y - S));
    }), delete _._dagreClusterSubgraph;
  }), r.forEach((b) => {
    var w, k;
    let g = e.node(b), m = o[b];
    if (g && g.rankdir && g._dagreClusterSubgraph && m) {
      let _ = g._dagreClusterSubgraph, C = (w = g.x) != null ? w : 0, j = (k = g.y) != null ? k : 0, I = (m.minX + m.maxX) / 2, S = (m.minY + m.maxY) / 2;
      _.nodes().forEach((G) => {
        if (G === b) return;
        let x = _.node(G), v = e.node(G);
        if (v && x && typeof x.x == "number" && typeof x.y == "number") {
          let N = x.x - I, O = x.y - S;
          v.x = C + N, v.y = j + O;
        }
      }), delete g._dagreClusterSubgraph;
    }
  });
}
function On(e, n, t, r = null) {
  var l, u;
  let o = (t == null ? void 0 : t.useDynamic) !== false, i = o && (l = r == null ? void 0 : r.graph) != null ? l : null, s = o && (u = r == null ? void 0 : r.rawNodes) != null ? u : null;
  n("    makeSpaceForEdgeLabels", () => hr(e)), n("    removeSelfEdges", () => Nr(e)), n("    acyclic", () => Ue(e, i)), n("    nestingGraph.run", () => un(e)), n("    rank", () => dn(Z(e))), n("    injectEdgeLabelProxies", () => br(e)), n("    removeEmptyRanks", () => Be(e)), n("    nestingGraph.cleanup", () => fn(e)), n("    normalizeRanks", () => We(e)), n("    assignRankMinMax", () => gr(e)), n("    removeEdgeLabelProxies", () => pr(e)), n("    normalize.run", () => Ke(e)), n("    parentDummyChains", () => ln(e)), n("    addBorderSegments", () => bn(e)), n("    order", () => re(e, t, s)), n("    insertSelfEdges", () => Gr(e)), n("    adjustCoordinateSystem", () => pn(e)), n("    position", () => kn(e, t.corePath)), n("    positionSelfEdges", () => vr(e));
  let a = JSON.parse(JSON.stringify(e._nodes));
  return n("    removeBorderNodes", () => wr(e)), n("    normalize.undo", () => Qe(e)), n("    fixupEdgeLabelCoords", () => Lr(e)), n("    undoCoordinateSystem", () => mn(e)), n("    translateGraph", () => mr(e)), n("    assignNodeIntersects", () => Er(e)), n("    reversePoints", () => yr(e)), n("    acyclic.undo", () => Je(e)), { graph: e, rawNodes: a };
}
function Cn(e, n) {
  e.nodes().forEach((t) => {
    let r = e.node(t), o = n.node(t);
    r && (r.x = o.x, r.y = o.y, r.order = o.order, r.rank = o.rank, n.children(t).length && (r.width = o.width, r.height = o.height));
  }), e.edges().forEach((t) => {
    let r = e.edge(t), o = n.edge(t);
    r.points = o.points, Object.hasOwn(o, "x") && (r.x = o.x, r.y = o.y);
  }), e.graph().width = n.graph().width, e.graph().height = n.graph().height;
}
var sr = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"];
var ar = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "TB", rankalign: "center" };
var dr = ["acyclicer", "ranker", "rankdir", "align", "rankalign"];
var lr = ["width", "height", "rank"];
var Tn = { width: 0, height: 0 };
var ur = ["minlen", "weight", "width", "height", "labeloffset"];
var cr = { minlen: 1, weight: 1, width: 0, height: 0, labeloffset: 10, labelpos: "r" };
var fr = ["labelpos"];
function jn(e) {
  let n = new T({ multigraph: true, compound: true }), t = _e(e.graph());
  return n.setGraph(Object.assign({}, ar, xe(t, sr), B(t, dr))), e.nodes().forEach((r) => {
    let o = _e(e.node(r)), i = xe(o, lr);
    Object.keys(Tn).forEach((a) => {
      i[a] === void 0 && (i[a] = Tn[a]);
    }), n.setNode(r, i);
    let s = e.parent(r);
    s !== void 0 && n.setParent(r, s);
  }), e.edges().forEach((r) => {
    let o = _e(e.edge(r));
    n.setEdge(r, Object.assign({}, cr, xe(o, ur), B(o, fr)));
  }), n;
}
function hr(e) {
  let n = e.graph();
  n.ranksep /= 2, e.edges().forEach((t) => {
    var o;
    let r = e.edge(t);
    r.minlen *= 2, ((o = r.labelpos) != null ? o : "r").toLowerCase() !== "c" && (n.rankdir === "TB" || n.rankdir === "BT" ? r.width += r.labeloffset : r.height += r.labeloffset);
  });
}
function br(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (t.width && t.height) {
      let r = e.node(n.v), i = { rank: (e.node(n.w).rank - r.rank) / 2 + r.rank, e: n };
      M(e, "edge-proxy", i, "_ep");
    }
  });
}
function gr(e) {
  let n = 0;
  e.nodes().forEach((t) => {
    let r = e.node(t);
    r.borderTop && (r.minRank = e.node(r.borderTop).rank, r.maxRank = e.node(r.borderBottom).rank, n = Math.max(n, r.maxRank));
  }), e.graph().maxRank = n;
}
function pr(e) {
  e.nodes().forEach((n) => {
    let t = e.node(n);
    if (t.dummy === "edge-proxy") {
      let r = t;
      e.edge(r.e).labelRank = t.rank, e.removeNode(n);
    }
  });
}
function mr(e) {
  let n = Number.POSITIVE_INFINITY, t = 0, r = Number.POSITIVE_INFINITY, o = 0, i = e.graph(), s = i.marginx || 0, a = i.marginy || 0;
  function l(u) {
    let d = u.x, c = u.y, f = u.width, h = u.height;
    n = Math.min(n, d - f / 2), t = Math.max(t, d + f / 2), r = Math.min(r, c - h / 2), o = Math.max(o, c + h / 2);
  }
  e.nodes().forEach((u) => l(e.node(u))), e.edges().forEach((u) => {
    let d = e.edge(u);
    Object.hasOwn(d, "x") && l(d);
  }), n -= s, r -= a, e.nodes().forEach((u) => {
    let d = e.node(u);
    d.x -= n, d.y -= r;
  }), e.edges().forEach((u) => {
    let d = e.edge(u);
    d.points.forEach((c) => {
      c.x -= n, c.y -= r;
    }), Object.hasOwn(d, "x") && (d.x -= n), Object.hasOwn(d, "y") && (d.y -= r);
  }), i.width = t - n + s, i.height = o - r + a;
}
function Er(e) {
  e.edges().forEach((n) => {
    if (n.v === n.w) return;
    let t = e.edge(n), r = e.node(n.v), o = e.node(n.w), i, s;
    t.points ? (i = t.points[0], s = t.points[t.points.length - 1]) : (t.points = [], i = o, s = r), t.points.unshift(se(r, i)), t.points.push(se(o, s));
  });
}
function Lr(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    if (Object.hasOwn(t, "x")) switch ((t.labelpos === "l" || t.labelpos === "r") && (t.width -= t.labeloffset), t.labelpos) {
      case "l":
        t.x -= t.width / 2 + t.labeloffset;
        break;
      case "r":
        t.x += t.width / 2 + t.labeloffset;
        break;
    }
  });
}
function yr(e) {
  e.edges().forEach((n) => {
    let t = e.edge(n);
    t.reversed && t.points.reverse();
  });
}
function wr(e) {
  e.nodes().forEach((n) => {
    if (e.children(n).length) {
      let t = e.node(n), r = e.node(t.borderTop), o = e.node(t.borderBottom), i = e.node(t.borderLeft[t.borderLeft.length - 1]), s = e.node(t.borderRight[t.borderRight.length - 1]);
      t.width = Math.abs(s.x - i.x), t.height = Math.abs(o.y - r.y), t.x = i.x + t.width / 2, t.y = r.y + t.height / 2;
    }
  }), e.nodes().forEach((n) => {
    e.node(n).dummy === "border" && e.removeNode(n);
  });
}
function Nr(e) {
  e.edges().forEach((n) => {
    if (n.v === n.w) {
      let t = e.node(n.v);
      t.selfEdges || (t.selfEdges = []), t.selfEdges.push({ e: n, label: e.edge(n) }), e.removeEdge(n);
    }
  });
}
function Gr(e) {
  P(e).forEach((t) => {
    let r = 0;
    t.forEach((o, i) => {
      let s = e.node(o);
      typeof s.rank != "number" && (s.rank = 0), s.order = i + r, (s.selfEdges || []).forEach((a) => {
        M(e, "selfedge", { width: a.label.width, height: a.label.height, rank: s.rank, order: i + ++r, e: a.e, edgeLabel: a.label }, "_se"), (!Array.isArray(a.label.points) || a.label.points.length !== 7) && (a.label.points = [{ x: 0, y: -10 }, { x: 0, y: -10 }, { x: 0, y: 0 }, { x: 0, y: 10 }, { x: 0, y: 10 }, { x: 0, y: 0 }, { x: 0, y: 0 }]);
      }), delete s.selfEdges;
    });
  });
}
function vr(e) {
  e.nodes().forEach((n) => {
    let t = e.node(n), r = (o) => typeof o == "number" && isFinite(o);
    if (t.dummy === "selfedge") {
      let o = t, i = e.node(o.e.v), s = r(i == null ? void 0 : i.x) ? i.x : 0, a = r(i == null ? void 0 : i.y) ? i.y : 0, l = r(i == null ? void 0 : i.width) ? i.width : 0, u = r(i == null ? void 0 : i.height) ? i.height : 0, d = r(t.x) ? t.x : s, c = r(t.y) ? t.y : a, f = l / 2, h = u / 2;
      o.edgeLabel.points = [{ x: d + f, y: c - h }, { x: d + f, y: c - h }, { x: d, y: c }, { x: d - f, y: c + h }, { x: d - f, y: c + h }, { x: d, y: c }, { x: d, y: c }], o.edgeLabel.x = d, o.edgeLabel.y = c, e.setEdge(o.e, o.edgeLabel), e.removeNode(n);
    } else t && Array.isArray(t.selfEdges) && t.selfEdges.forEach((o) => {
      if (!Array.isArray(o.label.points) || o.label.points.length !== 7) {
        let i = r(t.x) ? t.x : 0, s = r(t.y) ? t.y : 0, a = r(t.width) ? t.width : 0, l = r(t.height) ? t.height : 0, u = a / 2, d = l / 2;
        o.label.points = [{ x: i + u, y: s - d }, { x: i + u, y: s - d }, { x: i, y: s }, { x: i - u, y: s + d }, { x: i - u, y: s + d }, { x: i, y: s }, { x: i, y: s }];
      }
    });
  });
}
function xe(e, n) {
  return X(B(e, n), Number);
}
function _e(e) {
  let n = {};
  return e && Object.entries(e).forEach(([t, r]) => {
    typeof t == "string" && (t = t.toLowerCase()), n[t] = r;
  }), n;
}
function Ce(e) {
  let n = P(e), t = new T({ compound: true, multigraph: true }).setGraph({});
  return e.nodes().forEach((r) => {
    t.setNode(r, { label: r }), t.setParent(r, "layer" + e.node(r).rank);
  }), e.edges().forEach((r) => t.setEdge(r.v, r.w, {}, r.name)), n.forEach((r, o) => {
    let i = "layer" + o;
    t.setNode(i, { rank: "same" }), r.reduce((s, a) => (t.setEdge(s, a, { style: "invis" }), a));
  }), t;
}
var kr = { graphlib: ie, version: ue, layout: Oe, debug: Ce, util: { time: le, notime: q } };
var $o = kr;

// ../../packages/visual-flow/dist/chunk-CT6HPRAQ.js
var kinds = /* @__PURE__ */ new Set(["architecture", "workflow", "dataflow", "sequence", "lifecycle"]);
var layouts = /* @__PURE__ */ new Set(["manual", "grid", "lanes", "dagre"]);
var VISUAL_FLOW_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://visual-flow.dev/schemas/visual-flow.schema.json",
  title: "Visual Flow diagram",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "id", "kind", "title", "nodes", "edges"],
  properties: {
    schemaVersion: { const: 1 },
    id: { type: "string", minLength: 1 },
    kind: { enum: [...kinds] },
    title: { type: "string", minLength: 1 },
    description: { type: "string" },
    layout: { type: "object" },
    theme: { oneOf: [{ type: "string" }, { type: "object" }] },
    motion: { enum: ["none", "trace", "flow"] },
    nodes: { type: "array", items: { type: "object" } },
    edges: { type: "array", items: { type: "object" } },
    groups: { type: "array", items: { type: "object" } },
    lanes: { type: "array", items: { type: "object" } },
    annotations: { type: "array", items: { type: "object" } },
    metadata: { type: "object" }
  }
};
function issue(path, code, message, severity = "error") {
  return { path, code, message, severity };
}
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function validateVisualFlow(value) {
  const issues = [];
  if (!isRecord(value)) return { valid: false, issues: [issue("$", "type", "Diagram must be a JSON object.")] };
  if (value.schemaVersion !== 1) issues.push(issue("$.schemaVersion", "schema-version", "schemaVersion must be 1."));
  if (typeof value.id !== "string" || !value.id.trim()) issues.push(issue("$.id", "required", "id must be a non-empty string."));
  if (typeof value.title !== "string" || !value.title.trim()) issues.push(issue("$.title", "required", "title must be a non-empty string."));
  if (typeof value.kind !== "string" || !kinds.has(value.kind)) issues.push(issue("$.kind", "enum", "kind must be architecture, workflow, dataflow, sequence, or lifecycle."));
  if (value.layout !== void 0 && (!isRecord(value.layout) || typeof value.layout.mode !== "string" || !layouts.has(value.layout.mode))) {
    issues.push(issue("$.layout.mode", "enum", "layout.mode must be manual, grid, lanes, or dagre."));
  }
  if (!Array.isArray(value.nodes)) issues.push(issue("$.nodes", "type", "nodes must be an array."));
  if (!Array.isArray(value.edges)) issues.push(issue("$.edges", "type", "edges must be an array."));
  if (issues.some((entry) => entry.path === "$.nodes" || entry.path === "$.edges")) return { valid: false, issues };
  const nodeIds = /* @__PURE__ */ new Set();
  const nodes = value.nodes;
  for (const [index, node] of nodes.entries()) {
    const path = `$.nodes[${index}]`;
    if (!isRecord(node)) {
      issues.push(issue(path, "type", "Node must be an object."));
      continue;
    }
    if (typeof node.id !== "string" || !node.id.trim()) issues.push(issue(`${path}.id`, "required", "Node id must be a non-empty string."));
    else if (nodeIds.has(node.id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate node id '${node.id}'.`));
    else nodeIds.add(node.id);
    if (typeof node.label !== "string" || !node.label.trim()) issues.push(issue(`${path}.label`, "required", "Node label must be a non-empty string."));
    for (const dimension of ["x", "y", "width", "height"]) {
      const dimensionValue = node[dimension];
      if (dimensionValue !== void 0 && (typeof dimensionValue !== "number" || !Number.isFinite(dimensionValue))) {
        issues.push(issue(`${path}.${dimension}`, "finite-number", `${dimension} must be a finite number.`));
      }
    }
    if (typeof node.width === "number" && node.width < 80) issues.push(issue(`${path}.width`, "readability", "Node width below 80px may truncate content.", "warning"));
    if (typeof node.height === "number" && node.height < 48) issues.push(issue(`${path}.height`, "readability", "Node height below 48px may truncate content.", "warning"));
  }
  const edgeIds = /* @__PURE__ */ new Set();
  for (const [index, edge] of value.edges.entries()) {
    const path = `$.edges[${index}]`;
    if (!isRecord(edge)) {
      issues.push(issue(path, "type", "Edge must be an object."));
      continue;
    }
    if (typeof edge.from !== "string" || !nodeIds.has(edge.from)) issues.push(issue(`${path}.from`, "unknown-node", `Unknown source node '${String(edge.from)}'.`));
    if (typeof edge.to !== "string" || !nodeIds.has(edge.to)) issues.push(issue(`${path}.to`, "unknown-node", `Unknown target node '${String(edge.to)}'.`));
    const id = typeof edge.id === "string" ? edge.id : `${String(edge.from)}--${String(edge.to)}`;
    if (edgeIds.has(id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate edge id '${id}'.`));
    edgeIds.add(id);
    if (edge.from === edge.to) issues.push(issue(path, "self-edge", "Self-referencing edges are supported but are less readable.", "warning"));
  }
  if (Array.isArray(value.groups)) {
    const groupIds = /* @__PURE__ */ new Set();
    for (const [index, group] of value.groups.entries()) {
      const path = `$.groups[${index}]`;
      if (!isRecord(group)) {
        issues.push(issue(path, "type", "Group must be an object."));
        continue;
      }
      if (typeof group.id !== "string" || !group.id.trim()) issues.push(issue(`${path}.id`, "required", "Group id is required."));
      else if (groupIds.has(group.id)) issues.push(issue(`${path}.id`, "duplicate", `Duplicate group id '${group.id}'.`));
      else groupIds.add(group.id);
      if (!Array.isArray(group.nodeIds) || group.nodeIds.length === 0) issues.push(issue(`${path}.nodeIds`, "required", "Group must wrap at least one node."));
      else for (const nodeId of group.nodeIds) if (!nodeIds.has(String(nodeId))) issues.push(issue(`${path}.nodeIds`, "unknown-node", `Group references unknown node '${String(nodeId)}'.`));
    }
  }
  if (value.layout && isRecord(value.layout) && value.layout.mode === "manual") {
    nodes.forEach((node, index) => {
      if (isRecord(node) && (typeof node.x !== "number" || typeof node.y !== "number")) {
        issues.push(issue(`$.nodes[${index}]`, "manual-position", "Manual layout nodes require numeric x and y coordinates."));
      }
    });
  }
  return { valid: !issues.some((entry) => entry.severity === "error"), issues };
}
function assertVisualFlow(value) {
  const result = validateVisualFlow(value);
  if (!result.valid) {
    throw new Error(`Invalid Visual Flow diagram:
${result.issues.filter((entry) => entry.severity === "error").map((entry) => `- ${entry.path}: ${entry.message}`).join("\n")}`);
  }
}
var defaults = {
  mode: "dagre",
  direction: "LR",
  margin: 76,
  gapX: 96,
  gapY: 68,
  columns: 4,
  nodeWidth: 196,
  nodeHeight: 86,
  rankSeparation: 116,
  nodeSeparation: 72
};
function resolveLayout(spec) {
  return __spreadValues(__spreadValues({}, defaults), spec.layout);
}
function dimensions(spec, margin) {
  if (spec.nodes.length === 0) return { width: 720, height: 420 };
  const maxX = Math.max(...spec.nodes.map((node) => (node.x ?? 0) + (node.width ?? defaults.nodeWidth)));
  const maxY = Math.max(...spec.nodes.map((node) => (node.y ?? 0) + (node.height ?? defaults.nodeHeight)));
  return { width: Math.max(720, Math.ceil(maxX + margin)), height: Math.max(420, Math.ceil(maxY + margin)) };
}
function manual(spec, layout) {
  const nodes = spec.nodes.map((node) => __spreadProps(__spreadValues({}, node), {
    x: node.x ?? layout.margin,
    y: node.y ?? layout.margin + 80,
    width: node.width ?? layout.nodeWidth,
    height: node.height ?? layout.nodeHeight
  }));
  const positioned = __spreadProps(__spreadValues({}, spec), { nodes });
  return __spreadValues(__spreadValues({}, positioned), dimensions(positioned, layout.margin));
}
function grid(spec, layout) {
  const nodes = spec.nodes.map((node, index) => {
    const column = node.column ?? index % layout.columns;
    const row = node.row ?? Math.floor(index / layout.columns);
    return __spreadProps(__spreadValues({}, node), {
      x: node.x ?? layout.margin + column * (layout.nodeWidth + layout.gapX),
      y: node.y ?? layout.margin + 96 + row * (layout.nodeHeight + layout.gapY),
      width: node.width ?? layout.nodeWidth,
      height: node.height ?? layout.nodeHeight
    });
  });
  const positioned = __spreadProps(__spreadValues({}, spec), { nodes });
  return __spreadValues(__spreadValues({}, positioned), dimensions(positioned, layout.margin));
}
function lanes(spec, layout) {
  const laneOrder = new Map((spec.lanes ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((lane, index) => [lane.id, index]));
  const perLane = /* @__PURE__ */ new Map();
  const horizontal = layout.direction === "LR" || layout.direction === "RL";
  const nodes = spec.nodes.map((node, index) => {
    const lane = node.lane ?? spec.lanes?.[0]?.id ?? "main";
    const laneIndex = laneOrder.get(lane) ?? laneOrder.size;
    const positionInLane = perLane.get(lane) ?? 0;
    perLane.set(lane, positionInLane + 1);
    const primary = layout.margin + positionInLane * (horizontal ? layout.nodeWidth + layout.gapX : layout.nodeHeight + layout.gapY);
    const secondary = layout.margin + 112 + laneIndex * (horizontal ? layout.nodeHeight + layout.gapY + 48 : layout.nodeWidth + layout.gapX);
    return __spreadProps(__spreadValues({}, node), {
      x: node.x ?? (horizontal ? primary : secondary),
      y: node.y ?? (horizontal ? secondary : primary),
      width: node.width ?? layout.nodeWidth,
      height: node.height ?? layout.nodeHeight,
      row: node.row ?? laneIndex,
      column: node.column ?? index
    });
  });
  const positioned = __spreadProps(__spreadValues({}, spec), { nodes });
  return __spreadValues(__spreadValues({}, positioned), dimensions(positioned, layout.margin));
}
function auto(spec, layout) {
  const graph = new $o.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: layout.direction,
    ranksep: layout.rankSeparation,
    nodesep: layout.nodeSeparation,
    marginx: layout.margin,
    marginy: layout.margin + 80
  });
  for (const node of spec.nodes) graph.setNode(node.id, { width: node.width ?? layout.nodeWidth, height: node.height ?? layout.nodeHeight });
  for (const edge of spec.edges) graph.setEdge(edge.from, edge.to);
  $o.layout(graph);
  const horizontal = layout.direction === "LR" || layout.direction === "RL";
  const nodes = spec.nodes.map((node) => {
    const position = graph.node(node.id);
    return __spreadProps(__spreadValues({}, node), {
      x: node.x ?? position.x - position.width / 2,
      y: node.y ?? position.y - position.height / 2,
      width: node.width ?? position.width,
      height: node.height ?? position.height
    });
  });
  const graphInfo = graph.graph();
  const positioned = __spreadProps(__spreadValues({}, spec), { nodes });
  const fitted = dimensions(positioned, layout.margin);
  return __spreadProps(__spreadValues({}, positioned), {
    width: Math.max(fitted.width, Math.ceil((graphInfo.width ?? 0) + layout.margin)),
    height: Math.max(fitted.height, Math.ceil((graphInfo.height ?? 0) + layout.margin)),
    layout: __spreadProps(__spreadValues({}, spec.layout), { mode: "dagre", direction: layout.direction })
  });
}
function layoutVisualFlow(spec) {
  assertVisualFlow(spec);
  const layout = resolveLayout(spec);
  if (layout.mode === "manual") return manual(spec, layout);
  if (layout.mode === "grid") return grid(spec, layout);
  if (layout.mode === "lanes") return lanes(spec, layout);
  return auto(spec, layout);
}
var midnightCurrent = {
  name: "midnight-current",
  background: "#071019",
  backgroundAlt: "#0a1622",
  surface: "#0d1b28",
  surfaceElevated: "#112536",
  border: "#234153",
  borderStrong: "#3a6477",
  text: "#effaff",
  textMuted: "#8facb9",
  accent: "#31e6c0",
  accentSecondary: "#53a9ff",
  success: "#68e59f",
  warning: "#f2c96d",
  danger: "#ff7890",
  grid: "#163141",
  shadow: "rgba(0, 0, 0, 0.42)",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  monoFontFamily: "'JetBrains Mono', 'Cascadia Code', ui-monospace, monospace",
  radius: 16
};
var porcelainLight = {
  name: "porcelain-light",
  background: "#f6f9fb",
  backgroundAlt: "#edf3f6",
  surface: "#ffffff",
  surfaceElevated: "#f9fcfd",
  border: "#c8d7de",
  borderStrong: "#8ea8b4",
  text: "#10252f",
  textMuted: "#5c747f",
  accent: "#087f70",
  accentSecondary: "#216bb3",
  success: "#168752",
  warning: "#9a6812",
  danger: "#b93651",
  grid: "#dce7eb",
  shadow: "rgba(23, 54, 67, 0.16)",
  fontFamily: midnightCurrent.fontFamily,
  monoFontFamily: midnightCurrent.monoFontFamily,
  radius: 16
};
var executiveSlate = __spreadProps(__spreadValues({}, midnightCurrent), {
  name: "executive-slate",
  background: "#11151b",
  backgroundAlt: "#171d25",
  surface: "#1a212b",
  surfaceElevated: "#222c38",
  border: "#364351",
  borderStrong: "#586b7d",
  accent: "#d6b66d",
  accentSecondary: "#85aee8",
  grid: "#252f3a"
});
var visualFlowThemes = {
  "midnight-current": midnightCurrent,
  "porcelain-light": porcelainLight,
  "executive-slate": executiveSlate
};
function resolveTheme(input) {
  if (!input) return __spreadValues({}, midnightCurrent);
  if (typeof input === "string") return __spreadValues({}, visualFlowThemes[input] ?? midnightCurrent);
  const base = input.name ? visualFlowThemes[input.name] ?? midnightCurrent : midnightCurrent;
  return __spreadValues(__spreadValues({}, base), input);
}
function escapeXml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
function safeId(value) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function cssVariables(theme) {
  return [
    `--vf-background:${theme.background}`,
    `--vf-background-alt:${theme.backgroundAlt}`,
    `--vf-surface:${theme.surface}`,
    `--vf-surface-elevated:${theme.surfaceElevated}`,
    `--vf-border:${theme.border}`,
    `--vf-border-strong:${theme.borderStrong}`,
    `--vf-text:${theme.text}`,
    `--vf-text-muted:${theme.textMuted}`,
    `--vf-accent:${theme.accent}`,
    `--vf-accent-secondary:${theme.accentSecondary}`,
    `--vf-success:${theme.success}`,
    `--vf-warning:${theme.warning}`,
    `--vf-danger:${theme.danger}`,
    `--vf-grid:${theme.grid}`,
    `--vf-shadow:${theme.shadow}`,
    `--vf-radius:${theme.radius}px`,
    `--vf-font:${theme.fontFamily}`,
    `--vf-font-mono:${theme.monoFontFamily}`
  ].join(";");
}
function style(theme) {
  return `
    .vf-root{${cssVariables(theme)};font-family:var(--vf-font);background:var(--vf-background);color:var(--vf-text)}
    .vf-root[data-vf-theme="light"]{${cssVariables(porcelainLight)}}
    .vf-bg{fill:var(--vf-background)}.vf-grid-line{stroke:var(--vf-grid);stroke-width:1}
    .vf-title{fill:var(--vf-text);font-size:22px;font-weight:720;letter-spacing:-.3px}
    .vf-subtitle{fill:var(--vf-text-muted);font-size:11px;font-family:var(--vf-font-mono);letter-spacing:.08em;text-transform:uppercase}
    .vf-lane{fill:var(--vf-background-alt);stroke:var(--vf-border);stroke-width:1}.vf-lane-label{fill:var(--vf-text-muted);font:600 10px var(--vf-font-mono);letter-spacing:.12em;text-transform:uppercase}
    .vf-group{fill:var(--vf-surface);fill-opacity:.34;stroke:var(--vf-border-strong);stroke-width:1.25;stroke-dasharray:6 6}
    .vf-group.security{stroke:var(--vf-danger)}.vf-group.region{stroke:var(--vf-warning)}.vf-group.emphasis{stroke:var(--vf-accent)}
    .vf-group-label{fill:var(--vf-text-muted);font:650 10px var(--vf-font-mono);letter-spacing:.08em;text-transform:uppercase}
    .vf-edge{fill:none;stroke:var(--vf-border-strong);stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .vf-edge.accent{stroke:var(--vf-accent);stroke-width:2.1}.vf-edge.success{stroke:var(--vf-success)}.vf-edge.warning{stroke:var(--vf-warning)}.vf-edge.danger{stroke:var(--vf-danger)}.vf-edge.muted{stroke:var(--vf-border);stroke-dasharray:5 6}
    .vf-edge-label-bg{fill:var(--vf-background);stroke:var(--vf-border);stroke-width:1}.vf-edge-label{fill:var(--vf-text-muted);font:600 9px var(--vf-font-mono);letter-spacing:.02em}
    .vf-particle{fill:var(--vf-accent);filter:url(#vf-glow)}
    .vf-node-shadow{fill:var(--vf-shadow);opacity:.65}.vf-node{fill:var(--vf-surface);stroke:var(--vf-border);stroke-width:1.25}
    .vf-node.default{stroke:var(--vf-border)}.vf-node.service{stroke:var(--vf-accent-secondary)}.vf-node.client{stroke:var(--vf-accent)}.vf-node.data{stroke:var(--vf-warning)}.vf-node.security{stroke:var(--vf-danger)}.vf-node.event{stroke:var(--vf-success)}.vf-node.decision{stroke:var(--vf-warning)}.vf-node.external{stroke:var(--vf-border-strong);stroke-dasharray:5 4}
    .vf-node-rail{fill:var(--vf-accent)}.vf-node-rail.service{fill:var(--vf-accent-secondary)}.vf-node-rail.data,.vf-node-rail.decision{fill:var(--vf-warning)}.vf-node-rail.security{fill:var(--vf-danger)}.vf-node-rail.event{fill:var(--vf-success)}
    .vf-icon-shell{fill:var(--vf-surface-elevated);stroke:var(--vf-border);stroke-width:1}.vf-icon{fill:var(--vf-accent);font:750 10px var(--vf-font-mono);letter-spacing:.05em}
    .vf-node-label{fill:var(--vf-text);font-size:13px;font-weight:680}.vf-node-description{fill:var(--vf-text-muted);font-size:10px}.vf-badge{fill:var(--vf-background-alt);stroke:var(--vf-border);stroke-width:1}.vf-badge-text{fill:var(--vf-text-muted);font:650 8px var(--vf-font-mono)}
    .vf-annotation{fill:var(--vf-surface-elevated);stroke:var(--vf-border);stroke-width:1}.vf-annotation.warning{stroke:var(--vf-warning)}.vf-annotation-text{fill:var(--vf-text-muted);font:550 10px var(--vf-font)}
    @media(prefers-reduced-motion:reduce){.vf-particle{display:none}}
  `;
}
function wrapLabel(label, max = 24) {
  if (label.length <= max) return [label];
  const words = label.split(/\s+/);
  const result = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > max && line) {
      result.push(line);
      line = word;
      if (result.length === 1) break;
    } else line = candidate;
  }
  if (line && result.length < 2) result.push(line);
  if (words.join(" ").length > result.join(" ").length) result[result.length - 1] = `${result[result.length - 1].slice(0, Math.max(1, max - 1))}…`;
  return result.slice(0, 2);
}
function edgePoints(source, target, direction) {
  const horizontal = direction === "LR" || direction === "RL";
  if (horizontal) {
    const forward2 = target.x >= source.x;
    return {
      sx: forward2 ? source.x + source.width : source.x,
      sy: source.y + source.height / 2,
      tx: forward2 ? target.x : target.x + target.width,
      ty: target.y + target.height / 2
    };
  }
  const forward = target.y >= source.y;
  return {
    sx: source.x + source.width / 2,
    sy: forward ? source.y + source.height : source.y,
    tx: target.x + target.width / 2,
    ty: forward ? target.y : target.y + target.height
  };
}
function edgePath(edge, source, target, direction) {
  const { sx, sy, tx, ty } = edgePoints(source, target, direction);
  const route = edge.route ?? "smoothstep";
  if (route === "straight") return `M ${sx} ${sy} L ${tx} ${ty}`;
  if (route === "orthogonal") {
    if (direction === "LR" || direction === "RL") {
      const mx = (sx + tx) / 2;
      return `M ${sx} ${sy} L ${mx} ${sy} L ${mx} ${ty} L ${tx} ${ty}`;
    }
    const my2 = (sy + ty) / 2;
    return `M ${sx} ${sy} L ${sx} ${my2} L ${tx} ${my2} L ${tx} ${ty}`;
  }
  if (route === "bezier") {
    if (direction === "LR" || direction === "RL") {
      const curve2 = Math.max(64, Math.abs(tx - sx) * 0.45);
      const sign2 = tx >= sx ? 1 : -1;
      return `M ${sx} ${sy} C ${sx + curve2 * sign2} ${sy}, ${tx - curve2 * sign2} ${ty}, ${tx} ${ty}`;
    }
    const curve = Math.max(64, Math.abs(ty - sy) * 0.45);
    const sign = ty >= sy ? 1 : -1;
    return `M ${sx} ${sy} C ${sx} ${sy + curve * sign}, ${tx} ${ty - curve * sign}, ${tx} ${ty}`;
  }
  const radius = 18;
  if (direction === "LR" || direction === "RL") {
    const mx = (sx + tx) / 2;
    const sySign = ty >= sy ? 1 : -1;
    return `M ${sx} ${sy} L ${mx - radius} ${sy} Q ${mx} ${sy} ${mx} ${sy + radius * sySign} L ${mx} ${ty - radius * sySign} Q ${mx} ${ty} ${mx + radius} ${ty} L ${tx} ${ty}`;
  }
  const my = (sy + ty) / 2;
  const sxSign = tx >= sx ? 1 : -1;
  return `M ${sx} ${sy} L ${sx} ${my - radius} Q ${sx} ${my} ${sx + radius * sxSign} ${my} L ${tx - radius * sxSign} ${my} Q ${tx} ${my} ${tx} ${my + radius} L ${tx} ${ty}`;
}
function variantMarker(prefix, variant) {
  return `url(#${prefix}-arrow-${variant})`;
}
function markerColor(variant) {
  if (variant === "accent") return "var(--vf-accent)";
  if (variant === "success") return "var(--vf-success)";
  if (variant === "warning") return "var(--vf-warning)";
  if (variant === "danger") return "var(--vf-danger)";
  if (variant === "muted") return "var(--vf-border)";
  return "var(--vf-border-strong)";
}
function renderGroups(diagram) {
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  return (diagram.groups ?? []).map((group) => {
    const members = group.nodeIds.map((id) => byId.get(id)).filter((node) => Boolean(node));
    if (!members.length) return "";
    const padding = 32;
    const left = Math.min(...members.map((node) => node.x)) - padding;
    const top = Math.min(...members.map((node) => node.y)) - padding - 12;
    const right = Math.max(...members.map((node) => node.x + node.width)) + padding;
    const bottom = Math.max(...members.map((node) => node.y + node.height)) + padding;
    return `<g data-vf-group="${escapeXml(group.id)}"><rect class="vf-group ${escapeXml(group.variant ?? "default")}" x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" rx="20"/><text class="vf-group-label" x="${left + 16}" y="${top + 20}">${escapeXml(group.label)}</text></g>`;
  }).join("");
}
function renderLanes(diagram) {
  if (!diagram.lanes?.length || diagram.layout?.mode !== "lanes") return "";
  const horizontal = diagram.layout.direction === "LR" || diagram.layout.direction === "RL" || !diagram.layout.direction;
  return diagram.lanes.map((lane, index) => {
    const members = diagram.nodes.filter((node) => node.lane === lane.id);
    if (!members.length) return "";
    const pad = 28;
    const x = horizontal ? 24 : Math.min(...members.map((node) => node.x)) - pad;
    const y = horizontal ? Math.min(...members.map((node) => node.y)) - pad - 24 : 74;
    const width = horizontal ? diagram.width - 48 : Math.max(...members.map((node) => node.x + node.width)) - x + pad;
    const height = horizontal ? Math.max(...members.map((node) => node.y + node.height)) - y + pad : diagram.height - 98;
    return `<g data-vf-lane="${escapeXml(lane.id)}"><rect class="vf-lane" x="${x}" y="${y}" width="${width}" height="${height}" rx="20" opacity="${index % 2 ? ".7" : ".48"}"/><text class="vf-lane-label" x="${x + 16}" y="${y + 20}">${escapeXml(lane.label)}</text></g>`;
  }).join("");
}
function renderEdges(diagram, prefix, motion) {
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]));
  const direction = diagram.layout?.direction ?? "LR";
  return diagram.edges.map((edge, index) => {
    const source = byId.get(edge.from);
    const target = byId.get(edge.to);
    if (!source || !target) return "";
    const variant = edge.variant ?? "default";
    const path = edgePath(edge, source, target, direction);
    const id = safeId(edge.id ?? `${edge.from}-${edge.to}-${index}`);
    const points = edgePoints(source, target, direction);
    const labelX = (points.sx + points.tx) / 2;
    const labelY = (points.sy + points.ty) / 2 - 10;
    const labelWidth = edge.label ? Math.max(52, edge.label.length * 6 + 18) : 0;
    const particles = Math.min(4, Math.max(1, edge.particles ?? 1));
    const animate = edge.animated ?? (motion !== "none" && variant === "accent");
    const particleMarkup = animate ? Array.from({ length: particles }, (_, particleIndex) => `<circle class="vf-particle" r="${particleIndex === 0 ? 3.2 : 2.2}"><animateMotion dur="${2.3 + particleIndex * 0.4}s" begin="-${particleIndex * 0.7}s" repeatCount="indefinite" path="${path}"/></circle>`).join("") : "";
    const label = edge.label ? `<g><rect class="vf-edge-label-bg" x="${labelX - labelWidth / 2}" y="${labelY - 11}" width="${labelWidth}" height="20" rx="10"/><text class="vf-edge-label" x="${labelX}" y="${labelY + 3}" text-anchor="middle">${escapeXml(edge.label)}</text></g>` : "";
    return `<g data-vf-edge="${escapeXml(id)}"><path id="${prefix}-${id}" class="vf-edge ${variant}" d="${path}" marker-end="${variantMarker(prefix, variant)}"/>${particleMarkup}${label}</g>`;
  }).join("");
}
function renderNodes(diagram) {
  return diagram.nodes.map((node) => {
    const variant = node.variant ?? "default";
    const labels = wrapLabel(node.label, Math.max(12, Math.floor((node.width - 76) / 7)));
    const icon = (node.icon ?? node.label.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)).toUpperCase();
    const textX = node.x + 62;
    const titleY = node.y + (labels.length > 1 ? 30 : 36);
    const description = node.description ? `${node.description.slice(0, Math.max(12, Math.floor((node.width - 76) / 6.1)))}${node.description.length > Math.floor((node.width - 76) / 6.1) ? "…" : ""}` : "";
    const badges = (node.badges ?? []).slice(0, 2).map((badge, index) => {
      const badgeWidth = Math.max(38, badge.length * 5.4 + 14);
      const x = node.x + 14 + index * (badgeWidth + 6);
      const y = node.y + node.height - 24;
      return `<rect class="vf-badge" x="${x}" y="${y}" width="${badgeWidth}" height="15" rx="7.5"/><text class="vf-badge-text" x="${x + badgeWidth / 2}" y="${y + 10.5}" text-anchor="middle">${escapeXml(badge)}</text>`;
    }).join("");
    const title = labels.map((line, index) => `<tspan x="${textX}" dy="${index === 0 ? 0 : 16}">${escapeXml(line)}</tspan>`).join("");
    return `<g data-vf-node="${escapeXml(node.id)}" tabindex="0" role="group" aria-label="${escapeXml(`${node.label}${node.description ? `: ${node.description}` : ""}`)}"><rect class="vf-node-shadow" x="${node.x + 5}" y="${node.y + 8}" width="${node.width}" height="${node.height}" rx="16"/><rect class="vf-node ${variant}" x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="16"/><rect class="vf-node-rail ${variant}" x="${node.x}" y="${node.y + 14}" width="3" height="${node.height - 28}" rx="2"/><rect class="vf-icon-shell" x="${node.x + 14}" y="${node.y + 20}" width="34" height="34" rx="10"/><text class="vf-icon" x="${node.x + 31}" y="${node.y + 41.5}" text-anchor="middle">${escapeXml(icon)}</text><text class="vf-node-label" x="${textX}" y="${titleY}">${title}</text>${description ? `<text class="vf-node-description" x="${textX}" y="${node.y + node.height - 17}">${escapeXml(description)}</text>` : ""}${badges}</g>`;
  }).join("");
}
function renderAnnotations(diagram) {
  return (diagram.annotations ?? []).map((annotation) => {
    const width = Math.max(130, Math.min(300, annotation.text.length * 6.2 + 24));
    return `<g data-vf-annotation="${escapeXml(annotation.id)}"><rect class="vf-annotation ${escapeXml(annotation.variant ?? "note")}" x="${annotation.x}" y="${annotation.y}" width="${width}" height="38" rx="12"/><text class="vf-annotation-text" x="${annotation.x + 12}" y="${annotation.y + 24}">${escapeXml(annotation.text)}</text></g>`;
  }).join("");
}
function renderVisualFlow(spec, options = {}) {
  const diagram = layoutVisualFlow(spec);
  const theme = resolveTheme(options.theme ?? spec.theme);
  const prefix = safeId(options.idPrefix ?? spec.id);
  const motion = options.motion ?? spec.motion ?? "none";
  const markers = ["default", "accent", "success", "warning", "danger", "muted"].map((variant) => `<marker id="${prefix}-arrow-${variant}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${markerColor(variant)}"/></marker>`).join("");
  const grid2 = options.background === false ? "" : `<pattern id="${prefix}-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path class="vf-grid-line" d="M 28 0 L 0 0 0 28" fill="none" opacity=".42"/></pattern>`;
  const description = spec.description ?? `${spec.kind} diagram with ${spec.nodes.length} nodes and ${spec.edges.length} connections`;
  const svg = `<svg class="vf-root ${escapeXml(options.className ?? "")}" data-vf-theme="${theme.name === "porcelain-light" ? "light" : "dark"}" data-vf-diagram="${escapeXml(spec.id)}" xmlns="http://www.w3.org/2000/svg" width="${diagram.width}" height="${diagram.height}" viewBox="0 0 ${diagram.width} ${diagram.height}" role="img" aria-labelledby="${prefix}-title ${prefix}-description" preserveAspectRatio="xMidYMid meet"><title id="${prefix}-title">${escapeXml(spec.title)}</title><desc id="${prefix}-description">${escapeXml(description)}</desc><style>${style(theme)}</style><defs>${markers}${grid2}<filter id="vf-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect class="vf-bg" x="0" y="0" width="100%" height="100%"/>${options.background === false ? "" : `<rect x="0" y="0" width="100%" height="100%" fill="url(#${prefix}-grid)"/>`}<text class="vf-title" x="36" y="42">${escapeXml(spec.title)}</text><text class="vf-subtitle" x="36" y="63">${escapeXml(spec.kind)} · ${spec.nodes.length} nodes · ${spec.edges.length} connections</text>${renderLanes(diagram)}${renderGroups(diagram)}${renderEdges(diagram, prefix, motion)}${renderNodes(diagram)}${renderAnnotations(diagram)}</svg>`;
  return { svg, width: diagram.width, height: diagram.height, diagram, theme };
}
function mountVisualFlow(container, initialSpec, initialOptions = {}) {
  let spec = initialSpec;
  let options = initialOptions;
  let svg = "";
  const abort = new AbortController();
  const render = () => {
    const result = renderVisualFlow(spec, options);
    svg = result.svg;
    container.innerHTML = svg;
    const element = container.querySelector("svg");
    if (!element || options.panZoom === false) return;
    const base = element.viewBox.baseVal;
    let view = { x: base.x, y: base.y, width: base.width, height: base.height };
    let pointer;
    const apply = () => element.setAttribute("viewBox", `${view.x} ${view.y} ${view.width} ${view.height}`);
    element.addEventListener("wheel", (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 1.08 : 0.92;
      const nextWidth = Math.max(base.width * 0.35, Math.min(base.width * 3, view.width * factor));
      const nextHeight = nextWidth * (base.height / base.width);
      view = { x: view.x + (view.width - nextWidth) / 2, y: view.y + (view.height - nextHeight) / 2, width: nextWidth, height: nextHeight };
      apply();
    }, { passive: false, signal: abort.signal });
    element.addEventListener("pointerdown", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
    }, { signal: abort.signal });
    element.addEventListener("pointermove", (event) => {
      if (!pointer) return;
      const scale = view.width / element.clientWidth;
      view.x -= (event.clientX - pointer.x) * scale;
      view.y -= (event.clientY - pointer.y) * scale;
      pointer = { x: event.clientX, y: event.clientY };
      apply();
    }, { signal: abort.signal });
    element.addEventListener("pointerup", () => {
      pointer = void 0;
    }, { signal: abort.signal });
  };
  render();
  return {
    update(nextSpec, nextOptions = options) {
      spec = nextSpec;
      options = nextOptions;
      render();
    },
    exportSvg: () => svg,
    destroy() {
      abort.abort();
      container.innerHTML = "";
    }
  };
}

// ../../packages/visual-flow-angular/dist/fesm2022/visual-flow-angular.mjs
var VisualFlowAngularComponent = class _VisualFlowAngularComponent {
  host = inject(ElementRef);
  platformId = inject(PLATFORM_ID);
  controller;
  viewReady = false;
  spec;
  options = {
    panZoom: true
  };
  visualFlowReady = new EventEmitter();
  visualFlowError = new EventEmitter();
  get ariaLabel() {
    return this.spec ? `${this.spec.title} diagram` : "Visual Flow diagram";
  }
  ngAfterViewInit() {
    this.viewReady = true;
    this.render();
  }
  ngOnChanges() {
    if (this.viewReady) this.render();
  }
  ngOnDestroy() {
    this.controller?.destroy();
    this.controller = void 0;
  }
  exportSvg() {
    return this.controller?.exportSvg() ?? "";
  }
  render() {
    if (!isPlatformBrowser(this.platformId) || !this.spec) return;
    try {
      if (this.controller) this.controller.update(this.spec, this.options);
      else {
        this.controller = mountVisualFlow(this.host.nativeElement, this.spec, this.options);
        this.visualFlowReady.emit(this.controller);
      }
    } catch (error) {
      this.visualFlowError.emit(error);
    }
  }
  static ɵfac = function VisualFlowAngularComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VisualFlowAngularComponent)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _VisualFlowAngularComponent,
    selectors: [["visual-flow-diagram"]],
    hostAttrs: ["role", "group", 1, "visual-flow-diagram"],
    hostVars: 1,
    hostBindings: function VisualFlowAngularComponent_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("aria-label", ctx.ariaLabel);
      }
    },
    inputs: {
      spec: "spec",
      options: "options"
    },
    outputs: {
      visualFlowReady: "visualFlowReady",
      visualFlowError: "visualFlowError"
    },
    features: [ɵɵNgOnChangesFeature],
    decls: 0,
    vars: 0,
    template: function VisualFlowAngularComponent_Template(rf, ctx) {
    },
    styles: [".visual-flow-diagram{display:block;min-width:0;min-height:320px;overflow:hidden}\n", ".visual-flow-diagram>svg{display:block;width:100%;height:100%;min-height:inherit}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VisualFlowAngularComponent, [{
    type: Component,
    args: [{
      selector: "visual-flow-diagram",
      standalone: true,
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        class: "visual-flow-diagram",
        role: "group",
        "[attr.aria-label]": "ariaLabel"
      },
      styles: [".visual-flow-diagram{display:block;min-width:0;min-height:320px;overflow:hidden}\n", ".visual-flow-diagram>svg{display:block;width:100%;height:100%;min-height:inherit}\n"]
    }]
  }], null, {
    spec: [{
      type: Input,
      args: [{
        required: true
      }]
    }],
    options: [{
      type: Input
    }],
    visualFlowReady: [{
      type: Output
    }],
    visualFlowError: [{
      type: Output
    }]
  });
})();
export {
  VisualFlowAngularComponent
};
//# sourceMappingURL=@sentimental37_visual-flow-angular.js.map
