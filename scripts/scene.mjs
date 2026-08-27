/**
 * Procedural scene renderer for the prototype's placeholder plates.
 *
 * Each "scene" is a small piece of generative art built from the same vocabulary
 * a photograph has — a background wash, depth planes, a subject silhouette, a
 * key light, bokeh, atmosphere. The point is not to fake a photo but to give
 * every slot on the page a frame with real structure, tonality and composition,
 * so the layout can be judged as a design rather than as a wall of grey boxes.
 *
 * Everything is deterministic: same seed in, same frame out.
 */

/* ── math helpers ──────────────────────────────────────────────────────── */
export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0 || 1e-6));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seeded value noise + fbm — used for ridgelines, foliage and atmosphere. */
function makeNoise(rnd) {
  const N = 256;
  const grid = new Float32Array(N * N);
  for (let i = 0; i < grid.length; i++) grid[i] = rnd();
  const at = (x, y) => grid[(y & (N - 1)) * N + (x & (N - 1))];
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return mix(
      mix(at(xi, yi), at(xi + 1, yi), u),
      mix(at(xi, yi + 1), at(xi + 1, yi + 1), u),
      v,
    );
  };
  const fbm = (x, y, oct = 4) => {
    let s = 0, amp = 0.5, f = 1;
    for (let i = 0; i < oct; i++) { s += noise(x * f, y * f) * amp; amp *= 0.5; f *= 2; }
    return s * 1.6;
  };
  return { noise, fbm };
}

/* ── shape helpers (normalised coords, aspect-corrected) ───────────────── */
const ellipse = (u, v, cx, cy, rx, ry, soft) => {
  const d = Math.hypot((u - cx) / rx, (v - cy) / ry);
  return 1 - smoothstep(1 - soft, 1 + soft, d);
};
const band = (t, pos, width, soft) =>
  smoothstep(pos - width - soft, pos - width, t) * (1 - smoothstep(pos + width, pos + width + soft, t));

/**
 * An out-of-focus foreground mass: a large ellipse whose centre sits outside the
 * frame, so only its lit edge crosses the picture. Reads as a form caught close
 * to the lens rather than as a drawn figure — the frames stay abstract on
 * purpose, which is what keeps them honest as placeholders.
 */
function mass(u, v, cx, cy, rx, ry, soft) {
  return ellipse(u, v, cx, cy, rx, ry, soft);
}

/* ── the scenes ────────────────────────────────────────────────────────── *
 * Every scene writes straight into a Float32 RGB buffer. Colours stay in
 * 0–255 float space until the very end so the light maths keeps its headroom.
 */
