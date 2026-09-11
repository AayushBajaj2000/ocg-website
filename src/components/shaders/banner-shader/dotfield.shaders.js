/**
 * DotField — GLSL source.
 *
 * Pipeline, in one fragment pass:
 *
 *   1. SOURCE   a slow drifting gradient + two fbm octaves, plus a soft lobe
 *               that follows the pointer. Grayscale, roughly 0..1.
 *   2. SMEAR    the sample coordinate is pixel-quantised 16 times over, each
 *               octave on its own grid size and grid offset, then averaged with
 *               exponential weights. Averaging *coordinates* rather than colours
 *               is what produces the rectangular smears: each octave lands on a
 *               different block edge and the blend drags them into each other.
 *               The coarsest octave quantises into cells about a third of the
 *               short side, which is where the large rectangles come from. The
 *               offsets sway on a slow sine so the blocks keep reorganising.
 *   3. DITHER   4-level ordered Bayer at 1 bit. Coverage carries the tone, not
 *               dot size — that is what makes it read as a data plot rather
 *               than a halftone print. The matrix origin steps once a second on
 *               a golden-ratio offset so the grid never locks.
 *   4. TINT     the surviving bits take the neutral, or the accent near the
 *               pointer.
 *
 * No textures, no buffers, no ping-pong. One full-screen triangle.
 */

