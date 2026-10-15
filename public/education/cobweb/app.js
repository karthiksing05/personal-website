/*
  Figures for the Cobweb explainer. Every scenario here is hand-built for exposition:
  Figures 1 and 3 compute their numbers from a fixed toy hierarchy (Eqs. 1-3), Figure 2 uses
  illustrative operator scores, Figures 4 and 5 plot human data from the original studies,
  and Figures 6 and 7 are schematics of reported behavior.
*/
(function () {
  "use strict";

  var Sim = window.Sim;
  var el = Sim.el, svg = Sim.svg, slot = Sim.slot, segmented = Sim.segmented, fmt = Sim.fmt;
  var allNodes = Sim.allNodes, distBlock = Sim.distBlock, TONE = Sim.TONE;
  var ALPHA = 0.1;
  var ATTRS = ["shape", "color", "size"];
  var VALUES = { shape: ["circle", "square", "triangle"], color: ["red", "yellow", "blue"], size: ["small", "large"] };
  var FILL = { red: "#ff7b6b", yellow: "#ffd23f", blue: "#6fa8ff" };
  var OP_NAME = { insert: "insert", new: "create", merge: "merge", split: "split" };

  /* ---------- glyphs: a shape, colored, at one of two sizes ---------- */

  function glyph(parent, inst, cx, cy, opts) {
    opts = opts || {};
    var r = inst.size === "large" ? 15 : 10;
    var common = {
      fill: FILL[inst.color] || "#ddd", stroke: "#12100d", "stroke-width": 1.6,
      "stroke-dasharray": opts.dashed ? "3 2.5" : "none", "fill-opacity": opts.dashed ? 0.55 : 1
    };
    var shape;
    if (inst.shape === "circle") shape = svg("circle", Object.assign({ cx: cx, cy: cy, r: r }, common), parent);
    else if (inst.shape === "square") shape = svg("rect", Object.assign({ x: cx - r * 0.9, y: cy - r * 0.9, width: r * 1.8, height: r * 1.8 }, common), parent);
    else {
      var h = r * 1.9;
      shape = svg("polygon", Object.assign({ points: [cx, cy - h * 0.58, cx + r, cy + h * 0.42, cx - r, cy + h * 0.42].join(" ") }, common), parent);
    }
    return shape;
  }

  function glyphIcon(inst, size) {
    var s = svg("svg", { width: size || 22, height: size || 22, viewBox: "-17 -17 34 34", "aria-hidden": "true" });
    glyph(s, inst, 0, 0);
    return s;
  }

  function describe(inst) {
    return ATTRS.filter(function (a) { return inst[a]; }).map(function (a) { return inst[a]; }).join(" ");
  }

  /* ---------- toy hierarchy: counts live at the leaves, concepts sum them ---------- */

  function L(shape, color, size, count, extra) {
    return Object.assign({ leaf: { shape: shape, color: color, size: size }, count: count, children: [] }, extra || {});
  }
  function N(children, extra) { return Object.assign({ children: children }, extra || {}); }

  // fill in n(C) and n(C, a=v) for every node, and give each a stable name C0, C1, ...
  function annotate(root) {
    var k = 0;
    (function walk(node, parent) {
      node.parent = parent;
      node.name = "C" + k++;
      node.av = {};
      ATTRS.forEach(function (a) { node.av[a] = {}; });
      if (!node.children.length) {
        node.n = node.count;
        ATTRS.forEach(function (a) { if (node.leaf[a]) node.av[a][node.leaf[a]] = node.count; });
      } else {
        node.n = 0;
        node.children.forEach(function (c) {
          walk(c, node);
          node.n += c.n;
          ATTRS.forEach(function (a) {
            for (var v in c.av[a]) node.av[a][v] = (node.av[a][v] || 0) + c.av[a][v];
          });
        });
      }
    })(root, null);
    return root;
  }

  // Eq. 1
  function prob(node, a, v) {
    return ((node.av[a][v] || 0) + ALPHA) / (node.n + ALPHA * VALUES[a].length);
  }
  function entropy(node) {
    var h = 0;
    ATTRS.forEach(function (a) {
      VALUES[a].forEach(function (v) { var p = prob(node, a, v); h -= p * Math.log(p); });
    });
    return h;
  }
  // Eq. 2
  function partitionScore(node) {
    var hc = node.children.reduce(function (s, c) { return s + (c.n / node.n) * entropy(c); }, 0);
    var hp = entropy(node);
    return { hp: hp, hc: hc, k: node.children.length, pu: (hp - hc) / node.children.length };
  }
  function modal(node) {
    var out = {};
    ATTRS.forEach(function (a) {
      var best = null, bc = -1;
      for (var v in node.av[a]) if (node.av[a][v] > bc) { bc = node.av[a][v]; best = v; }
      out[a] = best;
    });
    return out;
  }
  function logLik(node, probe) {
    return ATTRS.reduce(function (s, a) { return probe[a] ? s + Math.log(prob(node, a, probe[a])) : s; }, 0);
  }

  /* ---------- tree renderer: shared layout, shape glyphs for concepts ---------- */

  // Text trees (opts.text) use the shared renderer as is. Shape trees draw each concept's
  // modal instance (dashed for abstractions) above its count, optionally prefixed by its name.
  function drawTree(container, root, opts) {
    opts = opts || {};
    if (opts.text) return Sim.drawTree(container, root, opts);
    allNodes(root).forEach(function (n) { n.ariaLabel = "Concept " + n.name + ", " + n.n + " instances"; });
    return Sim.drawTree(container, root, Object.assign({}, opts, {
      nodeW: 64, nodeH: 62, gapY: 38,
      drawNode: function (g, n, W, H) {
        glyph(g, n.leaf || modal(n), W / 2, 25, { dashed: !n.leaf });
        svg("text", { x: W / 2, y: H - 7, "text-anchor": "middle", "font-size": 10, fill: "#12100d", text: (opts.names ? n.name + " " : "") + "n=" + n.n }, g);
      }
    }));
  }

  function valueIcon(a, v) {
    var inst = { shape: "circle", color: "yellow", size: "small" };
    if (a === "shape") inst = { shape: v, color: "yellow", size: "small" };
    if (a === "color") inst = { shape: "circle", color: v, size: "small" };
    if (a === "size") inst = { shape: "circle", color: "yellow", size: v };
    return glyphIcon(inst, 16);
  }

  function toyTree() {
    return annotate(N([
      N([
        N([L("circle", "red", "large", 3), L("circle", "red", "small", 2)]),
        L("circle", "yellow", "small", 1)
      ]),
      N([
        N([L("square", "blue", "large", 2), L("square", "blue", "small", 1)]),
        L("triangle", "blue", "small", 1),
        L("triangle", "yellow", "large", 1)
      ])
    ]));
  }

  /* ---------- Figure 1: representation ---------- */

  function figRepresentation(fig) {
    var root = toyTree();
    var selected = root.children[0];
    function render() {
      allNodes(root).forEach(function (n) { n.selected = n === selected; });
      drawTree(slot(fig, "tree"), root, { names: true, onSelect: function (n) { selected = n; render(); }, label: "Toy concept hierarchy over eleven shapes" });
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      var kind = !selected.children.length ? "leaf (exemplar)" : selected === root ? "root" : "concept";
      panel.appendChild(el("h4", { text: selected.name + ", " + kind + ", n(C) = " + selected.n }));
      ATTRS.forEach(function (a) {
        panel.appendChild(distBlock("P(" + a + " | " + selected.name + ")", VALUES[a].map(function (v) {
          return { label: v, icon: valueIcon(a, v), p: prob(selected, a, v) };
        })));
      });
      if (selected.children.length) {
        var s = partitionScore(selected);
        panel.appendChild(el("p", { class: "eqline", html:
          "H(" + selected.name + ") = " + fmt(s.hp) + " nats<br>&Sigma; P(C<sub>k</sub>) H(C<sub>k</sub>) = " + fmt(s.hc) +
          "<br>K = " + s.k + ", PU = (" + fmt(s.hp) + " &minus; " + fmt(s.hc) + ") / " + s.k + " = <b>" + fmt(s.pu, 3) + "</b>" }));
      } else {
        panel.appendChild(el("p", { class: "muted", text: "A leaf has no partition to score. Its distributions are as sharp as α allows: it behaves like a stored exemplar." }));
      }
    }
    render();
  }

  /* ---------- Figure 2: the four operators ---------- */

  var RC = function (size, n, x) { return L("circle", "red", size, n, x); };
  var BS = function (size, n, x) { return L("square", "blue", size, n, x); };
  var YT = function (size, n, x) { return L("triangle", "yellow", size, n, x); };

  var SCENARIOS = [
    {
      key: "insert", label: "insert",
      instance: { shape: "circle", color: "red", size: "small" },
      scores: { insert: 0.41, new: 0.29, merge: null, split: 0.17 },
      stages: [
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)]), N([BS("large", 2), BS("small", 1)])]); },
          text: "A small red circle arrives at the root, whose two children summarize red circles and blue squares." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)], { mark: "best1" }), N([BS("large", 2), BS("small", 1)], { mark: "best2" })]); },
          text: "Cobweb ranks the children by how little the instance would raise their weighted entropy. The red-circle concept accommodates it best." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)], { mark: "best1" }), N([BS("large", 2), BS("small", 1)], { mark: "best2" })]); },
          scores: true,
          text: "Merge is unavailable with only two children. Insert scores highest: the instance agrees with the best child on shape and color, so adding it sharpens that concept instead of blurring it." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 2, { tone: "insert" })], { tone: "insert" }), N([BS("large", 2), BS("small", 1)])]); },
          scores: true,
          text: "Cobweb inserts the instance, descends into the red-circle concept, and reaches an identical leaf, whose count it increments." }
      ]
    },
    {
      key: "new", label: "create",
      instance: { shape: "triangle", color: "yellow", size: "large" },
      scores: { insert: 0.22, new: 0.33, merge: null, split: 0.15 },
      stages: [
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)]), N([BS("large", 2), BS("small", 1)])]); },
          text: "A large yellow triangle arrives. It shares no shape or color with either child." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)], { mark: "best2" }), N([BS("large", 2), BS("small", 1)], { mark: "best1" })]); },
          text: "The blue-square concept ranks first only because it contains large items; the margin over the red circles is small." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)], { mark: "best2" }), N([BS("large", 2), BS("small", 1)], { mark: "best1" })]); },
          scores: true,
          text: "Inserting the triangle into either child would blur a concept that is currently pure in shape and color. A singleton child costs less information than that blur." },
        { tree: function () { return N([N([RC("large", 2), RC("small", 1)]), N([BS("large", 2), BS("small", 1)]), YT("large", 1, { tone: "new" })]); },
          scores: true,
          text: "Cobweb creates a new child for the instance and stops. The triangle now waits for similar instances to join it." }
      ]
    },
    {
      key: "merge", label: "merge",
      instance: { shape: "circle", color: "red", size: "large" },
      scores: { insert: 0.3, new: 0.21, merge: 0.37, split: null },
      stages: [
        { tree: function () { return N([RC("large", 2), RC("small", 2), N([BS("large", 2), BS("small", 1)])]); },
          text: "A large red circle arrives at a root with three children. Two of them are leaves that differ only in size." },
        { tree: function () { return N([RC("large", 2, { mark: "best1" }), RC("small", 2, { mark: "best2" }), N([BS("large", 2), BS("small", 1)])]); },
          text: "The two red-circle leaves rank first and second. Split is unavailable because the best child is a leaf." },
        { tree: function () { return N([RC("large", 2, { mark: "best1" }), RC("small", 2, { mark: "best2" }), N([BS("large", 2), BS("small", 1)])]); },
          scores: true,
          text: "Merging the two leaves yields one concept that predicts shape and color perfectly, so the root separates circles from squares with two children instead of three." },
        { tree: function () { return N([N([RC("large", 3, { tone: "insert" }), RC("small", 2)], { tone: "merge" }), N([BS("large", 2), BS("small", 1)])]); },
          scores: true,
          text: "Cobweb creates the merged concept, places both leaves beneath it, and descends into it. The instance then matches the large-red-circle leaf, whose count it increments." }
      ]
    },
    {
      key: "split", label: "split",
      instance: { shape: "square", color: "blue", size: "small" },
      scores: { insert: 0.24, new: 0.14, merge: null, split: 0.35 },
      stages: [
        { tree: function () { return N([N([N([BS("large", 2), BS("small", 1)]), N([YT("large", 1), YT("small", 1)])]), N([RC("large", 2), RC("small", 1)])]); },
          text: "A small blue square arrives. An early, unrepresentative sequence left the root with a concept that mixes blue squares and yellow triangles." },
        { tree: function () { return N([N([N([BS("large", 2), BS("small", 1)]), N([YT("large", 1), YT("small", 1)])], { mark: "best1" }), N([RC("large", 2), RC("small", 1)], { mark: "best2" })]); },
          text: "The mixed concept ranks first, since it contains every blue square." },
        { tree: function () { return N([N([N([BS("large", 2), BS("small", 1)]), N([YT("large", 1), YT("small", 1)])], { mark: "best1" }), N([RC("large", 2), RC("small", 1)], { mark: "best2" })]); },
          scores: true,
          text: "The mixed concept predicts neither shape nor color well. Promoting its two children to the root yields a cleaner three-way partition, so split wins." },
        { tree: function () { return N([N([BS("large", 2), BS("small", 1)], { tone: "split" }), N([YT("large", 1), YT("small", 1)], { tone: "split" }), N([RC("large", 2), RC("small", 1)])]); },
          scores: true,
          text: "Cobweb removes the mixed concept and promotes its children. Split does not place the instance, so the decision at the root runs again." },
        { tree: function () { return N([N([BS("large", 2), BS("small", 2, { tone: "insert" })], { tone: "insert" }), N([YT("large", 1), YT("small", 1)]), N([RC("large", 2), RC("small", 1)])]); },
          text: "On the second pass, insert into the blue-square concept wins, and the instance increments the identical small-blue-square leaf." }
      ]
    }
  ];

  function figOperators(fig) {
    var scenario = SCENARIOS[0], stage = 0;

    function scoresBlock(sc, reveal) {
      var vals = Object.keys(sc.scores).map(function (k) { return sc.scores[k]; }).filter(function (v) { return v != null; });
      var max = Math.max.apply(null, vals);
      var box = el("div", {}, [el("p", { class: "score-head", text: "Partition score after each operator" })]);
      ["insert", "new", "merge", "split"].forEach(function (op) {
        var v = sc.scores[op];
        var bar = el("div", { class: "bar" });
        bar.style.background = TONE[op];
        bar.style.width = reveal && v != null ? (v / max * 100).toFixed(1) + "%" : "0%";
        var row = el("div", { class: "score-row" + (v == null ? " is-na" : "") + (reveal && v === max ? " is-win" : "") }, [
          el("span", { class: "op", text: OP_NAME[op] }),
          el("div", { class: "track" }, [bar]),
          el("span", { class: "num", text: v == null ? "n/a" : reveal ? fmt(v) : "?" })
        ]);
        row.querySelector(".op").style.background = TONE[op];
        box.appendChild(row);
      });
      return box;
    }

    function render() {
      var st = scenario.stages[stage];
      var root = annotate(st.tree());
      drawTree(slot(fig, "tree"), root, { label: OP_NAME[scenario.key] + " scenario, step " + (stage + 1) });
      var inc = slot(fig, "incoming");
      inc.innerHTML = "";
      inc.appendChild(glyphIcon(scenario.instance, 34));
      inc.appendChild(el("div", { class: "what" }, [el("span", { class: "tag", text: "incoming instance" }), describe(scenario.instance)]));
      var sc = slot(fig, "scores");
      sc.innerHTML = "";
      sc.appendChild(scoresBlock(scenario, !!st.scores));
      slot(fig, "text").textContent = st.text;
      slot(fig, "count").textContent = "step " + (stage + 1) + " / " + scenario.stages.length;
      fig.querySelector('[data-act="back"]').disabled = stage === 0;
      fig.querySelector('[data-act="step"]').disabled = stage === scenario.stages.length - 1;
    }

    segmented(slot(fig, "tabs"), SCENARIOS.map(function (s) { return { value: s.key, label: s.label, tone: s.key }; }), scenario.key, function (key) {
      scenario = SCENARIOS.filter(function (s) { return s.key === key; })[0];
      stage = 0;
      render();
    });
    fig.querySelector('[data-act="step"]').addEventListener("click", function () {
      stage = Math.min(stage + 1, scenario.stages.length - 1); render();
    });
    fig.querySelector('[data-act="back"]').addEventListener("click", function () {
      stage = Math.max(stage - 1, 0); render();
    });
    render();
  }

  /* ---------- Figure 3: prediction ---------- */

  function figPrediction(fig) {
    var root = toyTree();
    var total = allNodes(root).length;
    var state = { target: "shape", probe: { color: "yellow", size: "small" }, maxNodes: 3 };
    var probeSlot = slot(fig, "probe");

    // best-first by log p(x | C), weights by normalized scores (Section 4)
    function expand() {
      var queue = [root], out = [];
      while (queue.length && out.length < state.maxNodes) {
        var bi = 0;
        for (var i = 1; i < queue.length; i++) if (logLik(queue[i], state.probe) > logLik(queue[bi], state.probe)) bi = i;
        var cur = queue.splice(bi, 1)[0];
        out.push(cur);
        queue = queue.concat(cur.children);
      }
      var scores = out.map(function (n) { return logLik(n, state.probe); });
      var m = Math.max.apply(null, scores);
      var z = scores.reduce(function (s, x) { return s + Math.exp(x - m); }, 0);
      out.forEach(function (n, i) { n._w = Math.exp(scores[i] - m) / z; n._s = scores[i]; });
      return out;
    }

    function buildControls() {
      probeSlot.innerHTML = "";
      probeSlot.appendChild(el("span", { class: "label", text: "Predict" }));
      var tgt = el("div", { class: "seg", role: "group", "aria-label": "Attribute to predict" });
      probeSlot.appendChild(tgt);
      segmented(tgt, ATTRS.map(function (a) { return { value: a, label: a }; }), state.target, function (a) {
        state.target = a;
        state.probe = {};
        ATTRS.forEach(function (b) { if (b !== a) state.probe[b] = VALUES[b][0]; });
        buildControls();
        render();
      });
      ATTRS.filter(function (a) { return a !== state.target; }).forEach(function (a) {
        probeSlot.appendChild(el("span", { class: "label", text: a }));
        var seg = el("div", { class: "seg", role: "group", "aria-label": "Observed " + a });
        probeSlot.appendChild(seg);
        segmented(seg, VALUES[a].map(function (v) { return { value: v, label: v }; }), state.probe[a], function (v) {
          state.probe[a] = v; render();
        });
      });
      probeSlot.appendChild(el("span", { class: "label", text: "max_nodes" }));
      var range = el("input", { type: "range", min: 1, max: total, step: 1, value: state.maxNodes, "aria-label": "max_nodes" });
      var out = el("output", { text: String(state.maxNodes) });
      range.addEventListener("input", function () { state.maxNodes = Number(range.value); out.textContent = range.value; render(); });
      probeSlot.appendChild(range);
      probeSlot.appendChild(out);
    }

    function render() {
      allNodes(root).forEach(function (n) { n.badge = null; n.weight = null; n.expanded = false; });
      var expanded = expand();
      expanded.forEach(function (n, i) { n.badge = i + 1; n.weight = n._w; n.expanded = true; });
      drawTree(slot(fig, "tree"), root, { names: true, weights: true, label: "Best-first expansion over the toy hierarchy" });

      var pred = {};
      VALUES[state.target].forEach(function (v) {
        pred[v] = expanded.reduce(function (s, n) { return s + n._w * prob(n, state.target, v); }, 0);
      });
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "P(" + state.target + " | " + describe(state.probe) + ")" }));
      panel.appendChild(distBlock("mixture of " + expanded.length + " concept" + (expanded.length > 1 ? "s" : ""), VALUES[state.target].map(function (v) {
        return { label: v, icon: valueIcon(state.target, v), p: pred[v] };
      })));
      panel.appendChild(el("p", { class: "eqline", html: "order. concept: log p(x|C), weight<br>" + expanded.map(function (n, i) {
        return (i + 1) + ". " + n.name + ": " + fmt(n._s) + ", " + fmt(n._w);
      }).join("<br>") }));
    }

    buildControls();
    render();
  }

  /* ---------- Figure 4: Hayes-Roth & Hayes-Roth (1977) ---------- */

  // [code, club, training frequency, recognition rating, confidence for Club 1]
  var HR = [
    ["112", "1", 10, 3.27, 2.43], ["121", "1", 10, 3.85, 2.46], ["211", "1", 10, 3.09, 2.46],
    ["113", "1", 1, -0.06, 2.57], ["131", "1", 1, 0.88, 2.44], ["311", "1", 1, 0.18, 2.44],
    ["133", "1", 1, -3.45, 2.09], ["313", "1", 1, -2.29, 2.09], ["331", "1", 1, -2.1, 2.22],
    ["221", "2", 10, 1.73, -2.12], ["212", "2", 10, 1.07, -2.32], ["122", "2", 10, 2.17, -2.22],
    ["223", "2", 1, -0.91, -2.08], ["232", "2", 1, 0.01, -1.97], ["322", "2", 1, 0.1, -2.11],
    ["233", "2", 1, -1.69, -1.94], ["323", "2", 1, -2.22, -1.78], ["332", "2", 1, -1.74, -1.95],
    ["132", "E", 10, 1.13, 0], ["321", "E", 10, 1.58, -0.02], ["213", "E", 10, 1.3, 0.09],
    ["231", "E", 0, -0.61, -0.03], ["123", "E", 0, -1.23, 0.09], ["312", "E", 0, -0.95, -0.1],
    ["111", "1", 0, 0.49, 2.82], ["222", "2", 0, 1.5, -2.39], ["333", "E", 0, -4.19, -1.78],
    ["444", "N", 0, -0.92, -1.32]
  ];

  function hrType(code, club, freq) {
    if (code === "444") return "Neither prototype";
    if (code === "333") return "Either prototype";
    if (club === "E") return "Either items";
    if (freq === 0) return "Club " + club + " prototype";
    var shared = code.split("").filter(function (c) { return c === club; }).length;
    return "Club " + club + ", " + (shared === 2 ? "1 transform" : "2 transforms");
  }

  function hrTypes() {
    var groups = {};
    HR.forEach(function (r) {
      var key = hrType(r[0], r[1], r[2]) + "|" + r[2];
      var g = groups[key] || (groups[key] = { label: hrType(r[0], r[1], r[2]), club: r[1], freq: r[2], recog: [], cls: [] });
      g.recog.push(r[3]);
      g.cls.push(r[4]);
    });
    function avg(xs) { return xs.reduce(function (s, x) { return s + x; }, 0) / xs.length; }
    return Object.keys(groups).map(function (k) {
      var g = groups[k];
      return { label: g.label, club: g.club, freq: g.freq, recog: avg(g.recog), cls: avg(g.cls) };
    });
  }

  function figHayesRoth(fig) {
    var types = hrTypes();
    var task = "cls";
    var RANGE = { cls: [-3.6, 3.6], recog: [-5, 5] };
    var color = { "1": "#e8452c", "2": "#2d55d8", E: "#7c7366", N: "#7c7366" };

    function render() {
      var chart = slot(fig, "chart");
      chart.innerHTML = "";
      var lo = RANGE[task][0], hi = RANGE[task][1];
      function x(v) { return (v - lo) / (hi - lo) * 100; }
      types.slice().sort(function (a, b) { return b[task] - a[task]; }).forEach(function (t) {
        var v = t[task];
        var bar = el("div", { class: "bar" });
        bar.style.left = Math.min(x(0), x(v)) + "%";
        bar.style.width = Math.abs(x(v) - x(0)) + "%";
        bar.style.background = color[t.club];
        var val = el("span", { class: "val", text: (v > 0 ? "+" : "") + fmt(v) });
        val.style.left = (v >= 0 ? x(v) + 1 : Math.max(0, x(v) - 11)) + "%";
        var zero = el("div", { class: "zero" });
        zero.style.left = x(0) + "%";
        var badge = t.freq === 0 ? "unseen" : "×" + t.freq;
        chart.appendChild(el("div", { class: "hr-row" }, [
          el("div", { class: "hr-label" }, [t.label, el("span", { class: "hr-badge hr-badge--" + t.freq, text: badge })]),
          el("div", { class: "hr-track" }, [zero, bar, val])
        ]));
      });
      var ends = task === "cls" ? ["← Club 2", "Club 1 →"] : ["← new", "old →"];
      chart.appendChild(el("div", { class: "hr-axis" }, [el("span"), el("div", { class: "ends" }, [el("span", { text: ends[0] }), el("span", { text: ends[1] })])]));
    }

    segmented(slot(fig, "tabs"), [{ value: "cls", label: "classification" }, { value: "recog", label: "recognition" }], task, function (v) {
      task = v; render();
    });
    render();
  }

  /* ---------- Figure 5: Medin & Schaffer (1978), Experiment 2 ---------- */

  // code (form, size, color, position) -> item; p is the human proportion correct
  var MS = {
    "1110": { id: 4, cat: "A", train: true, p: 0.78 }, "1010": { id: 7, cat: "A", train: true, p: 0.88 },
    "1011": { id: 15, cat: "A", train: true, p: 0.81 }, "1101": { id: 13, cat: "A", train: true, p: 0.88 },
    "0111": { id: 5, cat: "A", train: true, p: 0.81 },
    "1100": { id: 12, cat: "B", train: true, p: 0.84 }, "0110": { id: 2, cat: "B", train: true, p: 0.84 },
    "0001": { id: 14, cat: "B", train: true, p: 0.88 }, "0000": { id: 10, cat: "B", train: true, p: 0.97 },
    "1001": { id: 1, cat: "A", train: false, p: 0.59 }, "1111": { id: 6, cat: "A", train: false, p: 0.94 },
    "0101": { id: 9, cat: "A", train: false, p: 0.5 }, "0011": { id: 11, cat: "A", train: false, p: 0.62 },
    "1000": { id: 3, cat: "B", train: false, p: 0.69 }, "0010": { id: 8, cat: "B", train: false, p: 0.66 },
    "0100": { id: 16, cat: "B", train: false, p: 0.84 }
  };
  var GRAY = ["00", "01", "11", "10"];

  function hamming(a, b) {
    var d = 0;
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
    return d;
  }

  function figMedin(fig) {
    var selected = "1010";
    var cells = {};

    function neighbors(code) {
      return Object.keys(MS).filter(function (c) { return MS[c].train && hamming(c, code) === 1; });
    }

    function build() {
      var wrap = el("div", { class: "ms-wrap", role: "group", "aria-label": "Stimulus grid" });
      wrap.appendChild(el("div", { class: "ms-head", text: "F S \\ C P" }));
      GRAY.forEach(function (c) { wrap.appendChild(el("div", { class: "ms-head", text: c[0] + " " + c[1] })); });
      GRAY.forEach(function (r) {
        wrap.appendChild(el("div", { class: "ms-head ms-head--row", text: r[0] + " " + r[1] }));
        GRAY.forEach(function (c) {
          var code = r + c, it = MS[code];
          var b = el("button", {
            type: "button",
            class: "ms-cell ms-cell--" + it.cat + " ms-cell--" + (it.train ? "train" : "transfer"),
            "aria-label": "Item " + it.id + ", " + code + ", category " + it.cat + (it.train ? ", training" : ", transfer")
          }, [el("span", { class: "id", text: "#" + it.id }), el("span", { text: code }), el("span", { class: "p", text: it.p.toFixed(2) })]);
          b.addEventListener("click", function () { selected = code; render(); });
          cells[code] = b;
          wrap.appendChild(b);
        });
      });
      var grid = slot(fig, "grid");
      grid.appendChild(wrap);
      grid.appendChild(el("div", { class: "ms-legend", html:
        '<span><i style="background:#ffd8cf;border-color:#e8452c"></i>A, training</span>' +
        '<span><i style="background:#d5e0ff;border-color:#2d55d8"></i>B, training</span>' +
        '<span><i style="border-style:dashed"></i>transfer only</span>' +
        '<span><i style="box-shadow:inset 0 0 0 3px #ffe48a"></i>one-feature neighbor</span>' }));
    }

    function render() {
      var near = neighbors(selected);
      Object.keys(cells).forEach(function (c) {
        cells[c].classList.toggle("is-selected", c === selected);
        cells[c].classList.toggle("is-neighbor", near.indexOf(c) >= 0);
      });
      var it = MS[selected];
      var nA = near.filter(function (c) { return MS[c].cat === "A"; }).map(function (c) { return "#" + MS[c].id; });
      var nB = near.filter(function (c) { return MS[c].cat === "B"; }).map(function (c) { return "#" + MS[c].id; });
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "Item " + it.id + " (" + selected + "), Category " + it.cat + ", " + (it.train ? "training" : "transfer") }));
      panel.appendChild(el("p", { html: "Distance to the A prototype 1111: <b>" + hamming(selected, "1111") + "</b>; to the B prototype 0000: <b>" + hamming(selected, "0000") + "</b>." }));
      panel.appendChild(el("p", { html: "One feature from A exemplars: <b>" + (nA.join(", ") || "none") + "</b><br>One feature from B exemplars: <b>" + (nB.join(", ") || "none") + "</b>" }));
      panel.appendChild(el("p", { html: "Human proportion correct: <b>" + it.p.toFixed(2) + "</b>" }));
      var note = {
        "1010": "Item 7 sits two features from the prototype, yet two A exemplars and no B exemplar surround it. Participants classified it better than item 4.",
        "1110": "Item 4 sits one feature from the prototype, but two of its three close neighbors belong to B. A prototype account ranks it above item 7; participants did not.",
        "1111": "The prototype never appeared in training. It sits one feature from four A exemplars and from no B exemplar, and participants classified it best of all A items."
      }[selected];
      if (note) panel.appendChild(el("p", { class: "muted", text: note }));
    }

    segmented(slot(fig, "presets"), [
      { value: "1010", label: "item 7" }, { value: "1110", label: "item 4" }, { value: "1111", label: "prototype (6)" }
    ], selected, function (code) { selected = code; render(); });
    build();
    render();
  }

  /* ---------- Figure 6: Smith & Minda (1998), schematic ---------- */

  function logistic(x) { return 1 / (1 + Math.exp(-x)); }
  // P(category A) for each A item type at segment s; B items mirror these
  var SM_CURVES = {
    prototype: function (s) { return 0.985 - 0.13 * Math.exp(-(s - 1) / 2.2); },
    standard: function (s) { return 0.965 - 0.2 * Math.exp(-(s - 1) / 2.6); },
    exception: {
      "0.5": function (s) { return 0.8 + 0.13 * (1 - Math.exp(-(s - 1) / 3)); },
      "1": function (s) { return 0.36 + 0.46 * logistic((s - 3.5) / 1.3); },
      "2": function (s) { return 0.34 + 0.3 * logistic((s - 5) / 0.8); }
    }
  };

  function figSmithMinda(fig) {
    var alpha = "2", segment = 2;
    var Wd = 600, Ht = 320, M = { l: 46, r: 14, t: 14, b: 38 };
    function X(s) { return M.l + (s - 1) / 9 * (Wd - M.l - M.r); }
    function Y(p) { return M.t + (1 - p) * (Ht - M.t - M.b); }

    function curve(kind, cat) {
      var f = kind === "exception" ? SM_CURVES.exception[alpha] : SM_CURVES[kind];
      var pts = [];
      for (var s = 1; s <= 10; s++) pts.push([s, cat === "A" ? f(s) : 1 - f(s)]);
      return pts;
    }

    function marker(g, kind, x, y, color) {
      if (kind === "prototype") svg("circle", { cx: x, cy: y, r: 4.5, fill: color }, g);
      else if (kind === "standard") svg("rect", { x: x - 3.5, y: y - 3.5, width: 7, height: 7, fill: "#fdf8f1", stroke: color, "stroke-width": 1.6 }, g);
      else svg("polygon", { points: [x, y - 5, x + 5, y + 4, x - 5, y + 4].join(" "), fill: "#fdf8f1", stroke: color, "stroke-width": 1.6 }, g);
    }

    function render() {
      var chart = slot(fig, "chart");
      chart.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 " + Wd + " " + Ht, role: "img", "aria-label": "Probability of category A by segment for each item type" });
      [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
        svg("line", { x1: M.l, x2: Wd - M.r, y1: Y(p), y2: Y(p), stroke: p === 0.5 ? "#12100d" : "#ddd0bb", "stroke-dasharray": p === 0.5 ? "4 4" : "none" }, s);
        svg("text", { x: M.l - 8, y: Y(p) + 4, "text-anchor": "end", "font-size": 11, fill: "#4a4339", text: p.toFixed(2) }, s);
      });
      for (var k = 1; k <= 10; k++) svg("text", { x: X(k), y: Ht - M.b + 18, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", text: k }, s);
      svg("text", { x: (M.l + Wd - M.r) / 2, y: Ht - 4, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", text: "segment (4 blocks each)" }, s);
      svg("text", { x: 12, y: Ht / 2, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", transform: "rotate(-90 12 " + Ht / 2 + ")", text: "P(category A)" }, s);
      svg("rect", { x: X(segment) - 9, y: M.t, width: 18, height: Ht - M.t - M.b, fill: "#ffe48a", opacity: 0.6 }, s);

      ["A", "B"].forEach(function (cat) {
        var color = cat === "A" ? "#e8452c" : "#2d55d8";
        ["prototype", "standard", "exception"].forEach(function (kind) {
          var pts = curve(kind, cat);
          var g = svg("g", {}, s);
          svg("polyline", {
            points: pts.map(function (p) { return X(p[0]) + "," + Y(p[1]); }).join(" "),
            fill: "none", stroke: color, "stroke-width": kind === "prototype" ? 2.6 : kind === "standard" ? 1.4 : 2,
            "stroke-dasharray": kind === "exception" ? "6 4" : "none"
          }, g);
          pts.forEach(function (p) { marker(g, kind, X(p[0]), Y(p[1]), color); });
        });
      });
      chart.className = "sm-chart";
      chart.appendChild(s);

      var legend = el("div", { class: "sm-legend" });
      [["prototype", "prototypes"], ["standard", "standard items"], ["exception", "exceptions"]].forEach(function (k) {
        var icon = svg("svg", { width: 26, height: 14, "aria-hidden": "true" });
        svg("line", { x1: 0, x2: 26, y1: 7, y2: 7, stroke: "#12100d", "stroke-width": 1.6, "stroke-dasharray": k[0] === "exception" ? "4 3" : "none" }, icon);
        marker(icon, k[0], 13, 7, "#12100d");
        legend.appendChild(el("span", {}, [icon, k[1]]));
      });
      chart.appendChild(legend);
      renderInset();
    }

    function renderInset() {
      var pA = SM_CURVES.exception[alpha](segment);
      var distinct = pA >= 0.5;
      var inset = slot(fig, "inset");
      inset.innerHTML = "";
      inset.appendChild(el("h4", { text: "Segment " + segment + ", α = " + alpha }));
      var A = { lines: ["A concept", "000000 +5"], children: [], ink: "#e8452c" };
      var B = { lines: ["B concept", "111111 +5"], children: [], ink: "#2d55d8" };
      var exc = { lines: ["111101", "label A"], children: [], ink: "#e8452c", tone: distinct ? "new" : null };
      var root;
      if (distinct) {
        root = { lines: ["root"], children: [A, B, exc] };
      } else {
        B.children = [{ lines: ["111111", "+5 std"], children: [], ink: "#2d55d8" }, exc];
        root = { lines: ["root"], children: [A, B] };
      }
      var tree = el("div", { class: "tree-scroll" });
      inset.appendChild(tree);
      drawTree(tree, root, { text: true, nodeW: 72, nodeH: 40, label: "Where the A exception sits in the hierarchy" });
      inset.appendChild(el("p", { html: "P(A | 111101) ≈ <b>" + fmt(pA) + "</b>" }));
      inset.appendChild(el("p", { class: "muted", text: distinct
        ? "The exception has enough exposures to outweigh the prior, so it holds a concept of its own whose label follows its feedback: exemplar-like behavior."
        : "The prior still dominates the exception's evidence, so it remains inside the B concept it resembles and inherits that concept's label: prototype-like behavior." }));
    }

    segmented(slot(fig, "alpha"), [{ value: "0.5", label: "0.5" }, { value: "1", label: "1" }, { value: "2", label: "2" }], alpha, function (v) {
      alpha = v; render();
    });
    var range = slot(fig, "segment"), out = slot(fig, "segout");
    range.addEventListener("input", function () { segment = Number(range.value); out.textContent = range.value; render(); });
    render();
  }

  /* ---------- Figure 7: CobwebTM on a stream, schematic ---------- */

  function T(lines, n, children, tone) {
    return { lines: lines.concat(["n=" + n]), children: children || [], tone: tone || null };
  }

  var STREAM = [
    { text: "The first batch seeds two topics under the root: sports and computing hardware.",
      tree: function () { return T(["news"], 250, [T(["game team", "season coach"], 130), T(["chip memory", "gpu intel"], 120)]); } },
    { text: "The second batch brings operating-system posts. Cobweb inserts them under the computing topic, and creating a subtopic beside hardware wins; the sports topic is untouched.",
      tree: function () {
        return T(["news"], 375, [T(["game team", "season coach"], 140), T(["computer", "windows chip"], 235, [T(["chip memory", "gpu intel"], 128), T(["windows dos", "drive linux"], 107, null, "new")], "insert")], "insert");
      } },
    { text: "The third batch deepens sports. Olympic and baseball coverage enter the sports topic, and as the two diverge, Cobweb creates a subtopic for each beneath it.",
      tree: function () {
        return T(["news"], 500, [T(["game team", "season coach"], 265, [T(["olympic athens", "gold medal"], 121, null, "new"), T(["sox red", "boston game"], 144, null, "new")], "insert"), T(["computer", "windows chip"], 235, [T(["chip memory", "gpu intel"], 128), T(["windows dos", "drive linux"], 107)])], "insert");
      } },
    { text: "The final batch carries election coverage, a category absent from every earlier batch. No existing topic accommodates it, so Cobweb creates a new top-level topic; every earlier topic keeps its words and its documents.",
      tree: function () {
        return T(["news"], 625, [T(["game team", "season coach"], 265, [T(["olympic athens", "gold medal"], 121), T(["sox red", "boston game"], 144)]), T(["computer", "windows chip"], 235, [T(["chip memory", "gpu intel"], 128), T(["windows dos", "drive linux"], 107)]), T(["vote election", "senate ballot"], 125, null, "new")], "insert");
      } }
  ];

  function figTopics(fig) {
    var stage = 0;
    function render() {
      drawTree(slot(fig, "tree"), STREAM[stage].tree(), { text: true, nodeW: 112, nodeH: 58, label: "Topic hierarchy after batch " + (stage + 1) });
      slot(fig, "text").textContent = STREAM[stage].text;
      slot(fig, "count").textContent = "batch " + (stage + 1) + " / " + STREAM.length;
      fig.querySelector('[data-act="step"]').disabled = stage === STREAM.length - 1;
    }
    fig.querySelector('[data-act="step"]').addEventListener("click", function () { stage = Math.min(stage + 1, STREAM.length - 1); render(); });
    fig.querySelector('[data-act="reset"]').addEventListener("click", function () { stage = 0; render(); });
    render();
  }

  Sim.boot({
    "fig-rep": figRepresentation, "fig-ops": figOperators, "fig-pred": figPrediction,
    "fig-hr": figHayesRoth, "fig-ms": figMedin, "fig-sm": figSmithMinda, "fig-tm": figTopics
  });
})();
