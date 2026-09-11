/**
 * Building ASCII — offscreen atlases.
 *
 * Two canvases feed the fragment shader:
 *
 *   masks   1024x256, four 256-wide slots holding the shapes the artwork cycles
 *           through — building, computer, storefront, lightbulb. Only the red
 *           channel is read, so the greys are luminance steps that become
 *           glyph-density steps.
 *   glyphs  9x32 cells of `.:+*ox%#@` at a fixed size, sampled by alpha.
 *
 * Both are pure functions of nothing, so a module-level cache lets several
 * mounts share one pair instead of re-rasterising ~1MB each.
 */

export const CHARS = ".:+*ox%#@";

export const MASK_WIDTH = 1024;
export const MASK_HEIGHT = 256;
export const SHAPE_COUNT = 4;

/**
 * Fraction of a 256px slot the shapes' ink actually covers, measured off the
 * rasterised atlas. The slot carries a lot of dead margin — the building spans
 * only 0.652 of its width — so sizing against the slot leaves the artwork
 * smaller than the space allotted to it. Both values take the largest shape on
 * each axis (storefront widest, lightbulb tallest) so a single scale fits every
 * shape and nothing resizes mid-morph.
 */
export const INK_WIDTH = 0.793;
export const INK_HEIGHT = 0.832;
export const SLOT_WIDTH = MASK_WIDTH / SHAPE_COUNT;

function drawShapes(c) {
  const line = (points, color = "#fff", width = 4) => {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.beginPath();
    points.forEach((p, i) => (i ? c.lineTo(...p) : c.moveTo(...p)));
    c.stroke();
  };

  const polygon = (points, fill, stroke = "#fff", width = 4) => {
    c.beginPath();
    points.forEach((p, i) => (i ? c.lineTo(...p) : c.moveTo(...p)));
    c.closePath();
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = width;
      c.lineJoin = "round";
      c.stroke();
    }
  };

  const rect = (x, y, w, h, fill, stroke = "#fff", width = 4) => {
    c.fillStyle = fill;
    c.fillRect(x, y, w, h);
    if (stroke) {
      c.strokeStyle = stroke;
      c.lineWidth = width;
      c.strokeRect(x, y, w, h);
    }
  };

  // Building: a dimensional office tower with distinct rows of windows and an entry.
  polygon(
    [
      [67, 58],
      [144, 33],
      [189, 57],
      [113, 81],
    ],
    "#999",
  );
  polygon(
    [
      [67, 58],
      [113, 81],
      [113, 220],
      [67, 194],
    ],
    "#555",
  );
  polygon(
    [
      [113, 81],
      [189, 57],
      [189, 198],
      [113, 220],
    ],
    "#999",
  );
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 3; col++) {
      const x = 123 + col * 20;
      const y = 94 + row * 21 - col * 6.3;
      polygon(
        [
          [x, y],
          [x + 9, y - 3],
          [x + 9, y + 8],
          [x, y + 11],
        ],
        "#111",
        "#ddd",
        1.2,
      );
    }
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 2; col++) {
      const x = 77 + col * 17;
      const y = 77 + row * 23 + col * 8;
      polygon(
        [
          [x, y],
          [x + 8, y + 4],
          [x + 8, y + 14],
          [x, y + 10],
        ],
        "#111",
        "#aaa",
        1.2,
      );
    }
  polygon(
    [
      [141, 210],
      [141, 188],
      [160, 181],
      [160, 204],
    ],
    "#111",
    "#fff",
    2.5,
  );
  line(
    [
      [45, 210],
      [111, 242],
      [211, 211],
    ],
    "#777",
    2,
  );

  c.save();
  c.translate(256, 0);
  // Desktop computer: screen, window UI, pedestal and keyboard.
  rect(32, 43, 192, 135, "#999", "#fff", 5);
  rect(41, 53, 174, 106, "#151515", "#fff", 2);
  rect(49, 61, 157, 10, "#444", null);
  [54, 62, 70].forEach((x) => {
    c.fillStyle = "#eee";
    c.fillRect(x, 64, 3, 3);
  });
  rect(51, 80, 42, 68, "#444", null);
  [87, 99, 111, 123].forEach((y) =>
    line(
      [
        [57, y],
        [85, y],
      ],
      "#bbb",
      2,
    ),
  );
  rect(102, 81, 94, 28, "#999", null);
  rect(102, 118, 42, 30, "#555", "#aaa", 1);
  rect(153, 118, 43, 30, "#555", "#aaa", 1);
  line(
    [
      [128, 182],
      [128, 201],
    ],
    "#ddd",
    10,
  );
  line(
    [
      [100, 203],
      [156, 203],
    ],
    "#fff",
    5,
  );
  polygon(
    [
      [53, 216],
      [189, 216],
      [206, 236],
      [38, 236],
    ],
    "#555",
    "#eee",
    3,
  );
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 12; col++)
      rect(56 + col * 11 - row * 3, 221 + row * 7, 7, 3, "#eee", null);

  c.restore();
  c.save();
  c.translate(512, 0);
  // Storefront: pitched striped awning, display window and door.
  rect(57, 44, 142, 33, "#777", "#fff", 4);
  line(
    [
      [80, 60],
      [176, 60],
    ],
    "#fff",
    5,
  );
  rect(43, 112, 170, 111, "#555", "#fff", 4);
  polygon(
    [
      [49, 79],
      [207, 79],
      [228, 119],
      [28, 119],
    ],
    "#aaa",
    "#fff",
    4,
  );
  for (let n = 0; n < 7; n++) {
    const a = 49 + n * 22.6;
    const b = 28 + n * 28.6;
    if (n % 2 === 0)
      polygon(
        [
          [a, 80],
          [a + 22.6, 80],
          [b + 28.6, 119],
          [b, 119],
        ],
        "#333",
        null,
      );
    c.beginPath();
    c.moveTo(b, 119);
    c.lineTo(b + 28.6, 119);
    c.lineTo(b + 28.6, 128);
    c.quadraticCurveTo(b + 14.3, 141, b, 128);
    c.closePath();
    c.fillStyle = n % 2 ? "#aaa" : "#444";
    c.fill();
    c.strokeStyle = "#fff";
    c.lineWidth = 2;
    c.stroke();
  }
  rect(58, 148, 83, 58, "#171717", "#eee", 3);
  line(
    [
      [99, 148],
      [99, 206],
    ],
    "#eee",
    2,
  );
  line(
    [
      [66, 183],
      [82, 166],
    ],
    "#777",
    2,
  );
  line(
    [
      [110, 189],
      [130, 169],
    ],
    "#777",
    2,
  );
  rect(157, 148, 40, 75, "#222", "#fff", 3);
  rect(163, 156, 28, 39, "#777", null);
  line(
    [
      [188, 204],
      [188, 208],
    ],
    "#fff",
    3,
  );
  line(
    [
      [29, 228],
      [227, 228],
    ],
    "#aaa",
    3,
  );

  c.restore();
  c.save();
  c.translate(768, 0);
  // Lightbulb: big silhouette, glowing filament and screw base.
  c.beginPath();
  c.moveTo(105, 178);
  c.bezierCurveTo(105, 155, 70, 153, 70, 109);
  c.bezierCurveTo(70, 30, 186, 30, 186, 109);
  c.bezierCurveTo(186, 153, 151, 155, 151, 178);
  c.closePath();
  c.fillStyle = "#666";
  c.fill();
  c.lineWidth = 5;
  c.strokeStyle = "#fff";
  c.stroke();
  line(
    [
      [113, 174],
      [109, 125],
      [124, 138],
      [139, 123],
      [142, 174],
    ],
    "#fff",
    3.5,
  );
  line(
    [
      [90, 102],
      [92, 87],
      [102, 76],
    ],
    "#bbb",
    3,
  );
  rect(104, 180, 48, 12, "#999", "#fff", 2);
  rect(104, 194, 48, 12, "#666", "#eee", 2);
  rect(108, 208, 40, 10, "#aaa", "#fff", 2);
  polygon(
    [
      [113, 220],
      [143, 220],
      [136, 229],
      [120, 229],
    ],
    "#aaa",
    "#fff",
    2,
  );
  [
    [
      [128, 18],
      [128, 33],
    ],
    [
      [60, 42],
      [72, 54],
    ],
    [
      [194, 42],
      [183, 54],
    ],
    [
      [39, 107],
      [55, 107],
    ],
    [
      [202, 107],
      [218, 107],
    ],
    [
      [48, 171],
      [62, 160],
    ],
    [
      [194, 160],
      [208, 171],
    ],
  ].forEach((p) => line(p, "#bbb", 3));

  c.restore();
}

