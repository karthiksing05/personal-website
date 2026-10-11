/*
  Exact diffusion quantities for a toy 2-D dataset. With finitely many data points, the noisy
  marginal p_t is a Gaussian kernel density (Eq. 7 of Wang et al., 2026), so its score, its
  modes, and their Tweedie prototypes have closed forms and need no learned network.

  Everything is expressed in data space: the marginal at timestep t, rescaled by sqrt(abar_t),
  is a kernel density over the data with bandwidth h_t = sqrt((1 - abar_t) / abar_t), the
  inverse square root of the signal-to-noise ratio. A mode of that density, found by score
  ascent, is the Tweedie prototype m_c = x_t* / sqrt(abar_t).
*/
(function (root) {
  "use strict";

  var T = 1000;

  // cosine schedule (Nichol & Dhariwal, 2021)
  function abar(t) {
    var s = 0.008;
    var f = function (u) { var c = Math.cos(((u / T) + s) / (1 + s) * Math.PI / 2); return c * c; };
    return Math.max(1e-6, f(t) / f(0));
  }
  function bandwidth(t) { var a = abar(t); return Math.sqrt((1 - a) / a); }
  function snr(t) { var a = abar(t); return a / (1 - a); }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var x = Math.imul(a ^ (a >>> 15), a | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rand) {
    var u = Math.max(1e-12, rand()), v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Three superordinate groups, each with two or three subgroups: a small taxonomy whose
  // levels a kernel density should recover as its bandwidth grows. `spread` scales the
  // within-subgroup scatter.
  var GROUPS = [
    { name: "A", color: "#e8452c", subs: [[-2.3, 1.5], [-1.4, 2.1], [-2.0, 0.6]] },
    { name: "B", color: "#2d55d8", subs: [[1.7, 1.8], [2.5, 1.1]] },
    { name: "C", color: "#0f8a5f", subs: [[0.1, -1.7], [0.9, -2.3], [-0.7, -2.2]] }
  ];

  function makeData(opts) {
    opts = opts || {};
    var rand = rng(opts.seed || 7), spread = opts.spread == null ? 0.22 : opts.spread;
    var per = opts.per || 7, pts = [];
    GROUPS.forEach(function (g, gi) {
      g.subs.forEach(function (c, si) {
        for (var k = 0; k < per; k++) {
          pts.push({ x: c[0] + spread * gauss(rand), y: c[1] + spread * gauss(rand), group: gi, sub: si });
        }
      });
    });
    return pts;
  }

  // log of the kernel density at (x, y), up to the constant -log N
  function logDensity(pts, h, x, y) {
    var m = -Infinity, terms = new Array(pts.length);
    for (var i = 0; i < pts.length; i++) {
      var dx = x - pts[i].x, dy = y - pts[i].y;
      terms[i] = -(dx * dx + dy * dy) / (2 * h * h);
      if (terms[i] > m) m = terms[i];
    }
    var z = 0;
    for (i = 0; i < pts.length; i++) z += Math.exp(terms[i] - m);
    return m + Math.log(z) - Math.log(2 * Math.PI * h * h);
  }

  // Score ascent with step eta = h^2. On a Gaussian kernel density this step size turns the
  // update x <- x + eta * score(x) into the mean-shift fixed-point iteration, which converges
  // to a mode without overshooting. Returns the path when `trace` is set.
  function ascend(pts, h, x, y, trace) {
    var path = trace ? [[x, y]] : null;
    for (var it = 0; it < 400; it++) {
      var sw = 0, sx = 0, sy = 0, m = -Infinity, w = new Array(pts.length);
      for (var i = 0; i < pts.length; i++) {
        var dx = x - pts[i].x, dy = y - pts[i].y;
        w[i] = -(dx * dx + dy * dy) / (2 * h * h);
        if (w[i] > m) m = w[i];
      }
      for (i = 0; i < pts.length; i++) {
        var e = Math.exp(w[i] - m);
        sw += e; sx += e * pts[i].x; sy += e * pts[i].y;
      }
      var nx = sx / sw, ny = sy / sw;
      var moved = Math.hypot(nx - x, ny - y);
      x = nx; y = ny;
      if (trace) path.push([x, y]);
      if (moved < 1e-5 * Math.max(1, h)) break;
    }
    return { x: x, y: y, path: path };
  }

  // Modes at timestep t: ascend from every datum and pool endpoints that land together.
  // Each mode records its members and their mean and per-axis variance.
  function modesAt(pts, t, from) {
    var h = bandwidth(t), tol = Math.max(0.02, 0.15 * h);
    var starts = from || pts.map(function (p, i) { return { x: p.x, y: p.y, members: [i] }; });
    var modes = [];
    starts.forEach(function (s) {
      var end = ascend(pts, h, s.x, s.y);
      var hit = null;
      for (var k = 0; k < modes.length; k++) {
        if (Math.hypot(modes[k].x - end.x, modes[k].y - end.y) < tol) { hit = modes[k]; break; }
      }
      if (!hit) { hit = { x: end.x, y: end.y, members: [], children: [] }; modes.push(hit); }
      hit.members = hit.members.concat(s.members);
      hit.children.push(s);
    });
    modes.forEach(function (m) { summarize(pts, m); });
    return modes;
  }

  function summarize(pts, m) {
    var n = m.members.length, mx = 0, my = 0, vx = 0, vy = 0;
    m.members.forEach(function (i) { mx += pts[i].x; my += pts[i].y; });
    mx /= n; my /= n;
    m.members.forEach(function (i) { vx += Math.pow(pts[i].x - mx, 2); vy += Math.pow(pts[i].y - my, 2); });
    m.mean = [mx, my];
    m.var = [vx / n, vy / n];
    var counts = {};
    m.members.forEach(function (i) { counts[pts[i].group] = (counts[pts[i].group] || 0) + 1; });
    m.groups = counts;
  }

  // The bottom-up "mode-path" taxonomy: modes at each rung of a noise ladder are seeded with
  // the modes of the rung below, so every coarse mode is the parent of the finer modes that
  // flow into it. Rungs whose mode count does not change are skipped.
  function taxonomy(pts, ladder) {
    var levels = [], prev = null;
    ladder.forEach(function (t) {
      var modes = modesAt(pts, t, prev);
      if (!prev || modes.length < prev.length) levels.push({ t: t, modes: modes });
      else levels[levels.length - 1].modes = modes.map(function (m) { return m; });
      prev = modes;
    });
    return levels;
  }

  // Basic-level curve (Eqs. 14-16): assign each held-out point to the mode its ascent reaches
  // at t, and score it under that concept's diagonal Gaussian. The fit term rewards a centroid
  // close to the point relative to its spread; the spread term rewards compact concepts.
  // Variances are floored so a single-member concept is not a spike.
  function basicLevel(pts, heldOut, ladder, floor) {
    floor = floor || 0.002;
    return ladder.map(function (t) {
      var modes = modesAt(pts, t), h = bandwidth(t);
      var fit = 0, spread = 0;
      heldOut.forEach(function (q) {
        var end = ascend(pts, h, q.x, q.y), best = null, bd = Infinity;
        modes.forEach(function (m) {
          var d = Math.hypot(m.x - end.x, m.y - end.y);
          if (d < bd) { bd = d; best = m; }
        });
        [0, 1].forEach(function (k) {
          var v = best.var[k] + floor;
          var diff = (k ? q.y : q.x) - best.mean[k];
          fit += -0.5 * diff * diff / v;
          spread += -0.5 * Math.log(2 * Math.PI * v);
        });
      });
      var n = heldOut.length;
      return { t: t, k: modes.length, fit: fit / n, spread: spread / n, ll: (fit + spread) / n };
    });
  }

  var api = {
    T: T, abar: abar, bandwidth: bandwidth, snr: snr, rng: rng, GROUPS: GROUPS,
    makeData: makeData, logDensity: logDensity, ascend: ascend, modesAt: modesAt,
    taxonomy: taxonomy, basicLevel: basicLevel
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DiffusionToy = api;
})(this);
