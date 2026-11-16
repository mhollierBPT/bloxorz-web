# Bloxorz (self-hosted HTML5, `bloxorz-web`)

The classic block-rolling puzzle — roll the 2×1 block across the tiled platforms,
over the gaps, past the switches and bridges, and drop it into the goal hole.
33 hand-crafted stages, with saved progress (per-browser) and a stage loader.

This is the **HTML5 build of Bloxorz as served by [Cool Math Games](https://www.coolmathgames.com/0-bloxorz)**
(an Adobe Animate / CreateJS port of the original 2009 Flash game by
[Mike Krahne](https://web.archive.org/web/2011*/http://www.bloxorz.com/)),
captured and self-hosted so it plays anywhere without Flash, plugins, CDNs,
analytics, or ad scripts.

## Play

Open [`index.html`](index.html) in any modern browser — or use the
[GitHub Pages build](https://mhollierBPT.github.io/bloxorz-web/).

- **Arrow keys / WASD** — roll the block
- **Space** — switch which block to control when a stage splits the block in two
- Everything scales to fit the window; works in iframes.

## Embed in a dashboard

```html
<iframe
  src="https://mhollierBPT.github.io/bloxorz-web/"
  style="width:100%; height:100%; border:0;"
  title="Bloxorz">
</iframe>
```

The page sends no `X-Frame-Options`/`frame-ancestors` headers, so it can be
iframed from any origin. Progress is stored in `localStorage` on the
`github.io` origin (one save slot per browser).

## What's in here

| Path | What it is |
|---|---|
| `index.html` | Cleaned-up launch page (responsive scaling from the original `/play` page, analytics/ads removed) |
| `bloxorz.js` | The game itself (Adobe Animate HTML5 export; only change: the manifest's jQuery entry now points at `lib/jquery-2.2.4.min.js`) |
| `images/bloxorz_atlas_.png` | Sprite atlas |
| `sounds/` | All 40 sound effects + background music |
| `components/` | Adobe Animate web-component helpers (text input, CSS link) used by the stage loader |
| `assets/styles.css` | Styling for the in-game stage loader |
| `lib/` | Pinned copies of CreateJS 2015.11.26 and jQuery 3.6.3 / 2.2.4 |
| `.nojekyll` | Makes GitHub Pages skip Jekyll — required so leading-underscore assets like `images/_preloader.gif` get published |

No network calls are made at runtime other than the files in this repo.

## Attribution

- Game: **Bloxorz** — originally a 2009 Flash game by Mike Krahne (bloxorz.com).
- This build: the HTML5 port hosted at coolmathgames.com
  (`/sites/default/files/public_games/48807/`, captured 2026-11-16).
- Engine: [CreateJS](https://createjs.com/) (MIT) and [jQuery](https://jquery.com/) (MIT), self-hosted at the versions the original page used.