let cachedMasks = null;
let cachedGlyphs = null;
let cachedPixels = null;

/** The four-slot shape atlas. Rasterised once per document. */
export function maskAtlas() {
  if (cachedMasks) return cachedMasks;

  const atlas = document.createElement("canvas");
  atlas.width = MASK_WIDTH;
  atlas.height = MASK_HEIGHT;

  // willReadFrequently matches the reference build: it pins the canvas to the
  // CPU backend, and the resulting rasterisation is what the shader was tuned
  // against. Changing it shifts antialiasing on every edge in the atlas.
  const c = atlas.getContext("2d", { willReadFrequently: true });
  c.fillStyle = "#000";
  c.fillRect(0, 0, MASK_WIDTH, MASK_HEIGHT);
  drawShapes(c);

  cachedMasks = atlas;
  return atlas;
}

/** The glyph ramp, sampled by alpha. */
export function glyphAtlas() {
  if (cachedGlyphs) return cachedGlyphs;

  const glyphs = document.createElement("canvas");
  glyphs.width = 9 * 32;
  glyphs.height = 32;

  const ctx = glyphs.getContext("2d");
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  [...CHARS].forEach((ch, i) => ctx.fillText(ch, i * 32 + 16, 17));

  cachedGlyphs = glyphs;
  return glyphs;
}

/**
 * Red-channel readback of the mask atlas, for the 2D fallback only. Deferred
 * because it costs a 1MB copy the WebGL path never touches.
 */
export function maskPixels() {
  if (cachedPixels) return cachedPixels;

  cachedPixels = maskAtlas()
    .getContext("2d", { willReadFrequently: true })
    .getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;

  return cachedPixels;
}
