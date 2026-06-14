/*
 * HexGL course variants (non-commercial).
 * Builds on bkcore.hexgl.tracks.Cityscape (CC BY-NC) — see Cityscape.js.
 *
 * Each variant is a shallow clone of Cityscape (inherits load/buildMaterials/
 * buildScenes) with its own fresh lib/materials/analyser and overridden config.
 */

var bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};
bkcore.hexgl.tracks = bkcore.hexgl.tracks || {};

(function () {
  var PIXEL_RATIO = 2048.0 / 6000.0; // Cityscape collision/height map scale

  function clone(name, overrides) {
    var base = bkcore.hexgl.tracks.Cityscape;
    var v = {};
    for (var k in base) v[k] = base[k]; // copy methods + fields by reference
    v.materials = {};
    v.lib = null;
    v.analyser = null;
    v.checkpoints = {
      list: base.checkpoints.list.slice(),
      start: base.checkpoints.start,
      last: base.checkpoints.last
    };
    v.spawn = { x: base.spawn.x, y: base.spawn.y, z: base.spawn.z };
    v.spawnRotation = { x: base.spawnRotation.x, y: base.spawnRotation.y, z: base.spawnRotation.z };
    v.name = name;
    if (overrides) for (var o in overrides) v[o] = overrides[o];
    return v;
  }

  // Scan the collision analyser for checkpoint pixels (track is r=g=255, the
  // checkpoint id is stored in the blue channel where b<250) and return the
  // world-space centroid of each checkpoint id. One-time, at load.
  // For each checkpoint id, return its world-space centroid plus the track
  // tangent. Checkpoints are stripes drawn ACROSS the track, so the stripe's
  // principal axis (largest pixel spread, via PCA) is the cross-track
  // direction; the track tangent is perpendicular to it.
  function analyseCheckpoints(analyser) {
    var px = analyser.pixels, W = px.width, H = px.height, data = px.data;
    var sum = {}; // id -> accumulators
    var step = 2; // subsample for speed
    for (var y = 0; y < H; y += step) {
      for (var x = 0; x < W; x += step) {
        var i = (y * W + x) * 4;
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] < 250) {
          var id = data[i + 2];
          var s = sum[id] || (sum[id] = { x: 0, z: 0, n: 0, xx: 0, zz: 0, xz: 0 });
          s.x += x; s.z += y; s.n++;
          s.xx += x * x; s.zz += y * y; s.xz += x * y;
        }
      }
    }
    function toWorld(pxc, pzc) {
      return { x: (pxc - W / 2) / PIXEL_RATIO, z: (pzc - H / 2) / PIXEL_RATIO };
    }
    var out = {};
    for (var id in sum) {
      var s = sum[id], n = s.n;
      var mx = s.x / n, mz = s.z / n;
      var a = s.xx / n - mx * mx, b = s.xz / n - mx * mz, c = s.zz / n - mz * mz; // covariance
      // dominant eigenvector (stripe long axis = cross-track direction)
      var lam = (a + c) / 2 + Math.sqrt(((a - c) / 2) * ((a - c) / 2) + b * b);
      var evx = b, evz = lam - a;
      if (Math.abs(evx) < 1e-9 && Math.abs(evz) < 1e-9) { evx = 1; evz = 0; }
      var el = Math.sqrt(evx * evx + evz * evz); evx /= el; evz /= el;
      var w = toWorld(mx, mz);
      w.crossX = evx; w.crossZ = evz;       // cross-track (stripe) direction
      w.tanX = -evz; w.tanZ = evx;          // tangent = perpendicular to stripe
      out[id] = w;
    }
    return out;
  }

  // --- Reverse: same track, driven the other way -------------------------
  // Forward checkpoint order is 0->1->2->0 (start=0, last=2). Reverse order is
  // 0->2->1->0, so the checkpoint just before the finish line is 1 -> last=1.
  // Spawn on the track at checkpoint 2 facing toward checkpoint 1 (the reverse
  // driving direction), computed from the collision map at load time.
  var Reverse = clone('CityscapeReverse', {
    checkpoints: { list: [0, 1, 2], start: 0, last: 1 }
  });
  Reverse.buildScenes = function (ctx, quality) {
    var analyser = this.lib.get('analysers', 'track.cityscape.collision');
    try {
      var c = analyseCheckpoints(analyser);
      if (c[2] && c[1]) {
        // Heading = track tangent at cp2, signed toward cp1 (the reverse direction).
        var tx = c[2].tanX, tz = c[2].tanZ;
        if (tx * (c[1].x - c[2].x) + tz * (c[1].z - c[2].z) < 0) { tx = -tx; tz = -tz; }
        var yaw = Math.atan2(tx, tz);                          // local +Z is ship forward
        this.spawn = { x: c[2].x, y: bkcore.hexgl.tracks.Cityscape.spawn.y, z: c[2].z };
        this.spawnRotation = { x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) };
        if (window.console) console.log('[Reverse] spawn', this.spawn, 'yaw', yaw, 'tan', tx.toFixed(2), tz.toFixed(2));
      }
    } catch (e) {
      if (window.console) console.warn('[Reverse] checkpoint scan failed', e);
    }
    bkcore.hexgl.tracks.Cityscape.buildScenes.call(this, ctx, quality);
  };
  bkcore.hexgl.tracks.CityscapeReverse = Reverse;
})();
