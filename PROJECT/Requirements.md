# Requirements — HexGL on Verse8

## Runtime requirements
- **WebGL** capable browser (desktop or mobile). `launch.js` detects WebGL and falls back
  to get.webgl.org if missing.
- Static file serving only — no server-side code, no special COOP/COEP headers
  (no SharedArrayBuffer / wasm threads).
- Assets are served from `public/` via relative paths; hosting under a subpath is fine
  because `vite.config.js` sets `base: './'`.

## Build / deploy
- Node + Vite. `npm install && npm run build` → `dist/`.
- `dist/` is fully self-contained and can be served by any static host.

## Verse8 deployment (one-way GitLab — see workflow memory §8/§9)
Verse8 provisions its own GitLab repo per project; deployment flows **only** from the
Verse8 agent's commits, not from external pushes. To deploy:
1. Create a developer project at https://create.verse8.io (provisions GitLab repo).
2. Clone `develop` from `gitlab.verse8.io/<user>/<repo>` with the oauth token.
3. Keep the repo's `.env` (`VITE_AGENT8_*`), `committedAt`, `.gitignore`; replace the
   React/TS template with these game files.
4. Keep `base: './'` + `publicDir: 'public'` in `vite.config.js`.
5. `npm install && npm run build` locally to verify, then push to `develop`.
6. First Verse8-agent prompt: "sync to latest develop commit, do NOT convert to React/TS,
   do NOT modify game logic, just build & deploy."
7. Set status to **Unlisted** initially; monetization activated after review.

## Do NOT
- Do not convert the classic `<script>` tags to ES modules.
- Do not delete `textures.full/` (it's the default quality assets).
- Do not re-add tracking/analytics scripts.

## Constraints
- License: MIT (code+assets) + PD/CC-BY 3.0 audio. Keep `LICENSE`, `public/audio/LICENSE`,
  and the credits in `README.md`. Attribution must remain.