export function renderScene({ scene = 'portrait', seed = 1, palette }, W, H) {
  const rnd = mulberry32(seed);
  const { fbm } = makeNoise(mulberry32(seed ^ 0x9e3779b9));
  const P = palette;
  const dark = P.mood === 'dark';
  const buf = new Float32Array(W * H * 3);
  const ar = W / H;

  const base = P.base, leak = P.leak;
  const b0 = P.blobs[0], b1 = P.blobs[1], b2 = P.blobs[2];

  /* Scene-level randomised parameters, drawn once so the pixel loop stays cheap. */
  const keyX = rnd() < 0.5 ? 0.22 + rnd() * 0.12 : 0.66 + rnd() * 0.12;
  const keyY = 0.18 + rnd() * 0.3;
  const subjX = keyX < 0.5 ? 0.56 + rnd() * 0.12 : 0.32 + rnd() * 0.12;
  const horizon = 0.46 + rnd() * 0.14;

  const bokehCount = { event: 16, couple: 11, still: 14, family: 8, portrait: 5, business: 4, arch: 0, landscape: 0 }[scene] ?? 6;
  const bokeh = [];
  for (let i = 0; i < bokehCount; i++) {
    bokeh.push({
      x: rnd(), y: rnd() * (scene === 'event' ? 0.8 : 1),
      r: 0.018 + rnd() * (scene === 'still' ? 0.09 : 0.055),
      a: 0.12 + rnd() * 0.5,
      warm: rnd(),
    });
  }

  const beams = [];
  if (scene === 'event') {
    for (let i = 0; i < 4 + Math.floor(rnd() * 2); i++) {
      beams.push({ x: rnd(), w: 0.02 + rnd() * 0.05, tilt: (rnd() - 0.5) * 0.7, a: 0.25 + rnd() * 0.6 });
    }
  }

  const ridges = [];
  if (scene === 'landscape' || scene === 'family') {
    for (let i = 0; i < 4; i++) {
      ridges.push({ top: horizon - 0.1 + i * 0.035, amp: 0.075 - i * 0.014, f: 1.1 + i * 0.9, off: rnd() * 40, k: 0.25 + i * 0.22 });
    }
  }

  const planes = [];
  if (scene === 'arch' || scene === 'business') {
    for (let i = 0; i < 3; i++) {
      planes.push({ x0: rnd() * 0.8, w: 0.08 + rnd() * 0.24, k: (rnd() - 0.5) * 0.5, tilt: (rnd() - 0.5) * 0.18 });
    }
  }
  const winX = 0.1 + rnd() * 0.55, winY = 0.08 + rnd() * 0.3, winW = 0.1 + rnd() * 0.14, winH = 0.2 + rnd() * 0.3;

  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      const uc = (u - 0.5) * ar + 0.5;      // aspect-corrected horizontal
      let r, g, b;

      /* ── background wash, shared by every scene ── */
      const gradT = smoothstep(0, 1, v * 0.75 + u * 0.25);
      r = mix(b0[0], base[0], gradT);
      g = mix(b0[1], base[1], gradT);
      b = mix(b0[2], base[2], gradT);

      switch (scene) {
        /* ── open landscape: sky, layered ridges, water ── */
        case 'landscape': {
          const skyT = smoothstep(0, horizon, v);
          const topR = mix(b1[0], base[0], 0.35), topG = mix(b1[1], base[1], 0.35), topB = mix(b1[2], base[2], 0.35);
          const horR = mix(base[0], leak[0], 0.7), horG = mix(base[1], leak[1], 0.62), horB = mix(base[2], leak[2], 0.5);
          r = mix(topR, horR, Math.pow(skyT, 1.5));
          g = mix(topG, horG, Math.pow(skyT, 1.5));
          b = mix(topB, horB, Math.pow(skyT, 1.5));

          // sun / haze core just above the horizon
          const sd = Math.hypot((u - keyX) * ar, (v - (horizon - 0.03)) * 1.6);
          const sun = Math.exp(-(sd * sd) / 0.055) * 0.9 + Math.exp(-(sd * sd) / 0.32) * 0.26;
          r += (leak[0] - r) * clamp(sun);
          g += (leak[1] - g) * clamp(sun) * 0.92;
          b += (leak[2] - b) * clamp(sun) * 0.8;

          const water = 0.78 + Math.sin(u * 3 + seed) * 0.006;
          for (const rg of ridges) {
            const yr = rg.top + rg.amp * (fbm(u * rg.f * 3 + rg.off, rg.off) - 0.5) * 2;
            const inside = smoothstep(yr, yr + 0.004, v) * (1 - smoothstep(water - 0.01, water, v));
            if (inside > 0) {
              const rr = mix(r, base[0] * 0.42, rg.k), gg = mix(g, base[1] * 0.42, rg.k), bb = mix(b, base[2] * 0.46, rg.k);
              r = mix(r, rr, inside); g = mix(g, gg, inside); b = mix(b, bb, inside);
              const rim = Math.exp(-((v - yr) ** 2) / 0.00004) * 0.5 * (1 - rg.k);
              r += leak[0] * rim * 0.35; g += leak[1] * rim * 0.3; b += leak[2] * rim * 0.22;
            }
          }

          const inWater = smoothstep(water, water + 0.006, v);
          if (inWater > 0) {
            const glitter = Math.exp(-(((u - keyX) * ar) ** 2) / 0.02) * (0.35 + 0.65 * Math.abs(Math.sin(v * 260 + fbm(u * 8, v * 40) * 6)));
            const streak = 0.5 + 0.5 * Math.sin(v * 150 + fbm(u * 3, v * 20) * 8);
            const wr = mix(base[0] * 0.5, leak[0], glitter * 0.5) * (0.85 + streak * 0.2);
            const wg = mix(base[1] * 0.5, leak[1], glitter * 0.45) * (0.85 + streak * 0.2);
            const wb = mix(base[2] * 0.58, leak[2], glitter * 0.35) * (0.85 + streak * 0.2);
            r = mix(r, wr, inWater); g = mix(g, wg, inWater); b = mix(b, wb, inWater);
          }
          break;
        }

        /* ── studio portrait: falloff background, key glow, rim-lit figure ── */
        case 'portrait':
        case 'couple':
        case 'business': {
          const fall = 1 - smoothstep(0, 0.9, Math.hypot((u - keyX) * ar * 0.85, (v - keyY) * 0.85));
          const glow = Math.pow(fall, 1.7) * (dark ? 0.95 : 0.55);
          r = mix(r * (dark ? 0.5 : 0.9), mix(r, leak[0], 0.6), glow);
          g = mix(g * (dark ? 0.5 : 0.9), mix(g, leak[1], 0.54), glow);
          b = mix(b * (dark ? 0.54 : 0.93), mix(b, leak[2], 0.44), glow);

          if (scene === 'business') {
            for (const p of planes) {
              const edge = p.x0 + p.tilt * v;
              const inside = band(u, edge + p.w / 2, p.w / 2, 0.02);
              r = mix(r, r * (1 + p.k * 0.4), inside);
              g = mix(g, g * (1 + p.k * 0.4), inside);
              b = mix(b, b * (1 + p.k * 0.4), inside);
            }
            const win = band(u, winX + winW / 2, winW / 2, 0.03) * band(v, winY + winH / 2, winH / 2, 0.05);
            r += (leak[0] - r) * win * 0.5; g += (leak[1] - g) * win * 0.45; b += (leak[2] - b) * win * 0.36;
          }

          // one or two soft foreground forms, entering from the lower edge
          const forms = scene === 'couple'
            ? [{ x: subjX - 0.3, y: 1.18, rx: 0.3, ry: 0.5 }, { x: subjX + 0.22, y: 1.44, rx: 0.46, ry: 0.76 }]
            : [{ x: keyX < 0.5 ? subjX + 0.2 : subjX - 0.2, y: 1.32, rx: 0.52, ry: 0.78 }];

          for (const f of forms) {
            const a = mass(u, v, f.x, f.y, f.rx, f.ry, 0.09);
            if (a > 0.001) {
              const sr = base[0] * (dark ? 0.16 : 0.38), sg = base[1] * (dark ? 0.16 : 0.38), sb = base[2] * (dark ? 0.2 : 0.42);
              const dir = keyX < 0.5 ? -1 : 1;
              const a2 = mass(u - dir * 0.022, v - 0.018, f.x, f.y, f.rx, f.ry, 0.09);
              const rim = clamp(a - a2) * (dark ? 2.4 : 1.3);
              r = mix(r, sr, a); g = mix(g, sg, a); b = mix(b, sb, a);
              r += leak[0] * rim * 0.8; g += leak[1] * rim * 0.72; b += leak[2] * rim * 0.52;
            }
          }
          break;
        }

        /* ── architecture: planes, hard light, a window and its spill ── */
        case 'arch': {
          const wall = mix(0.9, 1.12, smoothstep(0, 1, u * 0.7 + (1 - v) * 0.3));
          r *= wall; g *= wall; b *= wall;

          for (const p of planes) {
            const e0 = p.x0 + p.tilt * v, e1 = e0 + p.w;
            const inside = smoothstep(e0, e0 + 0.006, u) * (1 - smoothstep(e1, e1 + 0.006, u));
            const k = 1 + p.k * 0.95;
            r = mix(r, r * k, inside); g = mix(g, g * k, inside); b = mix(b, b * k, inside);
          }

          // floor / ceiling edge in perspective
          const floorY = 0.72 + (u - 0.5) * 0.14;
          const onFloor = smoothstep(floorY, floorY + 0.008, v);
          r = mix(r, r * 0.6, onFloor); g = mix(g, g * 0.6, onFloor); b = mix(b, b * 0.63, onFloor);

          const win = band(u, winX + winW / 2, winW / 2, 0.006) * band(v, winY + winH / 2, winH / 2, 0.008);
          r += (leak[0] - r) * win * 0.85; g += (leak[1] - g) * win * 0.82; b += (leak[2] - b) * win * 0.75;

          // light spilling from the window across the floor
          const spill = Math.exp(-(((u - (winX + winW / 2)) * 1.4) ** 2) / 0.06) * onFloor * 0.5;
          r += leak[0] * spill * 0.28; g += leak[1] * spill * 0.26; b += leak[2] * spill * 0.2;

          // hard diagonal shadow
          const sh = smoothstep(0, 0.02, v - (0.2 + u * 0.55));
          r *= mix(1, 0.58, sh); g *= mix(1, 0.58, sh); b *= mix(1, 0.62, sh);
          break;
        }

        /* ── stage: beams from above, bokeh, a crowd line ── */
        case 'event': {
          r *= 0.35; g *= 0.35; b *= 0.4;
          for (const bm of beams) {
            const cx = bm.x + bm.tilt * v;
            const w = bm.w * (0.35 + v * 1.6);
            const inside = Math.exp(-(((u - cx) / w) ** 2)) * bm.a * (1 - smoothstep(0.35, 1.05, v));
            r += leak[0] * inside * 0.5; g += leak[1] * inside * 0.45; b += leak[2] * inside * 0.38;
          }
          const floorFade = smoothstep(0.6, 1, v) * 0.85;
          r = mix(r, base[0] * 0.1, floorFade); g = mix(g, base[1] * 0.1, floorFade); b = mix(b, base[2] * 0.13, floorFade);
          break;
        }

        /* ── outdoors: meadow, low sun, a foliage frame, small figures ── */
        case 'family': {
          const skyT = smoothstep(0, horizon, v);
          r = mix(mix(b1[0], base[0], 0.3), mix(base[0], leak[0], 0.55), Math.pow(skyT, 1.4));
          g = mix(mix(b1[1], base[1], 0.3), mix(base[1], leak[1], 0.5), Math.pow(skyT, 1.4));
          b = mix(mix(b1[2], base[2], 0.3), mix(base[2], leak[2], 0.4), Math.pow(skyT, 1.4));

          const sd = Math.hypot((u - keyX) * ar, (v - (horizon - 0.06)) * 1.5);
          const sun = Math.exp(-(sd * sd) / 0.05) * 0.8;
          r += (leak[0] - r) * sun; g += (leak[1] - g) * sun * 0.9; b += (leak[2] - b) * sun * 0.7;

          const ground = smoothstep(horizon, horizon + 0.02, v);
          if (ground > 0) {
            const tex = fbm(u * 9, v * 22, 3);
            const gr = base[0] * (0.5 + tex * 0.5), gg = base[1] * (0.62 + tex * 0.5), gb = base[2] * (0.42 + tex * 0.45);
            r = mix(r, gr, ground); g = mix(g, gg, ground); b = mix(b, gb, ground);
          }

          // a soft form drifting in from the lower corner, close to the lens
          const near = mass(u, v, subjX + 0.34, 1.3, 0.4, 0.5, 0.16);
          r = mix(r, base[0] * 0.24, near * 0.8); g = mix(g, base[1] * 0.26, near * 0.8); b = mix(b, base[2] * 0.24, near * 0.8);

          // blurred foliage framing the top corners
          const fol = clamp((fbm(u * 3.4 + 11, v * 4.2 + 7, 4) - 0.42) * 3) * (1 - smoothstep(0.1, 0.42, v));
          r = mix(r, base[0] * 0.2, fol * 0.85); g = mix(g, base[1] * 0.24, fol * 0.85); b = mix(b, base[2] * 0.2, fol * 0.85);
          break;
        }

        /* ── still life / macro: one soft edge, everything else falls away ── */
        default: {
          const edge = smoothstep(0, 0.14, v - (0.28 + u * 0.42));
          r = mix(r * 1.08, r * 0.62, edge); g = mix(g * 1.06, g * 0.62, edge); b = mix(b * 1.04, b * 0.66, edge);
          const hot = Math.exp(-(Math.hypot((u - keyX) * ar, v - keyY) ** 2) / 0.05) * 0.7;
          r += (leak[0] - r) * hot * 0.5; g += (leak[1] - g) * hot * 0.45; b += (leak[2] - b) * hot * 0.35;
          break;
        }
      }

      /* ── bokeh, shared: soft discs with a slightly brighter edge ── */
      for (const k of bokeh) {
        const d = Math.hypot((u - k.x) * ar, v - k.y) / k.r;
        if (d < 1.25) {
          const core = 1 - smoothstep(0.72, 1, d);
          const ring = Math.exp(-((d - 0.86) ** 2) / 0.012) * 0.6;
          const a = (core * 0.8 + ring) * k.a * (dark ? 1 : 0.45);
          const cr = mix(leak[0], b2[0], k.warm), cg = mix(leak[1], b2[1], k.warm), cb = mix(leak[2], b2[2], k.warm);
          r += (cr - r) * clamp(a); g += (cg - g) * clamp(a); b += (cb - b) * clamp(a);
        }
      }

      /* ── atmosphere: cool shadows / warm highlights, then vignette ── */
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const split = (lum - 0.5) * 2;
      r += split * 6; b -= split * 5;

      const dx = (uc - 0.5) * 2, dy = (v - 0.5) * 2;
      const open = scene === 'landscape' || scene === 'family';   // open frames keep their corners
      const vig = 1 - (dark ? 0.4 : 0.26) * (open ? 0.5 : 1) * Math.pow((dx * dx + dy * dy) / 2, 2);
      r *= vig; g *= vig; b *= vig;

      const o = (y * W + x) * 3;
      buf[o] = r; buf[o + 1] = g; buf[o + 2] = b;
    }
  }

  const out = Buffer.allocUnsafe(W * H * 3);
  for (let i = 0; i < buf.length; i++) out[i] = clamp(buf[i], 0, 255);
  return out;
}
