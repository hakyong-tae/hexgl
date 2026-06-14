# Context — HexGL

## What this is
HexGL is a **futuristic WebGL racing game** (WipEout-style anti-gravity racer) running
entirely in the browser. The player pilots a hovering ship around a 3D track at high speed,
steering, accelerating, and using left/right air-brakes to take corners.

## Origin & license
- Port of [BKcore/HexGL](https://github.com/BKcore/HexGL) by Thibaut Despoulain.
- **MIT licensed** (code + 3D models + textures). Audio is Public Domain / CC-BY 3.0.
- Commercial use, modification, and redistribution are all permitted — safe to monetize on Verse8.

## How it plays
1. Main menu → pick controls / quality / HUD.
2. Controls help screen → tap to continue.
3. Loading (async load of models, textures, audio).
4. Race: 3-lap time trial against a ghost replay, with a 3-2-1 countdown.
5. Results screen with finish time.

## Controls
- **Keyboard:** ← → steer, ↑ accelerate, A / D left/right air-brake.
- **Touch / device tilt / gamepad** also supported (mobile-friendly).

## Tech in one line
Three.js + a custom `bkcore` framework, WebGL rendering with a bloom/post-processing pipeline.
No build step required at runtime — pure static assets served from `public/`.
