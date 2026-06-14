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
  function clone(name, overrides) {
    var base = bkcore.hexgl.tracks.Cityscape;
    var v = {};
    for (var k in base) v[k] = base[k]; // copy methods + fields by reference
    // give each variant its own mutable state so they don't share with base
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

  // --- Reverse: same track driven the other way ---------------------------
  // Lap counts on (prev == last && cp == start). Forward order is 0->1->2->0
  // (start=0, last=2). Driving in reverse the order is 0->2->1->0, so the
  // checkpoint just before the finish line becomes 1 -> last = 1.
  // Spawn at the start line rotated ~180deg about Y (reset() reads rotation as
  // quaternion x,y,z with w=1, so a large y component approximates a half turn).
  bkcore.hexgl.tracks.CityscapeReverse = clone('CityscapeReverse', {
    checkpoints: { list: [0, 1, 2], start: 0, last: 1 },
    spawnRotation: { x: 0, y: 100000, z: 0 }
  });
})();
