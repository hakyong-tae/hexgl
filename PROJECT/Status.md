# Status — HexGL

## Current state: ✅ Playable & build-ready

- [x] Game runs end-to-end via Vite (`npm run dev`, port 3017): menu → controls → loading → race → results.
- [x] All assets load (libs, bkcore, geometries, textures.full, audio) — no console errors, no 404s.
- [x] `npm run build` succeeds; `dist/` contains all assets with relative paths (subpath-host safe).
- [x] Legacy cruft removed (Google Analytics, FB/og absolute URLs, Firefox-OS manifests, appcache).
- [x] License preserved (MIT) + audio credits documented.
- [x] Pushed to GitHub: https://github.com/hakyong-tae/hexgl (public).

## Known / by-design
- `vite build` prints "can't be bundled without type=module" warnings for the classic
  `<script>` tags — expected, not an error (see Structure.md).
- Default quality is **VERY HIGH**, which loads `textures.full/` (~10 MB). Lower quality
  options use `textures/`. Consider defaulting lower if load time on Verse8 matters.
- Single track (Cityscape), single-player time trial vs ghost. No online multiplayer.

## Not yet done (optional, future)
- [ ] Deploy to Verse8 (needs Verse8 project + GitLab repo — see Requirements.md).
- [ ] Optional: Verse8 leaderboard via `@agent8/gameserver` (submit best lap time).
- [ ] Optional: default-quality / loading-screen tuning for faster first load.
