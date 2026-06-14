HexGL (Vite / Verse8 port)
==========================

A futuristic WebGL racing game. This repository is a **Vite-structured port** of
[HexGL](http://hexgl.bkcore.com) by [Thibaut Despoulain (BKcore)](http://bkcore.com),
prepared for offline play and deployment on [Verse8](https://verse8.io).

The original game code is unmodified in behavior — this port only restructures the
project for Vite (`index.html` at root, game files under `public/`) and removes
legacy tracking/Firefox-OS files. See [NOTES.md](NOTES.md) for the full structure analysis.

## Run

```bash
npm install
npm run dev      # http://localhost:3017
npm run build    # -> dist/
npm run preview
```

## License

Unless specified in the file, HexGL's code and resources are licensed under the **MIT License**
(see [LICENSE](LICENSE)). This permits commercial use, modification, and redistribution.

Audio files (`public/audio/`) are under Public Domain or Creative Commons BY 3.0 — see
[public/audio/LICENSE](public/audio/LICENSE).

## Credits

- **Concept & Development:** Thibaut Despoulain (BKcore)
- **HexMKI ship model:** Charnel
- **Track texture:** Nobiax
- **Audio:** IFartInUrGeneralDirection, qubodup, kangaroovindaloo, mu6k, beman87, Licson (see audio/LICENSE)
- **Original repository:** https://github.com/BKcore/HexGL
