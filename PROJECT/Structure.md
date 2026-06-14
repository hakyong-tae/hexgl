# Structure — HexGL

## Project layout (Vite)
```
hexgl/
├── index.html          # Vite entry (root). Loads engine via classic <script> tags.
├── vite.config.js      # base:'./', publicDir:'public', port 3017
├── package.json        # type:module, dev/build/preview
├── PROJECT/            # Verse8 AI context docs (this folder)
├── NOTES.md            # full structure analysis
├── LICENSE / README.md
└── public/             # served at '/'; runtime XHR uses relative paths
    ├── launch.js               # bootstrap: WebGL detect → create HexGL instance
    ├── libs/                   # Three.js + postprocessing + Detector/Stats/DAT.GUI/Leap
    ├── bkcore.coffee/          # compiled controllers/, Timer, ImageData, Utils
    ├── bkcore/
    │   ├── threejs/            # RenderManager, Shaders, Particles, Loader
    │   ├── Audio.js
    │   └── hexgl/              # game core (see below)
    ├── geometries/             # 3D models: ships/ tracks/ booster/ bonus/
    ├── textures/  textures.full/   # standard / VERY HIGH textures (full = default)
    ├── audio/                  # bg/boost/crash/destroyed/wind .ogg
    └── replays/                # ghost data
```

## Game core (`public/bkcore/hexgl/`)
| File | Responsibility |
|---|---|
| `HexGL.js` | main game class — scene/state machine, loop |
| `Gameplay.js` | race logic (laps, timing, collisions) |
| `ShipControls.js` | ship physics + input |
| `ShipEffects.js` | booster / particle / motion-blur VFX |
| `CameraChase.js` | chase camera |
| `HUD.js` | speed/shield/lap HUD (canvas 2D) |
| `RaceData.js` | per-track race data |
| `tracks/Cityscape.js` | the Cityscape track (only track) |

## Key data-driven pieces
- `textures.full/tracks/cityscape/collision.png` — pixel-based track boundary map.
- `textures.full/tracks/cityscape/height.png` — track height map.
- `replays/` — ghost run data.

## Important note for the build
`index.html` uses **classic (non-module) `<script>` tags** that reference files in `public/`.
`vite build` emits warnings ("can't be bundled without type=module") — these are expected and
harmless; Vite copies `public/` verbatim into `dist/` and the relative paths resolve at runtime.
Do **not** convert these to ES modules.
