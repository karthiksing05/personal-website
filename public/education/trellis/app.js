/*
  Figures for the TRELLIS explainer. Every scenario is hand-built: the parse of Figure 1, the
  taxonomies of Figure 2, the counts and scores of Figure 3, and the memory of Figure 4 follow
  the MED grammar of Singaravadivelan and Langley (2026) but are not outputs of TRELLIS.
  Figure 5 sketches the shape of the reported learning curves.
*/
(function () {
  "use strict";

  var Sim = window.Sim;
  var el = Sim.el, svg = Sim.svg, slot = Sim.slot, fmt = Sim.fmt, INK = Sim.INK;

  var CLASSES = ["Det", "N", "Adj", "V", "P", "NP", "AdjP", "PP", "VP", "VPobj", "S"];
  var COLOR = {
    Det: "#9a9184", N: "#2d55d8", Adj: "#8a3fc0", V: "#e8452c", P: "#0f8a5f",
    NP: "#6fa8ff", AdjP: "#d2b6f7", PP: "#9fe6c4", VP: "#ffbf96", VPobj: "#ffe48a", S: "#4a4339"
  };
  var LEX = {
    Det: ["the", "a"], N: ["cat", "dog", "man", "woman", "park", "telescope"],
    Adj: ["big", "small", "red", "quick", "lazy"], V: ["saw", "liked", "chased", "found", "admired"],
    P: ["with", "in", "on", "under"]
  };
  var WORD_CLASS = {};
  Object.keys(LEX).forEach(function (c) { LEX[c].forEach(function (w) { WORD_CLASS[w] = c; }); });

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var x = Math.imul(a ^ (a >>> 15), a | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(list, rand) { return list[Math.floor(rand() * list.length)]; }

  // parse trees: a word is a string, a composite is [class, left, right]
  function words(tree) { return typeof tree === "string" ? [tree] : words(tree[1]).concat(words(tree[2])); }
  function classOf(tree) { return typeof tree === "string" ? WORD_CLASS[tree] : tree[0]; }
  function depthOf(tree) { return typeof tree === "string" ? 0 : 1 + Math.max(depthOf(tree[1]), depthOf(tree[2])); }
  function brackets(tree) { return typeof tree === "string" ? tree : "[" + brackets(tree[1]) + " " + brackets(tree[2]) + "]"; }

  // break a phrase into lines of at most `width` characters for a tree node
  function wrap(text, width) {
    var out = [], line = "";
    text.split(" ").forEach(function (w) {
      if (line && (line + " " + w).length > width) { out.push(line); line = w; }
      else line = line ? line + " " + w : w;
    });
    if (line) out.push(line);
    return out;
  }

  function conceptId(prefix, key) { return prefix + "_CONCEPT-" + (100000 + hash(prefix + key) % 900000); }

  /* ---------- Figure 1: content and context of each element ---------- */

  function figRepresentation(fig) {
    var parse = ["S", ["NP", "the", "cat"], ["VP", "saw", ["NP", "a", "dog"]]];
    var sentence = words(parse);
    var selected = null;

    // annotate each node with its word span so contexts can be read off the sentence
    function build(tree, start) {
      var ws = words(tree);
      var node = {
        tree: tree, start: start, end: start + ws.length, text: ws.join(" "),
        primitive: typeof tree === "string", children: []
      };
      if (!node.primitive) {
        var left = build(tree[1], start);
        node.children = [left, build(tree[2], left.end)];
      }
      node.lines = wrap(node.text, 12);
      node.uniform = true;
      node.tone = node.primitive ? "#d8e8ff" : "#ffe1cc";
      node.ariaLabel = (node.primitive ? "word " : "phrase ") + node.text;
      return node;
    }
    var root = build(parse, 0);
    selected = root.children[1];

    function contextRows(node) {
      var rows = [];
      [-2, -1].forEach(function (k) {
        var i = node.start + k;
        rows.push({ attr: "left" + k, value: i >= 0 ? sentence[i] : "EMPTYNULL", w: Math.pow(2, k) });
      });
      [1, 2].forEach(function (k) {
        var i = node.end - 1 + k;
        rows.push({ attr: "right+" + k, value: i < sentence.length ? sentence[i] : "EMPTYNULL", w: Math.pow(2, -k) });
      });
      return rows;
    }

    function table(head, rows) {
      return el("table", { class: "inst" }, [
        el("thead", {}, [el("tr", {}, head.map(function (h) { return el("th", { text: h }); }))]),
        el("tbody", {}, rows.map(function (r) { return el("tr", {}, r.map(function (c) { return el("td", { text: c }); })); }))
      ]);
    }

    function render() {
      Sim.allNodes(root).forEach(function (n) { n.selected = n === selected; });
      Sim.drawTree(slot(fig, "tree"), root, { nodeW: 96, nodeH: 50, gapY: 30, onSelect: function (n) { selected = n; render(); }, label: "Parse tree of the cat saw a dog" });
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      var n = selected;
      panel.appendChild(el("h4", { text: "“" + n.text + "”, " + (n.primitive ? "primitive" : "composite, nesting depth " + depthOf(n.tree)) }));
      panel.appendChild(el("p", { class: "inst-label", html: '<span class="hl hl--context">context instance</span> → ' + conceptId("CTX", n.text) }));
      panel.appendChild(table(["attribute", "value", "weight"], contextRows(n).map(function (r) { return [r.attr, r.value, r.w === 0.5 ? "1/2" : "1/4"]; })));
      if (n.primitive) {
        panel.appendChild(el("p", { class: "muted", text: "A primitive has no content instance; it enters only the context taxonomy. The window shown here spans two positions per side; TRELLIS uses five, halving the weight at each step." }));
      } else {
        panel.appendChild(el("p", { class: "inst-label", html: '<span class="hl hl--content">content instance</span> → ' + conceptId("CNT", n.text) }));
        panel.appendChild(table(["attribute", "context concept", "depth"], n.children.map(function (c, k) {
          return [k ? "content-right" : "content-left", conceptId("CTX", c.text), String(depthOf(c.tree))];
        })));
        panel.appendChild(el("p", { class: "muted", text: "Content never names words directly: each constituent appears as the context concept it sorted to, plus its depth of nesting, so a chunk learned over one set of words applies to any words that occur in the same slots." }));
      }
    }
    render();
  }

  /* ---------- Figure 2: the two taxonomies ---------- */

  function D(obj) { return obj; }
  function T(lines, n, bars, children, basic) {
    return { lines: lines, n: n, bars: bars, children: children || [], stroke: basic ? "#e8452c" : null, basic: !!basic };
  }

  var CONTEXT_TREE = T(["context root"], 1729, [D({ N: 0.2, Det: 0.15, V: 0.17, Adj: 0.1, P: 0.08, NP: 0.1, AdjP: 0.06, VP: 0.08, PP: 0.03, VPobj: 0.02, S: 0.01 })], [
    T(["nominal slots"], 640, [D({ N: 0.6, AdjP: 0.32, Adj: 0.08 })], [
      T(["cat dog man", "n=380"], 380, [D({ N: 0.97, Adj: 0.03 })], [], true),
      T(["big dog, red cat", "n=260"], 260, [D({ AdjP: 0.82, N: 0.1, Adj: 0.08 })], [], true)
    ]),
    T(["function words"], 420, [D({ Det: 0.6, P: 0.4 })], [
      T(["the a", "n=250"], 250, [D({ Det: 1 })], [], true),
      T(["with in on", "n=170"], 170, [D({ P: 0.96, Adj: 0.04 })], [], true)
    ]),
    T(["predicates"], 669, [D({ V: 0.45, VP: 0.35, VPobj: 0.12, PP: 0.08 })], [
      T(["saw chased", "n=300"], 300, [D({ V: 0.98, N: 0.02 })], [], true),
      T(["saw a dog", "n=369"], 369, [D({ VP: 0.62, VPobj: 0.24, PP: 0.14 })], [], true)
    ])
  ]);

  var CONTENT_TREE = T(["content root"], 1329, [D({ Det: 0.45, V: 0.25, NP: 0.15, Adj: 0.1, P: 0.05 }), D({ N: 0.3, NP: 0.3, AdjP: 0.2, VP: 0.12, PP: 0.08 })], [
    T(["nominal chunks"], 651, [D({ Det: 1 }), D({ N: 0.62, AdjP: 0.38 })], [
      T(["Det + N", "n=402"], 402, [D({ Det: 1 }), D({ N: 1 })], [], true),
      T(["Det + AdjP", "n=249"], 249, [D({ Det: 1 }), D({ AdjP: 0.94, N: 0.06 })], [], true)
    ]),
    T(["clausal chunks"], 445, [D({ V: 0.64, NP: 0.36 }), D({ NP: 0.43, VPobj: 0.21, VP: 0.36 })], [
      T(["V + NP", "n=190"], 190, [D({ V: 1 }), D({ NP: 1 })], [], true),
      T(["V + VPobj", "n=95"], 95, [D({ V: 1 }), D({ VPobj: 1 })], [], true),
      T(["NP + VP", "n=160"], 160, [D({ NP: 1 }), D({ VP: 1 })], [], true)
    ]),
    T(["modifier chunks"], 233, [D({ Adj: 0.47, P: 0.3, NP: 0.23 }), D({ N: 0.35, AdjP: 0.12, NP: 0.3, PP: 0.23 })], [
      T(["Adj + N | AdjP", "n=110"], 110, [D({ Adj: 1 }), D({ N: 0.74, AdjP: 0.26 })], [], true),
      T(["P + NP", "n=70"], 70, [D({ P: 1 }), D({ NP: 1 })], [], true),
      T(["NP + PP", "n=53"], 53, [D({ NP: 1 }), D({ PP: 1 })], [], true)
    ])
  ]);

  function drawBars(g, bars, W, H) {
    bars.forEach(function (dist, row) {
      var x = 6, y = H - 10 - (bars.length - 1 - row) * 10, total = 0;
      CLASSES.forEach(function (c) { total += dist[c] || 0; });
      CLASSES.forEach(function (c) {
        var w = (W - 12) * (dist[c] || 0) / total;
        if (w > 0) svg("rect", { x: x, y: y, width: w, height: 7, fill: COLOR[c] }, g);
        x += w;
      });
      if (bars.length > 1) svg("text", { x: 2, y: y + 6.5, "font-size": 7, fill: "#7c7366", text: row ? "R" : "L" }, g);
    });
  }

  function figTaxonomies(fig) {
    var which = "content";
    function render() {
      var tree = which === "content" ? CONTENT_TREE : CONTEXT_TREE;
      Sim.drawTree(slot(fig, "tree"), tree, {
        nodeW: 100, nodeH: 64, gapX: 10, gapY: 30, label: which + " taxonomy",
        drawNode: function (g, n, W, H) {
          var lines = n.children.length ? n.lines.concat(["n=" + n.n]) : n.lines;
          lines.forEach(function (line, i) {
            svg("text", { x: W / 2, y: 15 + i * 13, "text-anchor": "middle", "font-size": i === 0 ? 10.5 : 9.5, "font-weight": i === 0 ? 600 : 400, fill: INK, text: line }, g);
          });
          drawBars(g, n.bars, W, H);
        }
      });
    }
    Sim.segmented(slot(fig, "tabs"), [{ value: "content", label: "content" }, { value: "context", label: "context" }], which, function (v) { which = v; render(); });
    slot(fig, "legend").innerHTML = CLASSES.map(function (c) {
      return '<span><i style="background:' + COLOR[c] + '"></i>' + c + "</span>";
    }).join("") + '<span><i class="basic"></i>basic level</span>';
    render();
  }

  /* ---------- Figure 3: greedy parsing ---------- */

  // the regularities a trained memory would hold: result class, score, and share of cases
  var RULES = {
    "Det+N": ["NP", 5.3, 0.3], "Det+AdjP": ["NP", 5.0, 0.12], "Adj+N": ["AdjP", 4.8, 0.12],
    "Adj+AdjP": ["AdjP", 4.1, 0.04], "P+NP": ["PP", 4.6, 0.1], "NP+PP": ["VPobj", 4.4, 0.06],
    "V+NP": ["VP", 4.0, 0.14], "V+VPobj": ["VP", 3.8, 0.06], "NP+VP": ["S", 3.6, 0.25]
  };
  var NONCONSTITUENT_SHARE = 0.1, TAU_PARSE = 30;
  var SENTENCES = ["the cat saw a dog", "the big dog chased a small cat", "a man found the dog in the park"];

  function candidates(frontier, nTrain) {
    var out = [];
    for (var i = 0; i + 1 < frontier.length; i++) {
      var a = frontier[i], b = frontier[i + 1];
      var key = a.cls + "+" + b.cls, rule = RULES[key];
      var text = a.text + " | " + b.text;
      var jitter = (hash(text) % 1000) / 1000;
      var share = rule ? rule[2] : NONCONSTITUENT_SHARE;
      var count = Math.round(share * nTrain * 1.6);
      out.push({
        i: i, text: text, rule: rule, count: count, admitted: count > TAU_PARSE,
        score: rule ? rule[1] + 0.25 * jitter : 1.2 + 1.0 * jitter
      });
    }
    var best = null;
    out.forEach(function (c) { if (c.admitted && (!best || c.score > best.score)) best = c; });
    if (best) best.best = true;
    return { list: out, best: best };
  }

  function figParser(fig) {
    var sentence = SENTENCES[0], nTrain = 320, history = [];

    function initial() {
      return sentence.split(" ").map(function (w) {
        return { text: w, cls: WORD_CLASS[w], children: [], lines: [w], tone: "#d8e8ff" };
      });
    }
    function commit(frontier, cand) {
      var a = frontier[cand.i], b = frontier[cand.i + 1];
      var text = a.text + " " + b.text;
      var node = { text: text, cls: cand.rule ? cand.rule[0] : "?", children: [a, b], lines: wrap(text, 13), uniform: true, tone: "hl" };
      frontier.forEach(function (n) { if (n.tone === "hl") n.tone = "#ffe1cc"; });
      return frontier.slice(0, cand.i).concat([node], frontier.slice(cand.i + 2));
    }
    function clearTones(n) { if (n.tone === "hl") n.tone = "#ffe1cc"; n.children.forEach(clearTones); }

    function render() {
      var frontier = history[history.length - 1];
      var forest = { children: frontier, lines: [] };
      Sim.drawTree(slot(fig, "tree"), forest, { nodeW: 100, nodeH: 60, gapX: 10, gapY: 26, hideRoot: true, label: "Partial parse" });
      var done = frontier.length === 1;
      var c = candidates(frontier, nTrain);
      slot(fig, "count").textContent = "step " + history.length + (done ? ", parse complete" : "");

      var box = slot(fig, "candidates");
      box.innerHTML = "";
      if (!done) {
        box.appendChild(el("table", { class: "tbl cand" }, [
          el("thead", {}, [el("tr", {}, ["candidate", "best ancestor count", "gate", "s_c + s_x"].map(function (h) { return el("th", { text: h }); }))]),
          el("tbody", {}, c.list.map(function (k) {
            return el("tr", { class: k.best ? "is-best" : k.admitted ? "" : "is-out" }, [
              el("td", { text: k.text }),
              el("td", { text: String(k.count) }),
              el("td", { text: k.admitted ? "admit" : "reject" }),
              el("td", { text: k.admitted ? fmt(k.score) : "–" })
            ]);
          }))
        ]));
      }
      var text;
      if (done) text = "A single composite spans the sentence, so parsing halts with a complete tree. Its unlabeled brackets: " + brackets(toTree(frontier[0])) + ".";
      else if (!c.best) text = "No candidate clears the gate, so parsing halts gracefully with a partial parse of " + frontier.length + " pieces. With more training, the counts on these paths would grow past τ = " + TAU_PARSE + ".";
      else if (c.best.rule) text = "Commit “" + c.best.text.replace(" | ", " ") + "”: the highest score among the admitted candidates.";
      else text = "Commit “" + c.best.text.replace(" | ", " ") + "”, a non-constituent: the greedy parser cannot undo this choice.";
      slot(fig, "text").textContent = text;
      fig.querySelector('[data-act="step"]').disabled = done || !c.best;
      fig.querySelector('[data-act="back"]').disabled = history.length === 1;
    }
    function toTree(n) { return n.children.length ? [n.cls, toTree(n.children[0]), toTree(n.children[1])] : n.text; }

    function reset() { history = [initial()]; render(); }
    fig.querySelector('[data-act="step"]').addEventListener("click", function () {
      var frontier = history[history.length - 1], c = candidates(frontier, nTrain);
      if (!c.best) return;
      history[history.length - 1].forEach(clearTones);
      history.push(commit(frontier, c.best));
      render();
    });
    fig.querySelector('[data-act="back"]').addEventListener("click", function () {
      if (history.length > 1) { history.pop(); history[history.length - 1].forEach(clearTones); render(); }
    });
    fig.querySelector('[data-act="reset"]').addEventListener("click", reset);
    Sim.segmented(slot(fig, "sentences"), SENTENCES.map(function (s, k) { return { value: s, label: "sentence " + (k + 1) }; }), sentence, function (s) { sentence = s; reset(); });
    Sim.segmented(slot(fig, "training"), [20, 80, 160, 320].map(function (n) { return { value: n, label: String(n) }; }), nTrain, function (n) { nTrain = n; reset(); });
    reset();
  }

  /* ---------- Figure 4: generation and the recall threshold ---------- */

  var MEMORY = [
    ["S", ["NP", "the", "cat"], ["VP", "saw", ["NP", "a", "dog"]]],
    ["S", ["NP", "a", ["AdjP", "big", "dog"]], ["VP", "chased", ["NP", "the", "man"]]],
    ["S", ["NP", "the", "woman"], ["VP", "found", ["VPobj", ["NP", "a", "cat"], ["PP", "in", ["NP", "the", "park"]]]]],
    ["S", ["NP", "a", "man"], ["VP", "liked", ["NP", "the", ["AdjP", "small", ["AdjP", "red", "cat"]]]]],
    ["S", ["NP", "the", "dog"], ["VP", "admired", ["NP", "a", "woman"]]],
    ["S", ["NP", "a", ["AdjP", "quick", "cat"]], ["VP", "chased", ["VPobj", ["NP", "the", "dog"], ["PP", "with", ["NP", "a", "telescope"]]]]],
    ["S", ["NP", "the", "man"], ["VP", "saw", ["NP", "a", ["AdjP", "lazy", "dog"]]]],
    ["S", ["NP", "the", "cat"], ["VP", "found", ["VPobj", ["NP", "a", "man"], ["PP", "on", ["NP", "the", "park"]]]]]
  ];
  var SEEN = MEMORY.map(function (t) { return words(t).join(" "); });

  // pools a trained memory would hold: phrases by class, expansions by class, words by class
  var PHRASES = {}, EXPANSIONS = {}, WORDS = {};
  function index(tree) {
    if (typeof tree === "string") { (WORDS[WORD_CLASS[tree]] = WORDS[WORD_CLASS[tree]] || []).push(tree); return; }
    (PHRASES[tree[0]] = PHRASES[tree[0]] || []).push(tree);
    (EXPANSIONS[tree[0]] = EXPANSIONS[tree[0]] || []).push([classOf(tree[1]), classOf(tree[2])]);
    index(tree[1]);
    index(tree[2]);
  }
  MEMORY.forEach(index);
  // general nodes high in the content taxonomy mix classes that fill nearby slots
  var MIXED = { N: ["N", "Adj"], Adj: ["Adj", "N"], V: ["V", "P"], P: ["P", "V"], Det: ["Det"] };

  function generate(level, filter, rand) {
    var bad = [];
    function word(cls) {
      if (level !== "high") return pick(WORDS[cls], rand);
      // a general node offers a word of a neighboring class for some slots...
      var others = MIXED[cls].filter(function (c) { return c !== cls; });
      var cl = others.length && rand() < 0.3 ? pick(others, rand) : cls;
      // ...and the context filter rejects most of those, falling back to a wider pool
      if (cl !== cls && filter && rand() < 0.9) cl = cls;
      var w = pick(WORDS[cl], rand);
      if (cl !== cls) bad.push(w);
      return w;
    }
    function expand(cls, depth) {
      if (LEX[cls]) return word(cls);
      if (level === "low" && depth > 0) return pick(PHRASES[cls], rand);
      var pool = EXPANSIONS[cls];
      if (depth > 3) pool = pool.filter(function (e) { return e.indexOf("AdjP") < 0 || cls !== "AdjP"; });
      var e = pick(pool.length ? pool : EXPANSIONS[cls], rand);
      return [cls, expand(e[0], depth + 1), expand(e[1], depth + 1)];
    }
    var tree;
    if (level === "low" && rand() < 0.5) tree = pick(MEMORY, rand);
    else tree = expand("S", 0);
    var text = words(tree).join(" ");
    var verdict = bad.length ? "error" : SEEN.indexOf(text) >= 0 ? "memorized" : "novel";
    return { tree: tree, text: text, verdict: verdict, bad: bad };
  }

  function figGeneration(fig) {
    var level = "medium", seed = 11;
    var LABEL = { memorized: "seen in training", novel: "novel, well-formed", error: "error of commission" };
    var NOTE = {
      low: "A low threshold recalls very specific nodes supported by few cases. Output reuses whole training sentences or recombines whole stored phrases, so it rarely says anything new.",
      medium: "A moderate threshold recalls a node per class and samples its constituents. Most sentences are novel, and all respect the grammar, because each pool holds one kind of constituent.",
      high: "A high threshold recalls general nodes that mix constituents which do not belong together, such as nouns with adjectives or verbs with prepositions, and some sentences violate the grammar."
    };
    function render() {
      var rand = rng(seed), out = [];
      for (var i = 0; i < 8; i++) out.push(generate(level, slot(fig, "filter").checked, rand));
      var list = slot(fig, "list");
      list.innerHTML = "";
      out.forEach(function (g) {
        var html = brackets(g.tree).replace(/[a-z]+/g, function (w) { return g.bad.indexOf(w) >= 0 ? '<mark>' + w + "</mark>" : w; });
        list.appendChild(el("li", {}, [
          el("span", { class: "chip chip--" + g.verdict, text: LABEL[g.verdict] }),
          el("code", { html: html })
        ]));
      });
      var counts = { memorized: 0, novel: 0, error: 0 };
      out.forEach(function (g) { counts[g.verdict]++; });
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "Recall threshold: " + level }));
      panel.appendChild(Sim.distBlock("this batch of 8", [
        { label: "seen", p: counts.memorized, color: "#d2b6f7" },
        { label: "novel", p: counts.novel, color: "#0f8a5f" },
        { label: "errors", p: counts.error, color: "#e8452c" }
      ], { max: 8, format: function (v) { return String(v); } }));
      panel.appendChild(el("p", { text: NOTE[level] }));
    }
    Sim.segmented(slot(fig, "threshold"), [{ value: "low", label: "low" }, { value: "medium", label: "medium" }, { value: "high", label: "high" }], level, function (v) { level = v; render(); });
    slot(fig, "filter").addEventListener("change", render);
    fig.querySelector('[data-act="generate"]').addEventListener("click", function () { seed += 1; render(); });
    render();
  }

  /* ---------- Figure 5: learning curves, schematic ---------- */

  var CONDITIONS = {
    grammar: [["small", 4, 0.98, "#0f8a5f"], ["med", 7, 0.96, "#2d55d8"], ["large", 11, 0.93, "#e8452c"]],
    lexicon: [["low (11 words)", 5, 0.97, "#0f8a5f"], ["med (22 words)", 7, 0.96, "#2d55d8"], ["high (39 words)", 10, 0.94, "#e8452c"]]
  };

  // a rise to about 0.8 within the first sentences, then slow gains toward `top`
  function curve(n, k, top) { return 0.8 * (1 - Math.exp(-n / k)) + (top - 0.8) * (1 - Math.exp(-n / 110)); }

  function figCurves(fig) {
    var which = "grammar";
    function chart(title, offset) {
      var Wd = 300, Ht = 220, L = 38, R = 10, Tp = 24, B = 34;
      function X(n) { return L + n / 320 * (Wd - L - R); }
      function Y(v) { return Tp + (1 - v) * (Ht - Tp - B); }
      var s = svg("svg", { viewBox: "0 0 " + Wd + " " + Ht, role: "img", "aria-label": title });
      svg("text", { x: L, y: 14, "font-size": 11, "font-weight": 600, fill: INK, text: title }, s);
      [0, 0.2, 0.4, 0.6, 0.8, 1].forEach(function (v) {
        svg("line", { x1: L, x2: Wd - R, y1: Y(v), y2: Y(v), stroke: v === 0 ? INK : "#ddd0bb" }, s);
        svg("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end", "font-size": 10, fill: "#4a4339", text: v.toFixed(1) }, s);
      });
      [0, 100, 200, 300].forEach(function (n) {
        svg("text", { x: X(n), y: Ht - B + 16, "text-anchor": "middle", "font-size": 10, fill: "#4a4339", text: n }, s);
      });
      svg("text", { x: (L + Wd - R) / 2, y: Ht - 4, "text-anchor": "middle", "font-size": 10, fill: "#4a4339", text: "training sentences" }, s);
      CONDITIONS[which].forEach(function (c) {
        var up = [], down = [], mid = [];
        for (var n = 0; n <= 320; n += 4) {
          var v = curve(n, c[1] * offset, c[2] - 0.01 * (offset - 1) * 4);
          mid.push(X(n) + "," + Y(v));
          up.push(X(n) + "," + Y(Math.min(1, v + 0.035)));
          down.unshift(X(n) + "," + Y(Math.max(0, v - 0.035)));
        }
        svg("polygon", { points: up.concat(down).join(" "), fill: c[3], opacity: 0.14 }, s);
        svg("polyline", { points: mid.join(" "), fill: "none", stroke: c[3], "stroke-width": 2 }, s);
      });
      return s;
    }
    function render() {
      var box = slot(fig, "charts");
      box.innerHTML = "";
      box.appendChild(chart("parsing: 1 − omission", 1));
      box.appendChild(chart("generation: 1 − commission", 1.25));
      slot(fig, "legend").innerHTML = CONDITIONS[which].map(function (c) {
        return '<span><i style="border-color:' + c[3] + '"></i>' + c[0] + "</span>";
      }).join("");
    }
    Sim.segmented(slot(fig, "tabs"), [{ value: "grammar", label: "grammar size" }, { value: "lexicon", label: "lexicon size" }], which, function (v) { which = v; render(); });
    render();
  }

  Sim.boot({
    "fig-rep": figRepresentation, "fig-tax": figTaxonomies, "fig-parse": figParser,
    "fig-gen": figGeneration, "fig-curves": figCurves
  });
})();
