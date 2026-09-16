/**
 * Building ASCII — framework-agnostic core.
 *
 * Mounts a WebGL canvas inside `host`, cycles four shapes on a timer, and
 * returns a handle. No dependencies. BuildingShader.tsx is a thin wrapper
 * around this, so both run identical code.
 *
 *   const art = createBuildingAscii(hostEl, { ink: '#ffffff' });
 *   art.reveal(2);
 *   art.destroy();
 *
 * The render maths, the atlases and the GLSL are ported unchanged from the
 * reference build, so output is identical frame for frame. What changed is the
 * lifecycle: the loop is cancelled while offscreen or backgrounded instead of
 * spinning through early returns, the atlases are shared between mounts, the
 * fallback's pixel readback is deferred, and uniforms that only move on resize
 * are pushed on resize rather than every frame.
 */

import { FRAGMENT, VERTEX } from "./buildingAscii.shaders.js";
import {
  CHARS,
  MASK_HEIGHT,
  MASK_WIDTH,
  SHAPE_COUNT,
  SLOT_WIDTH,
  glyphAtlas,
  maskAtlas,
  maskPixels,
} from "./buildingAscii.masks.js";

/** @type {import('./buildingAscii.core').BuildingAsciiOptions} */
export const BUILDING_ASCII_DEFAULTS = {
  ink: "#ffffff",
  cellSize: 7,
  glyphScale: 0.65,
  autoplay: true,
  interval: 1800,
  interactive: false,
  maxDpr: 2,
  shapeLayout: null,
  onShapeChange: null,
};

export const SHAPE_CAPTIONS = [
  "A COMPANY, BUILT TO LAST.",
  "AN IDEA, MADE USEFUL.",
  "OPEN FOR POSSIBILITY.",
  "SOMETHING ONLY YOU CAN IMAGINE.",
];

const UNIFORMS = [
  "resolution",
  "mouse",
  "shapeLayout",
  "cell",
  "clock",
  "reveal",
  "blend",
  "previous",
  "current",
  "ink",
  "glyphScale",
  "masks",
  "glyphs",
];

const OFFSCREEN_POINTER = [-9999, -9999];