export const VERT = /* glsl */ `#version 300 es
// Full-screen triangle, no attribute buffers.
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2  uRes;          // canvas size, CSS px
uniform float uDpr;          // device pixel ratio in use
uniform float uTime;         // seconds, already scaled by the speed option
uniform vec2  uMouse;        // pointer, CSS px, y down
uniform vec2  uMouseN;       // pointer, 0..1, y down
uniform float uHover;        // 0..1, eased in/out
uniform float uBlock;        // smear amount, drives max block size
uniform float uScale;        // dither scale, smaller = coarser dots
uniform float uDensity;      // coverage ceiling, 0..1
uniform float uIntensity;    // opacity ceiling
uniform vec3  uDot;          // resting dot colour
uniform vec3  uAccent;       // colour near the pointer
uniform float uHoverRadius;  // falloff radius, CSS px
uniform vec4  uBox;          // tracking box: x, y, w, h in CSS px
uniform float uBoxOn;        // 0 or 1
uniform float uFadeEdges;    // 0 or 1

const int   ITER = 16;
const float REF  = 1000.0;

// ── Source field ────────────────────────────────────────────────────────────

float hash21(vec2 p) {
  p = fract(p * vec2(127.31, 311.7));
  p += dot(p, p + 34.72);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),                 hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

float source(vec2 uv, float t) {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  // Slow gradient, then noise over the top of it. The noise has to carry real
  // high-frequency contrast: the coarsest smear octaves quantise into very
  // large cells, and neighbouring cells only read as distinct rectangles if
  // the values they land on are far apart.
  float g = 0.5
          + 0.34 * sin(p.x * 1.9 + t * 0.25) * cos(p.y * 1.5 - t * 0.18)
          + 0.16 * sin((p.x + p.y) * 2.6 - t * 0.12);
  float n1 = fbm(p * 4.2 + vec2(t * 0.05, -t * 0.035));
  float n2 = fbm(p * 9.0 - vec2(t * 0.03,  t * 0.060));
  float v  = mix(mix(g, n1, 0.70), n2, 0.25);
  v = (v - 0.5) * 1.55 + 0.5;

  // A soft lobe riding the pointer, so the field thickens where you are.
  vec2  mp = vec2(uMouseN.x * aspect, uMouseN.y);
  float dm = distance(p, mp);
  v += uHover * 0.30 * exp(-(dm * dm) / 0.035);

  return v;
}

// ── Multi-scale coordinate smear ────────────────────────────────────────────

// Exponential falloff, so the coarse octaves dominate the average.
float weightAt(int i) {
  return exp(-float(i) / 3.0);
}

// Each octave needs its own block phase, otherwise the grids stack up and the
// smear collapses back into one clean pixelation. Golden-angle spiral: the
// offsets never repeat and never line up.
vec2 gridOffset(int i) {
  float a = float(i) * 2.39996323;
  float r = 0.32 * sqrt(float(i) / float(ITER));
  return vec2(cos(a), sin(a)) * r;
}

vec2 perp(vec2 v) { return vec2(-v.y, v.x); }

vec2 pixelateUV(vec2 uv, vec2 anchor, float pixelSizePx, vec2 goff) {
  float shortSide = max(min(uRes.x, uRes.y), 1e-4);
  vec2  scale     = uRes / shortSide;
  float pixelSize = pixelSizePx / REF;
  vec2  sa        = anchor * scale;
  vec2  cell      = floor((((uv * scale) - sa) / pixelSize) + goff) * pixelSize;
  return (cell + (vec2(0.5) - goff) * pixelSize + sa) / scale;
}

vec2 smearUV(vec2 uv, float t) {
  // Anchor drifts a little with the pointer, so the whole block lattice
  // shifts under the cursor instead of only the colour changing.
  vec2  anchor = vec2(0.5) + (uMouseN - 0.5) * (0.03 + 0.05 * uHover);
  float maxPx  = 1.0 + uBlock * 50.0;
  vec2  acc    = vec2(0.0);
  float accW   = 0.0;

  for (int i = 0; i < ITER; i++) {
    float w     = weightAt(i);
    // Inverted weight, so the heaviest octave gets the largest cell.
    float curve = pow(weightAt((ITER - 1) - i), -0.5);
    float pxSz  = mix(maxPx, 1.0, curve);
    float str   = mix(0.35, 0.0, curve);
    vec2  base  = gridOffset(i) * str;
    vec2  sway  = normalize(perp(base) + vec2(1e-5, 0.0));
    vec2  goff  = base + sway * (sin(t * 0.35 + float(i) * 1.6180339) * abs(str) * 0.18);

    acc  += pixelateUV(uv, anchor, pxSz, goff) * w;
    accW += w;
  }
  return acc / max(accW, 1e-4);
}

// ── Ordered dither ──────────────────────────────────────────────────────────

const int MAX_LEVEL = 4;

float bayer(vec2 pixelpos, float scale) {
  float acc = 0.0;
  float div = 0.0;
  float mul = 1.0;
  for (float lvl = float(MAX_LEVEL); lvl >= 1.0; lvl -= 1.0) {
    float size = exp2(lvl) * 0.5 / scale;
    vec2  bc   = mod(floor(pixelpos / size), 2.0);
    mul *= 4.0;
    float x2 = bc.x * 2.0;
    acc += mix(x2, 3.0 - x2, bc.y) / 3.0 * mul;
    div += mul;
  }
  return acc / div - 0.006;
}

float bayerNoise(vec2 cssPx, float delta, float scale) {
  // Golden-ratio walk, one step per second — keeps the grid from locking.
  vec2 jitter = vec2(mod(delta * 0.618033988749895, 16.0),
                     mod(delta * 0.381966011250105, 16.0)) * 20.0;
  return bayer(cssPx + jitter, scale);
}

// ── Main ────────────────────────────────────────────────────────────────────

void main() {
  vec2 sp = vec2(gl_FragCoord.x, float(int(uRes.y * uDpr)) - gl_FragCoord.y) / uDpr;
  vec2 uv = sp / uRes;

  float v   = source(smearUV(uv, uTime), uTime);
  float cov = clamp(smoothstep(0.30, 0.74, v), 0.0, 1.0) * uDensity;

  float bit = floor(cov + bayerNoise(sp, floor(uTime), uScale));

  float rr   = max(uHoverRadius, 1.0);
  vec2  d    = sp - uMouse;
  float infl = exp(-dot(d, d) / (rr * rr)) * uHover;

  // Everything the tracking box encloses reads as selected: full accent, hard
  // edge. 1.5px of feather only to keep the boundary from crawling.
  vec2 e = smoothstep(vec2(0.0), vec2(1.5), sp - uBox.xy)
         * smoothstep(vec2(0.0), vec2(1.5), uBox.xy + uBox.zw - sp);
  float inBox = e.x * e.y * uBoxOn * uHover;

  float tint = max(infl * 1.25, inBox);
  vec3  col  = mix(uDot, uAccent, clamp(tint, 0.0, 1.0));

  // Hue alone is not enough: at the resting intensity an accent dot is ~45%
  // over white, which reads as pale blue-grey. Inside the box, drive alpha to
  // near-opaque so the dots land on the actual brand blue.
  float a = clamp(bit, 0.0, 1.0) * mix(uIntensity, 0.95, inBox);

  if (uFadeEdges > 0.5) {
    a *= smoothstep(0.0, 0.16, uv.x) * smoothstep(0.0, 0.16, 1.0 - uv.x);
    a *= smoothstep(0.0, 0.12, uv.y) * smoothstep(0.0, 0.24, 1.0 - uv.y);
  }

  outColor = vec4(col, clamp(a, 0.0, 1.0));
}`;
