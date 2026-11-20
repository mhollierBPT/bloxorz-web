# CLAUDE.md

## Runtime model (index.html + bloxorz.js)
- Ticker runs at display rate (`RAF`); every MovieClip advances by elapsed time at 36fps (index.html patches `MovieClip.prototype.advance`). New Ticker "tick" code must count `evt.delta / (1000/36)` (see `frames()` in bloxorz.js), never ticks.
- `render-cache.js` bitmaps only layers flagged `renderCacheable` (set in `World()`); caches are full-canvas, so don't flag cheap layers.
- Set `createjs.Sound.volume` only after `createjs.Sound.initializeDefaultPlugins()`; otherwise it's recorded but never applied (sound plays while "muted").
- Load: atlas + scripts first (6 connections, 120s timeout; PreloadJS defaults are 1 and 8s), then sounds in `loadSounds()`.
- Tile's colour-filtered children use `sharedCache()`; don't call `cache()` on them per instance (~8ms each, froze level builds).
- Atlas is lossless WebP (`images/bloxorz_atlas_.webp`); verify any re-encode is pixel-identical with PIL.
- Game opens directly on the menu (root `frame_0`: `stage.doneIntro = true; gotoAndStop(1)`).

## Testing in Chrome (chrome-devtools MCP)
- Serve: `python -m http.server 8765 --bind 127.0.0.1`; it's slow, so compare builds side by side (baseline via `git worktree add --detach <scratch> HEAD` on another port), never absolute times.
- Cold loads: `navigate_page` type `reload` with `ignoreCache: true` (a `url` navigation can hit cache).
- Drive the game: `stage.levelNumber = N; exportRoot.gotoAndStop("game")`, `stage.triggerKeyDown/Up({code:"ArrowUp"})`, current level `window.__lastWorld`.
- Pixel compare: `stage.tickOnUpdate = false; stage.update()`; `stage.draw()` doesn't clear the canvas and gives false diffs.
- Give in-page wait loops a timeout; an unbounded one hangs the DevTools protocol call.
