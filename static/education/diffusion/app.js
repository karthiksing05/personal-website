/*
  Figures for the diffusion explainer. Figures 1, 3, and 4 compute exact kernel-density
  quantities for a toy dataset (model.js); Figure 2 evaluates Eq. 5 directly.
*/
(function () {
  "use strict";

  var Sim = window.Sim, M = window.DiffusionToy;
  var el = Sim.el, svg = Sim.svg, slot = Sim.slot, fmt = Sim.fmt;
  var INK = Sim.INK;
  var CORAL = "#e8452c", COBALT = "#2d55d8", JADE = "#0f8a5f";

  // data and held-out points shared by every figure at the default spread
  var DATA = M.makeData({ seed: 7 });

  /* ---------- Figure 1: the noisy marginal and its modes ---------- */

  function figDensity(fig) {
    var canvas = slot(fig, "canvas"), ctx = canvas.getContext("2d");
    var W = canvas.width, H = canvas.height;
    var X0 = -3.6, X1 = 3.6, Y0 = -3.3, Y1 = 3.0;
    var t = 150, selected = 24;
    function px(x) { return (x - X0) / (X1 - X0) * W; }
    function py(y) { return H - (y - Y0) / (Y1 - Y0) * H; }

    function render() {
      var h = M.bandwidth(t);
      ctx.fillStyle = "#fdf8f1";
      ctx.fillRect(0, 0, W, H);

      // density shading on a coarse grid, normalized to the frame's maximum
      var step = 8, grid = [], max = -Infinity;
      for (var gy = 0; gy < H; gy += step) {
        for (var gx = 0; gx < W; gx += step) {
          var x = X0 + (gx + step / 2) / W * (X1 - X0), y = Y1 - (gy + step / 2) / H * (Y1 - Y0);
          var v = M.logDensity(DATA, h, x, y);
          grid.push([gx, gy, v]);
          if (v > max) max = v;
        }
      }
      grid.forEach(function (c) {
        var a = Math.exp(c[2] - max);
        if (a < 0.01) return;
        ctx.fillStyle = "rgba(138, 63, 192," + (0.55 * Math.pow(a, 0.6)).toFixed(3) + ")";
        ctx.fillRect(c[0], c[1], step, step);
      });

      DATA.forEach(function (p, i) {
        ctx.beginPath();
        ctx.arc(px(p.x), py(p.y), i === selected ? 6 : 4, 0, 2 * Math.PI);
        ctx.fillStyle = M.GROUPS[p.group].color;
        ctx.fill();
        ctx.lineWidth = i === selected ? 2.5 : 1;
        ctx.strokeStyle = INK;
        ctx.stroke();
      });

      var modes = M.modesAt(DATA, t);
      modes.forEach(function (m) {
        ctx.beginPath();
        ctx.arc(px(m.x), py(m.y), 9, 0, 2 * Math.PI);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = INK;
        ctx.stroke();
      });

      var p = DATA[selected];
      var trace = M.ascend(DATA, h, p.x, p.y, true);
      ctx.beginPath();
      trace.path.forEach(function (q, k) { if (k) ctx.lineTo(px(q[0]), py(q[1])); else ctx.moveTo(px(q[0]), py(q[1])); });
      ctx.lineWidth = 2;
      ctx.strokeStyle = INK;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      // the prototype the datum reaches
      var ex = px(trace.x), ey = py(trace.y);
      ctx.beginPath();
      ctx.moveTo(ex, ey - 11); ctx.lineTo(ex + 11, ey); ctx.lineTo(ex, ey + 11); ctx.lineTo(ex - 11, ey); ctx.closePath();
      ctx.fillStyle = "#ffe48a";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = INK;
      ctx.stroke();

      var mine = null, bd = Infinity;
      modes.forEach(function (m) { var d = Math.hypot(m.x - trace.x, m.y - trace.y); if (d < bd) { bd = d; mine = m; } });
      renderPanel(modes, mine, h);
    }

    function renderPanel(modes, mine, h) {
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "t = " + t + " of " + M.T }));
      panel.appendChild(el("p", { class: "eqline", html:
        "ᾱ<sub>t</sub> = " + fmt(M.abar(t), 3) + ", SNR = " + (M.snr(t) > 999 ? M.snr(t).toExponential(1) : fmt(M.snr(t))) +
        "<br>bandwidth h<sub>t</sub> = " + fmt(h, 3) + "<br>modes: <b>" + modes.length + "</b> of " + DATA.length + " points" }));
      var regime = modes.length === DATA.length ? "Every datum is its own mode: the leaves of the hierarchy, one exemplar each."
        : modes.length === 1 ? "A single mode remains: the root, which summarizes the whole dataset."
        : modes.length <= M.GROUPS.length ? "The modes now correspond to the superordinate groups."
        : "Neighboring points have fused into intermediate prototypes.";
      panel.appendChild(el("p", { text: regime }));
      var rows = M.GROUPS.map(function (g, k) {
        return { label: "group " + g.name, p: (mine.groups[k] || 0) / mine.members.length, color: g.color };
      });
      panel.appendChild(Sim.distBlock("selected point's mode: " + mine.members.length + " members", rows));
      panel.appendChild(el("p", { class: "eqline", html: "prototype m<sub>c</sub> = (" + fmt(mine.x) + ", " + fmt(mine.y) + ")" }));
    }

    var range = slot(fig, "t"), out = slot(fig, "tout");
    function setT(v) { t = v; range.value = v; out.textContent = String(v); render(); }
    range.addEventListener("input", function () { setT(Number(range.value)); });
    Sim.segmented(slot(fig, "presets"), [25, 100, 150, 400, 700].map(function (v) { return { value: v, label: "t=" + v }; }), 150, setT);
    canvas.addEventListener("click", function (e) {
      var r = canvas.getBoundingClientRect();
      var cx = (e.clientX - r.left) / r.width * W, cy = (e.clientY - r.top) / r.height * H;
      var best = -1, bd = 18;
      DATA.forEach(function (p, i) { var d = Math.hypot(px(p.x) - cx, py(p.y) - cy); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { selected = best; render(); }
    });
    render();
  }

  /* ---------- Figure 2: parent pooling (Eq. 5) ---------- */

  function figPooling(fig) {
    var state = { mu1: -1.2, s1: 0.6, mu2: 1.4, s2: 0.9, w1: 0.55 };
    var SPEC = [
      ["mu1", "μ₁", -3, 3, 0.1], ["s1", "σ₁", 0.2, 1.5, 0.05],
      ["mu2", "μ₂", -3, 3, 0.1], ["s2", "σ₂", 0.2, 1.5, 0.05],
      ["w1", "P(1 | c)", 0.05, 0.95, 0.05]
    ];
    var controls = slot(fig, "controls");
    SPEC.forEach(function (sp) {
      var input = el("input", { type: "range", min: sp[2], max: sp[3], step: sp[4], value: state[sp[0]], "aria-label": sp[1] });
      var out = el("output", { text: fmt(state[sp[0]]) });
      input.addEventListener("input", function () { state[sp[0]] = Number(input.value); out.textContent = fmt(state[sp[0]]); render(); });
      controls.appendChild(el("label", { class: "pool-ctl" }, [el("span", { class: "label", text: sp[1] }), input, out]));
    });

    function pdf(x, m, s) { return Math.exp(-0.5 * Math.pow((x - m) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }

    function render() {
      var w1 = state.w1, w2 = 1 - w1;
      var mu = w1 * state.mu1 + w2 * state.mu2;
      var within = w1 * state.s1 * state.s1 + w2 * state.s2 * state.s2;
      var between = w1 * Math.pow(state.mu1 - mu, 2) + w2 * Math.pow(state.mu2 - mu, 2);
      var sc = Math.sqrt(within + between);

      var Wd = 600, Ht = 280, L = 16, R = 16, Tp = 12, B = 30, X0 = -5, X1 = 5;
      var xs = [];
      for (var i = 0; i <= 240; i++) xs.push(X0 + (X1 - X0) * i / 240);
      var c1 = xs.map(function (x) { return w1 * pdf(x, state.mu1, state.s1); });
      var c2 = xs.map(function (x) { return w2 * pdf(x, state.mu2, state.s2); });
      var mix = xs.map(function (x, k) { return c1[k] + c2[k]; });
      var par = xs.map(function (x) { return pdf(x, mu, sc); });
      var ymax = Math.max.apply(null, mix.concat(par)) * 1.1;
      function X(x) { return L + (x - X0) / (X1 - X0) * (Wd - L - R); }
      function Y(y) { return Tp + (1 - y / ymax) * (Ht - Tp - B); }
      var s = svg("svg", { viewBox: "0 0 " + Wd + " " + Ht, role: "img", "aria-label": "Two child Gaussians, their mixture, and the pooled parent Gaussian" });
      svg("line", { x1: L, x2: Wd - R, y1: Y(0), y2: Y(0), stroke: INK }, s);
      for (var k = -5; k <= 5; k++) {
        svg("line", { x1: X(k), x2: X(k), y1: Y(0), y2: Y(0) + 4, stroke: INK }, s);
        svg("text", { x: X(k), y: Y(0) + 17, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", text: k }, s);
      }
      function line(vals, color, width, dash) {
        svg("polyline", {
          points: xs.map(function (x, j) { return X(x) + "," + Y(vals[j]); }).join(" "),
          fill: "none", stroke: color, "stroke-width": width, "stroke-dasharray": dash || "none"
        }, s);
      }
      svg("polygon", { points: X(X0) + "," + Y(0) + " " + xs.map(function (x, j) { return X(x) + "," + Y(c1[j]); }).join(" ") + " " + X(X1) + "," + Y(0), fill: CORAL, opacity: 0.18 }, s);
      svg("polygon", { points: X(X0) + "," + Y(0) + " " + xs.map(function (x, j) { return X(x) + "," + Y(c2[j]); }).join(" ") + " " + X(X1) + "," + Y(0), fill: COBALT, opacity: 0.18 }, s);
      line(c1, CORAL, 2);
      line(c2, COBALT, 2);
      line(mix, INK, 1.5, "5 4");
      line(par, JADE, 3);
      svg("line", { x1: X(mu), x2: X(mu), y1: Tp, y2: Y(0), stroke: JADE, "stroke-dasharray": "3 3" }, s);
      svg("text", { x: X(mu) + 4, y: Tp + 10, "font-size": 11, fill: JADE, text: "μ_c" }, s);
      var chart = slot(fig, "chart");
      chart.innerHTML = "";
      chart.appendChild(s);

      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "Parent concept c" }));
      panel.appendChild(el("p", { class: "eqline", html:
        "μ<sub>c</sub> = " + fmt(w1) + "·" + fmt(state.mu1) + " + " + fmt(w2) + "·" + fmt(state.mu2) + " = <b>" + fmt(mu) + "</b>" }));
      panel.appendChild(Sim.distBlock("parent variance: within + between", [
        { label: "within", p: within, color: "#7c7366" },
        { label: "between", p: between, color: JADE }
      ], { max: Math.max(within + between, 0.5) }));
      panel.appendChild(el("p", { class: "eqline", html: "σ²<sub>c</sub> = " + fmt(within) + " + " + fmt(between) + " = <b>" + fmt(within + between) + "</b>" }));
      panel.appendChild(el("p", { class: "muted", text: "In the binary case of a deep taxonomic network, the parent mean is the interpolation λμ₁ + (1 − λ)μ₂ with λ = P(1 | c)." }));
    }
    render();
  }

  /* ---------- Figure 3: the mode-path taxonomy ---------- */

  function ladderFrom(t0) {
    var out = [];
    for (var t = t0; t <= 800; t += t < 300 ? 6 : 20) out.push(t);
    return out;
  }

  // Follow single-child chains down to the rung where a concept formed by merging, so the tree
  // shows only the levels at which the partition changes.
  function toTree(mode, rung0) {
    var node = mode;
    while (node.t !== rung0 && node.children.length === 1) node = node.children[0];
    var counts = {};
    node.members.forEach(function (i) { counts[DATA[i].group] = (counts[DATA[i].group] || 0) + 1; });
    var out = { lines: ["n=" + node.members.length, "t=" + node.t], counts: counts, n: node.members.length, children: [] };
    if (node.t !== rung0) out.children = node.children.map(function (c) { return toTree(c, rung0); });
    return out;
  }

  function figTaxonomy(fig) {
    var start = 100;
    function render() {
      var ladder = ladderFrom(start), prev = null, top = null;
      ladder.forEach(function (t) {
        var modes = M.modesAt(DATA, t, prev);
        modes.forEach(function (m) { m.t = t; });
        prev = modes;
        top = modes;
      });
      // above the last rung everything has merged; take the largest mode as the root
      var root = top.reduce(function (a, b) { return b.members.length > a.members.length ? b : a; });
      var tree = toTree(root, start);
      Sim.drawTree(slot(fig, "tree"), tree, {
        nodeW: 56, nodeH: 46, gapX: 8, gapY: 26, label: "Mode-path taxonomy of the toy data",
        drawNode: function (g, n, W, H) {
          svg("text", { x: W / 2, y: 15, "text-anchor": "middle", "font-size": 10, "font-weight": 600, fill: INK, text: n.lines[0] }, g);
          svg("text", { x: W / 2, y: 28, "text-anchor": "middle", "font-size": 9, fill: "#4a4339", text: n.lines[1] }, g);
          var x = 5;
          M.GROUPS.forEach(function (gr, k) {
            var w = (W - 10) * (n.counts[k] || 0) / n.n;
            if (w > 0) svg("rect", { x: x, y: H - 12, width: w, height: 7, fill: gr.color }, g);
            x += w;
          });
        }
      });
    }
    Sim.segmented(slot(fig, "start"), [60, 100, 150].map(function (v) { return { value: v, label: "t=" + v }; }), start, function (v) { start = v; render(); });
    slot(fig, "legend").innerHTML = M.GROUPS.map(function (g) {
      return '<span><i style="background:' + g.color + '"></i>group ' + g.name + "</span>";
    }).join("");
    render();
  }

  /* ---------- Figure 4: the basic level ---------- */

  function figBasic(fig) {
    var ladder = [];
    for (var t = 2; t <= 800; t += t < 100 ? 6 : t < 300 ? 12 : 30) ladder.push(t);

    function render(spread) {
      var pts = M.makeData({ seed: 7, spread: spread }), held = M.makeData({ seed: 99, per: 5, spread: spread });
      var rows = M.basicLevel(pts, held, ladder);
      var peak = rows.reduce(function (a, b) { return b.ll > a.ll ? b : a; });

      var Wd = 600, Ht = 300, L = 46, R = 14, Tp = 14, B = 40;
      var vals = [];
      rows.forEach(function (r) { vals.push(r.fit, r.spread, r.ll); });
      var lo = Math.floor(Math.min.apply(null, vals)), hi = Math.ceil(Math.max.apply(null, vals));
      function X(x) { return L + x / 800 * (Wd - L - R); }
      function Y(y) { return Tp + (hi - y) / (hi - lo) * (Ht - Tp - B); }
      var s = svg("svg", { viewBox: "0 0 " + Wd + " " + Ht, role: "img", "aria-label": "Held-out log-likelihood and its two terms against timestep" });
      for (var k = Math.ceil(lo); k <= Math.floor(hi); k++) {
        svg("line", { x1: L, x2: Wd - R, y1: Y(k), y2: Y(k), stroke: k === 0 ? INK : "#ddd0bb" }, s);
        svg("text", { x: L - 8, y: Y(k) + 4, "text-anchor": "end", "font-size": 11, fill: "#4a4339", text: k }, s);
      }
      [0, 200, 400, 600, 800].forEach(function (v) {
        svg("text", { x: X(v), y: Ht - B + 18, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", text: v }, s);
      });
      svg("text", { x: (L + Wd - R) / 2, y: Ht - 6, "text-anchor": "middle", "font-size": 11, fill: "#4a4339", text: "diffusion timestep t (coarser →)" }, s);
      svg("line", { x1: X(peak.t), x2: X(peak.t), y1: Tp, y2: Ht - B, stroke: INK, "stroke-dasharray": "4 4" }, s);
      svg("text", { x: X(peak.t) + 5, y: Tp + 10, "font-size": 11, fill: INK, text: "basic level t* = " + peak.t }, s);
      [["fit", CORAL, "6 4", 2], ["spread", COBALT, "6 4", 2], ["ll", JADE, "none", 3]].forEach(function (c) {
        svg("polyline", {
          points: rows.map(function (r) { return X(r.t) + "," + Y(r[c[0]]); }).join(" "),
          fill: "none", stroke: c[1], "stroke-dasharray": c[2], "stroke-width": c[3]
        }, s);
      });
      svg("circle", { cx: X(peak.t), cy: Y(peak.ll), r: 6, fill: "#ffe48a", stroke: INK, "stroke-width": 2 }, s);
      var chart = slot(fig, "chart");
      chart.innerHTML = "";
      chart.appendChild(s);
      chart.appendChild(el("div", { class: "line-legend", html:
        '<span><i style="border-color:' + CORAL + ';border-style:dashed"></i>fit term</span>' +
        '<span><i style="border-color:' + COBALT + ';border-style:dashed"></i>spread term</span>' +
        '<span><i style="border-color:' + JADE + ';border-width:3px"></i>total, mean log p(x | c)</span>' }));

      var first = rows[0], last = rows[rows.length - 1];
      var panel = slot(fig, "panel");
      panel.innerHTML = "";
      panel.appendChild(el("h4", { text: "Basic level at t* = " + peak.t }));
      panel.appendChild(el("p", { html: "At the peak the data hold <b>" + peak.k + "</b> modes, against " + DATA.length + " leaves and 1 root." }));
      panel.appendChild(el("p", { class: "eqline", html:
        "level &nbsp;&nbsp;fit &nbsp;&nbsp;spread &nbsp;total<br>" +
        "leaves " + fmt(first.fit) + " " + fmt(first.spread) + " " + fmt(first.ll) + "<br>" +
        "<b>t* &nbsp;&nbsp;&nbsp;" + fmt(peak.fit) + " " + fmt(peak.spread) + " " + fmt(peak.ll) + "</b><br>" +
        "root &nbsp;&nbsp;" + fmt(last.fit) + " " + fmt(last.spread) + " " + fmt(last.ll) }));
      panel.appendChild(el("p", { class: "muted", text: "Leaves fit held-out points poorly because each rests on one datum; the root pays for its breadth in the spread term. The paper finds the same interior peak at t ≈ 150 on MNIST and Fashion-MNIST." }));
    }

    var range = slot(fig, "spread"), out = slot(fig, "sout");
    range.addEventListener("input", function () { out.textContent = Number(range.value).toFixed(2); render(Number(range.value)); });
    render(0.22);
  }

  Sim.boot({ "fig-kde": figDensity, "fig-pool": figPooling, "fig-tax": figTaxonomy, "fig-basic": figBasic });
})();
