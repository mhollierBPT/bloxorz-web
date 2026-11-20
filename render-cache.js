// Static-layer render cache.
//
// Every frame CreateJS redraws the whole level as vectors (~90 tiles, the
// background, the pause menu), although between moves almost nothing changes.
// This watches a set of containers and, once one has stayed identical for a
// few ticks, caches it to a bitmap at device resolution (so it stays sharp).
// The moment anything inside it changes (a timeline frame, a position, alpha,
// visibility, a child added or removed) the cache is dropped and it is drawn
// live again, so animations look exactly as before.
(function () {
	"use strict";

	var STABLE_TICKS = 3;

	// Writes the state of a subtree into sig[] starting at i and returns the
	// new length; sets sig.dirty when a value differs from the previous tick.
	function walk(o, sig, i) {
		i = put(sig, i, o.id);
		i = put(sig, i, o.currentFrame == null ? -1 : o.currentFrame);
		i = put(sig, i, o.x);
		i = put(sig, i, o.y);
		i = put(sig, i, o.scaleX);
		i = put(sig, i, o.scaleY);
		i = put(sig, i, o.rotation);
		i = put(sig, i, o.skewX);
		i = put(sig, i, o.skewY);
		i = put(sig, i, o.alpha);
		i = put(sig, i, o.visible ? 1 : 0);
		i = put(sig, i, o.regX);
		i = put(sig, i, o.regY);
		i = put(sig, i, o.mask ? o.mask.id : -1);
		if (o.graphics) {
			i = put(sig, i, o.graphics._instructions ? o.graphics._instructions.length : 0);
			i = put(sig, i, o.graphics._activeInstructions ? o.graphics._activeInstructions.length : 0);
		}
		var kids = o.children;
		if (kids) {
			i = put(sig, i, kids.length);
			for (var k = 0; k < kids.length; k++) {
				i = walk(kids[k], sig, i);
			}
		}
		return i;
	}

	function put(sig, i, v) {
		if (sig[i] !== v) {
			sig[i] = v;
			sig.dirty = true;
		}
		return i + 1;
	}

	// Drop the cache but keep its canvas in st, so re-caching reuses it instead
	// of allocating another full-screen bitmap after every move.
	function uncache(o, st) {
		if (o.cacheCanvas) {
			st.canvas = o.cacheCanvas;
			o.uncache();
		}
	}

	// Cache o so one cache pixel maps onto one canvas pixel over the visible area.
	function cacheAtDeviceResolution(o, st, canvas) {
		var m = o.getConcatenatedMatrix();
		var scale = Math.sqrt(m.a * m.a + m.b * m.b);
		if (!scale || m.b || m.c) {
			return; // rotated or degenerate: leave it drawn live
		}
		var inv = m.clone().invert();
		var tl = inv.transformPoint(0, 0);
		var br = inv.transformPoint(canvas.width, canvas.height);
		o.cacheCanvas = st.canvas || null;
		o.cache(tl.x, tl.y, br.x - tl.x, br.y - tl.y, scale);
	}

	window.renderCache = {
		// Call once per tick, before stage.update(). Of the given display
		// objects, only those flagged renderCacheable are managed: each cache
		// is a full-canvas bitmap, so it is reserved for layers that are
		// expensive to draw.
		update: function (stage, layers) {
			var canvas = stage.canvas;
			for (var n = 0; n < layers.length; n++) {
				var o = layers[n];
				if (!o || !o.renderCacheable) continue;
				var st = o.__rc || (o.__rc = { sig: [], stable: 0, canvas: null });
				var sig = st.sig;
				sig.dirty = false;
				var i = put(sig, 0, canvas.width);
				i = put(sig, i, canvas.height);
				i = put(sig, i, stage.scaleX);
				i = walk(o, sig, i);
				if (sig.length !== i) {
					sig.length = i;
					sig.dirty = true;
				}
				if (sig.dirty || !o.visible || !o.parent) {
					st.stable = 0;
					uncache(o, st);
				} else if (++st.stable >= STABLE_TICKS && !o.cacheCanvas) {
					cacheAtDeviceResolution(o, st, canvas);
				}
			}
		}
	};
})();
