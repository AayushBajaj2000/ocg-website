/**
 * DotField — framework-agnostic core.
 *
 * Mounts a WebGL2 canvas plus an SVG detection overlay inside `host`, runs one
 * rAF loop, and returns a handle. No dependencies. The React component in
 * DotField.tsx is a thin wrapper around this; the preview page uses it directly,
 * so both run identical code.
 *
 *   const field = createDotField(hostEl, { intensity: 0.36 });
 *   field.setOptions({ density: 0.6 });
 *   field.destroy();
 */

import { FRAG, VERT } from "./dotfield.shaders.js";

/** @type {import('./dotfield.core').DotFieldOptions} */
export const DOTFIELD_DEFAULTS = {
  dotColor: "#D0D5DD",
  accentColor: "#2068CC",
  block: 0.61,
  scale: 0.5,
  density: 0.5,
  intensity: 0.36,
  hoverRadius: 220,
  speed: 1,
  fadeEdges: true,
  interactive: true,
  tracking: true,
  maxFps: 30,
  maxDpr: 1.5,
};

const UNIFORMS = [
  "uRes",
  "uDpr",
  "uTime",
  "uMouse",
  "uMouseN",
  "uHover",
  "uBlock",
  "uScale",
  "uDensity",
  "uIntensity",
  "uDot",
  "uAccent",
  "uHoverRadius",
  "uBox",
  "uBoxOn",
  "uFadeEdges",
];

const SVG_NS = "http://www.w3.org/2000/svg";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

function toRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  if (!m) return [0.82, 0.84, 0.87];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl, type, src, label) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(`DotField: ${label} shader failed to compile:`, gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function el(tag, attrs) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

/**
 * @param {HTMLElement} host
 * @param {Partial<import('./dotfield.core').DotFieldOptions>} [options]
 */
export function createDotField(host, options = {}) {
  const opts = { ...DOTFIELD_DEFAULTS, ...options };

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "display:block;width:100%;height:100%";
  host.appendChild(canvas);

  const svg = el("svg", { width: "100%", height: "100%", "aria-hidden": "true" });
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  host.appendChild(svg);

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
    powerPreference: "low-power",
  });

  if (!gl) {
    host.dataset.dotfield = "unsupported";
    return {
      setOptions() {},
      destroy() {
        canvas.remove();
        svg.remove();
      },
    };
  }

  const vs = compile(gl, gl.VERTEX_SHADER, VERT, "vertex");
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG, "fragment");
  if (!vs || !fs) {
    host.dataset.dotfield = "unsupported";
    return {
      setOptions() {},
      destroy() {
        canvas.remove();
        svg.remove();
      },
    };
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("DotField: program failed to link:", gl.getProgramInfoLog(prog));
    host.dataset.dotfield = "unsupported";
    return {
      setOptions() {},
      destroy() {
        canvas.remove();
        svg.remove();
      },
    };
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  gl.useProgram(prog);

  const loc = {};
  for (const name of UNIFORMS) loc[name] = gl.getUniformLocation(prog, name);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  // ── Overlay ───────────────────────────────────────────────────────────────

  const overlay = el("g", { opacity: "0" });
  svg.appendChild(overlay);

  const boxRect = el("rect", {
    fill: "none",
    stroke: opts.accentColor,
    "stroke-width": "1",
    "stroke-opacity": "0.8",
    "shape-rendering": "crispEdges",
  });
  const boxLabel = el("text", {
    fill: opts.accentColor,
    "font-family": MONO,
    "font-size": "9",
    "letter-spacing": "0.06em",
  });
  overlay.append(boxRect, boxLabel);

  // Animated rect, chased toward the pointer each frame. The shader reads it
  // too, so it has to be resolved before the draw call, not after.
  const box = { x: 0, y: 0, side: 0, ready: false };

  function syncOverlay() {
    overlay.setAttribute("display", opts.tracking ? "" : "none");
    boxRect.setAttribute("stroke", opts.accentColor);
    boxLabel.setAttribute("fill", opts.accentColor);
  }
  syncOverlay();

  // ── Sizing ────────────────────────────────────────────────────────────────

  let cssW = 1;
  let cssH = 1;
  let dpr = 1;

  function resize() {
    const rect = host.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    // The dither is 1-bit, so extra device pixels buy nothing but fragments.
    dpr = Math.min(window.devicePixelRatio || 1, Math.max(1, opts.maxDpr));
    const w = Math.round(cssW * dpr);
    const h = Math.round(cssH * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    svg.setAttribute("viewBox", `0 0 ${cssW} ${cssH}`);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();

  // Resizing the canvas clears it, so a held static frame has to be redrawn.
  const ro = new ResizeObserver(() => {
    resize();
    sync();
  });
  ro.observe(host);

  // ── Pointer ───────────────────────────────────────────────────────────────

  // Read from the window, not the host: the field sits behind page content and
  // is pointer-events:none, so it would never see its own hover otherwise.
  const target = { x: -9999, y: -9999 };
  const mouse = { x: -9999, y: -9999 };
  let hoverTarget = 0;
  let hover = 0;

  function onPointerMove(e) {
    if (!opts.interactive) return;
    const rect = host.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    hoverTarget = inside ? 1 : 0;
    if (inside) {
      target.x = x;
      target.y = y;
      // First entry: jump rather than sweeping in from the last position.
      if (mouse.x < -9000) {
        mouse.x = x;
        mouse.y = y;
        box.ready = false;
      }
    }
  }
  function onLeave() {
    hoverTarget = 0;
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  window.addEventListener("blur", onLeave);

  // ── Visibility ────────────────────────────────────────────────────────────

  let visible = true;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((en) => en.isIntersecting);
      sync();
    },
    { rootMargin: "96px" },
  );
  io.observe(host);

  const onVisibilityChange = () => sync();
  document.addEventListener("visibilitychange", onVisibilityChange);

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A software rasteriser (SwiftShader, llvmpipe) runs this fragment shader on
  // the CPU, where a full-viewport draw per frame costs more than the effect is
  // worth. Render one frame and hold it, same as reduced motion.
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);

  const isStatic = () => motion.matches || software;

  // ── Loop ──────────────────────────────────────────────────────────────────

  let raf = 0;
  let last = performance.now();
  let clock = 0;

  function updateBox(dt) {
    const side = Math.max(48, Math.min(cssW, cssH) * 0.3);
    const tx = Math.min(Math.max(mouse.x - side / 2, 3), Math.max(3, cssW - side - 3));
    const ty = Math.min(Math.max(mouse.y - side / 2, 3), Math.max(3, cssH - side - 14));

    if (!box.ready) {
      box.x = tx;
      box.y = ty;
      box.ready = true;
    } else {
      // Chased a frame behind the pointer, so it trails rather than sticking.
      const chase = 1 - Math.pow(0.004, dt);
      box.x += (tx - box.x) * chase;
      box.y += (ty - box.y) * chase;
    }
    box.side = side;
  }

  let lastOpacity = "";
  function updateOverlay() {
    const opacity = hover.toFixed(3);
    if (opacity !== lastOpacity) {
      overlay.setAttribute("opacity", opacity);
      lastOpacity = opacity;
    }
    if (hover < 0.002 || !opts.tracking) return;

    const x = Math.round(box.x) + 0.5;
    const y = Math.round(box.y) + 0.5;
    const s = Math.round(box.side);

    boxRect.setAttribute("x", x);
    boxRect.setAttribute("y", y);
    boxRect.setAttribute("width", s);
    boxRect.setAttribute("height", s);

    boxLabel.setAttribute("x", x);
    boxLabel.setAttribute("y", y + s + 11);
    boxLabel.textContent = `${((box.x + box.side / 2) / cssW).toFixed(3)}, ${((box.y + box.side / 2) / cssH).toFixed(3)}`;
  }

  function draw(dt) {
    clock += dt * (isStatic() ? 0 : opts.speed);

    const ease = 1 - Math.pow(0.002, dt);
    mouse.x += (target.x - mouse.x) * ease;
    mouse.y += (target.y - mouse.y) * ease;
    hover += ((opts.interactive ? hoverTarget : 0) - hover) * (1 - Math.pow(0.01, dt));

    updateBox(dt);

    const dc = toRgb(opts.dotColor);
    const ac = toRgb(opts.accentColor);

    gl.uniform2f(loc.uRes, cssW, cssH);
    gl.uniform1f(loc.uDpr, dpr);
    gl.uniform1f(loc.uTime, clock);
    gl.uniform2f(loc.uMouse, mouse.x, mouse.y);
    gl.uniform2f(loc.uMouseN, mouse.x / cssW, mouse.y / cssH);
    gl.uniform1f(loc.uHover, hover);
    gl.uniform1f(loc.uBlock, opts.block);
    gl.uniform1f(loc.uScale, Math.max(0.05, opts.scale));
    gl.uniform1f(loc.uDensity, opts.density);
    gl.uniform1f(loc.uIntensity, opts.intensity);
    gl.uniform3f(loc.uDot, dc[0], dc[1], dc[2]);
    gl.uniform3f(loc.uAccent, ac[0], ac[1], ac[2]);
    gl.uniform1f(loc.uHoverRadius, opts.hoverRadius);
    gl.uniform4f(loc.uBox, box.x, box.y, box.side, box.side);
    gl.uniform1f(loc.uBoxOn, opts.tracking ? 1 : 0);
    gl.uniform1f(loc.uFadeEdges, opts.fadeEdges ? 1 : 0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    updateOverlay();
  }

  // An ambient field does not need every frame the display can give it, so the
  // loop keeps ticking but only draws on the ones the budget allows.
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dtRaw = (now - last) / 1000;
    if (dtRaw < 1 / Math.max(1, opts.maxFps)) return;
    last = now;
    // Clamp so a backgrounded tab does not jump the field on return.
    draw(Math.min(dtRaw, 1 / 20));
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  // Offscreen, backgrounded, reduced-motion and software-rendered all resolve
  // to the same thing: hold the last frame and stop burning the main thread.
  function sync() {
    if (!visible || document.hidden) {
      stop();
      return;
    }
    if (isStatic()) {
      stop();
      draw(0);
      return;
    }
    start();
  }

  sync();

  return {
    /** @param {Partial<import('./dotfield.core').DotFieldOptions>} next */
    setOptions(next) {
      Object.assign(opts, next);
      syncOverlay();
      sync();
    },
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
      svg.remove();
    },
  };
}