function toRgb(hex) {
  const value = /^#[0-9a-f]{6}$/i.test(String(hex).trim()) ? String(hex).trim() : "#ffffff";
  return [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
}

/**
 * @param {HTMLElement} host
 * @param {Partial<import('./buildingAscii.core').BuildingAsciiOptions>} [options]
 */
export function createBuildingAscii(host, options = {}) {
  const opts = { ...BUILDING_ASCII_DEFAULTS, ...options };

  let canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "display:block;width:100%;height:100%;position:absolute;inset:0;pointer-events:none";
  host.appendChild(canvas);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  let gl = null;
  let ctx2d = null;
  let program = null;
  let buffer = null;
  let textures = [];
  const loc = {};

  let dpr = 1;
  let width = 1;
  let height = 1;

  let index = 0;
  let prev = 0;
  let amount = 0;
  let target = 0;
  let morph = 1;
  let elapsed = 0;
  let lastTime = 0;
  let pointer = OFFSCREEN_POINTER.slice();

  let raf = 0;
  let timer = 0;
  let visible = false;
  let running = false;
  let pageActive = true;
  let contextLost = false;

  // ── GL ────────────────────────────────────────────────────────────────────

  function initGL() {
    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });

    if (!gl) {
      ctx2d = canvas.getContext("2d");
      return;
    }

    try {
      const compile = (type, src) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
          throw new Error(gl.getShaderInfoLog(shader));
        return shader;
      };

      const vs = compile(gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const attrib = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(attrib);
      gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0);

      for (const name of UNIFORMS) loc[name] = gl.getUniformLocation(program, name);

      textures = [maskAtlas(), glyphAtlas()].map((source, slot) => {
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return tex;
      });

      gl.uniform1i(loc.masks, 0);
      gl.uniform1i(loc.glyphs, 1);
    } catch (err) {
      console.warn("BuildingAscii: ASCII shader unavailable; using character fallback.", err);
      const fallback = document.createElement("canvas");
      fallback.setAttribute("aria-hidden", "true");
      fallback.style.cssText = canvas.style.cssText;
      canvas.replaceWith(fallback);
      canvas = fallback;
      gl = null;
      ctx2d = fallback.getContext("2d");
    }
  }

  /** Uniforms that only move on resize or an option change. */
  function pushConstants() {
    if (!gl) return;

    const cell = clampCell(opts.cellSize) * dpr;
    const size = opts.shapeLayout
      ? opts.shapeLayout.size * dpr
      : Math.min(width * 0.82, height * 0.4);
    const centerY = opts.shapeLayout ? opts.shapeLayout.centerY * dpr : height * 0.73;
    const ink = toRgb(opts.ink);

    gl.uniform2f(loc.resolution, width, height);
    gl.uniform1f(loc.cell, cell);
    gl.uniform1f(loc.glyphScale, clampGlyphScale(opts.glyphScale));
    gl.uniform3f(loc.ink, ink[0], ink[1], ink[2]);
    gl.uniform3f(loc.shapeLayout, width / 2, height - centerY, size);
  }

  function clampGlyphScale(value) {
    return Math.max(0.2, Math.min(1, Number(value) || 1));
  }

  function clampCell(value) {
    return Math.max(5, Math.min(18, Number(value) || 7));
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, opts.maxDpr);
    width = Math.max(1, Math.round(rect.width * dpr));
    height = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = width;
    canvas.height = height;
    if (gl) {
      gl.viewport(0, 0, width, height);
      pushConstants();
    }
    draw(0);
  }

  // ── Shape state ───────────────────────────────────────────────────────────

  function reveal(next) {
    const clamped = Math.max(0, Math.min(SHAPE_COUNT - 1, Math.round(next) || 0));
    if (clamped !== index) {
      prev = index;
      index = clamped;
      morph = reduced.matches ? 1 : 0;
    }
    target = 1;
    opts.onShapeChange?.(index);
  }

  function rest() {
    target = 0;
    pointer = OFFSCREEN_POINTER.slice();
    opts.onShapeChange?.(index);
  }

  // ── Draw ──────────────────────────────────────────────────────────────────

  function draw(delta) {
    if (contextLost) return;

    amount = reduced.matches ? target : amount + (target - amount) * (1 - Math.exp(-delta * 4.5));
    if (Math.abs(amount - target) < 0.001) amount = target;
    morph = reduced.matches ? 1 : Math.min(1, morph + delta * 1.9);
    if (!reduced.matches) elapsed += delta;

    const blend = morph * morph * (3 - 2 * morph);

    if (gl) {
      gl.uniform2f(loc.mouse, pointer[0], pointer[1]);
      gl.uniform1f(loc.clock, elapsed);
      gl.uniform1f(loc.reveal, amount);
      gl.uniform1f(loc.blend, blend);
      gl.uniform1f(loc.previous, prev);
      gl.uniform1f(loc.current, index);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return;
    }

    draw2D(blend);
  }

  function draw2D(blend) {
    if (!ctx2d) return;

    const pixels = maskPixels();
    const step = clampCell(opts.cellSize) * dpr;
    const size = opts.shapeLayout
      ? opts.shapeLayout.size * dpr
      : Math.min(width * 0.82, height * 0.4);
    const centerY = opts.shapeLayout ? opts.shapeLayout.centerY * dpr : height * 0.73;

    ctx2d.clearRect(0, 0, width, height);
    ctx2d.font = `bold ${step}px monospace`;
    ctx2d.textAlign = "center";
    ctx2d.textBaseline = "middle";

    for (let y = step / 2; y < height; y += step)
      for (let x = step / 2; x < width; x += step) {
        const u = (x - width / 2) / size + 0.5;
        const v = (y - centerY) / size + 0.5;
        const sample = (slot) => {
          if (u < 0 || u >= 1 || v < 0 || v >= 1) return 0;
          const offset =
            (Math.floor(v * MASK_HEIGHT) * MASK_WIDTH +
              Math.floor(u * SLOT_WIDTH) +
              slot * SLOT_WIDTH) *
            4;
          return pixels[offset] / 255;
        };
        const value = (sample(prev) * (1 - blend) + sample(index) * blend) * amount;

        ctx2d.fillStyle = opts.ink;
        if (value > 0.06) {
          ctx2d.globalAlpha = 0.5 + value * 0.5;
          ctx2d.save();
          ctx2d.translate(x, y);
          ctx2d.scale(1, clampGlyphScale(opts.glyphScale));
          ctx2d.fillText(CHARS[Math.max(1, Math.min(8, Math.floor(value * 7.5)))], 0, 0);
          ctx2d.restore();
        } else {
          ctx2d.globalAlpha = y < height * 0.4 ? 0.06 : 0.26;
          ctx2d.beginPath();
          ctx2d.arc(x, y, step * 0.1, 0, Math.PI * 2);
          ctx2d.fill();
        }
      }

    ctx2d.globalAlpha = 1;
  }

  // ── Loop ──────────────────────────────────────────────────────────────────

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
    lastTime = now;
    draw(delta);
  }

  function start() {
    if (raf) return;
    lastTime = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function advance() {
    reveal((index + 1) % SHAPE_COUNT);
  }

  function syncTimer() {
    clearInterval(timer);
    timer = running && opts.autoplay ? setInterval(advance, opts.interval) : 0;
  }

  /**
   * Offscreen, backgrounded and unloading all resolve to the same thing: hold
   * the last frame, drop the timer, and stop touching the main thread. Guarded
   * on the transition so a host re-render cannot restart the cycle mid-shape.
   */
  function sync() {
    const shouldRun = visible && !document.hidden && pageActive && !contextLost;
    if (shouldRun === running) return;
    running = shouldRun;

    if (!shouldRun) {
      stop();
      clearInterval(timer);
      timer = 0;
      return;
    }

    start();
    reveal(index);
    syncTimer();
  }

  // ── Wiring ────────────────────────────────────────────────────────────────

  initGL();

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  io.observe(host);

  const abort = new AbortController();
  const signal = abort.signal;

  const onVisibility = () => sync();
  const onPageHide = () => {
    pageActive = false;
    sync();
  };
  const onPageShow = () => {
    pageActive = true;
    sync();
  };

  document.addEventListener("visibilitychange", onVisibility, { signal });
  window.addEventListener("pagehide", onPageHide, { signal });
  window.addEventListener("pageshow", onPageShow, { signal });

  canvas.addEventListener(
    "webglcontextlost",
    (e) => {
      e.preventDefault();
      contextLost = true;
      sync();
    },
    { signal },
  );
  canvas.addEventListener(
    "webglcontextrestored",
    () => {
      contextLost = false;
      initGL();
      resize();
      sync();
    },
    { signal },
  );

  if (opts.interactive) {
    let travel = 0;
    let changedAt = 0;
    let lastPoint = null;

    const movePointer = (e) => {
      const rect = host.getBoundingClientRect();
      pointer = [(e.clientX - rect.left) * dpr, (rect.bottom - e.clientY) * dpr];
    };

    host.addEventListener(
      "pointerenter",
      (e) => {
        if (e.pointerType !== "mouse") return;
        reveal(index);
        travel = 0;
        changedAt = performance.now();
        lastPoint = [e.clientX, e.clientY];
      },
      { signal },
    );
    host.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse") return;
        movePointer(e);
        const point = [e.clientX, e.clientY];
        if (lastPoint) travel += Math.hypot(point[0] - lastPoint[0], point[1] - lastPoint[1]);
        lastPoint = point;
        if (!reduced.matches && travel >= 180 && performance.now() - changedAt >= 720) {
          advance();
          travel = 0;
          changedAt = performance.now();
        }
      },
      { signal },
    );
    host.addEventListener(
      "pointerleave",
      () => {
        lastPoint = null;
        rest();
      },
      { signal },
    );
  }

  return {
    get index() {
      return index;
    },
    reveal,
    rest,
    /** @param {Partial<import('./buildingAscii.core').BuildingAsciiOptions>} next */
    setOptions(next) {
      const { autoplay, interval } = opts;
      Object.assign(opts, next);
      pushConstants();
      draw(0);
      sync();
      if (running && (opts.autoplay !== autoplay || opts.interval !== interval)) syncTimer();
    },
    destroy() {
      stop();
      clearInterval(timer);
      ro.disconnect();
      io.disconnect();
      abort.abort();
      if (gl) {
        textures.forEach((tex) => gl.deleteTexture(tex));
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      canvas.remove();
    },
  };
}
