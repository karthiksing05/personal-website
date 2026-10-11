/*
  Shared helpers for the explainers under /education: small DOM builders, a segmented control,
  probability bars, a tidy tree renderer, and a boot routine that mounts each figure and then
  typesets the page's math with KaTeX. Pages load this before their own script and read it
  from window.Sim.
*/
(function () {
  "use strict";

  var SVGNS = "http://www.w3.org/2000/svg";
  var INK = "#12100d", LINEN = "#faf0e6";
  // pastel fills, one per recurring idea; keys match the tones in sim.css
  var TONE = { insert: "#9fe6c4", new: "#a9d0ff", merge: "#ffbf96", split: "#d2b6f7", hl: "#ffe48a", rose: "#ffb3c4" };

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }

  function svg(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }

  function slot(fig, name) { return fig.querySelector('[data-slot="' + name + '"]'); }

  // segmented control; options are [{value, label, tone?}]
  function segmented(container, options, initial, onChange) {
    container.innerHTML = "";
    var buttons = options.map(function (o) {
      var b = el("button", { type: "button", "aria-pressed": String(o.value === initial), text: o.label });
      if (o.tone) b.setAttribute("data-tone", o.tone);
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        onChange(o.value);
      });
      container.appendChild(b);
      return b;
    });
  }

  function fmt(x, d) { return x.toFixed(d == null ? 2 : d); }

  function allNodes(root) {
    var out = [];
    (function walk(n) { out.push(n); n.children.forEach(walk); })(root);
    return out;
  }

  // a labeled list of probability bars; rows are [{label, icon?, p}]
  function distBlock(name, rows, opts) {
    opts = opts || {};
    var top = Math.max.apply(null, rows.map(function (r) { return r.p; }));
    var max = opts.max || 1;
    return el("div", { class: "dist" }, [el("p", { class: "dist-name", text: name })].concat(rows.map(function (r) {
      var bar = el("div", { class: "bar" });
      bar.style.width = (Math.max(0, r.p) / max * 100).toFixed(1) + "%";
      if (r.color) bar.style.background = r.color;
      return el("div", { class: "dist-row" + (r.p === top && !r.color ? " is-top" : "") }, [
        el("span", { class: "v" }, [r.icon || null, r.label]),
        el("div", { class: "track" }, [bar]),
        el("span", { class: "num", text: opts.format ? opts.format(r.p) : fmt(r.p) })
      ]);
    })));
  }

  function drawTextLines(g, n, W) {
    (n.lines || []).forEach(function (line, i) {
      svg("text", {
        x: W / 2, y: 18 + i * 15, "text-anchor": "middle",
        "font-size": i === 0 || n.uniform ? 11 : 10, "font-weight": i === 0 || n.uniform ? 600 : 400, fill: n.ink || INK, text: line
      }, g);
    });
  }

  // Lays a tree out with leaves evenly spaced and parents centered over their children, then
  // draws each node as a box. Node fields: children (required), lines (text nodes; uniform sets
  // every line in the heading style), ink, tone
  // (a TONE key or a color), mark ("best1" | "best2"), badge, weight (0..1), selected,
  // expanded. Options: nodeW, nodeH, gapX, gapY, weights, label, onSelect(node),
  // drawNode(g, node, W, H) to draw custom content in place of text lines, and hideRoot to
  // draw the root's children as a forest.
  function drawTree(container, root, opts) {
    opts = opts || {};
    var W = opts.nodeW || 132, H = opts.nodeH || 58;
    var GX = opts.gapX || 14, GY = opts.gapY || 34, PAD = 10;
    var leaves = 0, depth = 0;
    var top = opts.hideRoot ? 1 : 0;
    (function place(n, d) {
      n._d = d - top; depth = Math.max(depth, d - top);
      if (!n.children.length) { n._x = leaves++; return; }
      n.children.forEach(function (c) { place(c, d + 1); });
      n._x = (n.children[0]._x + n.children[n.children.length - 1]._x) / 2;
    })(root, 0);
    var extra = opts.weights ? 16 : 0;
    var width = leaves * (W + GX) - GX + PAD * 2;
    var height = (depth + 1) * (H + GY + extra) - GY + PAD * 2;
    var s = svg("svg", { width: width, height: height, viewBox: "0 0 " + width + " " + height, role: "img", "aria-label": opts.label || "hierarchy" });
    function pos(n) { return { x: PAD + n._x * (W + GX), y: PAD + n._d * (H + GY + extra) }; }

    var edges = svg("g", {}, s), nodes = svg("g", {}, s);
    (function edgesOf(n) {
      var p = pos(n);
      n.children.forEach(function (c) {
        if (n === root && opts.hideRoot) { edgesOf(c); return; }
        var q = pos(c), midY = p.y + H + (GY + extra) / 2;
        svg("path", {
          d: "M" + (p.x + W / 2) + " " + (p.y + H + extra) + " V" + midY + " H" + (q.x + W / 2) + " V" + q.y,
          fill: "none", stroke: INK, "stroke-width": 1.2, opacity: 0.7
        }, edges);
        edgesOf(c);
      });
    })(root);

    allNodes(root).forEach(function (n) {
      if (n === root && opts.hideRoot) return;
      var p = pos(n);
      var g = svg("g", { transform: "translate(" + p.x + "," + p.y + ")" }, nodes);
      var fill = n.tone ? (TONE[n.tone] || n.tone) : (n.expanded ? TONE.hl : LINEN);
      var strokeW = n.mark === "best1" || n.selected ? 3 : 1.5;
      var stroke = n.mark === "best2" ? "#9a9184" : (n.stroke || INK);
      svg("rect", { x: 0, y: 0, width: W, height: H, fill: fill, stroke: stroke, "stroke-width": strokeW, "stroke-dasharray": n.mark === "best2" || n.dashed ? "5 3" : "none" }, g);
      (opts.drawNode || drawTextLines)(g, n, W, H);
      if (n.badge != null) {
        svg("circle", { cx: W - 2, cy: 2, r: 9, fill: INK }, g);
        svg("text", { x: W - 2, y: 5.5, "text-anchor": "middle", "font-size": 10, "font-weight": 700, fill: LINEN, text: n.badge }, g);
      }
      if (opts.weights && n.weight != null) {
        svg("rect", { x: 0, y: H + 4, width: W, height: 8, fill: "none", stroke: "#ddd0bb" }, g);
        svg("rect", { x: 0, y: H + 4, width: Math.max(1, W * n.weight), height: 8, fill: "#0f8a5f" }, g);
      }
      if (opts.onSelect) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.setAttribute("aria-label", n.ariaLabel || (n.lines || []).join(" ") || "node");
        g.style.cursor = "pointer";
        g.addEventListener("click", function () { opts.onSelect(n); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opts.onSelect(n); }
        });
      }
    });
    container.innerHTML = "";
    container.appendChild(s);
    return s;
  }

  // mount each figure by id, then typeset \( \) and \[ \] with KaTeX's auto-render
  function boot(figures) {
    function run() {
      Object.keys(figures).forEach(function (id) {
        var fig = document.getElementById(id);
        if (fig) figures[id](fig);
      });
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
          throwOnError: false
        });
      }
    }
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
  }

  window.Sim = {
    INK: INK, LINEN: LINEN, TONE: TONE,
    el: el, svg: svg, slot: slot, segmented: segmented, fmt: fmt, allNodes: allNodes,
    distBlock: distBlock, drawTree: drawTree, boot: boot
  };
})();
